import { PostHog } from "posthog-node";

const token =
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ??
  process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

let posthogServer: PostHog | null = null;

export function getPostHogServer() {
  if (!token) return null;

  posthogServer ??= new PostHog(token, {
    host,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: process.env.NEXT_RUNTIME === "nodejs",
  });

  return posthogServer;
}
