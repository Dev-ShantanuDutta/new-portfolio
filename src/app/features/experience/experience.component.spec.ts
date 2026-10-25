import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { fireEvent, render, screen } from '@testing-library/angular';
import { Experience } from '../../core/models/experience.model';
import { ExperienceComponent } from './experience.component';

const mockExperience: Experience[] = [
  {
    id: 'current',
    role: 'Staff Engineer',
    company: 'Acme',
    startDate: '2024-01-01',
    endDate: null,
    status: 'live',
    summary: 'Current role summary.',
    highlights: ['Led the migration.'],
  },
  {
    id: 'past',
    role: 'Engineer',
    company: 'Widgets Inc',
    startDate: '2022-01-01',
    endDate: '2023-12-31',
    status: 'none',
    summary: 'Past role summary.',
    highlights: ['Shipped the thing.'],
  },
];

describe('ExperienceComponent', () => {
  it('renders each role from ContentService, marking the current one live', async () => {
    const { container, detectChanges } = await render(ExperienceComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('/assets/data/identity.json').flush(null);
    httpMock.expectOne('/assets/data/process-steps.json').flush([]);
    httpMock.expectOne('/assets/data/projects.json').flush([]);
    httpMock.expectOne('/assets/data/experience.json').flush(mockExperience);
    httpMock.expectOne('/assets/data/tech-stack.json').flush([]);
    httpMock.expectOne('/assets/data/bookmarks.json').flush([]);
    httpMock.expectOne('/assets/data/blog-posts.json').flush([]);

    detectChanges();

    expect(screen.getByRole('button', { name: /Staff Engineer/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Widgets Inc/ })).toBeTruthy();
    expect(container.querySelectorAll('.status-dot--live').length).toBe(1);
    expect(screen.getByText(/Present/)).toBeTruthy();

    httpMock.verify();
  });

  it('expands a role to reveal its highlights', async () => {
    const { detectChanges } = await render(ExperienceComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('/assets/data/identity.json').flush(null);
    httpMock.expectOne('/assets/data/process-steps.json').flush([]);
    httpMock.expectOne('/assets/data/projects.json').flush([]);
    httpMock.expectOne('/assets/data/experience.json').flush(mockExperience);
    httpMock.expectOne('/assets/data/tech-stack.json').flush([]);
    httpMock.expectOne('/assets/data/bookmarks.json').flush([]);
    httpMock.expectOne('/assets/data/blog-posts.json').flush([]);

    detectChanges();

    fireEvent.click(screen.getByRole('button', { name: /Staff Engineer/ }));
    detectChanges();

    expect(screen.getByText('Led the migration.')).toBeTruthy();

    httpMock.verify();
  });
});
