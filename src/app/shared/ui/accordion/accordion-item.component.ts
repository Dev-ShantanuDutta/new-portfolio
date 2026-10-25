import { CdkAccordionItem } from '@angular/cdk/accordion';
import { ChangeDetectionStrategy, Component, effect, inject, input, model } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

let nextAccordionItemId = 0;

@Component({
  selector: 'app-accordion-item',
  standalone: true,
  hostDirectives: [CdkAccordionItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.scss',
})
export class AccordionItemComponent {
  /** Accessible name for the trigger, and its visible text unless hasCustomTrigger is set. */
  readonly title = input.required<string>();

  /** Set when projecting custom [accordion-trigger] content instead of the plain title text. */
  readonly hasCustomTrigger = input(false);

  /** Visible "click to open" text beside the chevron, e.g. "View details". Hidden when unset. */
  readonly expandHint = input<string>();

  /** Replaces expandHint while the item is open. */
  readonly collapseHint = input('Hide details');

  /** Two-way expanded state, coordinated with sibling items by the parent app-accordion. */
  readonly expanded = model(false);

  protected readonly triggerId = `accordion-item-trigger-${nextAccordionItemId++}`;
  protected readonly panelId = `accordion-item-panel-${nextAccordionItemId++}`;

  private readonly cdkItem = inject(CdkAccordionItem, { self: true });

  constructor() {
    effect(() => {
      this.cdkItem.expanded = this.expanded();
    });

    this.cdkItem.expandedChange.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.expanded.set(value);
    });
  }

  protected toggle(): void {
    this.cdkItem.toggle();
  }
}
