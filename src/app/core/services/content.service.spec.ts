import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Bookmark } from '../models/bookmark.model';
import { BlogPost } from '../models/blog-post.model';
import { Experience } from '../models/experience.model';
import { Identity } from '../models/identity.model';
import { ProcessStep } from '../models/process-step.model';
import { Project } from '../models/project.model';
import { TechEntry } from '../models/tech.model';
import { ContentService } from './content.service';

describe('ContentService', () => {
  let service: ContentService;
  let httpMock: HttpTestingController;

  const flushRemaining = (except: string[] = []) => {
    const urls = [
      '/assets/data/identity.json',
      '/assets/data/process-steps.json',
      '/assets/data/projects.json',
      '/assets/data/experience.json',
      '/assets/data/tech-stack.json',
      '/assets/data/bookmarks.json',
      '/assets/data/blog-posts.json',
    ].filter((url) => !except.includes(url));

    for (const url of urls) {
      httpMock.expectOne(url).flush(url === '/assets/data/identity.json' ? null : []);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ContentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads the identity/specialization copy and exposes it as a signal', () => {
    const mockIdentity: Identity = {
      name: 'A',
      specialization: [{ text: 'engineer', highlighted: true }],
      currentFocus: 'testing',
      currentFocusDate: '2026-09-19',
      ctas: [{ label: 'Email', href: 'mailto:a@example.com', variant: 'primary' }],
      bio: ['A short bio.'],
      contact: {
        email: 'a@example.com',
        github: 'https://github.com/a',
        linkedin: 'https://linkedin.com/in/a',
        resume: 'https://example.com/resume.pdf',
      },
    };

    const req = httpMock.expectOne('/assets/data/identity.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockIdentity);

    expect(service.identity()).toEqual(mockIdentity);

    flushRemaining(['/assets/data/identity.json']);
  });

  it('loads process steps and exposes them as a signal', () => {
    const mockSteps: ProcessStep[] = [
      {
        title: 'Build',
        summary: 's',
        points: [{ term: 't', why: 'w', detail: 'd' }],
        example: 'e',
        isHighlighted: true,
      },
    ];

    httpMock.expectOne('/assets/data/identity.json').flush(null);
    httpMock.expectOne('/assets/data/process-steps.json').flush(mockSteps);
    httpMock.expectOne('/assets/data/projects.json').flush([]);
    httpMock.expectOne('/assets/data/experience.json').flush([]);
    httpMock.expectOne('/assets/data/tech-stack.json').flush([]);
    httpMock.expectOne('/assets/data/bookmarks.json').flush([]);
    httpMock.expectOne('/assets/data/blog-posts.json').flush([]);

    expect(service.processSteps()).toEqual(mockSteps);
  });

  it('loads projects and exposes them as a signal', () => {
    const mockProjects: Project[] = [
      {
        slug: 'demo',
        name: 'Demo',
        status: 'live',
        origin: 'personal',
        reframe: 'A demo project.',
        techTags: ['TypeScript'],
        links: {},
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

    httpMock.expectOne('/assets/data/identity.json').flush(null);
    httpMock.expectOne('/assets/data/process-steps.json').flush([]);
    const req = httpMock.expectOne('/assets/data/projects.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);

    expect(service.projects()).toEqual(mockProjects);

    httpMock.expectOne('/assets/data/experience.json').flush([]);
    httpMock.expectOne('/assets/data/tech-stack.json').flush([]);
    httpMock.expectOne('/assets/data/bookmarks.json').flush([]);
    httpMock.expectOne('/assets/data/blog-posts.json').flush([]);
  });

  it('loads experience entries and exposes them as a signal', () => {
    const mockExperience: Experience[] = [
      {
        id: 'role-1',
        role: 'Engineer',
        company: 'Acme',
        startDate: '2024-01-01',
        endDate: null,
        status: 'live',
        summary: 's',
        highlights: ['h'],
      },
    ];

    httpMock.expectOne('/assets/data/identity.json').flush(null);
    httpMock.expectOne('/assets/data/process-steps.json').flush([]);
    httpMock.expectOne('/assets/data/projects.json').flush([]);
    httpMock.expectOne('/assets/data/experience.json').flush(mockExperience);
    httpMock.expectOne('/assets/data/tech-stack.json').flush([]);
    httpMock.expectOne('/assets/data/bookmarks.json').flush([]);
    httpMock.expectOne('/assets/data/blog-posts.json').flush([]);

    expect(service.experience()).toEqual(mockExperience);
  });

  it('loads the tech stack and exposes it as a signal', () => {
    const mockTechStack: TechEntry[] = [{ name: 'Angular', icon: 'NG' }];

    httpMock.expectOne('/assets/data/identity.json').flush(null);
    httpMock.expectOne('/assets/data/process-steps.json').flush([]);
    httpMock.expectOne('/assets/data/projects.json').flush([]);
    httpMock.expectOne('/assets/data/experience.json').flush([]);
    httpMock.expectOne('/assets/data/tech-stack.json').flush(mockTechStack);
    httpMock.expectOne('/assets/data/bookmarks.json').flush([]);
    httpMock.expectOne('/assets/data/blog-posts.json').flush([]);

    expect(service.techStack()).toEqual(mockTechStack);
  });

  it('loads bookmarks and exposes them as a signal', () => {
    const mockBookmarks: Bookmark[] = [{ title: 'Article', url: 'https://example.com' }];

    httpMock.expectOne('/assets/data/identity.json').flush(null);
    httpMock.expectOne('/assets/data/process-steps.json').flush([]);
    httpMock.expectOne('/assets/data/projects.json').flush([]);
    httpMock.expectOne('/assets/data/experience.json').flush([]);
    httpMock.expectOne('/assets/data/tech-stack.json').flush([]);
    httpMock.expectOne('/assets/data/bookmarks.json').flush(mockBookmarks);
    httpMock.expectOne('/assets/data/blog-posts.json').flush([]);

    expect(service.bookmarks()).toEqual(mockBookmarks);
  });

  it('loads blog posts and exposes them as a signal', () => {
    const mockPosts: BlogPost[] = [
      {
        slug: 'first-post',
        title: 'First Post',
        publishedDate: '2026-08-01',
        summary: 's',
        tags: ['Angular'],
        content: 'c',
      },
    ];

    httpMock.expectOne('/assets/data/identity.json').flush(null);
    httpMock.expectOne('/assets/data/process-steps.json').flush([]);
    httpMock.expectOne('/assets/data/projects.json').flush([]);
    httpMock.expectOne('/assets/data/experience.json').flush([]);
    httpMock.expectOne('/assets/data/tech-stack.json').flush([]);
    httpMock.expectOne('/assets/data/bookmarks.json').flush([]);
    httpMock.expectOne('/assets/data/blog-posts.json').flush(mockPosts);

    expect(service.blogPosts()).toEqual(mockPosts);
  });

  it('defaults identity to null and every list signal to an empty array before responses arrive', () => {
    expect(service.identity()).toBeNull();
    expect(service.processSteps()).toEqual([]);
    expect(service.projects()).toEqual([]);
    expect(service.experience()).toEqual([]);
    expect(service.techStack()).toEqual([]);
    expect(service.bookmarks()).toEqual([]);
    expect(service.blogPosts()).toEqual([]);

    flushRemaining();
  });
});
