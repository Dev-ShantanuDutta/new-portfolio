import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { ScrollSpyService } from '../../core/services/scroll-spy.service';
import { PillButtonComponent } from '../../shared/ui/pill-button/pill-button.component';
import { PillNavComponent, PillNavLink } from '../../shared/ui/pill-nav/pill-nav.component';
import { ThemeToggleComponent } from '../../shared/ui/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [PillNavComponent, PillButtonComponent, ThemeToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  /** The home page's main sections in page order, then the resume. */
  protected readonly links: PillNavLink[] = [
    // The intro plus the tech stack and certifications strip under it.
    { label: 'Home', fragment: 'hero', sections: ['proof-strip'] },
    { label: 'Process', fragment: 'how-i-engineer' },
    // Projects and the work history read as one "Experience" stretch of the page.
    { label: 'Experience', fragment: 'selected-work', sections: ['experience'] },
    // Hidden while the Writing section is commented out on the home page.
    // { label: 'Writing', fragment: 'writing' },
    // The bio plus the contact links that close the page.
    { label: 'About', fragment: 'about-taste', sections: ['contact'] },
    { label: 'Resume', href: '[YOUR: link to your resume PDF]' },
  ];

  private readonly router = inject(Router);
  private readonly scrollSpy = inject(ScrollSpyService);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /**
   * The section in view, or Home on the home page until the reader scrolls
   * (the scroll spy has nothing to report before then, e.g. on first load).
   */
  protected readonly activeSection = computed(() => {
    const onHome = this.url().split(/[?#]/)[0] === '/';
    return this.scrollSpy.activeSection() ?? (onHome ? 'hero' : null);
  });

  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;

    // Anchor jumps land below the sticky bar rather than underneath it.
    inject(ViewportScroller).setOffset(() => [0, host.offsetHeight + 16]);

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.scrollSpy.measure());
  }
}
