/**
 * Closes this tab so the visitor lands back on the portfolio tab that opened it.
 * Browsers only let a page close a tab that was freshly opened (as the project
 * and "Let's talk" links do); if this one can't be closed, e.g. the URL was
 * typed in, go to `fallbackUrl` instead (the projects section by default).
 */
export function backToProjects(
  window: Window | null | undefined,
  fallbackUrl = '/#selected-work',
): void {
  if (!window) {
    return;
  }

  window.close();

  if (!window.closed) {
    window.location.assign(fallbackUrl);
  }
}
