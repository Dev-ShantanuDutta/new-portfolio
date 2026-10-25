import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';
import { WINDOW } from '../../core/tokens/window.token';
import { backToProjects } from '../../core/utils/back-to-projects.util';
import { PillButtonComponent } from '../../shared/ui/pill-button/pill-button.component';

/** Shown instead of a live demo for company projects, which run on client data. */
@Component({
  selector: 'app-demo-unavailable',
  standalone: true,
  imports: [PillButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-unavailable.component.html',
  styleUrl: './demo-unavailable.component.scss',
})
export class DemoUnavailableComponent {
  /** Project slug from the `?project=` query param, used to name the project and employer. */
  readonly project = input<string>();

  private readonly projects = inject(ContentService).projects;
  private readonly window = inject(WINDOW);

  protected readonly match = computed(() => this.projects().find((p) => p.slug === this.project()));

  constructor() {
    inject(SeoService).setMetadata({
      title: 'Demo not available — Shantanu Dutta',
      description:
        'This project was built for a client and runs on their data, so there is no public demo.',
    });
    // A placeholder page shouldn't show up in search results.
    inject(Meta).updateTag({ name: 'robots', content: 'noindex' });
  }

  protected backToProjects(): void {
    backToProjects(this.window);
  }
}
