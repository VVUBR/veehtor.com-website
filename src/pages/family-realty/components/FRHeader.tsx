import { ALL_JOBS, type JobFilter, type PeriodKey } from "../data";

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "week", label: "Esta semana" },
  { key: "month", label: "Este mês" },
  { key: "next12w", label: "Próximas 12 semanas" },
  { key: "all", label: "Tudo" },
  { key: "custom", label: "Personalizado" },
];

function toInputValue(d: Date | null): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function FRHeader({
  period,
  onPeriodChange,
  job,
  onJobChange,
  jobs,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
}: {
  period: PeriodKey;
  onPeriodChange: (p: PeriodKey) => void;
  job: JobFilter;
  onJobChange: (j: JobFilter) => void;
  jobs: string[];
  customFrom: Date | null;
  customTo: Date | null;
  onCustomFromChange: (d: Date | null) => void;
  onCustomToChange: (d: Date | null) => void;
}) {
  return (
    <header
      className="w-full px-6 py-4 flex flex-col gap-3"
      style={{ background: "var(--fr-navy)", color: "#fff" }}
    >
      <div className="flex flex-wrap items-center gap-4">
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

        <div className="flex items-center gap-2 flex-wrap">
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
              {jobs.map((j) => (
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
      </div>

      {period === "custom" && (
        <div
          className="flex flex-wrap items-center gap-3 self-end"
          style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}
        >
          <label className="flex items-center gap-2">
            De
            <input
              type="date"
              value={toInputValue(customFrom)}
              onChange={(e) =>
                onCustomFromChange(e.target.value ? new Date(e.target.value + "T00:00:00") : null)
              }
              style={{
                background: "#fff",
                color: "#041C2C",
                border: "1px solid rgba(255,255,255,0.4)",
                borderRadius: 6,
                padding: "4px 8px",
                fontSize: 12,
              }}
            />
          </label>
          <label className="flex items-center gap-2">
            Até
            <input
              type="date"
              value={toInputValue(customTo)}
              onChange={(e) =>
                onCustomToChange(e.target.value ? new Date(e.target.value + "T00:00:00") : null)
              }
              style={{
                background: "#fff",
                color: "#041C2C",
                border: "1px solid rgba(255,255,255,0.4)",
                borderRadius: 6,
                padding: "4px 8px",
                fontSize: 12,
              }}
            />
          </label>
          {(customFrom || customTo) && (
            <button
              type="button"
              onClick={() => {
                onCustomFromChange(null);
                onCustomToChange(null);
              }}
              style={{
                background: "transparent",
                color: "#EAAA00",
                border: "1px solid #EAAA00",
                padding: "3px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Limpar
            </button>
          )}
        </div>
      )}
    </header>
  );
}
