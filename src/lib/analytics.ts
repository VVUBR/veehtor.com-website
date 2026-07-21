// Analytics helper. Preserves event names from veehtor-home-v3.html.
// Sinks Plausible when window.plausible exists; also mirrors to console.debug for dev.
// TODO: wire GA4 or a real backend before the home relies on this in production.

type TrackData = Record<string, unknown>;

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: TrackData }) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: string, data?: TrackData): void {
  try {
    if (typeof window !== "undefined") {
      if (typeof window.plausible === "function") {
        window.plausible(event, data ? { props: data } : undefined);
      }
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event, ...(data || {}) });
      }
    }
    // eslint-disable-next-line no-console
    (console.debug || console.log).call(console, "[track]", event, data || {});
  } catch {
    /* analytics nunca pode quebrar a página */
  }
}
