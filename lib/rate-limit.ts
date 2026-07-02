// Minimal in-memory sliding-window limiter. Good enough for a single
// instance. For serverless/multi-region, swap for Upstash Redis.
type Hit = { count: number; reset: number };
const store = new Map<string, Hit>();

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const hit = store.get(key);

  if (!hit || hit.reset < now) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  hit.count += 1;
  if (hit.count > limit) return { ok: false, remaining: 0 };
  return { ok: true, remaining: limit - hit.count };
}

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
