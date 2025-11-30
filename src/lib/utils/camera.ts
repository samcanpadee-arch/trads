export async function requestCameraPermission() {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) return false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (err) {
    console.warn('[camera] permission denied', err);
    return false;
  }
}
