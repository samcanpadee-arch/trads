type RateLimitStore = Map<string, { count: number; reset: number }>;

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface AppRateLimitGlobal {
    __appRateLimitStore?: RateLimitStore;
  }
}

const globalWithStore = globalThis as typeof globalThis & AppRateLimitGlobal;
const globalStore = globalWithStore.__appRateLimitStore || new Map<string, { count: number; reset: number }>();
if (!globalWithStore.__appRateLimitStore) {
  globalWithStore.__appRateLimitStore = globalStore;
}

export type RateLimitOptions = {
  limit?: number;
  windowMs?: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

const DEFAULT_LIMIT = 30;
const DEFAULT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export function consumeRateLimit(key: string, options?: RateLimitOptions): RateLimitResult {
  const limit = Math.max(1, Math.floor(options?.limit ?? DEFAULT_LIMIT));
  const windowMs = Math.max(1000, Math.floor(options?.windowMs ?? DEFAULT_WINDOW_MS));
  const now = Date.now();
  const current = globalStore.get(key);

  if (!current || now >= current.reset) {
    const resetAt = now + windowMs;
    globalStore.set(key, { count: 1, reset: resetAt });
    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      resetAt,
      retryAfterSeconds: Math.max(0, Math.ceil((resetAt - now) / 1000))
    };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.reset,
      retryAfterSeconds: Math.max(0, Math.ceil((current.reset - now) / 1000))
    };
  }

  current.count += 1;
  globalStore.set(key, current);

  return {
    allowed: true,
    remaining: Math.max(0, limit - current.count),
    resetAt: current.reset,
    retryAfterSeconds: Math.max(0, Math.ceil((current.reset - now) / 1000))
  };
}
