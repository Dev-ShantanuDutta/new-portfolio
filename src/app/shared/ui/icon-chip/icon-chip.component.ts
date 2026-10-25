import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-icon-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-chip.component.html',
  styleUrl: './icon-chip.component.scss',
})
export class IconChipComponent {
  /** Glyph rendered inside the chip; omit to project a custom SVG instead. */
  readonly icon = input<string>();

  /** Accessible name for this icon-only element. */
  readonly label = input.required<string>();
}
