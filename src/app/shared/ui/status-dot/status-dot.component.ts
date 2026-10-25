import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type Status = 'live' | 'pinned' | 'none';

const STATUS_LABELS: Record<Status, string> = {
  live: 'Live',
  pinned: 'Pinned',
  none: '',
};

@Component({
  selector: 'app-status-dot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './status-dot.component.html',
  styleUrl: './status-dot.component.scss',
})
export class StatusDotComponent {
  /** Always pass this input, even as `'none'`, so the layout footprint stays stable. */
  readonly status = input.required<Status>();

  protected readonly modifierClass = computed(() => `status-dot--${this.status()}`);

  protected readonly statusLabel = computed(() => STATUS_LABELS[this.status()]);
}
