import { Routes } from '@angular/router';
import { blogPostResolver } from './core/resolvers/blog-post.resolver';
import { projectResolver } from './core/resolvers/project.resolver';
import { ComingSoonComponent } from './features/coming-soon/coming-soon.component';
import { ContactPageComponent } from './features/contact-page/contact-page.component';
import { DemoUnavailableComponent } from './features/demo-unavailable/demo-unavailable.component';
import { HomeComponent } from './features/home/home.component';
import { ProjectCaseStudyComponent } from './features/selected-work/project-case-study/project-case-study.component';
import { PostDetailComponent } from './features/writing/post-detail/post-detail.component';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'projects/:slug',
        component: ProjectCaseStudyComponent,
        resolve: { project: projectResolver },
        data: { initiallyExpanded: true },
      },
      {
        path: 'blog/:slug',
        component: PostDetailComponent,
        resolve: { post: blogPostResolver },
      },
    ],
  },
  // Full-page views opened in a new tab (placeholders from project links, the
  // contact form from "Let's talk"): no nav, just a way back.
  {
    path: '',
    component: ShellComponent,
    data: { hideNav: true },
    children: [
      { path: 'coming-soon', component: ComingSoonComponent },
      { path: 'demo-unavailable', component: DemoUnavailableComponent },
      { path: 'contact', component: ContactPageComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
