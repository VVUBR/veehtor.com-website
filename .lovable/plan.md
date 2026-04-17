

# New Route: `/Score.de.credito.DCarvalho`

## What I Understand
You want a new route at `/Score.de.credito.DCarvalho` (technically a path, not a subdomain — a true subdomain would be `score.veehtor.com`). I'll build it as a route accessible at `veehtor.com/Score.de.credito.DCarvalho`.

## Open Questions
Before building, I need to know what this page should contain. A few options:

1. **A landing page in Portuguese about credit score** (DCarvalho = personal brand?)
2. **A simple placeholder page** to reserve the URL
3. **A duplicate of the main site** with different branding/content
4. **Something else** — please describe

## Plan (Pending Your Input)

### 1. Create new page `src/pages/ScoreDeCredito.tsx`
- Content TBD based on your answer above
- Will follow the existing design system (DM Sans, Instrument Serif, teal accent, dark theme)

### 2. Register route in `src/App.tsx`
```tsx
<Route path="/Score.de.credito.DCarvalho" element={<ScoreDeCredito />} />
```
- Placed above the catch-all `*` route
- React Router handles the dotted path fine — no special config needed
- SPA deep-link refresh works automatically on Lovable hosting

### 3. Notes
- This is **case-sensitive** as written (`/Score...` with capital S). Confirm if you want it lowercase or both.
- If you actually want a true subdomain (`score.veehtor.com`), that requires a separate Lovable project + DNS CNAME setup — let me know.

## Next Step
Reply with:
- **What content** should appear on this page
- **Language** (English or Portuguese)
- Whether the URL should be **case-sensitive** as-is or normalized to lowercase

