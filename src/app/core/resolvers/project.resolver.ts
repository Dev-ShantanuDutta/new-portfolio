import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { SITE_OG_IMAGE, SITE_URL } from '../constants/site.constants';
import { Project } from '../models/project.model';
import { ContentService } from '../services/content.service';
import { SeoService } from '../services/seo.service';

/**
 * Resolves the project for `/projects/:slug`, sets its SEO metadata and
 * CreativeWork JSON-LD before the route activates, and redirects home for an
 * unknown slug rather than rendering an empty case study.
 */
export const projectResolver: ResolveFn<Project | RedirectCommand> = (route) => {
  const slug = route.paramMap.get('slug');
  const content = inject(ContentService);
  const seo = inject(SeoService);
  const router = inject(Router);

  return content.projects$.pipe(
    map((projects) => {
      const project = projects.find((candidate) => candidate.slug === slug);

      if (!project) {
        return new RedirectCommand(router.parseUrl('/'));
      }

      const url = `${SITE_URL}/projects/${project.slug}`;

      seo.setMetadata({
        title: `${project.name} — Shantanu Dutta`,
        description: project.reframe,
        url,
        image: SITE_OG_IMAGE,
      });

      seo.setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.name,
        description: project.reframe,
        url,
        keywords: project.techTags.join(', '),
        ...(project.links.github ? { codeRepository: project.links.github } : {}),
      });

      return project;
    }),
  );
};
