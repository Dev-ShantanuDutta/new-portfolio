import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { Identity } from '../../core/models/identity.model';
import { AboutTasteComponent } from './about-taste.component';

describe('AboutTasteComponent', () => {
  it('renders each bio paragraph from ContentService', async () => {
    const mockIdentity: Identity = {
      name: 'A',
      specialization: [],
      currentFocus: 'f',
      currentFocusDate: '2026-09-19',
      ctas: [],
      bio: ['I like building things that last.', 'And explaining how they work.'],
      contact: {
        email: 'a@example.com',
        github: 'https://github.com/a',
        linkedin: 'https://linkedin.com/in/a',
        resume: 'https://example.com/resume.pdf',
      },
    };

    const { detectChanges } = await render(AboutTasteComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('assets/data/identity.json').flush(mockIdentity);
    httpMock.expectOne('assets/data/process-steps.json').flush([]);
    httpMock.expectOne('assets/data/projects.json').flush([]);
    httpMock.expectOne('assets/data/experience.json').flush([]);
    httpMock.expectOne('assets/data/tech-stack.json').flush([]);
    httpMock
      .expectOne('assets/data/bookmarks.json')
      .flush([{ title: 'A Great Article', url: 'https://example.com', note: 'Changed my mind.' }]);
    httpMock.expectOne('assets/data/blog-posts.json').flush([]);

    detectChanges();

    expect(screen.getByText('I like building things that last.').tagName).toBe('P');
    expect(screen.getByText('And explaining how they work.').tagName).toBe('P');

    httpMock.verify();
  });
});
