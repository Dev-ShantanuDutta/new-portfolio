import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../features/footer/footer.component';
import { NavComponent } from '../nav/nav.component';

/** Page chrome around every routed page: nav, main landmark and footer. */
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  /**
   * Bound from route data (the router passes `undefined` when unset, so this must
   * default to falsy). On for full-page placeholders (coming soon, demo
   * unavailable), which open in their own tab and only offer a way back.
   */
  readonly hideNav = input(false);
}
