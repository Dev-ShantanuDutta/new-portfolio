import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
})
export class PanelComponent {
  /** Optional heading rendered above the projected content. */
  readonly label = input<string>();

  /** Applies the accent-bordered modifier used by the highlighted "How I Engineer" card. */
  readonly isHighlighted = input(false);
}
