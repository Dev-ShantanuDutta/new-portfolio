import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { ProofStripComponent } from './proof-strip.component';

describe('ProofStripComponent', () => {
  it('renders GitHub stats and tech-stack badges from the services, not hardcoded copy', async () => {
    const { detectChanges } = await render(ProofStripComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('assets/data/identity.json').flush(null);
    httpMock.expectOne('assets/data/process-steps.json').flush([]);
    httpMock.expectOne('assets/data/projects.json').flush([]);
    httpMock.expectOne('assets/data/experience.json').flush([]);
    httpMock.expectOne('assets/data/tech-stack.json').flush([
      { name: 'Angular', icon: 'NG' },
      { name: 'Rust', icon: 'RS' },
    ]);
    httpMock.expectOne('assets/data/bookmarks.json').flush([]);
    httpMock.expectOne('assets/data/blog-posts.json').flush([]);
    httpMock.expectOne('https://api.github.com/users/Shantanu-Dutta-2001').flush({
      login: 'octocat',
      avatar_url: 'https://avatars.githubusercontent.com/u/1',
      html_url: 'https://github.com/octocat',
      public_repos: 99,
      followers: 3,
    });

    detectChanges();

    // The numbers are rendered by <app-count-up>, so match on the whole span's text.
    const stat = (text: string) =>
      screen.getByText((_, el) => el?.tagName === 'SPAN' && el.textContent?.trim() === text);
    expect(stat('99 public repositories')).toBeTruthy();
    expect(stat('3 followers')).toBeTruthy();
    expect(screen.getByText('Angular')).toBeTruthy();
    expect(screen.getByText('Rust')).toBeTruthy();

    httpMock.verify();
  });

  it('renders certifications from identity, and hides the panel when there are none', async () => {
    const { detectChanges } = await render(ProofStripComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    expect(screen.queryByText('Certifications')).toBeNull();

    const httpMock = TestBed.inject(HttpTestingController);
    for (const url of [
      'assets/data/process-steps.json',
      'assets/data/projects.json',
      'assets/data/experience.json',
      'assets/data/tech-stack.json',
      'assets/data/bookmarks.json',
      'assets/data/blog-posts.json',
    ]) {
      httpMock.expectOne(url).flush([]);
    }
    httpMock.expectOne('assets/data/identity.json').flush({
      certifications: [
        {
          name: 'Claude Code in Action',
          issuers: [{ name: 'Anthropic', logo: 'anthropic.svg' }],
        },
        {
          name: 'ASP.NET Core MVC',
          issuers: [
            { name: 'Microsoft', logo: 'microsoft.svg' },
            { name: 'Udemy', logo: 'udemy.svg' },
          ],
        },
      ],
    });
    httpMock.expectOne('https://api.github.com/users/Shantanu-Dutta-2001').flush({
      login: 'octocat',
      avatar_url: '',
      html_url: '',
      public_repos: 0,
      followers: 0,
    });

    detectChanges();

    expect(screen.getByText('Certifications')).toBeTruthy();
    expect(screen.getByText('Claude Code in Action')).toBeTruthy();
    expect(screen.getByText('ASP.NET Core MVC')).toBeTruthy();
    expect(screen.getByText('Anthropic')).toBeTruthy();
    expect(screen.getByText('Microsoft')).toBeTruthy();
    expect(screen.getByText('Udemy')).toBeTruthy();

    httpMock.verify();
  });

  it('shows a loading state before the GitHub response arrives', async () => {
    await render(ProofStripComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    expect(screen.getByText('Loading GitHub activity…')).toBeTruthy();

    const httpMock = TestBed.inject(HttpTestingController);
    for (const url of [
      'assets/data/identity.json',
      'assets/data/process-steps.json',
      'assets/data/projects.json',
      'assets/data/experience.json',
      'assets/data/tech-stack.json',
      'assets/data/bookmarks.json',
      'assets/data/blog-posts.json',
    ]) {
      httpMock.expectOne(url).flush(url === 'assets/data/identity.json' ? null : []);
    }
    httpMock.expectOne('https://api.github.com/users/Shantanu-Dutta-2001').flush({
      login: 'octocat',
      avatar_url: '',
      html_url: '',
      public_repos: 0,
      followers: 0,
    });

    httpMock.verify();
  });
});
