import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RedirectCommand, provideRouter } from '@angular/router';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { projectResolver } from './project.resolver';

const mockProjects: Project[] = [
  {
    slug: 'demo',
    name: 'Demo Project',
    status: 'live',
    origin: 'personal',
    reframe: 'A demo project.',
    techTags: ['TypeScript'],
    links: { github: 'https://github.com/you/demo' },
    caseStudy: {
      problem: 'p',
      constraints: 'c',
      role: 'r',
      technicalChallenge: 't',
      decision: 'd',
      result: 'res',
      learned: 'l',
    },
  },
];

function snapshotWithSlug(slug: string | null): ActivatedRouteSnapshot {
  return { paramMap: { get: () => slug } } as unknown as ActivatedRouteSnapshot;
}

function resolve(slug: string | null): Observable<Project | RedirectCommand> {
  return TestBed.runInInjectionContext(
    () =>
      projectResolver(snapshotWithSlug(slug), {} as never) as Observable<Project | RedirectCommand>,
  );
}

/**
 * ContentService eagerly fires every content HTTP request on construction
 * (it's a single root-provided service backing every section) — injecting
 * it via the resolver triggers all of them, not just `projects.json`.
 */
function flushOtherContentRequests(httpMock: HttpTestingController): void {
  for (const url of [
    'assets/data/identity.json',
    'assets/data/process-steps.json',
    'assets/data/experience.json',
    'assets/data/tech-stack.json',
    'assets/data/bookmarks.json',
    'assets/data/blog-posts.json',
  ]) {
    httpMock.expectOne(url).flush(url === 'assets/data/identity.json' ? null : []);
  }
}

describe('projectResolver', () => {
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

  it('resolves the matching project and sets its SEO metadata and JSON-LD', () => {
    let result: Project | RedirectCommand | undefined;
    resolve('demo').subscribe((value) => (result = value));

    httpMock.expectOne('assets/data/projects.json').flush(mockProjects);
    flushOtherContentRequests(httpMock);

    expect(result).toEqual(mockProjects[0]);
    expect(document.title).toBe('Demo Project — Shantanu Dutta');
    expect(document.getElementById('seo-json-ld')?.textContent).toContain('"@type":"CreativeWork"');
  });

  it('redirects home when the slug does not match any project', () => {
    let result: Project | RedirectCommand | undefined;
    resolve('missing').subscribe((value) => (result = value));

    httpMock.expectOne('assets/data/projects.json').flush(mockProjects);
    flushOtherContentRequests(httpMock);

    expect(result).toBeInstanceOf(RedirectCommand);
    expect((result as RedirectCommand).redirectTo.toString()).toBe('/');
  });
});
