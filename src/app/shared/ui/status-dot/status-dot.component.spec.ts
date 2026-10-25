import { render, screen } from '@testing-library/angular';
import { StatusDotComponent } from './status-dot.component';

describe('StatusDotComponent', () => {
  it('renders a live status with an accessible name', async () => {
    const { container } = await render(StatusDotComponent, {
      inputs: { status: 'live' },
    });

    expect(container.querySelector('.status-dot--live')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Live' })).toBeTruthy();
  });

  it('renders a pinned status with an accessible name', async () => {
    const { container } = await render(StatusDotComponent, {
      inputs: { status: 'pinned' },
    });

    expect(container.querySelector('.status-dot--pinned')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Pinned' })).toBeTruthy();
  });

  it('keeps its layout footprint but exposes no accessible name for none', async () => {
    const { container } = await render(StatusDotComponent, {
      inputs: { status: 'none' },
    });

    const dot = container.querySelector('.status-dot--none');
    expect(dot).toBeTruthy();
    expect(dot?.getAttribute('role')).toBeNull();
    expect(dot?.getAttribute('aria-label')).toBeNull();
  });
});
