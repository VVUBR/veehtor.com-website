import { useEffect } from "react";

/**
 * Shared reveal-on-scroll hook. Same behavior across the marketing site
 * (home, case list, case detail): elements with `.reveal` inside `scope`
 * get `.in` when they enter view. Respects prefers-reduced-motion.
 *
 * @param scope CSS selector of the container to observe within. Defaults
 *              to `.home, .site` so it works on any wrapper we ship.
 */
export function useReveal(scope: string = ".home, .site") {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = document.querySelectorAll<HTMLElement>(
      scope
        .split(",")
        .map((s) => `${s.trim()} .reveal`)
        .join(","),
    );
    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [scope]);
}
