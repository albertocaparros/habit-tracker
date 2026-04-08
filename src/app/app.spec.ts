import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SwUpdate } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';

describe('App Component', () => {
  let fixture: ComponentFixture<App>;

  const swUpdateMock = {
    isEnabled: false,
    versionUpdates: EMPTY,
    checkForUpdate: () => Promise.resolve(false),
    activateUpdate: () => Promise.resolve(void 0),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        MatSlideToggleModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
      ],
      providers: [
        MatIconRegistry,
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: SwUpdate, useValue: swUpdateMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should set default icon font class on init', () => {
    const iconRegistry = TestBed.inject(MatIconRegistry);
    const spy = vi.spyOn(iconRegistry, 'setDefaultFontSetClass');

    fixture.componentInstance.ngOnInit();

    expect(spy).toHaveBeenCalledWith('material-symbols-outlined');
  });
});
