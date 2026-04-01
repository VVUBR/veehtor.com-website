

# Increase Font Sizes Globally

All text elements under 1rem will be bumped up by ~15-20%. The two fonts (Instrument Serif for headings, DM Sans for body) remain unchanged — only sizes increase.

## Changes in `src/index.css`

| Element | Current | New |
|---|---|---|
| Section labels (`.section-label`) | `0.7rem` | `0.85rem` |
| Body paragraphs (`.problem-card p`, `.step p`, `.pricing-desc`, `.outcomes-sub`, `.cta-sub`) | `0.9rem – 1.05rem` | `1rem – 1.15rem` |
| Stat label (`.stat-label`) | `0.8rem` | `0.95rem` |
| Stat desc (`.stat-desc`) | `0.85rem` | `1rem` |
| Step duration (`.step .duration`) | `0.75rem` | `0.85rem` |
| Case industry (`.case-industry`) | `0.7rem` | `0.85rem` |
| Case before/after (`.case-ba`) | `0.8rem` | `0.95rem` |
| Case ba strong | `0.65rem` | `0.75rem` |
| Nav links (`.nav-link-style`, `.nav-cta`) | `0.85rem` | `0.95rem` |
| Footer text (`.footer-text`, `.footer-links a`) | `0.75rem` | `0.85rem` |
| Pricing tier (`.pricing-tier`) | `0.7rem` | `0.85rem` |
| Pricing features li | `0.88rem` | `1rem` |
| Pricing timeline | `0.8rem` | `0.9rem` |
| Pricing note | `0.85rem` | `0.95rem` |
| CTA contact links | `0.85rem` | `0.95rem` |
| Scroll indicator span | `0.65rem` | `0.75rem` |
| Chaos cell font | `0.65rem` | `0.75rem` |
| Hero body `p` in phase-text | `1rem` | `1.1rem` |
| Phase transformed `p` | `1rem` | `1.1rem` |

## Changes in `src/pages/Index.tsx`

- Inline `fontSize` on case card metricLabel: `0.85rem` → `1rem`
- Case card body `p` (if any inline style): bump similarly

All changes are purely CSS size adjustments — no layout or structural changes.

