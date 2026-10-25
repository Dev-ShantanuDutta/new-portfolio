import { fireEvent, render, screen } from '@testing-library/angular';
import { Project, ProjectCaseStudy } from '../../../core/models/project.model';
import { ProjectCaseStudyComponent } from './project-case-study.component';

const mockCaseStudy: ProjectCaseStudy = {
  problem: 'The problem.',
  constraints: 'The constraints.',
  role: 'The role.',
  architecture: 'Client -> API -> Redis.',
  technicalChallenge: 'The hard part.',
  decision: 'The decision.',
  result: 'The result.',
  learned: 'The lesson.',
};

const mockProject: Project = {
  slug: 'demo',
  name: 'Demo Project',
  status: 'live',
  origin: 'personal',
  reframe: 'Not a to-do app — a distributed task queue.',
  techTags: ['TypeScript', 'Redis'],
  links: { github: 'https://github.com/you/demo', demo: 'https://demo.example.com' },
  caseStudy: mockCaseStudy,
};

describe('ProjectCaseStudyComponent', () => {
  it('shows the teaser and collapses the case study by default', async () => {
    await render(ProjectCaseStudyComponent, {
      inputs: { project: mockProject },
    });

    expect(screen.getByText('Demo Project')).toBeTruthy();
    expect(screen.getByText(mockProject.reframe)).toBeTruthy();
    expect(screen.getByText('TypeScript')).toBeTruthy();
    expect(screen.getByText('Redis')).toBeTruthy();

    const trigger = screen.getByRole('button', { name: /Demo Project/ });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByText('The problem.').closest('[role="region"]')).toHaveProperty(
      'hidden',
      true,
    );
  });

  it('expands to reveal the full case study, in the Section 17 order, when activated', async () => {
    const { detectChanges } = await render(ProjectCaseStudyComponent, {
      inputs: { project: mockProject },
    });

    fireEvent.click(screen.getByRole('button', { name: /Demo Project/ }));
    detectChanges();

    expect(screen.getByRole('button', { name: /Demo Project/ }).getAttribute('aria-expanded')).toBe(
      'true',
    );
    const github = screen.getByRole('link', { name: /^GitHub\s\(opens in new tab\)$/ });
    expect(github.getAttribute('href')).toBe(mockProject.links.github);
    expect(github.getAttribute('target')).toBe('_blank');
    expect(github.getAttribute('rel')).toBe('noopener noreferrer');

    const tryIt = screen.getByRole('link', { name: /^Try it\s\(opens in new tab\)$/ });
    expect(tryIt.getAttribute('href')).toBe(mockProject.links.demo);
    expect(tryIt.getAttribute('target')).toBe('_blank');

    const terms = screen.getAllByRole('term').map((term) => term.textContent);
    expect(terms).toEqual([
      'Problem',
      'Constraints',
      'Role',
      'Architecture',
      'Technical challenge',
      'Decision',
      'Result',
      'What I learned',
    ]);
    expect(screen.getByText('Client -> API -> Redis.')).toBeTruthy();
  });

  it('renders already expanded when initiallyExpanded is set, for the standalone /projects/:slug route', async () => {
    await render(ProjectCaseStudyComponent, {
      inputs: { project: mockProject, initiallyExpanded: true },
    });

    expect(screen.getByRole('button', { name: /Demo Project/ }).getAttribute('aria-expanded')).toBe(
      'true',
    );
    expect(screen.getByText('The problem.').closest('[role="region"]')).toHaveProperty(
      'hidden',
      false,
    );
  });

  it('shows the four overview sections instead of the case study when the project has an overview', async () => {
    const projectWithOverview: Project = {
      ...mockProject,
      overview: {
        purpose: 'Why it exists.',
        audience: 'Who it is for.',
        solves: [{ title: 'Fewer errors.', detail: 'Validates as you type.' }],
        learned: [{ detail: 'Recursive templates.' }],
      },
    };

    await render(ProjectCaseStudyComponent, {
      inputs: { project: projectWithOverview, initiallyExpanded: true },
    });

    const headings = screen.getAllByRole('heading', { level: 4 }).map((h) => h.textContent);
    expect(headings).toEqual(['Purpose', 'Target audience', 'What it solves', 'What I learned']);
    expect(screen.getByText('Why it exists.')).toBeTruthy();
    expect(screen.getByText('Who it is for.')).toBeTruthy();
    expect(screen.getByText('Fewer errors.')).toBeTruthy();
    expect(screen.getByText('Recursive templates.')).toBeTruthy();
    expect(screen.queryByText('The problem.')).toBeNull();
  });

  it('tells the user the card opens, and swaps the hint once it is open', async () => {
    const { detectChanges } = await render(ProjectCaseStudyComponent, {
      inputs: { project: mockProject },
    });

    const trigger = screen.getByRole('button', { name: /Demo Project/ });
    expect(trigger.textContent).toContain('View details');

    fireEvent.click(trigger);
    detectChanges();

    expect(trigger.textContent).toContain('Hide details');
    expect(trigger.textContent).not.toContain('View details');
  });

  it('omits the Architecture row and absent links when the project has neither', async () => {
    const projectWithoutArchitecture: Project = {
      ...mockProject,
      caseStudy: { ...mockCaseStudy, architecture: undefined },
      links: {},
    };

    const { detectChanges } = await render(ProjectCaseStudyComponent, {
      inputs: { project: projectWithoutArchitecture },
    });

    fireEvent.click(screen.getByRole('button', { name: /Demo Project/ }));
    detectChanges();

    expect(screen.queryByText('Architecture')).toBeNull();
    expect(screen.queryByRole('link', { name: /GitHub/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /Try it/ })).toBeNull();
  });
});
