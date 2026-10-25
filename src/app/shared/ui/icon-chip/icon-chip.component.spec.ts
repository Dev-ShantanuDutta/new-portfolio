import { render, screen } from '@testing-library/angular';
import { IconChipComponent } from './icon-chip.component';

describe('IconChipComponent', () => {
  it('exposes the label as its accessible name', async () => {
    await render(IconChipComponent, {
      inputs: { label: 'GitHub', icon: '★' },
    });

    expect(screen.getByRole('img', { name: 'GitHub' })).toBeTruthy();
  });

  it('renders the icon glyph hidden from assistive tech', async () => {
    const { container } = await render(IconChipComponent, {
      inputs: { label: 'GitHub', icon: '★' },
    });

    const glyph = container.querySelector('.icon-chip__glyph');
    expect(glyph?.textContent).toBe('★');
    expect(glyph?.getAttribute('aria-hidden')).toBe('true');
  });

  it('projects custom content when no icon glyph is given', async () => {
    await render(
      `<app-icon-chip label="Email"><svg data-testid="custom-svg"></svg></app-icon-chip>`,
      {
        imports: [IconChipComponent],
      },
    );

    expect(screen.getByTestId('custom-svg')).toBeTruthy();
  });
});
