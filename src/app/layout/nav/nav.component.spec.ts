import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  it('renders the primary nav, CTA, and theme toggle', async () => {
    await render(NavComponent, {
      providers: [provideRouter([])],
    });

    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeTruthy();
    const navLinks = screen
      .getByRole('navigation', { name: 'Primary' })
      .querySelectorAll<HTMLAnchorElement>('a');
    // The main sections in page order, with Resume (an external link) last.
    expect(Array.from(navLinks, (a) => a.textContent?.trim())).toEqual([
      'Home',
      'Process',
      'Experience',
      'About',
      'Resume',
    ]);
    expect(Array.from(navLinks, (a) => a.getAttribute('href')).slice(0, -1)).toEqual([
      '/#hero',
      '/#how-i-engineer',
      '/#selected-work',
      '/#about-taste',
    ]);
    // Home is selected on load, before any scrolling.
    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('aria-current')).toBe('true');
    const cta = screen.getByRole('link', { name: "Let's talk (opens in new tab)" });
    expect(cta.getAttribute('href')).toBe('/contact');
    expect(cta.getAttribute('target')).toBe('_blank');
    expect(screen.getByRole('button', { name: 'Toggle color theme' })).toBeTruthy();
  });
});
