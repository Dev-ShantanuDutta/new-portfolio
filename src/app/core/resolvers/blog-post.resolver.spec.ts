import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RedirectCommand, provideRouter } from '@angular/router';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';
import { blogPostResolver } from './blog-post.resolver';

const mockPosts: BlogPost[] = [
  {
    slug: 'demo-post',
    title: 'A Demo Post',
    publishedDate: '2026-08-01',
    summary: 'A summary.',
    tags: ['Angular'],
    content: 'Full post body.',
  },
];

function snapshotWithSlug(slug: string | null): ActivatedRouteSnapshot {
  return { paramMap: { get: () => slug } } as unknown as ActivatedRouteSnapshot;
}

function resolve(slug: string | null): Observable<BlogPost | RedirectCommand> {
  return TestBed.runInInjectionContext(
    () =>
      blogPostResolver(snapshotWithSlug(slug), {} as never) as Observable<
        BlogPost | RedirectCommand
      >,
  );
}

/**
 * ContentService eagerly fires every content HTTP request on construction
 * (it's a single root-provided service backing every section) — injecting
 * it via the resolver triggers all of them, not just `blog-posts.json`.
 */
function flushOtherContentRequests(httpMock: HttpTestingController): void {
  for (const url of [
    '/assets/data/identity.json',
    '/assets/data/process-steps.json',
    '/assets/data/projects.json',
    '/assets/data/experience.json',
    '/assets/data/tech-stack.json',
    '/assets/data/bookmarks.json',
  ]) {
    httpMock.expectOne(url).flush(url === '/assets/data/identity.json' ? null : []);
  }
}

describe('blogPostResolver', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    document.getElementById('seo-json-ld')?.remove();
    document
      .querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]')
      .forEach((tag) => tag.remove());
    httpMock.verify();
  });

  it('resolves the matching post and sets its SEO metadata and JSON-LD', () => {
    let result: BlogPost | RedirectCommand | undefined;
    resolve('demo-post').subscribe((value) => (result = value));

    httpMock.expectOne('/assets/data/blog-posts.json').flush(mockPosts);
    flushOtherContentRequests(httpMock);

    expect(result).toEqual(mockPosts[0]);
    expect(document.title).toBe('A Demo Post — Shantanu Dutta');
    expect(document.getElementById('seo-json-ld')?.textContent).toContain('"@type":"BlogPosting"');
  });

  it('redirects home when the slug does not match any post', () => {
    let result: BlogPost | RedirectCommand | undefined;
    resolve('missing').subscribe((value) => (result = value));

    httpMock.expectOne('/assets/data/blog-posts.json').flush(mockPosts);
    flushOtherContentRequests(httpMock);

    expect(result).toBeInstanceOf(RedirectCommand);
    expect((result as RedirectCommand).redirectTo.toString()).toBe('/');
  });
});
