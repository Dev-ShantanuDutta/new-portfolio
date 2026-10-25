import { render, screen } from '@testing-library/angular';
import { HighlightTextComponent } from './highlight-text.component';

describe('HighlightTextComponent', () => {
  it('renders projected content inside the highlight span', async () => {
    const { container } = await render(`<app-highlight-text>full-stack</app-highlight-text>`, {
      imports: [HighlightTextComponent],
    });

    expect(screen.getByText('full-stack')).toBeTruthy();
    expect(container.querySelector('.highlight-text')?.textContent).toBe('full-stack');
  });
});
