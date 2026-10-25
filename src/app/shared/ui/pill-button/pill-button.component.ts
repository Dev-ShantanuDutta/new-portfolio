import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pill-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pill-button.component.html',
  styleUrl: './pill-button.component.scss',
})
export class PillButtonComponent {
  /** Visible button text. */
  readonly label = input.required<string>();

  /** Fill style: `primary` uses the accent color, `secondary` is outlined. */
  readonly variant = input<'primary' | 'secondary'>('primary');

  /** Optional glyph rendered before the label. */
  readonly icon = input<string>();

  /** When set, renders an `<a>` instead of a `<button>`. */
  readonly href = input<string>();

  /** Opens `href` in a new tab, with a ↗ marker and a screen-reader note saying so. */
  readonly newTab = input(false);

  /** Emitted on activation when no `href` is set. */
  readonly clicked = output<void>();

  protected readonly isLink = computed(() => !!this.href());

  protected readonly classes = computed(() => ({
    'pill-button--primary': this.variant() === 'primary',
    'pill-button--secondary': this.variant() === 'secondary',
  }));
}
