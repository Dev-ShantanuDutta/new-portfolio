import { fireEvent, render, screen } from '@testing-library/angular';
import { AccordionComponent } from './accordion.component';
import { AccordionItemComponent } from './accordion-item.component';

describe('AccordionItemComponent', () => {
  it('renders collapsed by default with correct disclosure semantics', async () => {
    await render(
      `<app-accordion><app-accordion-item title="Senior Engineer">Details</app-accordion-item></app-accordion>`,
      { imports: [AccordionComponent, AccordionItemComponent] },
    );

    const trigger = screen.getByRole('button', { name: 'Senior Engineer' });
    const panel = screen.getByRole('region', { hidden: true });

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id);
    expect(panel.hidden).toBe(true);
  });

  it('expands and reveals its content when the trigger is activated', async () => {
    const { detectChanges } = await render(
      `<app-accordion><app-accordion-item title="Senior Engineer">Details</app-accordion-item></app-accordion>`,
      { imports: [AccordionComponent, AccordionItemComponent] },
    );

    fireEvent.click(screen.getByRole('button', { name: 'Senior Engineer' }));
    detectChanges();

    const trigger = screen.getByRole('button', { name: 'Senior Engineer' });
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Details').closest('[role="region"]')).not.toBeNull();
    expect(
      (screen.getByText('Details').closest('.accordion-item__panel') as HTMLElement).hidden,
    ).toBe(false);
  });

  it('honours an initially expanded input', async () => {
    await render(
      `<app-accordion><app-accordion-item title="Open by default" [expanded]="true">Details</app-accordion-item></app-accordion>`,
      { imports: [AccordionComponent, AccordionItemComponent] },
    );

    expect(
      screen.getByRole('button', { name: 'Open by default' }).getAttribute('aria-expanded'),
    ).toBe('true');
  });

  it('keeps only one item expanded at a time by default (multi is false)', async () => {
    const { detectChanges } = await render(
      `<app-accordion>
        <app-accordion-item title="First">First body</app-accordion-item>
        <app-accordion-item title="Second">Second body</app-accordion-item>
      </app-accordion>`,
      { imports: [AccordionComponent, AccordionItemComponent] },
    );

    fireEvent.click(screen.getByRole('button', { name: 'First' }));
    detectChanges();
    fireEvent.click(screen.getByRole('button', { name: 'Second' }));
    detectChanges();

    expect(screen.getByRole('button', { name: 'First' }).getAttribute('aria-expanded')).toBe(
      'false',
    );
    expect(screen.getByRole('button', { name: 'Second' }).getAttribute('aria-expanded')).toBe(
      'true',
    );
  });

  it('renders projected [accordion-trigger] content and derives the accessible name from it, not just title (WCAG 2.5.3)', async () => {
    await render(
      `<app-accordion>
        <app-accordion-item title="Project X" [hasCustomTrigger]="true">
          <span accordion-trigger>Rich teaser for Project X</span>
          Case study body
        </app-accordion-item>
      </app-accordion>`,
      { imports: [AccordionComponent, AccordionItemComponent] },
    );

    const trigger = screen.getByRole('button', { name: 'Rich teaser for Project X' });
    expect(trigger.getAttribute('aria-label')).toBeNull();
    expect(trigger.textContent?.trim()).toBe('Rich teaser for Project X');
    expect(screen.getByText('Case study body')).toBeTruthy();
  });
});
