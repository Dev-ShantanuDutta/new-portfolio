import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { shareReplay } from 'rxjs';
import { Bookmark } from '../models/bookmark.model';
import { BlogPost } from '../models/blog-post.model';
import { Experience } from '../models/experience.model';
import { Identity } from '../models/identity.model';
import { ProcessStep } from '../models/process-step.model';
import { Project } from '../models/project.model';
import { TechEntry } from '../models/tech.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);

  /** Hero identity/specialization copy. `null` until the request resolves. */
  readonly identity = toSignal(this.http.get<Identity>('/assets/data/identity.json'), {
    initialValue: null,
  });

  /** How I Engineer's 2x2 process grid entries. */
  readonly processSteps = toSignal(
    this.http.get<ProcessStep[]>('/assets/data/process-steps.json'),
    { initialValue: [] },
  );

  /**
   * Shared source for the project list. Exposed alongside the signal (rather
   * than only inside `toSignal`) so router resolvers for `/projects/:slug`
   * can await the real, resolved value without triggering a second HTTP
   * request — `shareReplay` lets both consumers share the one response.
   */
  readonly projects$ = this.http.get<Project[]>('/assets/data/projects.json').pipe(shareReplay(1));

  /** All portfolio projects: teaser fields plus their expanded case study. */
  readonly projects = toSignal(this.projects$, { initialValue: [] });

  /** Work-history entries for the experience accordion, newest first. */
  readonly experience = toSignal(this.http.get<Experience[]>('/assets/data/experience.json'), {
    initialValue: [],
  });

  /** Tech-stack logo-row entries. */
  readonly techStack = toSignal(this.http.get<TechEntry[]>('/assets/data/tech-stack.json'), {
    initialValue: [],
  });

  /** Curated external bookmarks for the About/Taste section. */
  readonly bookmarks = toSignal(this.http.get<Bookmark[]>('/assets/data/bookmarks.json'), {
    initialValue: [],
  });

  /**
   * Shared source for blog posts, exposed alongside the signal for the same
   * reason as `projects$`: the `/blog/:slug` resolver awaits this directly.
   */
  readonly blogPosts$ = this.http
    .get<BlogPost[]>('/assets/data/blog-posts.json')
    .pipe(shareReplay(1));

  /** Blog post metadata and content, newest first. */
  readonly blogPosts = toSignal(this.blogPosts$, { initialValue: [] });
}
