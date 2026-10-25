import { render, screen } from '@testing-library/angular';
import { RevealDirective, RevealObserver } from './reveal.directive';

describe('RevealDirective', () => {
  let visible: Map<Element, () => void>;

  const fakeObserver = {
    observe: (el: Element, cb: () => void) => visible.set(el, cb),
    unobserve: (el: Element) => visible.delete(el),
  };

  beforeEach(() => (visible = new Map()));

  it('marks the element for reveal, staggers it, and reveals it once in view', async () => {
    const { detectChanges } = await render(`<p [appReveal]="2">Hello</p>`, {
      imports: [RevealDirective],
      providers: [{ provide: RevealObserver, useValue: fakeObserver }],
    });

    const el = screen.getByText('Hello');
    expect(el.hasAttribute('data-reveal')).toBe(true);
    expect(el.classList.contains('is-revealed')).toBe(false);
    expect(el.style.getPropertyValue('--reveal-delay')).toBe('calc(var(--reveal-stagger) * 2)');

    visible.get(el)?.();
    detectChanges();

    expect(el.classList.contains('is-revealed')).toBe(true);
  });

  it('caps the stagger so long lists never wait too long', async () => {
    await render(`<p [appReveal]="12">Late</p>`, {
      imports: [RevealDirective],
      providers: [{ provide: RevealObserver, useValue: fakeObserver }],
    });

    expect(screen.getByText('Late').style.getPropertyValue('--reveal-delay')).toBe(
      'calc(var(--reveal-stagger) * 5)',
    );
  });

  it('stops observing when the element is destroyed', async () => {
    const { fixture } = await render(`<p appReveal>Bye</p>`, {
      imports: [RevealDirective],
      providers: [{ provide: RevealObserver, useValue: fakeObserver }],
    });
    expect(visible.size).toBe(1);

    fixture.destroy();

    expect(visible.size).toBe(0);
  });
});
