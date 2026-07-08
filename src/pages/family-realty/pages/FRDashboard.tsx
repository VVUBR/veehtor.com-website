import { useEffect, useMemo, useState } from "react";
import "../theme.css";
import FRHeader from "../components/FRHeader";
import KpiCard from "../components/KpiCard";
import BudgetStatusList from "../components/BudgetStatusList";
import StageDetailTable from "../components/StageDetailTable";
import MonthlySpendChart from "../components/MonthlySpendChart";
import PayablesList from "../components/PayablesList";
import CostTable from "../components/CostTable";
import ContractsSection from "../components/ContractsSection";
import ComplianceSection from "../components/ComplianceSection";
import EstimateVsBilledSection from "../components/EstimateVsBilledSection";
import UnassignedSection from "../components/UnassignedSection";
import WeeklySummarySection from "../components/WeeklySummarySection";
import { useFRAuth } from "../auth/FRAuthProvider";
import { FRDataProvider, useFRData } from "../lib/useFRData";
import { useI18n, fmtCurrency } from "../lib/i18n";
import { periodRange, inPeriod, type PeriodKey } from "../data";

type TabKey = "overview" | "weekly" | "payables" | "ledger";
const TAB_KEYS: TabKey[] = ["overview", "weekly", "payables", "ledger"];

function readTabFromHash(): TabKey {
  if (typeof window === "undefined") return "overview";
  const h = window.location.hash.replace(/^#/, "");
  return (TAB_KEYS as string[]).includes(h) ? (h as TabKey) : "overview";
}

function DashboardInner() {
  const [period, setPeriod] = useState<PeriodKey>("month");
  const [job, setJob] = useState<string>("__ALL__");
  const [customFrom, setCustomFrom] = useState<Date | null>(null);
  const [customTo, setCustomTo] = useState<Date | null>(null);
  const [tab, setTab] = useState<TabKey>(readTabFromHash);
  const { user, signOut } = useFRAuth();
  const { loading, error, data } = useFRData();
  const { t, lang } = useI18n();

  useEffect(() => {
    document.title = lang === "pt" ? "Family Realty — Controle de Custos" : "Family Realty — Cost Control";
  }, [lang]);

  // Persist tab in hash
  useEffect(() => {
    if (window.location.hash.replace(/^#/, "") !== tab) {
      window.history.replaceState(null, "", `#${tab}`);
    }
  }, [tab]);
  useEffect(() => {
    const onHash = () => setTab(readTabFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const range = useMemo(() => periodRange(period, customFrom, customTo), [period, customFrom, customTo]);

  const historyByJob = useMemo(
    () => data.historyItems.filter((h) => job === "__ALL__" || h.job === job || (job === "__UNASSIGNED__" && !h.job)),
    [data.historyItems, job],
  );
  const historyByPeriod = useMemo(
    () => historyByJob.filter((h) => (period === "all" ? true : inPeriod(h.date, range))),
    [historyByJob, range, period],
  );

  const jobsScope = useMemo(
    () => (job === "__ALL__" ? data.jobsMeta : data.jobsMeta.filter((j) => j.name === job)),
    [job, data.jobsMeta],
  );
  const totalBudget = jobsScope.reduce((s, j) => s + j.budget, 0);
  const jobsRealizado = jobsScope.reduce((s, j) => s + j.realizado, 0);
  const totalRealizado = jobsRealizado + (job === "__ALL__" ? data.unassignedTotal : 0);
  const pct = totalBudget > 0 ? (totalRealizado / totalBudget) * 100 : 0;
  const realizadoTone = pct > 100 ? "red" : pct >= 90 ? "gold" : "green";
  const activeCount = jobsScope.filter((j) => j.active).length;

  const payablesScope = useMemo(
    () => data.payables.filter((p) => job === "__ALL__" || p.job === job || (job === "__UNASSIGNED__" && !p.job)),
    [data.payables, job],
  );
  const openPay = payablesScope.reduce((s, p) => s + p.amount, 0);
  const overduePay = payablesScope.filter((p) => p.overdue);
  const overdueSum = overduePay.reduce((s, p) => s + p.amount, 0);

  const missingDate = useMemo(() => {
    if (period === "all") return null;
    const missing = historyByJob.filter((h) => !h.date);
    if (missing.length === 0) return null;
    return { n: missing.length, v: fmtCurrency(missing.reduce((s, i) => s + i.amount, 0)) };
  }, [historyByJob, period]);

  const activeJobMeta = useMemo(
    () => (job !== "__ALL__" ? data.jobsMeta.find((j) => j.name === job) ?? null : null),
    [job, data.jobsMeta],
  );

  const onExportPdf = () => window.print();

  return (
    <div className="family-realty">
      <div className="fr-print-hide"
        style={{ background: "#041C2C", color: "#EAAA00", fontSize: 12, padding: "6px 16px",
                 display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12 }}>
        <span style={{ opacity: 0.85 }}>{user?.email}</span>
        <button onClick={() => signOut()}
          style={{ background: "transparent", color: "#EAAA00", border: "1px solid #EAAA00",
                   padding: "2px 10px", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}>
          {t("signOut")}
        </button>
      </div>

      <FRHeader
        period={period} onPeriodChange={setPeriod}
        job={job} onJobChange={setJob} jobs={data.jobs}
        customFrom={customFrom} customTo={customTo}
        onCustomFromChange={setCustomFrom} onCustomToChange={setCustomTo}
        onExportPdf={onExportPdf}
      />

      <div className="fr-print-only" style={{ padding: "16px 24px", borderBottom: "1px solid var(--fr-border)" }}>
        <div className="fr-heading" style={{ fontSize: 18, color: "var(--fr-navy)" }}>
          {t("title")} — {t("tab_" + tab)}
        </div>
        <div className="fr-muted" style={{ fontSize: 12 }}>
          {t("job")}: {job === "__ALL__" ? t("allJobs") : job} · {t("period_" + (period === "last30" ? "30d" : period === "last3m" ? "3m" : period))} · {new Date().toLocaleString(lang === "pt" ? "pt-BR" : "en-US")}
        </div>
      </div>

      <main className="px-6 py-6 mx-auto" style={{ maxWidth: 1480 }}>
        {loading && <p className="fr-muted" style={{ fontSize: 13, marginBottom: 12 }}>{t("loading")}</p>}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b",
                        padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            <strong>{t("loadFail")}:</strong> {error.message}
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <KpiCard
            label={job === "__ALL__" ? t("kpi_budget_total") : t("kpi_budget_job")}
            value={fmtCurrency(totalBudget)}
            sub={job === "__ALL__" ? `${jobsScope.length} ${t("n_jobs")} (${activeCount} ${t("n_active")})` : job}
          />
          <KpiCard
            label={t("kpi_realizado")}
            value={fmtCurrency(totalRealizado)}
            tone={realizadoTone as "red" | "gold" | "green"}
            sub={totalBudget > 0
              ? (job === "__ALL__" && data.unassignedTotal > 0
                  ? `${Math.round(pct)}% ${t("of_budget")} · ${t("includes_unassigned", { v: fmtCurrency(data.unassignedTotal) })}`
                  : `${Math.round(pct)}% ${t("of_budget")}`)
              : undefined}
          />
          <KpiCard
            label={t("kpi_committed")}
            value={fmtCurrency(data.committed.total)}
            sub={t("kpi_committed_sub")}
          />
          <KpiCard
            label={t("kpi_topay")}
            value={fmtCurrency(openPay)}
            tone="gold"
            sub={`${payablesScope.length} ${t("invoices")}`}
          />
          <KpiCard
            label={t("kpi_overdue")}
            value={fmtCurrency(overdueSum)}
            tone={overduePay.length > 0 ? "red" : "default"}
            sub={`${overduePay.length} ${t("overdue_invoices")}`}
          />
          <KpiCard
            label={t("kpi_unassigned")}
            value={fmtCurrency(data.unassignedTotal)}
            tone={data.unassignedItems.length > 0 ? "gold" : "default"}
            sub={`${data.unassignedItems.length} · ${t("unassigned_sub")}`}
          />
        </section>

        <nav
          className="fr-print-hide flex flex-wrap items-center gap-1 mt-6 mb-2"
          style={{ borderBottom: "1px solid var(--fr-border)" }}
          role="tablist"
        >
          {TAB_KEYS.map((k) => {
            const active = tab === k;
            return (
              <button
                key={k}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(k)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: active ? "3px solid var(--fr-gold)" : "3px solid transparent",
                  color: active ? "var(--fr-navy)" : "var(--fr-muted)",
                  fontWeight: active ? 900 : 700,
                  fontFamily: "Roboto, system-ui, sans-serif",
                  fontSize: 14,
                  padding: "10px 14px",
                  cursor: "pointer",
                  marginBottom: -1,
                }}
              >
                {t("tab_" + k)}
              </button>
            );
          })}
        </nav>

        {tab === "overview" && (
          <>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <BudgetStatusList job={job} jobsMeta={data.jobsMeta} committed={data.committed} />
              <div>
                <MonthlySpendChart items={historyByJob} activeJob={activeJobMeta} />
                {missingDate && (
                  <p className="fr-muted" style={{ fontSize: 11, marginTop: 4 }}>
                    {t("cap_date_missing", missingDate)}
                  </p>
                )}
              </div>
            </section>
            <section className="mt-4">
              <StageDetailTable job={job} budgetLines={data.budgetLines} />
            </section>
          </>
        )}

        {tab === "weekly" && (
          <section className="mt-4">
            <WeeklySummarySection rows={data.weeklyRows} job={job} />
          </section>
        )}

        {tab === "payables" && (
          <>
            <section className="mt-4">
              <PayablesList items={data.payables} job={job} />
            </section>
            <section className="mt-4">
              <ContractsSection items={data.contractRows} job={job} />
            </section>
            <section className="mt-4">
              <EstimateVsBilledSection items={data.evbRows} job={job} />
            </section>
          </>
        )}

        {tab === "ledger" && (
          <>
            <section className="mt-4">
              <UnassignedSection items={data.unassignedItems} />
            </section>
            <section className="mt-6">
              <CostTable items={historyByPeriod} />
              {missingDate && (
                <p className="fr-muted" style={{ fontSize: 11, marginTop: 4 }}>
                  {t("cap_date_missing", missingDate)}
                </p>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default function FRDashboard() {
  return (
    <FRDataProvider>
      <DashboardInner />
    </FRDataProvider>
  );
}
