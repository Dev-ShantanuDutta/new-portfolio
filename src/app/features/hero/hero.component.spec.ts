import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { Identity } from '../../core/models/identity.model';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  it('renders identity, GitHub, and current-role data from the services, not hardcoded copy', async () => {
    const mockIdentity: Identity = {
      name: 'Ada Lovelace',
      specialization: [
        { text: 'I build ', highlighted: false },
        { text: 'distributed systems', highlighted: true },
        { text: '.', highlighted: false },
      ],
      currentFocus: 'a compiler backend',
      currentFocusDate: '2026-09-19',
      ctas: [{ label: 'Email me', href: 'mailto:ada@example.com', variant: 'primary' }],
      bio: ['A short bio.'],
      contact: {
        email: 'a@example.com',
        github: 'https://github.com/a',
        linkedin: 'https://linkedin.com/in/a',
        resume: 'https://example.com/resume.pdf',
      },
    };

    const { detectChanges } = await render(HeroComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('/assets/data/identity.json').flush(mockIdentity);
    httpMock.expectOne('/assets/data/process-steps.json').flush([]);
    httpMock.expectOne('/assets/data/projects.json').flush([]);
    httpMock.expectOne('/assets/data/experience.json').flush([
      {
        id: 'role-1',
        role: 'Staff Engineer',
        company: 'Analytical Engines Inc.',
        startDate: '2024-01-01',
        endDate: null,
        status: 'live',
        summary: 's',
        highlights: [],
      },
    ]);
    httpMock.expectOne('/assets/data/tech-stack.json').flush([]);
    httpMock.expectOne('/assets/data/bookmarks.json').flush([]);
    httpMock.expectOne('/assets/data/blog-posts.json').flush([]);
    httpMock.expectOne('https://api.github.com/users/Shantanu-Dutta-2001').flush({
      login: 'octocat',
      avatar_url: 'https://avatars.githubusercontent.com/u/1',
      html_url: 'https://github.com/octocat',
      public_repos: 42,
      followers: 7,
    });

    detectChanges();

    expect(screen.getByText(/Ada Lovelace/)).toBeTruthy();
    expect(screen.getByText('distributed systems')).toBeTruthy();
    expect(screen.getByText(/a compiler backend/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /42 public repos on GitHub/ })).toBeTruthy();
    expect(screen.getByText(/Analytical Engines Inc\./)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Email me' })).toBeTruthy();

    httpMock.verify();
  });
});
