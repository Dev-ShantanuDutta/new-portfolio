import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Injectable, inject } from '@angular/core';

const JSON_LD_ELEMENT_ID = 'seo-json-ld';

export interface SeoMetadata {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);

  /** Sets the page <title>, meta description, and Open Graph/Twitter Card tags for the current route. */
  setMetadata(metadata: SeoMetadata): void {
    this.title.setTitle(metadata.title);
    this.meta.updateTag({ name: 'description', content: metadata.description });

    this.meta.updateTag({ property: 'og:title', content: metadata.title });
    this.meta.updateTag({ property: 'og:description', content: metadata.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: metadata.title });
    this.meta.updateTag({ name: 'twitter:description', content: metadata.description });

    if (metadata.image) {
      this.meta.updateTag({ property: 'og:image', content: metadata.image });
      this.meta.updateTag({ name: 'twitter:image', content: metadata.image });
    }

    if (metadata.url) {
      this.meta.updateTag({ property: 'og:url', content: metadata.url });
    }
  }

  /** Injects (replacing any previous one) the page's JSON-LD structured-data script tag. */
  setJsonLd(data: Record<string, unknown>): void {
    this.document.getElementById(JSON_LD_ELEMENT_ID)?.remove();

    const script = this.document.createElement('script');
    script.id = JSON_LD_ELEMENT_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }
}
