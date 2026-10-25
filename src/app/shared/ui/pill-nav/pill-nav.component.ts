import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface PillNavLink {
  label: string;
  routerLink?: string;
  /** In-page section id; the link is highlighted while that section is in view. */
  fragment?: string;
  /** Further section ids that also highlight this link, for links that cover several sections. */
  sections?: string[];
  href?: string;
}

@Component({
  selector: 'app-pill-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pill-nav.component.html',
  styleUrl: './pill-nav.component.scss',
})
export class PillNavComponent {
  /** Ordered set of nav destinations. */
  readonly links = input.required<PillNavLink[]>();

  /** id of the section currently in view; the link with that fragment is highlighted. */
  readonly activeFragment = input<string | null>(null);

  protected readonly activeIndex = computed(() => {
    const active = this.activeFragment();
    return active
      ? this.links().findIndex(
          (link) => link.fragment === active || !!link.sections?.includes(active),
        )
      : -1;
  });

  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');
  private readonly indicator = viewChild.required<ElementRef<HTMLElement>>('indicator');
  private readonly linkEls = viewChildren<ElementRef<HTMLElement>>('navLink');
  private readonly layoutTick = signal(0);

  constructor() {
    // Slide one shared highlight pill under the current link. Measured after render
    // (reads), then applied as a transform (writes), so layout is never thrashed.
    afterRenderEffect({
      earlyRead: () => {
        this.layoutTick();
        // Measure the <li>: it's positioned, so it (not the link) is offset within the list.
        const item = this.linkEls()[this.activeIndex()]?.nativeElement.parentElement;
        return item ? { x: item.offsetLeft, width: item.offsetWidth } : null;
      },
      write: (rect) => {
        const el = this.indicator().nativeElement;
        const box = rect();
        if (!box) {
          el.classList.remove('pill-nav__indicator--visible');
          return;
        }
        el.style.width = `${box.width}px`;
        el.style.transform = `translateX(${box.x}px)`;

        // When the links scroll sideways (narrow screens), keep the current one in view.
        const list = this.list().nativeElement;
        if (box.x < list.scrollLeft || box.x + box.width > list.scrollLeft + list.clientWidth) {
          list.scrollTo({ left: box.x - (list.clientWidth - box.width) / 2, behavior: 'smooth' });
        }
        if (!el.classList.contains('pill-nav__indicator--visible')) {
          // First appearance: fade in where it belongs instead of sliding in from the left.
          el.classList.remove('pill-nav__indicator--settled');
          el.classList.add('pill-nav__indicator--visible');
          requestAnimationFrame(() => el.classList.add('pill-nav__indicator--settled'));
        }
      },
    });

    // Link widths change when web fonts load or the viewport resizes.
    const destroyRef = inject(DestroyRef);
    afterRenderEffect(() => {
      if (typeof ResizeObserver === 'undefined') {
        return;
      }
      const resize = new ResizeObserver(() => this.layoutTick.update((n) => n + 1));
      resize.observe(this.list().nativeElement);
      destroyRef.onDestroy(() => resize.disconnect());
    });
  }
}
