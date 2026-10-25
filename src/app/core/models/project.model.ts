export type ProjectStatus = 'live' | 'pinned' | 'none';

/** Built on my own time, or for an employer (where client data keeps the demo private). */
export type ProjectOrigin = 'personal' | 'company';

export interface ProjectLinks {
  github?: string;
  demo?: string;
}

export interface ProjectCaseStudy {
  problem: string;
  constraints: string;
  role: string;
  architecture?: string;
  technicalChallenge: string;
  decision: string;
  result: string;
  learned: string;
}

/** One bullet in an overview list: an optional bold lead-in, then the detail. */
export interface ProjectPoint {
  title?: string;
  detail: string;
}

/** Plain-language summary: why it exists, who it serves, what it fixes, what I took away. */
export interface ProjectOverview {
  purpose: string;
  audience: string;
  solves: ProjectPoint[];
  learned: ProjectPoint[];
}

export interface Project {
  slug: string;
  name: string;
  status: ProjectStatus;
  origin: ProjectOrigin;
  /** Employer the project was built at; set when `origin` is `company`. */
  company?: string;
  reframe: string;
  techTags: string[];
  links: ProjectLinks;
  /** Shown instead of the case study when present. */
  overview?: ProjectOverview;
  caseStudy?: ProjectCaseStudy;
}
