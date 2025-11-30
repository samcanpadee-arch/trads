# Adding Analytics

Adding analytics to your SaaS Starter project is optional.

Since each analytics platform has different setup instructions, we've created a guide instead of adding it in code.

### PostHog

- Create a PostHog Account
- Install PostHog JS Library
  - Run `npm install posthog-js` in your terminal. This will add PostHog dependencies to your `package.json` and `package-lock.json`.
- Set Up PostHog
  - in `src/routes/+layout.svelte` add PostHog to the script section following the [Posthog Svelte Guide](https://posthog.com/docs/libraries/svelte#client-side-setup). Note: ensure you’re logged into PostHog so that the code includes your unique API key automatically.
- Test analytics
  - Click around and view a few pages on your site to generate some events. You can view these events in PostHog to ensure tracking is active.

### Google Analytics

Follow the [Google Analytics Guide](https://support.google.com/analytics/answer/9304153?hl=en) to add Google Analytics to your project.

The ideal place to add Google Analytics is in `src/routes/+layout.svelte`.

### Chat camera events

The chat camera capture UI is gated behind the `PUBLIC_CHAT_CAMERA_CAPTURE_ENABLED` flag. When enabled, the client emits the
following events that can be wired to your analytics platform of choice:

- `chat_camera_open`: the capture button was tapped and permission requested.
- `chat_camera_capture`: a photo was captured and queued for upload (payload includes a `count`).
- `chat_capture_upload_success` / `chat_capture_upload_failed`: upload outcomes.

Hook these into your analytics sink by implementing a `/api/analytics` endpoint that records the payload from
`src/lib/utils/analytics.ts`.
