import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-gradient-blob',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gradient-blob.component.html',
  styleUrl: './gradient-blob.component.scss',
})
export class GradientBlobComponent {
  /** Blob diameter preset. */
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  /** Absolute position within the nearest positioned ancestor. */
  readonly position = input<'top-left' | 'top-right' | 'center'>('center');

  protected readonly modifierClasses = computed(
    () => `gradient-blob--${this.size()} gradient-blob--${this.position()}`,
  );
}
