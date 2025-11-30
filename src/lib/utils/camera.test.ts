import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requestCameraPermission } from './camera';

describe('requestCameraPermission', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false when camera API is unavailable', async () => {
    vi.stubGlobal('navigator', {});
    const allowed = await requestCameraPermission();
    expect(allowed).toBe(false);
  });

  it('requests permission and stops tracks on success', async () => {
    const stop = vi.fn();
    const getUserMedia = vi.fn().mockResolvedValue({ getTracks: () => [{ stop }] });
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } });

    const allowed = await requestCameraPermission();
    expect(allowed).toBe(true);
    expect(getUserMedia).toHaveBeenCalled();
    expect(stop).toHaveBeenCalled();
  });
});
