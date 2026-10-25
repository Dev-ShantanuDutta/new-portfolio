import { fireEvent, render, screen } from '@testing-library/angular';
import { PillButtonComponent } from './pill-button.component';

describe('PillButtonComponent', () => {
  it('renders a button with the label when no href is set', async () => {
    await render(PillButtonComponent, {
      inputs: { label: 'Get in touch' },
    });

    const button = screen.getByRole('button', { name: 'Get in touch' });
    expect(button.tagName).toBe('BUTTON');
    expect(button.className).toContain('pill-button--primary');
  });

  it('renders a link when href is set', async () => {
    await render(PillButtonComponent, {
      inputs: { label: 'View résumé', href: '/resume.pdf' },
    });

    const link = screen.getByRole('link', { name: 'View résumé' });
    expect(link.getAttribute('href')).toBe('/resume.pdf');
  });

  it('applies the secondary variant class when requested', async () => {
    await render(PillButtonComponent, {
      inputs: { label: 'Secondary', variant: 'secondary' },
    });

    expect(screen.getByRole('button').className).toContain('pill-button--secondary');
  });

  it('renders the icon glyph, hidden from assistive tech, alongside the button label', async () => {
    const { container } = await render(PillButtonComponent, {
      inputs: { label: 'Talk to me', icon: '→' },
    });

    const icon = container.querySelector('.pill-button__icon');
    expect(icon?.textContent).toBe('→');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders the icon glyph on a link variant too', async () => {
    const { container } = await render(PillButtonComponent, {
      inputs: { label: 'Resume', href: '/resume.pdf', icon: '📄' },
    });

    expect(container.querySelector('.pill-button__icon')?.textContent).toBe('📄');
  });

  it('emits clicked when activated as a button', async () => {
    const onClicked = vi.fn();

    await render(PillButtonComponent, {
      inputs: { label: 'Send' },
      on: { clicked: onClicked },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(onClicked).toHaveBeenCalledTimes(1);
  });
});
