import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentService } from '../../core/services/content.service';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { PanelComponent } from '../../shared/ui/panel/panel.component';

@Component({
  selector: 'app-how-i-engineer',
  standalone: true,
  imports: [PanelComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './how-i-engineer.component.html',
  styleUrl: './how-i-engineer.component.scss',
})
export class HowIEngineerComponent {
  protected readonly processSteps = inject(ContentService).processSteps;
}
