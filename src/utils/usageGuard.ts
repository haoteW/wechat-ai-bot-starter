type UsageState = {
  count: number;
  resetAt: number;
};

const usageMap = new Map<string, UsageState>();
const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_LIMIT = 5;

export function canUserSendMessage(userId: string): boolean {
  const now = Date.now();
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || DEFAULT_WINDOW_MS;
  const limit = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || DEFAULT_LIMIT;
  const state = usageMap.get(userId);

  if (!state || state.resetAt <= now) {
    usageMap.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (state.count >= limit) {
    return false;
  }

  state.count += 1;
  return true;
}
