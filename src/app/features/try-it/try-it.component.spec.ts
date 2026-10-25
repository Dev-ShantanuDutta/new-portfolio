import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { fireEvent, render, screen } from '@testing-library/angular';
import { TryItComponent } from './try-it.component';

const mockResults = [
  { name: 'API Gateway', status: 'operational' as const, latencyMs: 32 },
  { name: 'Primary Database', status: 'degraded' as const, latencyMs: 88 },
  { name: 'Auth Service', status: 'operational' as const, latencyMs: 21 },
  { name: 'Background Jobs', status: 'down' as const, latencyMs: 210 },
];

describe('TryItComponent', () => {
  it('renders a text-equivalent description and a fully keyboard-operable trigger', async () => {
    await render(TryItComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    expect(screen.getByText(/calls a real endpoint on this site's own server/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Run health check' })).toBeTruthy();
  });

  it('runs a real health check and renders each service result with an accessible status label', async () => {
    const { detectChanges } = await render(TryItComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Run health check' }));
    detectChanges();

    expect(screen.getByText('Checking service health…')).toBeTruthy();

    const httpMock = TestBed.inject(HttpTestingController);
    const req = httpMock.expectOne('/api/system-check');
    expect(req.request.method).toBe('GET');
    req.flush(mockResults);
    detectChanges();

    expect(screen.getByText('API Gateway')).toBeTruthy();
    expect(screen.getByText('32 ms')).toBeTruthy();
    expect(screen.getAllByRole('img', { name: 'Operational' })).toHaveLength(2);
    expect(screen.getByRole('img', { name: 'Degraded' })).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Down' })).toBeTruthy();
    expect(screen.getByText(/Session uptime so far/)).toBeTruthy();
    expect(screen.getByText('50%')).toBeTruthy();
    expect(screen.queryByText('Checking service health…')).toBeNull();

    httpMock.verify();
  });

  it('shows an error message when the health check request fails', async () => {
    const { detectChanges } = await render(TryItComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Run health check' }));
    detectChanges();

    const httpMock = TestBed.inject(HttpTestingController);
    httpMock
      .expectOne('/api/system-check')
      .flush('error', { status: 500, statusText: 'Server Error' });
    detectChanges();

    expect(screen.getByRole('alert').textContent).toContain('Something went wrong');

    httpMock.verify();
  });
});
