import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentService } from '../../core/services/content.service';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { AccordionComponent } from '../../shared/ui/accordion/accordion.component';
import { AccordionItemComponent } from '../../shared/ui/accordion/accordion-item.component';
import { IconChipComponent } from '../../shared/ui/icon-chip/icon-chip.component';
import { StatusDotComponent } from '../../shared/ui/status-dot/status-dot.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    DatePipe,
    AccordionComponent,
    AccordionItemComponent,
    IconChipComponent,
    StatusDotComponent,
    RevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  protected readonly experience = inject(ContentService).experience;
}
