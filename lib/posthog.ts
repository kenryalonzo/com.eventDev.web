import posthog from "posthog-js";

// Safe PostHog wrapper that won't break the app if PostHog is not available
export const safePosthog = {
  capture: (event: string, properties?: Record<string, any>) => {
    try {
      if (posthog && typeof posthog.capture === "function") {
        posthog.capture(event, properties);
      }
    } catch (error) {
      console.warn("PostHog capture failed:", error);
    }
  },

  captureException: (error: Error | string) => {
    try {
      if (posthog && typeof posthog.captureException === "function") {
        posthog.captureException(error);
      }
    } catch (err) {
      console.warn("PostHog exception capture failed:", err);
    }
  },

  identify: (userId: string, properties?: Record<string, any>) => {
    try {
      if (posthog && typeof posthog.identify === "function") {
        posthog.identify(userId, properties);
      }
    } catch (error) {
      console.warn("PostHog identify failed:", error);
    }
  },

  reset: () => {
    try {
      if (posthog && typeof posthog.reset === "function") {
        posthog.reset();
      }
    } catch (error) {
      console.warn("PostHog reset failed:", error);
    }
  },
};

export default safePosthog;
