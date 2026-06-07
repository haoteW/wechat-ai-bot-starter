type RateLimitRecord = {
  windowStartedAt: number;
  count: number;
};

const records = new Map<string, RateLimitRecord>();
const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_REQUESTS = 5;

export function checkRateLimit(key: string): boolean {
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || DEFAULT_WINDOW_MS;
  const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || DEFAULT_MAX_REQUESTS;
  const now = Date.now();
  const record = records.get(key);

  if (!record || now - record.windowStartedAt > windowMs) {
    records.set(key, {
      windowStartedAt: now,
      count: 1
    });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}
