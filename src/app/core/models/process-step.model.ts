export interface ProcessStepPoint {
  /** Short practice name, rendered as the highlighted term (e.g. "Design doc / RFC"). */
  term: string;
  /** Why this practice matters, rendered in brackets next to the term. */
  why: string;
  /** The rest of the sentence, in plain language. */
  detail: string;
}

export interface ProcessStep {
  title: string;
  /** One-sentence framing for the step. */
  summary: string;
  points: ProcessStepPoint[];
  /** A real, specific example of this step from actual project work. */
  example: string;
  isHighlighted: boolean;
}
