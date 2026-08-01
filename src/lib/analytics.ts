// Analytics helper. Preserves event names from veehtor-home-v3.html.
// Sinks Plausible when window.plausible exists, GA4 via gtag when available,
// and mirrors to console.debug for dev.

type TrackData = Record<string, unknown>;

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: TrackData }) => void;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Internal event name -> GA4 recommended event name (plus extra params).
const GA4_ALIASES: Record<string, { name: string; params?: TrackData }> = {
  form_started: { name: "form_start" },
  form_submitted: { name: "generate_lead" },
  cases_nav_clicked: { name: "select_content", params: { content_type: "case_studies" } },
};

export function track(event: string, data?: TrackData): void {
  try {
    if (typeof window !== "undefined") {
      if (typeof window.plausible === "function") {
        window.plausible(event, data ? { props: data } : undefined);
      }
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event, ...(data || {}) });
      }
      if (typeof window.gtag === "function") {
        window.gtag("event", event, data || {});
        const alias = GA4_ALIASES[event];
        if (alias) {
          window.gtag("event", alias.name, { ...(alias.params || {}), ...(data || {}) });
        }
      }
    }
    // eslint-disable-next-line no-console
    (console.debug || console.log).call(console, "[track]", event, data || {});
  } catch {
    /* analytics nunca pode quebrar a página */
  }
}
