import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Navigation } from './navigation';

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navigation],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Navigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the navigation links', () => {
    const navLinks = fixture.nativeElement.querySelectorAll('a');
    expect(navLinks.length).toBeGreaterThan(0);
    expect(navLinks[0].getAttribute('routerLink')).toBe('/');
    expect(navLinks[1].getAttribute('routerLink')).toBe('/add');
    expect(navLinks[2].getAttribute('routerLink')).toBe('/overview');
  });
});
