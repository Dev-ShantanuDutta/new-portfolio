import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { SITE_OG_IMAGE, SITE_URL } from '../constants/site.constants';
import { BlogPost } from '../models/blog-post.model';
import { ContentService } from '../services/content.service';
import { SeoService } from '../services/seo.service';

/**
 * Resolves the post for `/blog/:slug`, sets its SEO metadata and BlogPosting
 * JSON-LD before the route activates, and redirects home for an unknown slug.
 */
export const blogPostResolver: ResolveFn<BlogPost | RedirectCommand> = (route) => {
  const slug = route.paramMap.get('slug');
  const content = inject(ContentService);
  const seo = inject(SeoService);
  const router = inject(Router);

  return content.blogPosts$.pipe(
    map((posts) => {
      const post = posts.find((candidate) => candidate.slug === slug);

      if (!post) {
        return new RedirectCommand(router.parseUrl('/'));
      }

      const url = `${SITE_URL}/blog/${post.slug}`;

      seo.setMetadata({
        title: `${post.title} — Shantanu Dutta`,
        description: post.summary,
        url,
        image: SITE_OG_IMAGE,
      });

      seo.setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.summary,
        datePublished: post.publishedDate,
        url,
        keywords: post.tags.join(', '),
        author: { '@type': 'Person', name: 'Shantanu Dutta' },
      });

      return post;
    }),
  );
};
