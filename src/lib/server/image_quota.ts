export type ImageQuotaOptions = {
  limit?: number;
  windowMs?: number;
};

type QuotaBucket = { count: number; resetAt: number };

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ImageQuotaGlobal {
    __chatImageQuota?: Map<string, QuotaBucket>;
  }
}

const globalWithQuota = globalThis as typeof globalThis & ImageQuotaGlobal;
const quotaStore = globalWithQuota.__chatImageQuota || new Map<string, QuotaBucket>();
if (!globalWithQuota.__chatImageQuota) {
  globalWithQuota.__chatImageQuota = quotaStore;
}

const DEFAULT_LIMIT = 20;
const DEFAULT_WINDOW = 24 * 60 * 60 * 1000; // rolling 24h

export function consumeImageQuota(userId: string, options?: ImageQuotaOptions) {
  const limit = Math.max(1, Math.floor(options?.limit ?? DEFAULT_LIMIT));
  const windowMs = Math.max(1000, Math.floor(options?.windowMs ?? DEFAULT_WINDOW));
  const now = Date.now();
  const bucket = quotaStore.get(userId);

  if (!bucket || now >= bucket.resetAt) {
    const resetAt = now + windowMs;
    quotaStore.set(userId, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt } as const;
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt } as const;
  }

  bucket.count += 1;
  quotaStore.set(userId, bucket);
  return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt } as const;
}

export function resetImageQuota(userId?: string) {
  if (userId) {
    quotaStore.delete(userId);
  } else {
    quotaStore.clear();
  }
}
