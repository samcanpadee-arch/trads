import { describe, expect, it, beforeEach } from 'vitest';
import { consumeImageQuota, resetImageQuota } from './image_quota';

describe('consumeImageQuota', () => {
  beforeEach(() => {
    resetImageQuota();
  });

  it('allows the first request and decrements remaining', () => {
    const res = consumeImageQuota('user-1', { limit: 2, windowMs: 1000 });
    expect(res.allowed).toBe(true);
    expect(res.remaining).toBe(1);
  });

  it('blocks when limit reached', () => {
    consumeImageQuota('user-1', { limit: 1, windowMs: 1000 });
    const res = consumeImageQuota('user-1', { limit: 1, windowMs: 1000 });
    expect(res.allowed).toBe(false);
    expect(res.remaining).toBe(0);
  });
});
