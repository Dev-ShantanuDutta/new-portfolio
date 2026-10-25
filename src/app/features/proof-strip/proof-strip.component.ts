import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ContentService } from '../../core/services/content.service';
import { GithubService } from '../../core/services/github.service';
import { CountUpComponent } from '../../shared/motion/count-up.component';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { PanelComponent } from '../../shared/ui/panel/panel.component';
import { TechBadgeComponent } from '../../shared/ui/tech-badge/tech-badge.component';

@Component({
  selector: 'app-proof-strip',
  standalone: true,
  imports: [PanelComponent, TechBadgeComponent, RevealDirective, CountUpComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proof-strip.component.html',
  styleUrl: './proof-strip.component.scss',
})
export class ProofStripComponent {
  protected readonly githubProfile = inject(GithubService).profile;
  private readonly content = inject(ContentService);
  protected readonly techStack = this.content.techStack;
  protected readonly certifications = computed(() => this.content.identity()?.certifications ?? []);
}
