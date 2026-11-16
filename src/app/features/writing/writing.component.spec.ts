import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { BlogPost } from '../../core/models/blog-post.model';
import { WritingComponent } from './writing.component';

const mockPosts: BlogPost[] = [
  {
    slug: 'first-post',
    title: 'First Post',
    publishedDate: '2026-08-01',
    summary: 'First summary.',
    tags: ['Angular'],
    content: 'c1',
  },
  {
    slug: 'second-post',
    title: 'Second Post',
    publishedDate: '2026-06-15',
    summary: 'Second summary.',
    tags: ['System Design'],
    content: 'c2',
  },
];

describe('WritingComponent', () => {
  it('renders a teaser per post from ContentService, each linking to its routed detail page', async () => {
    const { detectChanges } = await render(WritingComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });

    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('assets/data/identity.json').flush(null);
    httpMock.expectOne('assets/data/process-steps.json').flush([]);
    httpMock.expectOne('assets/data/projects.json').flush([]);
    httpMock.expectOne('assets/data/experience.json').flush([]);
    httpMock.expectOne('assets/data/tech-stack.json').flush([]);
    httpMock.expectOne('assets/data/bookmarks.json').flush([]);
    httpMock.expectOne('assets/data/blog-posts.json').flush(mockPosts);

    detectChanges();

    expect(screen.getByText('First summary.')).toBeTruthy();
    expect(screen.getByText('Second summary.')).toBeTruthy();

    const links = screen.getAllByRole('link', { name: 'Read post ↗' });
    expect(links[0].getAttribute('href')).toBe('/blog/first-post');
    expect(links[1].getAttribute('href')).toBe('/blog/second-post');

    httpMock.verify();
  });
});
