import { render } from '@testing-library/angular';
import { GradientBlobComponent } from './gradient-blob.component';

describe('GradientBlobComponent', () => {
  it('renders as decorative and hidden from assistive tech', async () => {
    const { container } = await render(GradientBlobComponent);

    const blob = container.querySelector('.gradient-blob');
    expect(blob?.getAttribute('aria-hidden')).toBe('true');
    expect(blob?.className).toContain('gradient-blob--md');
    expect(blob?.className).toContain('gradient-blob--center');
  });

  it('applies the requested size and position modifiers', async () => {
    const { container } = await render(GradientBlobComponent, {
      inputs: { size: 'lg', position: 'top-right' },
    });

    const blob = container.querySelector('.gradient-blob');
    expect(blob?.className).toContain('gradient-blob--lg');
    expect(blob?.className).toContain('gradient-blob--top-right');
  });
});
