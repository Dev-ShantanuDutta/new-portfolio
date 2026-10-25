import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { IconChipComponent } from '../../shared/ui/icon-chip/icon-chip.component';
import { PanelComponent } from '../../shared/ui/panel/panel.component';

@Component({
  selector: 'app-writing',
  standalone: true,
  imports: [DatePipe, RouterLink, IconChipComponent, PanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './writing.component.html',
  styleUrl: './writing.component.scss',
})
export class WritingComponent {
  protected readonly posts = inject(ContentService).blogPosts;
}
