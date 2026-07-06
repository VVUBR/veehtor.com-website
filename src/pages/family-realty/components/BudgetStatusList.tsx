import { useI18n, fmtCurrency, fmtDateLocale } from "../lib/i18n";
import { today0, type JobMeta, type CommittedContracts } from "../data";

function statusFor(pct: number, t: (k: string) => string) {
  if (pct > 100) return { key: "over_budget", label: t("over_budget"), color: "var(--fr-red)" };
  if (pct >= 90) return { key: "near_limit", label: t("near_limit"), color: "var(--fr-gold)" };
  return { key: "within_budget", label: t("within_budget"), color: "var(--fr-green)" };
}

function monthsBetween(a: Date, b: Date) {
  return Math.max(1, (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1);
}

export default function BudgetStatusList({
  job,
  jobsMeta,
  committed,
}: {
  job: string;
  jobsMeta: JobMeta[];
  committed?: CommittedContracts;
}) {
  const { t, lang } = useI18n();
  const scope = job === "__ALL__" ? jobsMeta : jobsMeta.filter((j) => j.name === job);
  const rows = [...scope].sort((a, b) => b.pctConsumed - a.pctConsumed);

  return (
    <div className="fr-card p-5 h-full">
      <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", marginBottom: 16 }}>
        {t("sec_budget_status")}
      </h3>

      <div className="flex flex-col gap-4">
        {rows.map((r) => {
          const st = statusFor(r.pctConsumed, t);
          const committedRemain = committed?.byProject.get(r.name) ?? 0;
          const projection = r.realizado + committedRemain;
          const denom = Math.max(r.budget, projection, 1);
          const realPctVisual = Math.min((r.realizado / denom) * 100, 100);
          const commPctVisual = Math.min((committedRemain / denom) * 100, 100 - realPctVisual);
          const over = Math.max(r.pctConsumed - 100, 0);
          const endDate = r.dateFinished || today0();
          const months = r.dateStarted ? monthsBetween(r.dateStarted, endDate) : 0;
          const burn = months > 0 ? r.realizado / months : 0;
          const pctProjection = r.budget > 0 ? (projection / r.budget) * 100 : 0;

          const tooltip = [
            `${t("th_budget")}: ${fmtCurrency(r.budget)}`,
            `${t("th_realizado")}: ${fmtCurrency(r.realizado)}`,
            `${t("budget_committed_remaining")}: ${fmtCurrency(committedRemain)}`,
            `${t("budget_projection")}: ${fmtCurrency(projection)} (${Math.round(pctProjection)}%)`,
            `${Math.round(r.pctConsumed)}% ${t("of_budget")}`,
          ].join("\n");

          return (
            <div key={r.name} className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div style={{ width: 160, fontSize: 13, fontWeight: 700, color: "var(--fr-navy)" }}>
                  {r.name}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                  background: r.active ? "rgba(46,125,82,0.12)" : "rgba(128,128,128,0.12)",
                  color: r.active ? "var(--fr-green)" : "var(--fr-muted)",
                }}>
                  {r.active ? t("active") : t("completed")}
                </span>
                <div
                  title={tooltip}
                  style={{
                    flex: 1, position: "relative", height: 14,
                    background: "var(--fr-surface)", borderRadius: 4, overflow: "visible",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, width: `${realPctVisual}%`, background: st.color, borderRadius: 4 }} />
                  {commPctVisual > 0 && (
                    <div style={{
                      position: "absolute", top: 0, bottom: 0,
                      left: `${realPctVisual}%`, width: `${commPctVisual}%`,
                      background: st.color, opacity: 0.4,
                      borderTopRightRadius: 4, borderBottomRightRadius: 4,
                    }} />
                  )}
                  {over > 0 && (
                    <div style={{
                      position: "absolute", top: -2, left: "100%", height: 18,
                      width: `${Math.min(over, 40)}%`,
                      background: "repeating-linear-gradient(45deg, var(--fr-red), var(--fr-red) 4px, #8a0200 4px, #8a0200 8px)",
                      borderRadius: 4,
                    }} />
                  )}
                </div>
                <div style={{
                  width: 64, minWidth: 64, flexShrink: 0, textAlign: "right",
                  fontFamily: "Roboto", fontWeight: 900, fontSize: 15, color: st.color,
                  fontVariantNumeric: "tabular-nums",
                  position: "relative", zIndex: 2, background: "var(--fr-bg)", paddingLeft: 4,
                }} title={`${fmtCurrency(r.realizado)} / ${fmtCurrency(r.budget)}`}>
                  {`${Math.round(r.pctConsumed)}%`}
                </div>
                <div style={{ width: 150, minWidth: 150, flexShrink: 0, textAlign: "right", fontSize: 12, fontWeight: 700, color: st.color, position: "relative", zIndex: 2, background: "var(--fr-bg)" }}>
                  {st.label}
                </div>
              </div>
              <div style={{ paddingLeft: 172, fontSize: 11, color: "var(--fr-muted)" }}>
                {r.dateStarted
                  ? <>{t("since")} {fmtDateLocale(r.dateStarted, lang)} · {fmtCurrency(burn)} {t("monthly_avg")}</>
                  : <>{t("period_unknown")}</>}
                {committedRemain > 0 && (
                  <> · {t("budget_committed_remaining")}: <strong style={{ color: "var(--fr-navy)" }}>{fmtCurrency(committedRemain)}</strong></>
                )}
              </div>
            </div>
          );
        })}
        {rows.length === 0 && (
          <div className="fr-muted" style={{ fontSize: 13, padding: 12 }}>{t("empty_none")}</div>
        )}
      </div>

      {committed && committed.unassignedAmount > 0 && job === "__ALL__" && (
        <div style={{
          marginTop: 16, padding: "8px 12px", borderRadius: 6,
          background: "rgba(234,170,0,0.10)", color: "var(--fr-navy)", fontSize: 12,
        }}>
          {t("committed_no_project", {
            v: fmtCurrency(committed.unassignedAmount),
            n: committed.unassignedCount,
          })}
        </div>
      )}
    </div>
  );
}
