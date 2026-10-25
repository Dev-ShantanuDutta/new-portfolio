import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { Identity } from '../../core/models/identity.model';
import { ContactComponent } from './contact.component';

const mockIdentity: Identity = {
  name: 'A',
  specialization: [],
  currentFocus: 'f',
  currentFocusDate: '2026-09-19',
  ctas: [],
  bio: ['b'],
  contact: {
    email: 'a@example.com',
    github: 'https://github.com/a',
    linkedin: 'https://linkedin.com/in/a',
    resume: 'https://example.com/resume.pdf',
  },
};

describe('ContactComponent', () => {
  it('renders the four equal-weight contact links, none more visually prominent than another', async () => {
    const { container, detectChanges } = await render(ContactComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('/assets/data/identity.json').flush(mockIdentity);
    httpMock.expectOne('/assets/data/process-steps.json').flush([]);
    httpMock.expectOne('/assets/data/projects.json').flush([]);
    httpMock.expectOne('/assets/data/experience.json').flush([]);
    httpMock.expectOne('/assets/data/tech-stack.json').flush([]);
    httpMock.expectOne('/assets/data/bookmarks.json').flush([]);
    httpMock.expectOne('/assets/data/blog-posts.json').flush([]);

    detectChanges();

    for (const label of ['Email', 'Resume', 'GitHub', 'LinkedIn']) {
      const links = screen.getAllByRole('link', { name: label });
      expect(links.length).toBeGreaterThan(0);
    }
    expect(container.querySelectorAll('.pill-button--primary').length).toBe(0);
    expect(container.querySelectorAll('.pill-button--secondary').length).toBe(4);

    const emailLink = screen.getAllByRole('link', { name: 'Email' })[0];
    expect(emailLink.getAttribute('href')).toBe('mailto:a@example.com');

    httpMock.verify();
  });

  it('renders a fixed-position mobile CTA bar with the same links', async () => {
    const { container, detectChanges } = await render(ContactComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('/assets/data/identity.json').flush(mockIdentity);
    httpMock.expectOne('/assets/data/process-steps.json').flush([]);
    httpMock.expectOne('/assets/data/projects.json').flush([]);
    httpMock.expectOne('/assets/data/experience.json').flush([]);
    httpMock.expectOne('/assets/data/tech-stack.json').flush([]);
    httpMock.expectOne('/assets/data/bookmarks.json').flush([]);
    httpMock.expectOne('/assets/data/blog-posts.json').flush([]);

    detectChanges();

    // jsdom doesn't evaluate the max-width media query that shows this bar on real
    // small screens, so it's hidden at the test's default width — check its
    // structure directly rather than via an accessible-role query.
    const mobileBar = container.querySelector('.contact__mobile-bar');
    expect(mobileBar?.getAttribute('aria-label')).toBe('Quick contact');
    expect(mobileBar?.querySelectorAll('a').length).toBe(4);

    httpMock.verify();
  });
});
