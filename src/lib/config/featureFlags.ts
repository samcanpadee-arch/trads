import { env as publicEnv } from '$env/dynamic/public';

export const CHAT_CAMERA_CAPTURE_ENABLED =
  publicEnv.PUBLIC_CHAT_CAMERA_CAPTURE_ENABLED !== 'false';
export const CHAT_IMAGE_DAILY_LIMIT = Number.isFinite(Number(publicEnv.PUBLIC_CHAT_IMAGE_DAILY_LIMIT))
  ? Number(publicEnv.PUBLIC_CHAT_IMAGE_DAILY_LIMIT)
  : 20;
