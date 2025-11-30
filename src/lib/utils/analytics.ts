export async function emitAnalytics(event: string, payload?: Record<string, unknown>) {
  const body = JSON.stringify({ event, payload, ts: Date.now() });

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon('/api/analytics', body);
      return;
    }

    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });
  } catch (err) {
    console.debug('[analytics] unable to emit', event, err);
  }
}
