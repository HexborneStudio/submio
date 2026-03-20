/**
 * Analytics abstraction — MVP scaffold.
 * Replace the console.log with a real provider (Mixpanel, PostHog, etc.)
 */

export type AnalyticsEvent =
  | "signup_started"
  | "signup_completed"
  | "document_created"
  | "document_uploaded"
  | "text_pasted"
  | "analysis_started"
  | "analysis_completed"
  | "receipt_viewed"
  | "share_link_created"
  | "share_link_revoked"
  | "educator_review_submitted"
  | "pdf_exported";

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(event: AnalyticsEvent, properties?: EventProperties): void {
  // MVP: log to console. Replace with real provider.
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${event}`, properties);
  }

  // TODO: integrate real analytics provider here
  // Example: mixpanel.track(event, properties);
  // Example: posthog.capture(event, properties);
}

export function trackPageView(page: string, properties?: EventProperties): void {
  trackEvent("page_view" as AnalyticsEvent, { page, ...properties });
}
