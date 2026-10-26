import { useEffect, useRef, useState, FormEvent } from "react";
import { Download, FileDown, ListChecks, Monitor, ShieldCheck, KeyRound } from "lucide-react";

const BASE = "https://wbaskuadfihosvyweqyt.supabase.co";
const RPC_URL = `${BASE}/rest/v1/rpc/observer_convite_download`;
const SIGNUP_URL = `${BASE}/auth/v1/signup`;
const STORAGE_URL = `${BASE}/storage/v1/object/authenticated/observer-windows/`;
const API_KEY = "sb_publishable_40T-hu1QTtRNN7xloUCIPA_w5mOF1Fy";

type Sistema = "mac" | "windows";
type Parte = { objeto: string; sha256: string; tamanho: number };
type Ok = {
  ok: true;
  nome: string;
  versao: string;
  arquivo: string;
  tamanho: number;
  link?: string;
  sha256?: string;
  partes?: Parte[];
};

const MSG_DEFAULT = "Código não encontrado ou vencido. Confira as letras ou peça um convite novo à Veehtor.";
const MSG_PREPARO = "Não consegui preparar o download. Atualize a página e tente de novo.";
const MSG_EXPIROU = "O tempo para baixar acabou. Digite o código de novo.";
const MSG_INCOMPLETO = "O download veio incompleto. Tente de novo.";
const MSGS: Record<string, string> = {
  limite_de_downloads: "Este convite já foi baixado 3 vezes. Peça um convite novo à Veehtor.",
  muitas_tentativas: "Muitas tentativas erradas. Espere uma hora e tente de novo.",
  sem_versao_publicada: "Estamos atualizando o instalador. Tente de novo em alguns minutos.",
  precisa_login_anonimo: MSG_PREPARO,
};

function normalize(v: string) {
  const raw = v.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return raw.length === 12 ? raw.match(/.{4}/g)!.join("-") : v.trim().toUpperCase();
}

function detect(): { sistema: Sistema; certo: boolean } {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const s = `${nav.userAgentData?.platform || ""} ${nav.userAgent || ""}`;
  if (/Windows/i.test(s)) return { sistema: "windows", certo: true };
  if (/Macintosh|Mac OS|macOS/i.test(s) && !/iPhone|iPad|Mobile/i.test(s)) return { sistema: "mac", certo: true };
  return { sistema: "mac", certo: false };
}

const STEPS: Record<Sistema, { icon: typeof FileDown; t: string; d: string }[]> = {
  mac: [
    { icon: FileDown, t: "Abra o arquivo baixado", d: "Se o Mac disser que não pode abrir porque o desenvolvedor não foi verificado: abra Ajustes do Sistema, Privacidade e Segurança, role até o fim e clique em Abrir assim mesmo." },
    { icon: ListChecks, t: "Siga o instalador", d: "Continuar, Instalar e a senha do seu Mac. Leva 1 minuto." },
    { icon: Monitor, t: "O robô aparece no topo da tela", d: "Digite o seu código de convite e siga os passos: autorizar a coleta, conectar a agenda, conectar o Chrome e conectar a sua IA (Claude ou ChatGPT). As atualizações chegam pelo próprio robô." },
  ],
  windows: [
    { icon: FileDown, t: "Abra o arquivo baixado", d: "Se aparecer a tela azul 'O Windows protegeu o seu PC', clique em Mais informações e depois em Executar assim mesmo. Isso acontece porque o instalador ainda não tem certificado da Microsoft." },
    { icon: ListChecks, t: "Confirme a instalação", d: "Clique em Sim. Leva cerca de 1 minuto e não pede senha de administrador." },
    { icon: Monitor, t: "O robô aparece perto do relógio", d: "Digite o seu código de convite e siga os passos: autorizar a coleta, conectar a agenda, conectar o Chrome e conectar a sua IA (Claude ou ChatGPT). Se não vir o robô, clique na setinha ^ ao lado do relógio. As atualizações chegam pelo próprio robô." },
  ],
};

const LABEL: Record<Sistema, string> = { mac: "Mac", windows: "Windows" };

class Expirou extends Error {}

async function fetchParte(parte: Parte, token: string, onBytes: (n: number) => void): Promise<Uint8Array> {
  let lastErr: unknown;
  for (let tentativa = 0; tentativa < 3; tentativa++) {
    let recebidos = 0;
    try {
      const res = await fetch(STORAGE_URL + parte.objeto, {
        headers: { apikey: API_KEY, Authorization: "Bearer " + token },
      });
      if (res.status === 400 || res.status === 401 || res.status === 403) throw new Expirou();
      if (!res.ok || !res.body) throw new Error("falha");
      const reader = res.body.getReader();
      const chunks: Uint8Array[] = [];
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        recebidos += value.length;
        onBytes(value.length);
      }
      const out = new Uint8Array(recebidos);
      let off = 0;
      for (const c of chunks) { out.set(c, off); off += c.length; }
      return out;
    } catch (e) {
      if (e instanceof Expirou) throw e;
      onBytes(-recebidos);
      lastErr = e;
    }
  }
  throw lastErr;
}

export default function Observer() {
  const [det] = useState(detect);
  const [sistema, setSistema] = useState<Sistema>(det.sistema);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<Ok | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [dlMsg, setDlMsg] = useState("");
  const [dlErr, setDlErr] = useState("");
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    document.title = "Veehtor Observer";
  }, []);

  async function chamar(sis: Sistema): Promise<{ ok: true; data: Ok } | { ok: false; msg: string }> {
    const headers: Record<string, string> = { apikey: API_KEY, "Content-Type": "application/json" };
    if (sis === "windows") {
      try {
        const s = await fetch(SIGNUP_URL, {
          method: "POST",
          headers: { apikey: API_KEY, "Content-Type": "application/json" },
          body: "{}",
        }).then((r) => r.json());
        if (!s?.access_token) return { ok: false, msg: MSG_PREPARO };
        tokenRef.current = s.access_token;
      } catch {
        return { ok: false, msg: MSG_PREPARO };
      }
      headers.Authorization = "Bearer " + tokenRef.current;
    }
    try {
      const res = await fetch(RPC_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ p_codigo: normalize(code), p_sistema: sis }),
      });
      const json = await res.json();
      if (json && json.ok === true) return { ok: true, data: json as Ok };
      return { ok: false, msg: (json && MSGS[json.motivo]) || MSG_DEFAULT };
    } catch {
      return { ok: false, msg: MSG_DEFAULT };
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!code.trim() || loading) return;
    setLoading(true);
    setError("");
    const r = await chamar(sistema);
    if (r.ok) setData(r.data);
    else setError(r.msg);
    setLoading(false);
  }

  async function trocar() {
    if (loading || progress !== null) return;
    const outro: Sistema = sistema === "mac" ? "windows" : "mac";
    setLoading(true);
    setDlErr("");
    setDlMsg("");
    const r = await chamar(outro);
    if (r.ok) {
      setSistema(outro);
      setData(r.data);
    } else setDlErr(r.msg);
    setLoading(false);
  }

  function voltarAoCodigo(msg: string) {
    setData(null);
    setProgress(null);
    setDlMsg("");
    setDlErr("");
    tokenRef.current = null;
    setError(msg);
  }

  async function baixarWindows() {
    if (!data?.partes || !tokenRef.current || progress !== null) return;
    const token = tokenRef.current;
    const total = data.partes.reduce((a, p) => a + Number(p.tamanho), 0) || Number(data.tamanho) || 1;
    let recebidos = 0;
    setDlErr("");
    setDlMsg("");
    setProgress(0);
    try {
      const pedacos: Uint8Array[] = [];
      for (const parte of data.partes) {
        pedacos.push(
          await fetchParte(parte, token, (n) => {
            recebidos += n;
            setProgress(Math.min(100, Math.floor((recebidos / total) * 100)));
          }),
        );
      }
      const tam = pedacos.reduce((a, p) => a + p.length, 0);
      const tudo = new Uint8Array(tam);
      let off = 0;
      for (const p of pedacos) { tudo.set(p, off); off += p.length; }
      const hash = await crypto.subtle.digest("SHA-256", tudo);
      const hex = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
      if (hex !== String(data.sha256 || "").toLowerCase()) {
        setProgress(null);
        setDlErr(MSG_INCOMPLETO);
        return;
      }
      const url = URL.createObjectURL(new Blob([tudo], { type: "application/octet-stream" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = data.arquivo || "Instalar Veehtor Observer.exe";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setProgress(null);
      setDlMsg("Pronto: o arquivo está na sua pasta Downloads.");
    } catch (e) {
      if (e instanceof Expirou) voltarAoCodigo(MSG_EXPIROU);
      else {
        setProgress(null);
        setDlErr(MSG_INCOMPLETO);
      }
    }
  }

  const outro: Sistema = sistema === "mac" ? "windows" : "mac";
  const mb = data ? Math.round(Number(data.tamanho) / 1048576) : 0;
  const bigBtn = "inline-flex items-center justify-center gap-2 w-full rounded-xl bg-primary text-primary-foreground px-6 py-4 text-lg font-semibold disabled:opacity-60";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-14 md:py-20">
        <header className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Veehtor Observer</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Entenda para onde vai o seu tempo de trabalho e onde dá para melhorar. Tudo fica no seu computador.
          </p>
        </header>

        <section className="rounded-2xl border border-border bg-card p-6 md:p-8 mb-10">
          {!data ? (
            <form onSubmit={submit} className="space-y-4">
              <label htmlFor="codigo" className="block text-sm font-medium">Código do convite</label>
              <input
                id="codigo"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="A1B2-C3D4-E5F6"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg tracking-widest uppercase outline-none focus:ring-2 focus:ring-ring"
              />
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-semibold disabled:opacity-50"
              >
                {loading ? "Verificando..." : "Continuar"}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-5">
              <p className="text-2xl font-serif">Olá, {data.nome}!</p>
              {sistema === "mac" ? (
                <a href={data.link} className={bigBtn}>
                  <Download className="h-5 w-5" />
                  Baixar para Mac
                </a>
              ) : (
                <button type="button" onClick={baixarWindows} disabled={progress !== null} className={bigBtn}>
                  <Download className="h-5 w-5" />
                  {progress !== null ? `Baixando… ${progress}%` : "Baixar para Windows"}
                </button>
              )}
              {progress !== null && (
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
                  <div className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
                </div>
              )}
              <p className="text-sm text-muted-foreground">Versão {data.versao} · {mb} MB</p>
              {dlMsg && <p role="status" className="text-sm font-medium text-primary">{dlMsg}</p>}
              {dlErr && <p role="alert" className="text-sm text-destructive">{dlErr}</p>}
              {det.certo ? (
                <button
                  type="button"
                  onClick={trocar}
                  disabled={loading || progress !== null}
                  className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:opacity-50"
                >
                  {outro === "mac" ? "Está num Mac? Baixar para Mac" : "Está no Windows? Baixar para Windows"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={trocar}
                  disabled={loading || progress !== null}
                  className={bigBtn}
                >
                  <Download className="h-5 w-5" />
                  Baixar para {LABEL[outro]}
                </button>
              )}
              <p className="flex items-start gap-2 rounded-lg border border-primary/40 bg-primary/10 p-4 text-left font-medium">
                <KeyRound className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                Guarde o seu código: o robô vai pedir na primeira vez que abrir.
              </p>
            </div>
          )}
        </section>

        <ol className="space-y-4 mb-10">
          {STEPS[sistema].map((s, i) => (
            <li key={i} className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-sans font-semibold mb-1">{i + 1}. {s.t}</h2>
                <p className="text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="flex gap-4 rounded-xl border border-border bg-card p-5 mb-12">
          <ShieldCheck className="h-6 w-6 shrink-0 text-primary" />
          <div>
            <h2 className="font-sans font-semibold mb-1">Privacidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              Seus dados ficam no seu computador. A Veehtor só vê se o robô está coletando, nunca o que você faz. Os relatórios com IA usam a sua própria conta.
            </p>
          </div>
        </section>

        <footer className="text-center text-sm text-muted-foreground">
          Veehtor Observer para Mac (macOS 14 ou mais novo) e Windows 10 ou 11. Dúvidas: fale com quem te enviou o convite.
        </footer>
      </div>
    </main>
  );
}
