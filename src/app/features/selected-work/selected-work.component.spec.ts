import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { fireEvent, render, screen } from '@testing-library/angular';
import { Project } from '../../core/models/project.model';
import { SelectedWorkComponent } from './selected-work.component';

const mockProjects: Project[] = [
  {
    slug: 'first',
    name: 'First Project',
    status: 'live',
    origin: 'personal',
    reframe: 'First reframe.',
    techTags: ['TypeScript'],
    links: {},
    caseStudy: {
      problem: 'p1',
      constraints: 'c1',
      role: 'r1',
      technicalChallenge: 't1',
      decision: 'd1',
      result: 'res1',
      learned: 'l1',
    },
  },
  {
    slug: 'second',
    name: 'Second Project',
    status: 'pinned',
    origin: 'personal',
    reframe: 'Second reframe.',
    techTags: ['Rust'],
    links: {},
    caseStudy: {
      problem: 'p2',
      constraints: 'c2',
      role: 'r2',
      technicalChallenge: 't2',
      decision: 'd2',
      result: 'res2',
      learned: 'l2',
    },
  },
  {
    slug: 'third',
    name: 'Third Project',
    status: 'none',
    origin: 'company',
    company: 'Acme',
    reframe: 'Third reframe.',
    techTags: [],
    links: {},
  },
];

describe('SelectedWorkComponent', () => {
  async function renderWithProjects() {
    const result = await render(SelectedWorkComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('assets/data/identity.json').flush(null);
    httpMock.expectOne('assets/data/process-steps.json').flush([]);
    httpMock.expectOne('assets/data/projects.json').flush(mockProjects);
    httpMock.expectOne('assets/data/experience.json').flush([]);
    httpMock.expectOne('assets/data/tech-stack.json').flush([]);
    httpMock.expectOne('assets/data/bookmarks.json').flush([]);
    httpMock.expectOne('assets/data/blog-posts.json').flush([]);
    result.detectChanges();
    httpMock.verify();

    return result;
  }

  it('renders a teaser per project from ContentService, and keeps only one case study open at a time', async () => {
    const { detectChanges } = await renderWithProjects();

    expect(screen.getByText('First reframe.')).toBeTruthy();
    expect(screen.getByText('Second reframe.')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /First Project/ }));
    detectChanges();
    fireEvent.click(screen.getByRole('button', { name: /Second Project/ }));
    detectChanges();

    expect(
      screen.getByRole('button', { name: /First Project/ }).getAttribute('aria-expanded'),
    ).toBe('false');
    expect(
      screen.getByRole('button', { name: /Second Project/ }).getAttribute('aria-expanded'),
    ).toBe('true');
  });

  it('shows personal projects first and switches to company projects from the pill tabs', async () => {
    const { detectChanges } = await renderWithProjects();

    expect(screen.queryByText('Third reframe.')).toBeNull();

    fireEvent.click(screen.getByRole('tab', { name: /Company projects/ }));
    detectChanges();

    expect(
      screen.getByRole('tab', { name: /Company projects/ }).getAttribute('aria-selected'),
    ).toBe('true');
    expect(screen.getByText('Third reframe.')).toBeTruthy();
    expect(screen.getByText('Acme')).toBeTruthy();
    expect(screen.queryByText('First reframe.')).toBeNull();
  });
});
