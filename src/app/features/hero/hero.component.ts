import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { formatYearsOfExperience } from '../../core/utils/experience-duration.util';
import { ContentService } from '../../core/services/content.service';
import { GithubService } from '../../core/services/github.service';
import { CountUpComponent } from '../../shared/motion/count-up.component';
import { GradientBlobComponent } from '../../shared/ui/gradient-blob/gradient-blob.component';
import { HighlightTextComponent } from '../../shared/ui/highlight-text/highlight-text.component';
import { PanelComponent } from '../../shared/ui/panel/panel.component';
import { PillButtonComponent } from '../../shared/ui/pill-button/pill-button.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    DatePipe,
    GradientBlobComponent,
    HighlightTextComponent,
    PanelComponent,
    PillButtonComponent,
    CountUpComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  private readonly content = inject(ContentService);
  private readonly github = inject(GithubService);

  protected readonly identity = this.content.identity;
  protected readonly githubProfile = this.github.profile;

  protected readonly currentRole = computed(() =>
    this.content.experience().find((entry) => entry.status === 'live'),
  );

  /** Years of professional experience, auto-calculated from the earliest role's start date. */
  protected readonly yearsExperience = computed(() => {
    const entries = this.content.experience();
    if (!entries.length) {
      return null;
    }
    const earliestStart = entries.reduce(
      (min, entry) => (entry.startDate < min ? entry.startDate : min),
      entries[0].startDate,
    );
    return formatYearsOfExperience(earliestStart);
  });
}
