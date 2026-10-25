import { ProjectStatus } from './project.model';

export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  /** `null` means the role is current ("Present"); pairs with status: 'live'. */
  endDate: string | null;
  status: ProjectStatus;
  summary: string;
  highlights: string[];
  techTags?: string[];
}
