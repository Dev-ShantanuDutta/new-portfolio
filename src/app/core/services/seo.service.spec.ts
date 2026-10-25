import { Meta, Title } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let meta: Meta;
  let title: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoService);
    meta = TestBed.inject(Meta);
    title = TestBed.inject(Title);
  });

  afterEach(() => {
    document.getElementById('seo-json-ld')?.remove();
  });

  it('sets the document title and description', () => {
    service.setMetadata({ title: 'Home | Portfolio', description: 'A portfolio.' });

    expect(title.getTitle()).toBe('Home | Portfolio');
    expect(meta.getTag('name="description"')?.getAttribute('content')).toBe('A portfolio.');
  });

  it('sets Open Graph and Twitter Card tags', () => {
    service.setMetadata({ title: 'Project X', description: 'A case study.' });

    expect(meta.getTag('property="og:title"')?.getAttribute('content')).toBe('Project X');
    expect(meta.getTag('property="og:description"')?.getAttribute('content')).toBe('A case study.');
    expect(meta.getTag('name="twitter:card"')?.getAttribute('content')).toBe('summary_large_image');
  });

  it('only sets image/url tags when provided', () => {
    service.setMetadata({ title: 'No image', description: 'd' });
    expect(meta.getTag('property="og:image"')).toBeNull();

    service.setMetadata({
      title: 'With image',
      description: 'd',
      image: '/preview.png',
      url: 'https://example.com/',
    });
    expect(meta.getTag('property="og:image"')?.getAttribute('content')).toBe('/preview.png');
    expect(meta.getTag('property="og:url"')?.getAttribute('content')).toBe('https://example.com/');
  });

  it('injects a JSON-LD script tag and replaces it on the next call', () => {
    service.setJsonLd({ '@type': 'Person', name: 'A' });
    const first = document.getElementById('seo-json-ld');
    expect(first?.textContent).toContain('"name":"A"');

    service.setJsonLd({ '@type': 'Person', name: 'B' });
    const scripts = document.querySelectorAll('#seo-json-ld');
    expect(scripts.length).toBe(1);
    expect(scripts[0].textContent).toContain('"name":"B"');
  });
});
