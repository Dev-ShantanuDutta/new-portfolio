import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BlogPost } from '../../../core/models/blog-post.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent {
  /** The post to render in full. Bound from the resolved route data on `/blog/:slug`. */
  readonly post = input.required<BlogPost>();
}
