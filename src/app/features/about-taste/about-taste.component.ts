import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentService } from '../../core/services/content.service';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { PanelComponent } from '../../shared/ui/panel/panel.component';

@Component({
  selector: 'app-about-taste',
  standalone: true,
  imports: [PanelComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-taste.component.html',
  styleUrl: './about-taste.component.scss',
})
export class AboutTasteComponent {
  private readonly content = inject(ContentService);

  protected readonly identity = this.content.identity;
  protected readonly bookmarks = this.content.bookmarks;
}
