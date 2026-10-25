import { render, screen } from '@testing-library/angular';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  it('renders the footer landmark with links to llms.txt, robots.txt, and RSS', async () => {
    await render(FooterComponent);

    expect(screen.getByRole('contentinfo')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'llms.txt' }).getAttribute('href')).toBe('/llms.txt');
    expect(screen.getByRole('link', { name: 'robots.txt' }).getAttribute('href')).toBe(
      '/robots.txt',
    );
    expect(screen.getByRole('link', { name: 'RSS' }).getAttribute('href')).toBe('/rss.xml');
  });
});
