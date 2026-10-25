import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-highlight-text',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './highlight-text.component.html',
  styleUrl: './highlight-text.component.scss',
})
export class HighlightTextComponent {}
