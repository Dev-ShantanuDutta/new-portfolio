import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { PillNavComponent } from './pill-nav.component';

describe('PillNavComponent', () => {
  it('renders a link for each entry in order', async () => {
    await render(PillNavComponent, {
      inputs: {
        links: [
          { label: 'Work', routerLink: '/work' },
          { label: 'Writing', routerLink: '/writing' },
        ],
      },
      providers: [provideRouter([])],
    });

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    const links = screen.getAllByRole('link');

    expect(nav).toBeTruthy();
    expect(links.map((link) => link.textContent?.trim())).toEqual(['Work', 'Writing']);
    expect(links[0].getAttribute('href')).toBe('/work');
    expect(links[1].getAttribute('href')).toBe('/writing');
  });

  it('links fragments to their home-page section and marks the one in view as current', async () => {
    const { fixture, detectChanges } = await render(PillNavComponent, {
      inputs: {
        links: [
          { label: 'Work', fragment: 'selected-work' },
          { label: 'Contact', fragment: 'contact' },
        ],
        activeFragment: null,
      },
      providers: [provideRouter([])],
    });

    const work = screen.getByRole('link', { name: 'Work' });
    const contact = screen.getByRole('link', { name: 'Contact' });
    expect(work.getAttribute('href')).toBe('/#selected-work');
    expect(work.getAttribute('aria-current')).toBeNull();

    fixture.componentRef.setInput('activeFragment', 'contact');
    detectChanges();

    expect(contact.getAttribute('aria-current')).toBe('true');
    expect(contact.className).toContain('pill-nav__link--current');
    expect(work.getAttribute('aria-current')).toBeNull();
  });

  it('marks a link current while any of its extra sections is in view', async () => {
    const { fixture, detectChanges } = await render(PillNavComponent, {
      inputs: {
        links: [
          { label: 'Home', fragment: 'hero', sections: ['proof-strip'] },
          { label: 'Experience', fragment: 'selected-work', sections: ['experience'] },
        ],
        activeFragment: 'proof-strip',
      },
      providers: [provideRouter([])],
    });

    const home = screen.getByRole('link', { name: 'Home' });
    const experience = screen.getByRole('link', { name: 'Experience' });
    expect(home.getAttribute('aria-current')).toBe('true');

    fixture.componentRef.setInput('activeFragment', 'experience');
    detectChanges();

    expect(experience.getAttribute('aria-current')).toBe('true');
    expect(home.getAttribute('aria-current')).toBeNull();
  });

  it('renders a plain external link when href is set instead of routerLink', async () => {
    await render(PillNavComponent, {
      inputs: {
        links: [{ label: 'Resume', href: '/resume.pdf' }],
      },
      providers: [provideRouter([])],
    });

    const link = screen.getByRole('link', { name: 'Resume' });
    expect(link.getAttribute('href')).toBe('/resume.pdf');
  });
});
