import { ALL_JOBS, JOBS, type JobFilter, type PeriodKey } from "../data";

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "week", label: "Esta semana" },
  { key: "month", label: "Este mês" },
  { key: "next12w", label: "Próximas 12 semanas" },
  { key: "all", label: "Tudo" },
];

export default function FRHeader({
  period,
  onPeriodChange,
  job,
  onJobChange,
}: {
  period: PeriodKey;
  onPeriodChange: (p: PeriodKey) => void;
  job: JobFilter;
  onJobChange: (j: JobFilter) => void;
}) {
  return (
    <header
      className="w-full px-6 py-4 flex flex-wrap items-center gap-4"
      style={{ background: "var(--fr-navy)", color: "#fff" }}
    >
      <div
        className="flex items-center justify-center px-4 py-2 fr-heading"
        style={{
          border: "1px solid rgba(255,255,255,0.4)",
          borderRadius: 6,
          fontSize: 15,
          letterSpacing: "0.05em",
          minWidth: 170,
        }}
      >
        FAMILY REALTY
      </div>

      <h1 className="flex-1 text-center" style={{ fontSize: 20, margin: 0, color: "#fff" }}>
        Controle de Custos por Obra
      </h1>

      <div className="flex items-center gap-2">
        <label
          className="flex items-center gap-2"
          style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}
        >
          Obra
          <select
            className="fr-select"
            value={job}
            onChange={(e) => onJobChange(e.target.value as JobFilter)}
            style={{ minWidth: 160 }}
          >
            <option value={ALL_JOBS}>{ALL_JOBS}</option>
            {JOBS.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
        </label>

        {PERIODS.map((p) => (
          <button
            key={p.key}
            className={`fr-btn ${period === p.key ? "fr-btn-active" : ""}`}
            onClick={() => onPeriodChange(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </header>
  );
}
