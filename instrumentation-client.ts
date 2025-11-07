import posthog from "posthog-js";

// Only initialize PostHog if the API key is available
if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  try {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: "2025-05-24",
      capture_exceptions: true, // This enables capturing exceptions using Error Tracking
      debug: process.env.NODE_ENV === "development",
    });
  } catch (error) {
    console.warn("Failed to initialize PostHog:", error);
  }
} else {
  console.warn("PostHog API key not found, analytics disabled");
}
