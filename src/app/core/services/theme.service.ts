import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';
const THEME_ATTRIBUTE = 'data-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly theme = signal<Theme>(this.readInitialTheme());

  /** The active theme; 'light' is the default for first-time visitors. */
  readonly current = this.theme.asReadonly();

  readonly isLight = computed(() => this.theme() === 'light');

  constructor() {
    effect(() => {
      const value = this.theme();
      this.document.documentElement.setAttribute(THEME_ATTRIBUTE, value);

      if (this.isBrowser) {
        localStorage.setItem(STORAGE_KEY, value);
      }
    });

    // Keep tabs in step: toggling the theme in one tab (e.g. the portfolio) updates
    // any other open tab (e.g. a "Try it" placeholder page).
    this.document.defaultView?.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY && (event.newValue === 'light' || event.newValue === 'dark')) {
        this.theme.set(event.newValue);
      }
    });
  }

  /** Flips between 'dark' and 'light'. */
  toggle(): void {
    this.theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  /** Sets the theme explicitly. */
  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  private readInitialTheme(): Theme {
    if (this.isBrowser) {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }

    return this.document.documentElement.getAttribute(THEME_ATTRIBUTE) === 'dark'
      ? 'dark'
      : 'light';
  }
}
