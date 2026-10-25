import { render } from '@testing-library/angular';
import { WINDOW } from '../../core/tokens/window.token';
import { CountUpComponent } from './count-up.component';
import { RevealObserver } from './reveal.directive';

// Comfortably past the animation's duration.
const DONE_MS = 2000;

describe('CountUpComponent', () => {
  let onVisible: (() => void) | undefined;
  let frames: FrameRequestCallback[];
  let now: number;

  const fakeObserver = {
    observe: (_: Element, cb: () => void) => (onVisible = cb),
    unobserve: () => undefined,
  };

  function fakeWindow(opts: { reduce?: boolean; motion?: boolean } = {}) {
    const root = document.createElement('html');
    if (opts.motion !== false) {
      root.classList.add('motion');
    }
    return {
      document: { documentElement: root },
      innerHeight: 0, // everything counts as below the fold
      matchMedia: () => ({ matches: !!opts.reduce }),
      performance: { now: () => now },
      requestAnimationFrame: (cb: FrameRequestCallback) => frames.push(cb),
      cancelAnimationFrame: () => undefined,
      addEventListener: () => undefined,
    };
  }

  function flushFrame(at: number) {
    now = at;
    const pending = frames;
    frames = [];
    pending.forEach((cb) => cb(at));
  }

  beforeEach(() => {
    onVisible = undefined;
    frames = [];
    now = 0;
  });

  it('shows the final value up front, then counts from 0 once it scrolls into view', async () => {
    const { container, detectChanges } = await render(CountUpComponent, {
      inputs: { value: '3.5+' },
      providers: [
        { provide: WINDOW, useValue: fakeWindow() },
        { provide: RevealObserver, useValue: fakeObserver },
      ],
    });
    expect(container.textContent).toBe('3.5+');

    onVisible?.();
    detectChanges();
    expect(container.textContent).toBe('0.0+');

    flushFrame(450);
    detectChanges();
    const midway = Number.parseFloat(container.textContent ?? '');
    expect(midway).toBeGreaterThan(0);
    expect(midway).toBeLessThan(3.5);

    flushFrame(DONE_MS);
    detectChanges();
    expect(container.textContent).toBe('3.5+');
  });

  it('never animates when the visitor prefers reduced motion', async () => {
    const { container } = await render(CountUpComponent, {
      inputs: { value: 42 },
      providers: [
        { provide: WINDOW, useValue: fakeWindow({ reduce: true }) },
        { provide: RevealObserver, useValue: fakeObserver },
      ],
    });

    expect(onVisible).toBeUndefined();
    expect(container.textContent).toBe('42');
  });

  it('never animates when motion was not enabled by the page bootstrap', async () => {
    await render(CountUpComponent, {
      inputs: { value: 42 },
      providers: [
        { provide: WINDOW, useValue: fakeWindow({ motion: false }) },
        { provide: RevealObserver, useValue: fakeObserver },
      ],
    });

    expect(onVisible).toBeUndefined();
  });
});
