import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { fireEvent, render, screen } from '@testing-library/angular';
import { WINDOW } from '../../core/tokens/window.token';
import { DemoUnavailableComponent } from './demo-unavailable.component';

describe('DemoUnavailableComponent', () => {
  const providers = [provideHttpClient(), provideHttpClientTesting()];

  function flushProjects(): void {
    TestBed.inject(HttpTestingController)
      .match(() => true)
      .forEach((req) =>
        req.flush(
          req.request.url === 'assets/data/projects.json'
            ? [{ slug: 'admin-portal', name: 'Admin Portal', origin: 'company', company: 'Acme' }]
            : null,
        ),
      );
  }

  it('names the project and employer when the slug matches', async () => {
    const { detectChanges } = await render(DemoUnavailableComponent, {
      providers,
      inputs: { project: 'admin-portal' },
    });
    flushProjects();
    detectChanges();

    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      "Sorry, this demo isn't available",
    );
    expect(screen.getByText(/at Acme for a client/)).toBeTruthy();
    expect(screen.getByText('Admin Portal')).toBeTruthy();
  });

  it('falls back to generic copy without a known project', async () => {
    const { detectChanges } = await render(DemoUnavailableComponent, { providers });
    flushProjects();
    detectChanges();

    expect(screen.getByText(/This project was built for a client/)).toBeTruthy();
  });

  it('goes to the projects section when the tab cannot be closed', async () => {
    const assign = vi.fn();
    const fakeWindow = { closed: false, close: vi.fn(), location: { assign } };
    await render(DemoUnavailableComponent, {
      providers: [...providers, { provide: WINDOW, useValue: fakeWindow }],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Back to projects' }));

    expect(assign).toHaveBeenCalledWith('/#selected-work');
  });
});
