import { render, screen } from '@testing-library/angular';
import { BlogPost } from '../../../core/models/blog-post.model';
import { PostDetailComponent } from './post-detail.component';

const mockPost: BlogPost = {
  slug: 'demo-post',
  title: 'A Demo Post',
  publishedDate: '2026-08-01',
  summary: 'A summary.',
  tags: ['Angular', 'Testing'],
  content: 'Full post body.\n\nWith a second paragraph.',
};

describe('PostDetailComponent', () => {
  it('renders the full post: title, date, tags, and content', async () => {
    await render(PostDetailComponent, { inputs: { post: mockPost } });

    expect(screen.getByRole('heading', { name: 'A Demo Post' })).toBeTruthy();
    expect(screen.getByText('Angular')).toBeTruthy();
    expect(screen.getByText('Testing')).toBeTruthy();
    expect(screen.getByText(/Full post body\./)).toBeTruthy();
  });
});
