import { TestBed } from '@angular/core/testing';
import { fireEvent, render, screen } from '@testing-library/angular';
import { ThemeToggleComponent } from './theme-toggle.component';

describe('ThemeToggleComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to light and exposes an accessible name', async () => {
    await render(ThemeToggleComponent);

    const button = screen.getByRole('button', { name: 'Toggle color theme' });
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('switches to dark on activation and updates the document attribute', async () => {
    await render(ThemeToggleComponent);

    fireEvent.click(screen.getByRole('button', { name: 'Toggle color theme' }));
    TestBed.tick();

    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('false');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('picks up an already-persisted theme as its initial state', async () => {
    localStorage.setItem('theme', 'dark');

    await render(ThemeToggleComponent);

    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('false');
  });
});
