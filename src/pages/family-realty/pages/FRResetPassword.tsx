import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFRAuth } from "../auth/FRAuthProvider";

export default function FRResetPassword() {
  const { updatePassword } = useFRAuth();
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setErr("Mínimo 8 caracteres.");
    if (password !== confirm) return setErr("As senhas não coincidem.");
    setBusy(true);
    setErr(null);
    const { error } = await updatePassword(password);
    setBusy(false);
    if (error) setErr(error);
    else nav("/family-realty", { replace: true });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#041C2C", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#fff", borderRadius: 12, padding: 32 }}>
        <h1 style={{ color: "#041C2C", fontSize: 20, marginBottom: 16 }}>Definir nova senha</h1>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nova senha"
            style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d4d4d4", color: "#041C2C" }}
          />
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirmar senha"
            style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d4d4d4", color: "#041C2C" }}
          />
          {err && <div style={{ color: "#B00020", fontSize: 13 }}>{err}</div>}
          <button
            type="submit"
            disabled={busy}
            style={{ background: "#041C2C", color: "#EAAA00", padding: "12px 16px", borderRadius: 8, fontWeight: 700 }}
          >
            {busy ? "Salvando…" : "SALVAR"}
          </button>
        </form>
      </div>
    </div>
  );
}
