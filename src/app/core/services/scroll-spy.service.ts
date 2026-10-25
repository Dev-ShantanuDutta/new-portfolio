import { Injectable, inject, signal } from '@angular/core';
import { WINDOW } from '../tokens/window.token';

/** How far down the viewport a section's top must pass to count as "current". */
const ACTIVATION_LINE = 0.35;

/**
 * Tracks which `main section[id]` the reader is currently in, for highlighting
 * the matching nav link. Read-only layout queries, throttled to one per frame.
 */
@Injectable({ providedIn: 'root' })
export class ScrollSpyService {
  private readonly win = inject(WINDOW);
  private readonly current = signal<string | null>(null);
  private scheduled = false;

  /** id of the section in view, or null above the first one / off the home page. */
  readonly activeSection = this.current.asReadonly();

  constructor() {
    const win = this.win;
    if (!win) {
      return;
    }

    const schedule = () => {
      if (!this.scheduled) {
        this.scheduled = true;
        win.requestAnimationFrame(() => {
          this.scheduled = false;
          this.measure();
        });
      }
    };

    win.addEventListener('scroll', schedule, { passive: true });
    win.addEventListener('resize', schedule, { passive: true });
  }

  /** Re-checks immediately, e.g. after a route change swaps the page content. */
  measure(): void {
    const win = this.win;
    if (!win) {
      return;
    }

    const doc = win.document;
    const sections = Array.from(doc.querySelectorAll<HTMLElement>('main section[id]'));
    const atBottom =
      win.innerHeight + win.scrollY >= doc.documentElement.scrollHeight - 2 && win.scrollY > 0;

    let active: string | null = null;
    if (atBottom && sections.length) {
      // The last section may be too short to ever reach the activation line.
      active = sections[sections.length - 1].id;
    } else {
      const line = win.innerHeight * ACTIVATION_LINE;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) {
          active = section.id;
        }
      }
    }

    this.current.set(active);
  }
}
