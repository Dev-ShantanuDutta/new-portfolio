import { render, screen } from '@testing-library/angular';
import { TechBadgeComponent } from './tech-badge.component';

describe('TechBadgeComponent', () => {
  it('renders the tech name', async () => {
    await render(TechBadgeComponent, {
      inputs: { name: 'Angular' },
    });

    expect(screen.getByText('Angular')).toBeTruthy();
  });

  it('renders the icon image, hidden from assistive tech, when provided', async () => {
    const { container } = await render(TechBadgeComponent, {
      inputs: { name: 'Angular', icon: 'angular' },
    });

    expect(container.querySelector('.tech-badge__icon-chip')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
    const icon = container.querySelector<HTMLImageElement>('.tech-badge__icon');
    expect(icon?.src).toContain('assets/icons/angular.svg');
    expect(icon?.alt).toBe('');
  });
});
