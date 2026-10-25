#!/usr/bin/env node
// Generates dist/portfolio/browser/sitemap.xml after `ng build`, covering
// every prerendered route (/, /projects/:slug, /blog/:slug). Reads the same
// JSON content files ContentService serves, so new projects/posts are
// covered automatically on the next build — never hand-edited.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIR = join(ROOT, 'dist/portfolio/browser');

// Kept in sync with src/app/core/constants/site.constants.ts (plain Node
// can't import that TS file directly without a build step).
const SITE_URL = '[YOUR: production domain, e.g. https://shantanudutta.dev]';

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(ROOT, relativePath), 'utf-8'));
}

function escapeXml(value) {
  return value.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char],
  );
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

const projects = readJson('src/assets/data/projects.json');
const posts = readJson('src/assets/data/blog-posts.json');

const urls = [
  { loc: `${SITE_URL}/`, changefreq: 'monthly', priority: '1.0' },
  ...projects.map((project) => ({
    loc: `${SITE_URL}/projects/${project.slug}`,
    changefreq: 'monthly',
    priority: '0.8',
  })),
  ...posts.map((post) => ({
    loc: `${SITE_URL}/blog/${post.slug}`,
    lastmod: post.publishedDate,
    changefreq: 'yearly',
    priority: '0.6',
  })),
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(urlEntry),
  '</urlset>',
  '',
].join('\n');

writeFileSync(join(OUTPUT_DIR, 'sitemap.xml'), xml, 'utf-8');
console.log(`sitemap.xml: wrote ${urls.length} URLs to ${OUTPUT_DIR}`);
