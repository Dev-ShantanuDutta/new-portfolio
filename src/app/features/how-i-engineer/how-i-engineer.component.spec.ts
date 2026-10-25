import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { ProcessStep } from '../../core/models/process-step.model';
import { HowIEngineerComponent } from './how-i-engineer.component';

const mockSteps: ProcessStep[] = [
  {
    title: 'Discover',
    summary: 'Scope before coding.',
    points: [
      {
        term: 'Stakeholder interview',
        why: 'surfaces the real constraint',
        detail: 'talk to the user.',
      },
    ],
    example: 'Example for Discover.',
    isHighlighted: false,
  },
  {
    title: 'Design',
    summary: 'Write it down first.',
    points: [
      { term: 'Design doc', why: 'forces trade-offs onto paper', detail: 'propose and compare.' },
    ],
    example: 'Example for Design.',
    isHighlighted: false,
  },
  {
    title: 'Build',
    summary: 'Ship in small pieces.',
    points: [{ term: 'Small PRs', why: 'easier to review', detail: 'one change at a time.' }],
    example: 'Example for Build.',
    isHighlighted: true,
  },
  {
    title: 'Verify',
    summary: 'Prove it in production.',
    points: [
      {
        term: 'Monitoring',
        why: 'turns guesswork into a dashboard',
        detail: 'instrument everything.',
      },
    ],
    example: 'Example for Verify.',
    isHighlighted: false,
  },
];

describe('HowIEngineerComponent', () => {
  it('renders the 2x2 process grid from ContentService, with exactly one highlighted panel', async () => {
    const { container, detectChanges } = await render(HowIEngineerComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('/assets/data/identity.json').flush(null);
    httpMock.expectOne('/assets/data/process-steps.json').flush(mockSteps);
    httpMock.expectOne('/assets/data/projects.json').flush([]);
    httpMock.expectOne('/assets/data/experience.json').flush([]);
    httpMock.expectOne('/assets/data/tech-stack.json').flush([]);
    httpMock.expectOne('/assets/data/bookmarks.json').flush([]);
    httpMock.expectOne('/assets/data/blog-posts.json').flush([]);

    detectChanges();

    for (const step of mockSteps) {
      expect(screen.getByRole('heading', { name: step.title })).toBeTruthy();
      expect(screen.getByText(step.summary)).toBeTruthy();
      expect(screen.getByText(step.points[0].term)).toBeTruthy();
      expect(screen.getByText(`(${step.points[0].why})`)).toBeTruthy();
      expect(screen.getByText(new RegExp(step.example))).toBeTruthy();
    }
    expect(container.querySelectorAll('.panel--highlighted').length).toBe(1);
    expect(
      screen.getByRole('heading', { name: 'Build' }).closest('.panel--highlighted'),
    ).toBeTruthy();

    httpMock.verify();
  });
});
