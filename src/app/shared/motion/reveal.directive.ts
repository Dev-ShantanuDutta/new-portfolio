import {
  DestroyRef,
  Directive,
  ElementRef,
  Injectable,
  afterNextRender,
  computed,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';

/** One shared IntersectionObserver for every [appReveal] element on the page. */
@Injectable({ providedIn: 'root' })
export class RevealObserver {
  private readonly callbacks = new Map<Element, () => void>();
  private observer?: IntersectionObserver;

  /** Calls `onVisible` once, the first time `element` scrolls into view. */
  observe(element: Element, onVisible: () => void): void {
    if (typeof IntersectionObserver === 'undefined') {
      onVisible();
      return;
    }

    this.observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.callbacks.get(entry.target)?.();
            this.unobserve(entry.target);
          }
        }
      },
      // Once 10% of the element shows. No shrunken root margin: content at the very
      // bottom of the page could never scroll far enough to cross one.
      { threshold: 0.1 },
    );
    this.callbacks.set(element, onVisible);
    this.observer.observe(element);
  }

  unobserve(element: Element): void {
    this.callbacks.delete(element);
    this.observer?.unobserve(element);
  }
}

/**
 * Fades and slides the element in the first time it scrolls into view.
 * The value is a stagger index: `[appReveal]="$index"` delays each sibling a little more.
 *
 * Hidden state lives in global CSS behind `html.motion`, so without JavaScript (or
 * if the app fails to start) the element is simply visible.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    'data-reveal': '',
    '[class.is-revealed]': 'revealed()',
    '[style.--reveal-delay]': 'delay()',
  },
})
export class RevealDirective {
  /** Stagger position among siblings; each step adds --reveal-stagger, capped at 5 steps. */
  readonly appReveal = input(0, { transform: (v: unknown) => numberAttribute(v, 0) });

  protected readonly revealed = signal(false);
  protected readonly delay = computed(
    () => `calc(var(--reveal-stagger) * ${Math.min(this.appReveal(), 5)})`,
  );

  constructor() {
    const element = inject(ElementRef<HTMLElement>).nativeElement;
    const observer = inject(RevealObserver);

    afterNextRender(() => observer.observe(element, () => this.revealed.set(true)));
    inject(DestroyRef).onDestroy(() => observer.unobserve(element));
  }
}
