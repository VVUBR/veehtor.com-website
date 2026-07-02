import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useFRAuth } from "../auth/FRAuthProvider";
import { useI18n, type Lang } from "../lib/i18n";
import "../theme.css";

export default function FRLogin() {
  const { signIn, session } = useFRAuth();
  const { lang, setLang, t } = useI18n();
  const nav = useNavigate();
  const loc = useLocation() as { state?: { from?: string } };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) nav(loc.state?.from || "/family-realty", { replace: true });
  }, [session, nav, loc.state]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) setErr(error);
    else nav(loc.state?.from || "/family-realty", { replace: true });
  }

  return (
    <div
      className="family-realty"
      style={{
        minHeight: "100vh",
        background: "#041C2C",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 12,
          padding: 32,
          boxShadow: "0 20px 60px rgba(0,0,0,.35)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 8 }}>
          <LangBtn code="pt" cur={lang} onClick={() => setLang("pt")} />
          <LangBtn code="en" cur={lang} onClick={() => setLang("en")} />
        </div>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ color: "#EAAA00", fontWeight: 800, letterSpacing: 2, fontSize: 12 }}>
            FAMILY REALTY HOLDINGS
          </div>
          <h1 className="fr-heading" style={{ color: "#041C2C", fontSize: 22, marginTop: 6 }}>
            {lang === "pt" ? "Controle de Custos" : "Cost Control"}
          </h1>
        </div>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6, fontSize: 13, color: "#041C2C" }}>
            {lang === "pt" ? "Email" : "Email"}
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 13, color: "#041C2C" }}>
            {lang === "pt" ? "Senha" : "Password"}
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
          {err && (
            <div style={{ color: "#B00020", fontSize: 13, background: "#FDECEC", padding: 8, borderRadius: 6 }}>
              {err}
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            style={{
              background: "#041C2C",
              color: "#EAAA00",
              padding: "12px 16px",
              borderRadius: 8,
              fontWeight: 700,
              letterSpacing: 1,
              opacity: busy ? 0.7 : 1,
              cursor: busy ? "wait" : "pointer",
            }}
          >
            {busy ? (lang === "pt" ? "Entrando…" : "Signing in…") : lang === "pt" ? "ENTRAR" : "SIGN IN"}
          </button>
          <Link
            to="/family-realty/forgot-password"
            style={{ fontSize: 12, color: "#041C2C", textAlign: "center", marginTop: 4 }}
          >
            {lang === "pt" ? "Esqueci minha senha" : "Forgot password"}
          </Link>
        </form>
        <span style={{ display: "none" }}>{t("brand")}</span>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #d4d4d4",
  fontSize: 14,
  outline: "none",
  background: "#fff",
  color: "#041C2C",
};

function LangBtn({ code, cur, onClick }: { code: Lang; cur: Lang; onClick: () => void }) {
  const active = code === cur;
  return (
    <button type="button" onClick={onClick} title={code === "pt" ? "Português" : "English"}
      style={{ background: "transparent", border: active ? "2px solid #EAAA00" : "2px solid transparent",
               borderRadius: 4, padding: 2, cursor: "pointer", lineHeight: 0, opacity: active ? 1 : 0.55 }}>
      {code === "pt" ? (
        <svg width="22" height="14" viewBox="0 0 24 16"><rect width="24" height="16" fill="#009c3b"/><polygon points="12,2 22,8 12,14 2,8" fill="#ffdf00"/><circle cx="12" cy="8" r="3" fill="#002776"/></svg>
      ) : (
        <svg width="22" height="14" viewBox="0 0 24 16"><rect width="24" height="16" fill="#fff"/>{[0,2,4,6,8,10,12,14].map((y)=>(<rect key={y} y={y} width="24" height="1.23" fill="#b22234"/>))}<rect width="10" height="7" fill="#3c3b6e"/></svg>
      )}
    </button>
  );
}
