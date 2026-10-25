import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Project } from '../../../core/models/project.model';
import { AccordionItemComponent } from '../../../shared/ui/accordion/accordion-item.component';
import { PillButtonComponent } from '../../../shared/ui/pill-button/pill-button.component';
import { StatusDotComponent } from '../../../shared/ui/status-dot/status-dot.component';
import { TechBadgeComponent } from '../../../shared/ui/tech-badge/tech-badge.component';

@Component({
  selector: 'app-project-case-study',
  standalone: true,
  imports: [AccordionItemComponent, PillButtonComponent, StatusDotComponent, TechBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-case-study.component.html',
  styleUrl: './project-case-study.component.scss',
})
export class ProjectCaseStudyComponent {
  /** The project whose teaser and full case study this renders. */
  readonly project = input.required<Project>();

  /** Renders already expanded — set on the standalone `/projects/:slug` route. */
  readonly initiallyExpanded = input(false);
}
