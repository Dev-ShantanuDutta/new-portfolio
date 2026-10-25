import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { WINDOW } from '../../core/tokens/window.token';
import { RevealObserver } from './reveal.directive';

const DURATION_MS = 900;

/** Splits "3.5+" into 3.5, 1 decimal place and the "+" suffix. */
function parse(value: string | number): { target: number; decimals: number; suffix: string } {
  const match = /^(\d+(?:\.(\d+))?)(.*)$/.exec(String(value));
  return match
    ? { target: Number(match[1]), decimals: match[2]?.length ?? 0, suffix: match[3] }
    : { target: NaN, decimals: 0, suffix: '' };
}

/**
 * Renders a number that counts up from 0, once, when it first comes into view.
 * The final value is what's server-rendered and what's shown when motion is
 * reduced, so it is always correct without JavaScript.
 */
@Component({
  selector: 'app-count-up',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ display() ?? value() }}`,
  styles: `
    :host {
      font-variant-numeric: tabular-nums;
    }
  `,
})
export class CountUpComponent {
  /** The final value, e.g. 42 or "3.5+". Non-numeric values render as-is. */
  readonly value = input.required<string | number>();

  /** Mid-animation text; null means "show the final value". */
  protected readonly display = signal<string | null>(null);

  private readonly parsed = computed(() => parse(this.value()));

  constructor() {
    const element = inject(ElementRef<HTMLElement>).nativeElement;
    const observer = inject(RevealObserver);
    const win = inject(WINDOW);
    let frame = 0;

    inject(DestroyRef).onDestroy(() => {
      observer.unobserve(element);
      win?.cancelAnimationFrame(frame);
    });

    afterNextRender(() => {
      const { target } = this.parsed();
      const reduce = win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      const root = win?.document.documentElement;
      if (!win || reduce || !Number.isFinite(target) || !root?.classList.contains('motion')) {
        return;
      }

      const run = () => {
        const start = win.performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION_MS, 1);
          if (progress >= 1) {
            this.display.set(null);
            return;
          }
          this.display.set(this.format(target * (1 - Math.pow(1 - progress, 3))));
          frame = win.requestAnimationFrame(tick);
        };
        this.display.set(this.format(0));
        frame = win.requestAnimationFrame(tick);
      };

      // Under the intro: count once it lifts. Already on screen otherwise: leave the
      // final value alone rather than snapping it back to 0 in front of the reader.
      if (root.classList.contains('intro-playing')) {
        win.addEventListener('intro:done', run, { once: true });
      } else if (element.getBoundingClientRect().top < win.innerHeight) {
        return;
      } else {
        observer.observe(element, run);
      }
    });
  }

  private format(current: number): string {
    const { decimals, suffix } = this.parsed();
    return current.toFixed(decimals) + suffix;
  }
}
