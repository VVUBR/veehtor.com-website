import { useLanguage } from "@/i18n/LanguageContext";

function FlagUS() {
  return (
    <svg viewBox="0 0 60 30" width="22" height="14" aria-hidden="true" style={{ display: "block", borderRadius: 2 }}>
      <clipPath id="us-c"><rect width="60" height="30" rx="2" /></clipPath>
      <g clipPath="url(#us-c)">
        <rect width="60" height="30" fill="#fff" />
        {[0, 2, 4, 6, 8, 10, 12].map((i) => (
          <rect key={i} y={i * (30 / 13)} width="60" height={30 / 13} fill="#b22234" />
        ))}
        <rect width="24" height={30 / 13 * 7} fill="#3c3b6e" />
      </g>
    </svg>
  );
}

function FlagBR() {
  return (
    <svg viewBox="0 0 60 42" width="22" height="14" aria-hidden="true" style={{ display: "block", borderRadius: 2 }}>
      <clipPath id="br-c"><rect width="60" height="42" rx="2" /></clipPath>
      <g clipPath="url(#br-c)">
        <rect width="60" height="42" fill="#009c3b" />
        <polygon points="30,4 56,21 30,38 4,21" fill="#ffdf00" />
        <circle cx="30" cy="21" r="8" fill="#002776" />
      </g>
    </svg>
  );
}

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const btn = (active: boolean): React.CSSProperties => ({
    padding: 2,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    opacity: active ? 1 : 0.55,
    transition: "opacity 0.15s, box-shadow 0.15s",
    borderRadius: 4,
    outline: "none",
    boxShadow: active ? "0 0 0 1.5px currentColor" : "none",
    display: "flex",
    alignItems: "center",
    color: "var(--ink, #111828)",
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-label={t.header.switchToEnglish}
        aria-pressed={language === "en"}
        style={btn(language === "en")}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = language === "en" ? "1" : "0.5")}
      >
        <FlagUS />
      </button>
      <button
        type="button"
        onClick={() => setLanguage("pt")}
        aria-label={t.header.switchToPortuguese}
        aria-pressed={language === "pt"}
        style={btn(language === "pt")}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = language === "pt" ? "1" : "0.5")}
      >
        <FlagBR />
      </button>
    </div>
  );
}
