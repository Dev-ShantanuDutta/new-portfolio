import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-tech-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tech-badge.component.html',
  styleUrl: './tech-badge.component.scss',
})
export class TechBadgeComponent {
  /** Technology name shown on the badge. */
  readonly name = input.required<string>();

  /** Optional icon slug, rendered as `assets/icons/<icon>.svg` before the name. */
  readonly icon = input<string>();
}
