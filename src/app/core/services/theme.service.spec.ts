import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to light and writes it to the document', () => {
    const service = TestBed.inject(ThemeService);
    TestBed.tick();

    expect(service.current()).toBe('light');
    expect(service.isLight()).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('toggle() flips the theme and persists it', () => {
    const service = TestBed.inject(ThemeService);

    service.toggle();
    TestBed.tick();

    expect(service.current()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    service.toggle();
    TestBed.tick();

    expect(service.current()).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('setTheme() sets the theme explicitly', () => {
    const service = TestBed.inject(ThemeService);

    service.setTheme('dark');
    TestBed.tick();

    expect(service.current()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('reads a persisted theme from localStorage on construction', () => {
    localStorage.setItem('theme', 'dark');

    const service = TestBed.inject(ThemeService);

    expect(service.current()).toBe('dark');
  });

  it('falls back to the existing document attribute when nothing is persisted', () => {
    document.documentElement.setAttribute('data-theme', 'dark');

    const service = TestBed.inject(ThemeService);

    expect(service.current()).toBe('dark');
  });
});
