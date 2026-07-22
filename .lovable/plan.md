## Scope
Only touch the `proof` section on the home page. No other files/routes.

## Files to change
1. **`src/i18n/homeContent.ts`** — extend the `Stat` type with two optional fields and populate them on the Robbin and Complô entries (PT + EN):
   - `impact?: string` — the financial line.
   - `impactBadgeLabel?: string` — always `"Impacto estimado"` (PT) / `"Estimated impact"` (EN).
   
   Exact PT copy per spec:
   - Robbin → impact: `até US$ 26.000/ano em folha convertida em capacidade faturável`
   - Complô → impact: `US$ 6.000/ano de tempo de gestão recuperado`
   
   EN mirrors (natural, not literal):
   - Robbin → `up to US$ 26,000/year in payroll converted into billable capacity`
   - Complô → `US$ 6,000/year of management time recovered`
   
   D.Carvalho stat left untouched.

2. **`src/pages/Index.tsx`** — inside the `.proof-strip` map, after `.stat-label` and before the existing `.badge`, conditionally render:
   ```tsx
   {s.impact && (
     <>
       <div className="stat-impact">{s.impact}</div>
       <span className="badge b-estimated">{s.impactBadgeLabel}</span>
     </>
   )}
   ```
   The existing `badge b-${s.badge}` stays as-is below.

3. **`src/styles/home.css`** — add:
   - `.home .stat-impact{ margin-top:.75rem; font-size:.8rem; line-height:1.4; color:var(--muted); }`
   - `.home .stat-impact + .badge{ margin-top:.45rem; }` (tighten spacing so the "Impacto estimado" tag sits directly under its line)
   - Ensure the two tags share style: `b-estimated` already exists in the codebase (orange dot); reuse it so the two tags on each card look consistent.

## Layout / height
`.proof-strip` is a 3-column CSS grid; rows already stretch to equal height by default, and `.stat` content flows from the top (padding-based). No extra alignment change needed — the D.Carvalho card will simply have empty space at the bottom, which reads as intentional.

## Mobile
At the existing mobile breakpoint the grid collapses to a single column (already handled at line 320 of `home.css`). New elements inherit stat padding and stack naturally. No new media queries required.

## Out of scope (explicit)
- No change to the section heading, intro, sub, CTA link, or note.
- No change to any case study page (the Complô "≈ US$ 6.000" reconciliation the user mentioned is flagged as a follow-up, not part of this ship).
- No new components, routes, or i18n keys beyond the two optional fields.