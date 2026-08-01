import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Fires a GA4 page_view on every route change, including first render. */
export function usePageViews(): void {
  const location = useLocation();

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        if (typeof window.gtag === "function") {
          window.gtag("event", "page_view", {
            page_path: location.pathname + location.search,
            page_location: window.location.href,
            page_title: document.title,
          });
        }
      } catch {
        /* analytics nunca pode quebrar a página */
      }
    }, 50);
    return () => window.clearTimeout(id);
  }, [location.pathname, location.search]);
}

export default function PageViewTracker(): null {
  usePageViews();
  return null;
}

