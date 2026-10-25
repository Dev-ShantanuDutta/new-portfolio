import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  Router,
  ViewTransitionInfo,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { apiBaseUrlInterceptor } from './core/interceptors/api-base-url.interceptor';

/** Cross-fade between pages, but not for in-page jumps like /#selected-work → /#contact. */
function skipSamePageTransitions({ transition }: ViewTransitionInfo): void {
  const router = inject(Router);
  const target = router.currentNavigation()?.finalUrl;
  if (
    target &&
    router.isActive(target, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'exact',
    })
  ) {
    transition.skipTransition();
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      // Nav links scroll to their section (smoothly, via CSS scroll-behavior), and
      // Back restores the previous scroll position.
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      // Clicking the same section link twice still scrolls back to it.
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      // Feature-detected by Angular: browsers without the View Transitions API
      // just switch pages instantly.
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated: skipSamePageTransitions,
      }),
    ),
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([apiBaseUrlInterceptor])),
  ],
};
