import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { InjectionToken, PLATFORM_ID, inject } from '@angular/core';

/**
 * The browser window, or null during server rendering. Injectable so tests can swap it.
 * Checked by platform rather than by `defaultView`: the server's emulated document
 * has a window object too, but without layout or animation-frame APIs.
 */
export const WINDOW = new InjectionToken<Window | null>('WINDOW', {
  providedIn: 'root',
  factory: () => (isPlatformBrowser(inject(PLATFORM_ID)) ? inject(DOCUMENT).defaultView : null),
});
