import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { render } from '@testing-library/angular';
import { Identity } from '../../core/models/identity.model';
import { HomeComponent } from './home.component';

const mockIdentity: Identity = {
  name: 'Shantanu Dutta',
  specialization: [{ text: 'I build reliable systems.', highlighted: true }],
  currentFocus: 'testing',
  currentFocusDate: '2026-09-19',
  ctas: [],
  bio: ['A short bio.'],
  contact: {
    email: 'shantanu@example.com',
    github: 'https://github.com/shantanu',
    linkedin: 'https://linkedin.com/in/shantanu',
    resume: 'https://example.com/resume.pdf',
  },
};

describe('HomeComponent', () => {
  it('renders without error given mocked service data', async () => {
    const { container } = await render(HomeComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });

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

    expect(container.querySelector('#hero')).toBeTruthy();
    expect(container.querySelector('#proof-strip')).toBeTruthy();
    expect(container.querySelector('#how-i-engineer')).toBeTruthy();
    expect(container.querySelector('#selected-work')).toBeTruthy();
    expect(container.querySelector('#experience')).toBeTruthy();
    expect(container.querySelector('#about-taste')).toBeTruthy();
    expect(container.querySelector('#contact')).toBeTruthy();

    httpMock.verify();
  });

  it('wires SeoService with the Person JSON-LD and a title/description once identity loads', async () => {
    const { detectChanges } = await render(HomeComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });

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
      httpMock.expectOne(url).flush(url === 'assets/data/identity.json' ? mockIdentity : []);
    }
    httpMock.expectOne('https://api.github.com/users/Shantanu-Dutta-2001').flush({
      login: 'octocat',
      avatar_url: '',
      html_url: '',
      public_repos: 0,
      followers: 0,
    });
    detectChanges();

    expect(document.title).toBe('Shantanu Dutta — .NET Full Stack Developer');
    const jsonLd = document.getElementById('seo-json-ld')?.textContent ?? '';
    expect(jsonLd).toContain('"@type":"Person"');
    expect(jsonLd).toContain('"name":"Shantanu Dutta"');
    expect(jsonLd).toContain('https://github.com/shantanu');

    document.getElementById('seo-json-ld')?.remove();
    document
      .querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]')
      .forEach((tag) => tag.remove());
    httpMock.verify();
  });
});
