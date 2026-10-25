import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ProjectOrigin } from '../../core/models/project.model';
import { ContentService } from '../../core/services/content.service';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { AccordionComponent } from '../../shared/ui/accordion/accordion.component';
import { ProjectCaseStudyComponent } from './project-case-study/project-case-study.component';

interface ProjectTab {
  origin: ProjectOrigin;
  label: string;
}

@Component({
  selector: 'app-selected-work',
  standalone: true,
  imports: [AccordionComponent, ProjectCaseStudyComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './selected-work.component.html',
  styleUrl: './selected-work.component.scss',
})
export class SelectedWorkComponent {
  private readonly projects = inject(ContentService).projects;

  protected readonly tabs: ProjectTab[] = [
    { origin: 'personal', label: 'Personal projects' },
    { origin: 'company', label: 'Company projects' },
  ];

  protected readonly selected = signal<ProjectOrigin>('personal');

  protected readonly counts = computed(() => {
    const counts: Record<ProjectOrigin, number> = { personal: 0, company: 0 };
    for (const project of this.projects()) {
      counts[project.origin]++;
    }
    return counts;
  });

  protected readonly visibleProjects = computed(() =>
    this.projects().filter((project) => project.origin === this.selected()),
  );

  /** Arrow keys move between tabs, per the WAI-ARIA tabs pattern. */
  protected onTabKeydown(event: KeyboardEvent, index: number): void {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) {
      return;
    }
    event.preventDefault();
    const next = (index + step + this.tabs.length) % this.tabs.length;
    this.selected.set(this.tabs[next].origin);
    const tablist = (event.currentTarget as HTMLElement).parentElement;
    tablist?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  }
}
