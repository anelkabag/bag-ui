import posthog from "posthog-js"

const token =
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ??
  process.env.NEXT_PUBLIC_POSTHOG_KEY
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com"

if (token) {
  posthog.init(token, {
    api_host: host,
    defaults: "2026-08-30",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  })
} else if (process.env.NODE_ENV === "development") {
  console.error(
    new Error(
      "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is missing, so PostHog does not start and events are silently dropped. Add the project token from PostHog project settings.",
    ),
  )
}
