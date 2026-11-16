import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

describe('AppComponent', () => {
  it('renders the shell: nav, the routed home page, and footer', async () => {
    const { fixture, container } = await render(AppComponent, {
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });

    // Let the router's initial navigation activate HomeComponent before flushing its
    // children's HTTP requests — whenStable() would otherwise block on those requests
    // (Angular's PendingTasks tracks HttpClient calls) before navigation even settles.
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

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

    fixture.detectChanges();

    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeTruthy();
    expect(screen.getByRole('contentinfo')).toBeTruthy();
    expect(container.querySelector('#hero')).toBeTruthy();
    expect(container.querySelector('#proof-strip')).toBeTruthy();
    expect(container.querySelector('#how-i-engineer')).toBeTruthy();
    expect(container.querySelector('#selected-work')).toBeTruthy();
    expect(container.querySelector('#experience')).toBeTruthy();
    expect(container.querySelector('#about-taste')).toBeTruthy();
    expect(container.querySelector('#contact')).toBeTruthy();

    httpMock.verify();
  });
});
