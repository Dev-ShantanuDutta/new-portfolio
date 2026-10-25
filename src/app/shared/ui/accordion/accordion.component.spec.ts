import { render, screen } from '@testing-library/angular';
import { AccordionComponent } from './accordion.component';

describe('AccordionComponent', () => {
  it('renders its projected content', async () => {
    await render(`<app-accordion><p>Item content</p></app-accordion>`, {
      imports: [AccordionComponent],
    });

    expect(screen.getByText('Item content')).toBeTruthy();
  });
});
