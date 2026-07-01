import { useEffect, useMemo, useState } from "react";
import "../theme.css";
import FRHeader from "../components/FRHeader";
import KpiCard from "../components/KpiCard";
import BudgetStatusList from "../components/BudgetStatusList";
import StageDetailTable from "../components/StageDetailTable";
import MonthlySpendChart from "../components/MonthlySpendChart";
import PayablesList from "../components/PayablesList";
import CostTable from "../components/CostTable";
import LiveDataSection from "../components/LiveDataSection";
import { useFRAuth } from "../auth/FRAuthProvider";
import {
  ALL_JOBS,
  COST_ITEMS,
  countAlerts,
  expiringCompliance,
  filterByJob,
  filterByPeriod,
  fmtUSD,
  jobsMetaFor,
  sumUpcoming30d,
  type JobFilter,
  type PeriodKey,
} from "../data";

export default function FRDashboard() {
  const [period, setPeriod] = useState<PeriodKey>("month");
  const [job, setJob] = useState<JobFilter>(ALL_JOBS);
  const [customFrom, setCustomFrom] = useState<Date | null>(null);
  const [customTo, setCustomTo] = useState<Date | null>(null);
  const { user, signOut } = useFRAuth();

  useEffect(() => {
    const prev = document.title;
    document.title = "Family Realty — Cost Control";
    return () => {
      document.title = prev;
    };
  }, []);

  const jobItems = useMemo(() => filterByJob(COST_ITEMS, job), [job]);
  const periodItems = useMemo(
    () => filterByPeriod(jobItems, period, customFrom, customTo),
    [jobItems, period, customFrom, customTo],
  );

  const jobsScope = useMemo(() => jobsMetaFor(job), [job]);
  const totalBudget = jobsScope.reduce((s, j) => s + j.budget, 0);
  const totalRealizado = jobsScope.reduce((s, j) => s + j.realizado, 0);
  const pctConsumed = totalBudget > 0 ? Math.round((totalRealizado / totalBudget) * 100) : 0;

  const variations: Record<PeriodKey, { text: string; good: boolean; dir: "up" | "down" }> = {
    week: { text: "3.2% vs semana anterior", good: true, dir: "down" },
    month: { text: "1.8% vs mês anterior", good: false, dir: "up" },
    next12w: { text: "Plano em linha", good: true, dir: "down" },
    all: { text: "Sob controle no agregado", good: true, dir: "down" },
    custom: { text: "Intervalo personalizado", good: true, dir: "down" },
  };

  const upcoming = useMemo(() => sumUpcoming30d(jobItems), [jobItems]);
  const alerts = useMemo(() => countAlerts(jobItems), [jobItems]);
  const compl = useMemo(() => expiringCompliance(30), []);

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
      />

      <main className="px-6 py-6 mx-auto" style={{ maxWidth: 1480 }}>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard
            label={job === ALL_JOBS ? "Budget total (obras ativas)" : "Budget da obra"}
            value={fmtUSD(totalBudget)}
            sub={job === ALL_JOBS ? `${jobsScope.length} obras` : job}
          />
          <KpiCard
            label="Realizado"
            value={fmtUSD(totalRealizado)}
            sub={`${pctConsumed}% do budget`}
            trend={variations[period]}
          />
          <KpiCard
            label="A desembolsar (próximos 30 dias)"
            value={fmtUSD(upcoming)}
            tone="gold"
          />
          <KpiCard
            label="Pagamentos em alerta"
            value={alerts}
            sub="atrasados ou fora dos termos"
            tone={alerts > 0 ? "red" : "default"}
          />
          <KpiCard
            label="Compliance a vencer (30 dias)"
            value={compl}
            sub="Insurance / W-9"
            tone={compl > 0 ? "red" : "default"}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <BudgetStatusList job={job} />
          <MonthlySpendChart items={jobItems} />
        </section>

        <section className="mt-4">
          <StageDetailTable job={job} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <PayablesList items={jobItems} />
          <div className="fr-card p-5">
            <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", marginBottom: 12 }}>
              Compliance a vencer
            </h3>
            <ul style={{ fontSize: 14 }}>
              <li className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--fr-border)" }}>
                <span>Rivera Electric LLC — Insurance</span>
                <span style={{ color: "var(--fr-red)", fontWeight: 700 }}>vence em 11 dias</span>
              </li>
              <li className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--fr-border)" }}>
                <span>Coastal Plumbing Co — W-9</span>
                <span style={{ color: "var(--fr-red)", fontWeight: 700 }}>vence em 22 dias</span>
              </li>
              <li className="flex justify-between py-2">
                <span>Granite State Framing — Insurance</span>
                <span style={{ color: "var(--fr-red)", fontWeight: 700 }}>vence em 28 dias</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-6">
          <CostTable items={periodItems} />
        </section>

        <section className="mt-6">
          <LiveDataSection />
        </section>

        <p
          className="fr-muted"
          style={{ fontSize: 12, textAlign: "center", marginTop: 32, marginBottom: 16 }}
        >
          KPIs e gráficos acima ainda usam mock. A seção "Dados ao vivo" consulta o banco real. Após validar o schema das views, mapeamos os KPIs para os dados reais.
        </p>
      </main>
    </div>
  );
}
