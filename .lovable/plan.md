
## Family Realty Dashboard — Production Wiring

Connect the existing `/family-realty` visual to the external Supabase project `yklcfwhpkvtrjbqxhiln` with authentication and live data. No data mutations; read-only dashboard.

### 1. Supabase client (external, isolated)
- Add `src/pages/family-realty/lib/frSupabase.ts` creating a standalone client using:
  - URL: `https://yklcfwhpkvtrjbqxhiln.supabase.co`
  - anon key: the one you provided (safe to embed — publishable)
  - Custom `storageKey: "fr-auth"` so it never collides with the Lovable Cloud client used elsewhere.
- No env vars needed for the anon key (publishable). This keeps Family Realty fully isolated from the rest of the site.

### 2. Auth gate
- New `/family-realty/login` route: email + password form, brand navy `#041C2C` / gold `#EAAA00`, Roboto.
- `FRAuthProvider` around `/family-realty/*` that:
  - Registers `onAuthStateChange` first, then calls `getSession()`.
  - Redirects unauthenticated users to `/family-realty/login`.
  - Shows a "Sair" button in the header.
- No public sign-up. User `info@familyrealtyinvestments.com` logs in with the password set in the Supabase dashboard.
- Password reset link → `/family-realty/reset-password` page (updates password via `updateUser`).

### 3. Filters context
- `FRFiltersContext` with:
  - `job`: `"all" | <project_id>`
  - `period`: `"week" | "month" | "12w" | "all" | "custom"`, plus `from`/`to` for custom.
- Header exposes both filters globally; every section reads from the context via `useMemo`.

### 4. Data layer
Read-only hooks (React Query) per view, all filtered by `job` + `period`:
- `useBudgetVsActual` → `v_budget_vs_actual_by_project`, `v_budget_vs_actual`
- `usePayables` → `v_invoices_to_pay`
- `useUnassignedCosts` → `v_unassigned_costs`
- `useEstimateVsBilled` → `v_estimate_vs_billed`
- `useContracts` → `contracts`, `v_contract_payment_summary`
- `useDisbursements` → `v_disbursement_schedule`
- `useHistory` → `history`
- `useMonthlySpend` derived client-side from cost rows (or a dedicated view if present).

Currency: `Intl.NumberFormat("en-US",{style:"currency",currency:"USD"})`. Invalid dates guarded (skip rows with null/NaN `invoice_date`).

### 5. UI sections (replaces mock)
Reuses existing components; swaps `data.ts` mock for hook results:
1. KPI row (Budget total, Actual, Variance, Payables due, Overdue count)
2. Budget status per obra (progress bars, color tags)
3. Stage detail table
4. Monthly spend chart (10 real months + 3 forecast)
5. Payables ("A pagar", overdue highlighted red)
6. Contracts summary
7. Estimate vs Billed
8. Unassigned costs (action-required list)
9. Disbursement schedule
10. History (audit log, last 50)
11. Empty/loading/error states per section

### 6. i18n
- Small `FRLangProvider` (PT/EN), persisted in `localStorage`. Toggle in header. Does not touch the main site's LanguageContext.

### Technical notes
- No changes to Lovable Cloud config; this uses the external Supabase project directly.
- The anon key is publishable and safe in source; RLS on the Supabase side is the security boundary.
- No writes anywhere; all queries are `select`.
- I still need confirmation that RLS `SELECT` is granted to `authenticated` on the listed views/tables. If any query returns "permission denied", I'll surface a clear message per section and give you the exact `GRANT` SQL to run.

### What I need from you to finish
1. Confirm the password for `info@familyrealtyinvestments.com` is already set in Supabase → Authentication → Users (or set one and share you've done it — don't paste it here).
2. If you haven't verified RLS grants, reply "run grants" and I'll paste the SQL to run in the Supabase SQL editor before we test.
