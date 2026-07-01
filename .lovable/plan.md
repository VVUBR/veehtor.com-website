# Plan: /family-realty production dashboard

Replace the existing visual preview at `/family-realty` with a production, read-only cost-control dashboard connected to the real Supabase project (`yklcfwhpkvtrjbqxhiln`), gated by auth, bilingual PT/EN, driven by global Obra + period filters.

## 1. Backend wiring (Supabase — connect, not enable)

The target project already exists (`https://yklcfwhpkvtrjbqxhiln.supabase.co`). I will connect this Lovable project to that external Supabase using the native integration. This is different from Lovable Cloud (which would provision a brand new backend).

**I need from you before I can code:**
- The **Supabase anon/publishable key** for project `yklcfwhpkvtrjbqxhiln` (Project Settings → API). Safe to paste; it's a public key.
- Confirmation that RLS on all listed views/tables grants `SELECT` to `authenticated` (and revokes `anon`). If not set, I'll give you the SQL to run in the Supabase SQL editor — I will not write to your DB from here.
- A single existing auth user (email + password) already created in Supabase Auth, since there is no sign-up flow.

Once I have the anon key I'll create `src/integrations/supabase/client.ts` and typed helpers for each view/table listed in the spec. No writes anywhere.

## 2. Auth

- `/family-realty/login` — navy `#041C2C` background, white card, "Family Realty" text logo, title, email + password, red error state. No sign-up, no reset UI.
- `AuthProvider` wraps the dashboard; `onAuthStateChange` + `getSession` on mount. Unauthenticated users on any `/family-realty/*` route get redirected to login.
- Logout button in header.

## 3. i18n (scoped to this page)

Small local `FRLangProvider` with `pt` (default) / `en` dictionaries, persisted in `localStorage` under `fr-lang`. Independent of the site-wide `veehtor-lang` so it doesn't affect the marketing site. Domain terms (budget, subcontractor, invoice, downpayment, estimate, billed) stay in English in both languages. Dates via `Intl.DateTimeFormat` with `pt-BR` / `en-US`; currency always USD via `en-US`.

## 4. Global filters (header)

- **Obra** dropdown: "Todas as obras" + the 8 fixed job names.
- **Period**: preset chips (Este mês, Últimos 30 dias, Últimos 3 meses, Este ano, Tudo) **plus** a custom range picker (shadcn `Calendar` in a `Popover`, two dates). Active range printed as text.
- Filter state lives in a `FRFiltersContext` and is consumed by every section.
- Semantics enforced per section exactly as spec: period applies to Realizado KPI, budget status, stage detail, monthly chart, line-items. "A pagar", Contratos, Estimate vs Billed, A classificar ignore period. Obra applies everywhere.
- Date-guard helper drops `invoice_date` outside `[2020-01-01, 2027-12-31]`; dateless rows excluded from period-scoped views and reported as a small "N linhas sem data excluídas · $X" note.

## 5. Sections (top to bottom)

1. **Header** (navy) — logo, title, Obra dropdown, period presets + custom range, PT/EN toggle, logout.
2. **KPI row** (5 cards) — Budget total, Realizado (currency + % with green/gold/red), A pagar (gold, ignores period), Em atraso (red when > 0, ignores period), A classificar (gray/gold, ignores period).
3. **Status de budget por obra** — one row per job from `v_budget_vs_actual_by_project`: name, horizontal progress bar of `pct_consumed`, big % at end, status tag. Bar overflows past 100% mark with hatched red segment for over-budget. When a single Obra is selected, collapses to that job and expands the stage detail below.
4. **Detalhe por etapa** — table from `v_budget_vs_actual` grouped by `phase` (consolidated when "Todas"). Columns: Etapa, Budget, Realizado, % consumido (colored). Includes `(sem etapa)` / `(sem linha de budget)` rows labeled "Sem linha de budget". Row expander shows underlying `description`-level lines.
5. **Gastos por mês** — solid navy vertical bars from `history` summed by `invoice_date` month, plain labels (Jan/26, Fev/26 …). Two dashed bars ahead labeled "previsto (média dos últimos 3 meses)". Caption "Quanto a empresa gasta por mês." Single color, no stacks.
6. **A pagar** — from `v_invoices_to_pay`. Overdue rows first (red), then by `due_date` asc, dateless last. Columns: Fornecedor (canonical → fallback), Obra (or "A classificar" tag), Material, Valor, Vencimento ("18 jun"), Status ("Em atraso há X dias" / "Vence em X dias" / "Sem vencimento"). File-link icon when present.
7. **Contratos** — cards/rows from `contracts` + `v_contract_payment_summary` + `v_disbursement_schedule`. Vendor (canonical fallback), Obra (or "Sem obra definida"), contact_name, total_value, contract_date, `review_status` badge, `notes` in "ver condições" expander. Expander also lists installments (`installment_label` · `pct` · `amount`) as a milestone list and shows `schedule_gap` warning when `abs > 1`. Search by vendor. NO date timeline.
8. **Estimate vs Billed** — table from `v_estimate_vs_billed`. Diferença colored: green when `abs(diff) < 1`, red when `billed > estimate`, gray when `billed = 0`. Sorted by `abs(difference)` desc. Caption per spec. Row click opens a drawer of underlying `history` invoices (matching `supplier_canonical` + `project_name`).
9. **A classificar** — table from `v_unassigned_costs` with Sugestão parsed from `address_pointer` (gold when it starts with "Sugestao IA:"). Caption per spec.
10. **Linha a linha de custos** — full `history` detail, paginated 50/page, sortable, follows both global filters. Columns per spec.
11. **Footer** — small gray text with sync sentence + last-loaded timestamp (`new Date()` at fetch time).

## 6. Data quality guards (shared helpers)

- `isValidInvoiceDate(d)` — inside `[2020-01-01, 2027-12-31]`.
- Currency: `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` in both languages.
- Negatives kept in sums.
- `supplierLabel = supplier_canonical || supplier`, `vendorLabel = vendor_canonical || subcontractor`.

## 7. Behavior

Hover tooltips with exact values on bars and KPI values. Sortable tables. Loading skeletons per section during fetch. Empty states with plain sentences. Error state per section with a "Tentar de novo" button. All queries use `select('*')` on the specific view; `history` is paginated with `.range()` client-side by page.

## 8. Files touched

- New: `src/pages/family-realty/lib/supabase.ts`, `lib/types.ts`, `lib/i18n.tsx`, `lib/filters.tsx`, `lib/format.ts`, `lib/auth.tsx`, `pages/login.tsx`.
- New section components in `src/pages/family-realty/components/`: `StatusBudget.tsx` (replaces existing BudgetStatusList to use live data), `StageDetail.tsx`, `MonthlySpend.tsx`, `Payables.tsx`, `Contracts.tsx`, `EstimateVsBilled.tsx`, `Unassigned.tsx`, `HistoryTable.tsx`.
- Rewrites: `src/pages/family-realty/index.tsx`, `components/FRHeader.tsx`.
- Deletes: static `data.ts` mock data and unused preview components (`CostTable.tsx`, `PayablesList.tsx`, `BudgetStatusList.tsx`, `StageDetailTable.tsx`, `MonthlySpendChart.tsx`, old chart files).
- Route change in `src/App.tsx` to add `/family-realty/login` and protect `/family-realty`.
- `bun add @supabase/supabase-js date-fns` (small, needed for period math and formatting).

## 9. What I need from you to start

1. **Supabase anon key** for `yklcfwhpkvtrjbqxhiln` (paste it — it's public).
2. Confirmation that RLS `SELECT` policies for `authenticated` exist on all 7 views + `contracts` + `history`. If missing, I'll give you the SQL; you'll run it in the Supabase SQL editor.
3. That an auth user exists (email + password) — or create one now in Supabase → Authentication → Users.

As soon as those three are in place, I ship the whole page in one build.
