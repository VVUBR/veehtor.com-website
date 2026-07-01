import { useEffect, useMemo, useState } from "react";
import "../theme.css";
import FRHeader from "../components/FRHeader";
import KpiCard from "../components/KpiCard";
import BudgetStatusList from "../components/BudgetStatusList";
import StageDetailTable from "../components/StageDetailTable";
import MonthlySpendChart from "../components/MonthlySpendChart";
import PayablesList from "../components/PayablesList";
import CostTable from "../components/CostTable";
import { useFRAuth } from "../auth/FRAuthProvider";
import { FRDataProvider, useFRData } from "../lib/useFRData";
import {
  ALL_JOBS,
  countAlerts,
  filterByJob,
  filterByPeriod,
  fmtUSD,
  sumUpcoming30d,
  type JobFilter,
  type PeriodKey,
} from "../data";

function DashboardInner() {
  const [period, setPeriod] = useState<PeriodKey>("month");
  const [job, setJob] = useState<JobFilter>(ALL_JOBS);
  const [customFrom, setCustomFrom] = useState<Date | null>(null);
  const [customTo, setCustomTo] = useState<Date | null>(null);
  const { user, signOut } = useFRAuth();
  const { loading, error, jobs, jobsMeta, costItems } = useFRData();

  useEffect(() => {
    const prev = document.title;
    document.title = "Family Realty — Cost Control";
    return () => {
      document.title = prev;
    };
  }, []);

  const jobItems = useMemo(() => filterByJob(costItems, job), [costItems, job]);
  const periodItems = useMemo(
    () => filterByPeriod(jobItems, period, customFrom, customTo),
    [jobItems, period, customFrom, customTo],
  );

  const jobsScope = useMemo(
    () => (job === ALL_JOBS ? jobsMeta : jobsMeta.filter((j) => j.name === job)),
    [job, jobsMeta],
  );
  const totalBudget = jobsScope.reduce((s, j) => s + j.budget, 0);
  const totalRealizado = jobsScope.reduce((s, j) => s + j.realizado, 0);
  const pctConsumed = totalBudget > 0 ? Math.round((totalRealizado / totalBudget) * 100) : 0;

  const upcoming = useMemo(() => sumUpcoming30d(jobItems), [jobItems]);
  const alerts = useMemo(() => countAlerts(jobItems), [jobItems]);

  return (
    <div className="family-realty">
      <div
        style={{
          background: "#041C2C",
          color: "#EAAA00",
          fontSize: 12,
          padding: "6px 16px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ opacity: 0.85 }}>{user?.email}</span>
        <button
          onClick={() => signOut()}
          style={{
            background: "transparent",
            color: "#EAAA00",
            border: "1px solid #EAAA00",
            padding: "2px 10px",
            borderRadius: 6,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </div>

      <FRHeader
        period={period}
        onPeriodChange={setPeriod}
        job={job}
        onJobChange={setJob}
        jobs={jobs}
        customFrom={customFrom}
        customTo={customTo}
        onCustomFromChange={setCustomFrom}
        onCustomToChange={setCustomTo}
      />

      <main className="px-6 py-6 mx-auto" style={{ maxWidth: 1480 }}>
        {loading && (
          <p className="fr-muted" style={{ fontSize: 13, marginBottom: 12 }}>
            Carregando dados do banco…
          </p>
        )}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              padding: 12,
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            <strong>Falha ao carregar dados:</strong> {error.message}
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label={job === ALL_JOBS ? "Budget total (estimate)" : "Budget da obra"}
            value={fmtUSD(totalBudget)}
            sub={job === ALL_JOBS ? `${jobsScope.length} obras` : job}
          />
          <KpiCard
            label="Realizado (pago)"
            value={fmtUSD(totalRealizado)}
            sub={totalBudget > 0 ? `${pctConsumed}% do budget` : "Sem estimate para comparar"}
          />
          <KpiCard
            label="A pagar (próximos 30 dias)"
            value={fmtUSD(upcoming)}
            tone="gold"
          />
          <KpiCard
            label="Pagamentos em atraso"
            value={alerts}
            sub="faturas vencidas em aberto"
            tone={alerts > 0 ? "red" : "default"}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <BudgetStatusList job={job} jobsMeta={jobsMeta} />
          <MonthlySpendChart items={jobItems.filter((i) => i.status === "Pago")} />
        </section>

        <section className="mt-4">
          <StageDetailTable job={job} items={periodItems} />
        </section>

        <section className="mt-4">
          <PayablesList items={jobItems} />
        </section>

        <section className="mt-6">
          <CostTable items={periodItems} jobs={jobs} />
        </section>
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
