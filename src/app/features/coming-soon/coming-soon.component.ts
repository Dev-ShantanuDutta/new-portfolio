import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';
import { WINDOW } from '../../core/tokens/window.token';
import { backToProjects } from '../../core/utils/back-to-projects.util';
import { PillButtonComponent } from '../../shared/ui/pill-button/pill-button.component';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [PillButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.scss',
})
export class ComingSoonComponent {
  /** Project slug from the `?project=` query param, used to name the project in the heading. */
  readonly project = input<string>();

  /** Rotation angles, in degrees, for each tooth of the illustration's gears. */
  protected readonly largeTeeth = [0, 45, 90, 135, 180, 225, 270, 315];
  protected readonly smallTeeth = [0, 60, 120, 180, 240, 300];

  private readonly projects = inject(ContentService).projects;
  private readonly window = inject(WINDOW);

  protected readonly projectName = computed(
    () => this.projects().find((p) => p.slug === this.project())?.name,
  );

  constructor() {
    inject(SeoService).setMetadata({
      title: 'Coming soon — Shantanu Dutta',
      description: 'This project is still in progress. The demo and source code are on the way.',
    });
    // A placeholder page shouldn't show up in search results.
    inject(Meta).updateTag({ name: 'robots', content: 'noindex' });
  }

  protected backToProjects(): void {
    backToProjects(this.window);
  }
}
