export async function getChatErrorMessage(res: Response): Promise<string> {
  if (res.status === 401) {
    return "Please sign in to use the assistant.";
  }

  if (res.status === 429) {
    return "You have hit the current usage limit. Please wait a moment and try again.";
  }

  const fallback = (await res.text().catch(() => "")).trim();
  if (fallback) {
    return fallback;
  }

  if (res.status >= 500) {
    return "The assistant is temporarily unavailable. Please try again shortly.";
  }

  return "Something went wrong while contacting the assistant. Please try again.";
}
