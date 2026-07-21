import { useEffect } from "react";

/**
 * Shared reveal-on-scroll hook. Elements with `.reveal` inside `scope`
 * receive `.in` when they enter view. Also observes elements added later
 * (e.g. when filters remount cards) via MutationObserver.
 * Respects prefers-reduced-motion.
 */
export function useReveal(scope: string = ".home, .site") {
  useEffect(() => {
    const scopes = scope.split(",").map((s) => s.trim()).filter(Boolean);
    const revealSelector = scopes.map((s) => `${s} .reveal`).join(",");
    const roots = scopes.flatMap((s) =>
      Array.from(document.querySelectorAll<HTMLElement>(s)),
    );

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      document
        .querySelectorAll<HTMLElement>(revealSelector)
        .forEach((el) => el.classList.add("in"));
      return;
    }

    const observed = new WeakSet<Element>();
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

    const observe = (el: Element) => {
      if (observed.has(el)) return;
      observed.add(el);
      io.observe(el);
    };

    document.querySelectorAll<HTMLElement>(revealSelector).forEach(observe);

    const scanNode = (node: Node) => {
      if (node.nodeType !== 1) return;
      const el = node as HTMLElement;
      if (el.classList?.contains("in")) return;
      if (el.matches?.(revealSelector)) observe(el);
      el.querySelectorAll?.<HTMLElement>(revealSelector).forEach(observe);
    };

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach(scanNode);
      }
    });

    const mutationTargets = roots.length > 0 ? roots : [document.body];
    mutationTargets.forEach((r) =>
      mo.observe(r, { childList: true, subtree: true }),
    );

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [scope]);
}
