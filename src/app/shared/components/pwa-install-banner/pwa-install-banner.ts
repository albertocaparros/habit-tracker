import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

/** `beforeinstallprompt` is not in every TypeScript lib; keep a minimal surface. */
interface BeforeInstallPromptChoice {
  outcome: 'accepted' | 'dismissed';
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<BeforeInstallPromptChoice>;
}

@Component({
  selector: 'app-pwa-install-banner',
  imports: [MatButtonModule],
  templateUrl: './pwa-install-banner.html',
  styleUrl: './pwa-install-banner.scss',
})
export class PwaInstallBanner {
  readonly showBanner = signal(false);
  private deferred: BeforeInstallPromptEvent | null = null;

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferred = e as BeforeInstallPromptEvent;
      const standalone = window.matchMedia(
        '(display-mode: standalone)',
      ).matches;
      if (!standalone) {
        this.showBanner.set(true);
      }
    });

    window.addEventListener('appinstalled', () => {
      this.deferred = null;
      this.showBanner.set(false);
    });
  }

  async install(): Promise<void> {
    const ev = this.deferred;
    if (!ev) {
      return;
    }
    await ev.prompt();
    await ev.userChoice;
    this.deferred = null;
    this.showBanner.set(false);
  }

  dismiss(): void {
    this.showBanner.set(false);
  }
}
