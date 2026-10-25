import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IconChipComponent } from '../../shared/ui/icon-chip/icon-chip.component';
import { PanelComponent } from '../../shared/ui/panel/panel.component';
import { PillButtonComponent } from '../../shared/ui/pill-button/pill-button.component';

type ServiceStatus = 'operational' | 'degraded' | 'down';

interface ServiceCheckResult {
  name: string;
  status: ServiceStatus;
  latencyMs: number;
}

interface ServiceCheckViewModel extends ServiceCheckResult {
  icon: string;
  statusLabel: string;
}

const STATUS_ICON: Record<ServiceStatus, string> = {
  operational: '✅',
  degraded: '⚠️',
  down: '⛔',
};

const STATUS_LABEL: Record<ServiceStatus, string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  down: 'Down',
};

@Component({
  selector: 'app-try-it',
  standalone: true,
  imports: [PanelComponent, PillButtonComponent, IconChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './try-it.component.html',
  styleUrl: './try-it.component.scss',
})
export class TryItComponent {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly results = signal<ServiceCheckViewModel[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly checksRun = signal(0);
  protected readonly operationalChecks = signal(0);

  protected readonly sessionUptime = computed(() => {
    const total = this.checksRun();
    return total === 0 ? 0 : Math.round((this.operationalChecks() / total) * 1000) / 10;
  });

  protected runCheck(): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.http
      .get<ServiceCheckResult[]>('/api/system-check')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results) => {
          this.results.set(
            results.map((result) => ({
              ...result,
              icon: STATUS_ICON[result.status],
              statusLabel: STATUS_LABEL[result.status],
            })),
          );
          this.checksRun.update((count) => count + results.length);
          this.operationalChecks.update(
            (count) => count + results.filter((result) => result.status === 'operational').length,
          );
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Something went wrong running the health check — try again.');
          this.isLoading.set(false);
        },
      });
  }
}
