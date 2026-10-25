import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { fireEvent, render, screen } from '@testing-library/angular';
import { WINDOW } from '../../core/tokens/window.token';
import { ComingSoonComponent } from './coming-soon.component';

describe('ComingSoonComponent', () => {
  const providers = [provideHttpClient(), provideHttpClientTesting()];

  function flushProjects(): void {
    TestBed.inject(HttpTestingController)
      .match(() => true)
      .forEach((req) =>
        req.flush(
          req.request.url === '/assets/data/projects.json'
            ? [{ slug: 'candle-shop', name: 'Candle Shop' }]
            : null,
        ),
      );
  }

  it('names the project in the heading when the slug matches', async () => {
    const { detectChanges } = await render(ComingSoonComponent, {
      providers,
      inputs: { project: 'candle-shop' },
    });
    flushProjects();
    detectChanges();

    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Candle Shop is coming soon',
    );
  });

  it('closes the tab on "Back to projects" when the browser allows it', async () => {
    const assign = vi.fn();
    const fakeWindow = {
      closed: false,
      close: vi.fn(() => (fakeWindow.closed = true)),
      location: { assign },
    };
    await render(ComingSoonComponent, {
      providers: [...providers, { provide: WINDOW, useValue: fakeWindow }],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Back to projects' }));

    expect(fakeWindow.close).toHaveBeenCalled();
    expect(assign).not.toHaveBeenCalled();
  });

  it('goes to the projects section when the tab cannot be closed', async () => {
    const assign = vi.fn();
    const fakeWindow = { closed: false, close: vi.fn(), location: { assign } };
    await render(ComingSoonComponent, {
      providers: [...providers, { provide: WINDOW, useValue: fakeWindow }],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Back to projects' }));

    expect(assign).toHaveBeenCalledWith('/#selected-work');
  });

  it('falls back to a generic heading without a known project', async () => {
    const { detectChanges } = await render(ComingSoonComponent, { providers });
    flushProjects();
    detectChanges();

    expect(screen.getByRole('heading', { level: 1 }).textContent?.trim()).toBe('Coming soon');
  });
});
