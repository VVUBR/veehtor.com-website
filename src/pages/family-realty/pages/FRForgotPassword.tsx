import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useFRAuth } from "../auth/FRAuthProvider";

export default function FRForgotPassword() {
  const { requestReset } = useFRAuth();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setMsg(null);
    const { error } = await requestReset(email.trim());
    setBusy(false);
    if (error) setErr(error);
    else setMsg("Se este email existir, enviamos um link para redefinir a senha.");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#041C2C", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#fff", borderRadius: 12, padding: 32 }}>
        <h1 style={{ color: "#041C2C", fontSize: 20, marginBottom: 16 }}>Recuperar senha</h1>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d4d4d4", color: "#041C2C" }}
          />
          {msg && <div style={{ color: "#0a6b3b", fontSize: 13 }}>{msg}</div>}
          {err && <div style={{ color: "#B00020", fontSize: 13 }}>{err}</div>}
          <button
            type="submit"
            disabled={busy}
            style={{ background: "#041C2C", color: "#EAAA00", padding: "12px 16px", borderRadius: 8, fontWeight: 700 }}
          >
            {busy ? "Enviando…" : "ENVIAR LINK"}
          </button>
          <Link to="/family-realty/login" style={{ fontSize: 12, color: "#041C2C", textAlign: "center" }}>
            Voltar ao login
          </Link>
        </form>
      </div>
    </div>
  );
}
