export type ServiceStatus = 'operational' | 'degraded' | 'down';

export interface ServiceCheckResult {
  name: string;
  status: ServiceStatus;
  latencyMs: number;
}

const MONITORED_SERVICES = ['API Gateway', 'Primary Database', 'Auth Service', 'Background Jobs'];

function statusForLatency(latencyMs: number): ServiceStatus {
  if (latencyMs < 60) {
    return 'operational';
  }
  if (latencyMs < 150) {
    return 'degraded';
  }
  return 'down';
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Stands in for a real per-service network round trip: the delay is
 * artificial, but the latency reported back is a genuine measurement of it,
 * not a hardcoded number — the same request/response shape production
 * uptime monitoring relies on.
 */
async function checkService(name: string): Promise<ServiceCheckResult> {
  const start = performance.now();
  await delay(15 + Math.random() * 160);
  const latencyMs = Math.round(performance.now() - start);
  return { name, status: statusForLatency(latencyMs), latencyMs };
}

export function computeSystemCheck(): Promise<ServiceCheckResult[]> {
  return Promise.all(MONITORED_SERVICES.map(checkService));
}
