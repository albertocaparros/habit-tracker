import {
  ApplicationRef,
  Component,
  inject,
  isDevMode,
  NgZone,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-sw-update-prompt',
  imports: [MatSnackBarModule, MatButtonModule],
  template: '',
})
export class SwUpdatePrompt implements OnInit {
  private readonly appRef = inject(ApplicationRef);
  private readonly swUpdate = inject(SwUpdate);
  private readonly zone = inject(NgZone);
  private readonly snackBar = inject(MatSnackBar);

  private snackRef: MatSnackBarRef<unknown> | null = null;

  ngOnInit(): void {
    if (isDevMode() || !this.swUpdate.isEnabled) {
      return;
    }

    const appStable$ = this.appRef.isStable.pipe(first((stable) => stable));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appStable$, everySixHours$);

    this.zone.runOutsideAngular(() => {
      everySixHoursOnceAppIsStable$.subscribe(() => {
        void this.swUpdate.checkForUpdate();
      });
    });

    this.swUpdate.versionUpdates
      .pipe(filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'))
      .subscribe(() => {
        this.zone.run(() => this.showReloadSnackbar());
      });
  }

  private showReloadSnackbar(): void {
    this.snackRef?.dismiss();
    this.snackRef = this.snackBar.open(
      'A new version is available.',
      'Please reload',
    );
    this.snackRef.onAction().subscribe(() => {
      void this.swUpdate
        .activateUpdate()
        .then(() => document.location.reload());
    });
  }
}
