import { computeSystemCheck } from './system-check';

describe('computeSystemCheck', () => {
  it('checks every monitored service and returns a real measured latency for each', async () => {
    const results = await computeSystemCheck();

    expect(results.map((result) => result.name)).toEqual([
      'API Gateway',
      'Primary Database',
      'Auth Service',
      'Background Jobs',
    ]);

    for (const result of results) {
      expect(result.latencyMs).toBeGreaterThan(0);
      expect(['operational', 'degraded', 'down']).toContain(result.status);
    }
  });

  it('runs the checks concurrently rather than in sequence', async () => {
    const start = performance.now();
    await computeSystemCheck();
    const elapsed = performance.now() - start;

    // Each check delays up to ~175ms; run sequentially that's 700ms+, concurrently it's ~175ms.
    expect(elapsed).toBeLessThan(500);
  });
});
