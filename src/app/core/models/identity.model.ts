export interface SpecializationSegment {
  text: string;
  highlighted: boolean;
}

export interface Cta {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
}

export interface ContactLinks {
  email: string;
  github: string;
  linkedin: string;
  resume: string;
}

export interface Identity {
  name: string;
  specialization: SpecializationSegment[];
  currentFocus: string;
  currentFocusDate: string;
  ctas: Cta[];
  /** Paragraphs for the About section, in reading order. */
  bio: string[];
  /** Equal-weight contact channels for the Contact section. */
  contact: ContactLinks;
  /** Certifications for the proof strip, most relevant first. */
  certifications?: Certification[];
}

export interface CertificationIssuer {
  name: string;
  /** Logo file name under `assets/icons/`, including its extension. */
  logo: string;
}

export interface Certification {
  name: string;
  /** Who issued or hosted it; some certifications have more than one. */
  issuers: CertificationIssuer[];
}
