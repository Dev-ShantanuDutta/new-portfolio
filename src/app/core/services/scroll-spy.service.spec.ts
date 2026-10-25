import { TestBed } from '@angular/core/testing';
import { WINDOW } from '../tokens/window.token';
import { ScrollSpyService } from './scroll-spy.service';

describe('ScrollSpyService', () => {
  function setup(tops: Record<string, number>, scroll: { y: number; height: number }) {
    document.body.innerHTML = `<main>${Object.keys(tops)
      .map((id) => `<section id="${id}"></section>`)
      .join('')}</main>`;
    for (const [id, top] of Object.entries(tops)) {
      document.getElementById(id)!.getBoundingClientRect = () => ({ top }) as DOMRect;
    }
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: scroll.height,
    });

    const fakeWindow = {
      document,
      innerHeight: 1000,
      scrollY: scroll.y,
      addEventListener: () => undefined,
      requestAnimationFrame: () => 0,
    };
    TestBed.configureTestingModule({ providers: [{ provide: WINDOW, useValue: fakeWindow }] });
    const service = TestBed.inject(ScrollSpyService);
    service.measure();
    return service;
  }

  afterEach(() => (document.body.innerHTML = ''));

  it('picks the last section whose top has passed the activation line', () => {
    const service = setup(
      { hero: -900, 'selected-work': 200, contact: 1400 },
      { y: 900, height: 5000 },
    );
    expect(service.activeSection()).toBe('selected-work');
  });

  it('is null above the first section', () => {
    const service = setup({ 'selected-work': 600 }, { y: 0, height: 5000 });
    expect(service.activeSection()).toBeNull();
  });

  it('picks the last section at the bottom of the page, even if it is short', () => {
    const service = setup({ 'selected-work': -800, contact: 700 }, { y: 4000, height: 5000 });
    expect(service.activeSection()).toBe('contact');
  });
});
