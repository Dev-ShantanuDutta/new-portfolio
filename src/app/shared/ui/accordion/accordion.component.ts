import { CdkAccordion } from '@angular/cdk/accordion';
import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';

@Component({
  selector: 'app-accordion',
  standalone: true,
  hostDirectives: [CdkAccordion],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
})
export class AccordionComponent {
  /** Allows more than one child app-accordion-item to stay expanded at once. */
  readonly multi = input(false);

  private readonly cdkAccordion = inject(CdkAccordion, { self: true });

  constructor() {
    effect(() => {
      this.cdkAccordion.multi = this.multi();
    });
  }
}
