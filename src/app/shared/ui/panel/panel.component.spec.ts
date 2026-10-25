import { render, screen } from '@testing-library/angular';
import { PanelComponent } from './panel.component';

describe('PanelComponent', () => {
  it('renders projected content without a label', async () => {
    await render(`<app-panel>Body content</app-panel>`, {
      imports: [PanelComponent],
    });

    expect(screen.getByText('Body content')).toBeTruthy();
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('renders the label as a heading when provided', async () => {
    await render(`<app-panel label="Selected Work">Body content</app-panel>`, {
      imports: [PanelComponent],
    });

    expect(screen.getByRole('heading', { name: 'Selected Work' })).toBeTruthy();
  });

  it('applies the highlighted modifier class when isHighlighted is true', async () => {
    const { container } = await render(`<app-panel [isHighlighted]="true">Body</app-panel>`, {
      imports: [PanelComponent],
    });

    expect(container.querySelector('.panel--highlighted')).toBeTruthy();
  });
});
