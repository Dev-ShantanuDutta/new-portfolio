import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor() {
    // Created here, not only by the nav's theme toggle, so pages without the nav
    // still apply and follow the saved theme.
    inject(ThemeService);

    const root = inject(DOCUMENT).documentElement;
    // Tells the index.html failsafe the app booted, so scroll reveals stay enabled.
    afterNextRender(() => root.classList.add('motion-live'));
  }
}
