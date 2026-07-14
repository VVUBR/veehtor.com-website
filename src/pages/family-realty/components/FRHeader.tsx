import { useI18n, type Lang } from "../lib/i18n";
import { type ProjectStatusFilter } from "../data";

export default function FRHeader({
  job, onJobChange, jobs,
  projectStatus, onProjectStatusChange,
  onExportPdf,
}: {
  job: string;
  onJobChange: (j: string) => void;
  jobs: string[];
  projectStatus: ProjectStatusFilter;
  onProjectStatusChange: (s: ProjectStatusFilter) => void;
  onExportPdf: () => void;
}) {

  const { t, lang, setLang } = useI18n();

  return (
    <header
      className="fr-print-hide w-full px-6 py-4 flex flex-col gap-3"
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
          {t("brand")}
        </div>

        <h1 className="flex-1 text-center" style={{ fontSize: 20, margin: 0, color: "#fff" }}>
          {t("title")}
        </h1>

        <div className="flex items-center gap-2">
          <LangFlag current={lang} code="pt" onClick={() => setLang("pt")} />
          <LangFlag current={lang} code="en" onClick={() => setLang("en")} />
          <button className="fr-btn" onClick={onExportPdf} style={{ borderColor: "#EAAA00", color: "#EAAA00" }}>
            {t("exportPdf")}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2" style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
          {t("job")}
          <select
            className="fr-select"
            value={job}
            onChange={(e) => onJobChange(e.target.value)}
            style={{ minWidth: 200 }}
          >
            <option value="__ALL__">{t("allJobs")}</option>
            {jobs.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2" style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
          {t("job_status_filter")}
          <select
            className="fr-select"
            value={projectStatus}
            onChange={(e) => onProjectStatusChange(e.target.value as ProjectStatusFilter)}
            style={{ minWidth: 150 }}
          >
            <option value="active">{t("job_status_active")}</option>
            <option value="finished">{t("job_status_finished")}</option>
            <option value="all">{t("job_status_all")}</option>
          </select>
        </label>
      </div>
    </header>
  );
}

function LangFlag({ code, current, onClick }: { code: Lang; current: Lang; onClick: () => void }) {
  const active = code === current;
  return (
    <button
      onClick={onClick}
      title={code === "pt" ? "Português" : "English"}
      style={{
        background: "transparent",
        border: active ? "2px solid #EAAA00" : "2px solid transparent",
        borderRadius: 4, padding: 2, cursor: "pointer", lineHeight: 0,
        opacity: active ? 1 : 0.6,
      }}
    >
      {code === "pt" ? <BRFlag /> : <USFlag />}
    </button>
  );
}
function BRFlag() {
  return (
    <svg width="24" height="16" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="16" fill="#009c3b" />
      <polygon points="12,2 22,8 12,14 2,8" fill="#ffdf00" />
      <circle cx="12" cy="8" r="3" fill="#002776" />
    </svg>
  );
}
function USFlag() {
  return (
    <svg width="24" height="16" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="16" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12, 14].map((y) => (
        <rect key={y} y={y} width="24" height="1.23" fill="#b22234" />
      ))}
      <rect width="10" height="7" fill="#3c3b6e" />
    </svg>
  );
}
