import { useEffect, useState, FormEvent } from "react";
import { Download, FileDown, ListChecks, Monitor, ShieldCheck, KeyRound } from "lucide-react";

const RPC_URL = "https://wbaskuadfihosvyweqyt.supabase.co/rest/v1/rpc/observer_convite_download";
const API_KEY = "sb_publishable_40T-hu1QTtRNN7xloUCIPA_w5mOF1Fy";

type Ok = { ok: true; nome: string; versao: string; url: string; arquivo: string; tamanho: number };

const MSG_DEFAULT = "Código não encontrado ou vencido. Confira as letras ou peça um convite novo à Veehtor.";
const MSGS: Record<string, string> = {
  limite_de_downloads: "Este convite já foi baixado 3 vezes. Peça um convite novo à Veehtor.",
  muitas_tentativas: "Muitas tentativas erradas. Espere uma hora e tente de novo.",
  sem_versao_publicada: "Estamos atualizando o instalador. Tente de novo em alguns minutos.",
};

function normalize(v: string) {
  const raw = v.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return raw.length === 12 ? raw.match(/.{4}/g)!.join("-") : v.trim().toUpperCase();
}

const steps = [
  { icon: FileDown, t: "Abra o arquivo baixado", d: "Se o Mac disser que não pode abrir porque o desenvolvedor não foi verificado: abra Ajustes do Sistema, Privacidade e Segurança, role até o fim e clique em Abrir assim mesmo." },
  { icon: ListChecks, t: "Siga o instalador", d: "Continuar, Instalar e a senha do seu Mac. Leva 1 minuto." },
  { icon: Monitor, t: "O robô aparece no topo da tela", d: "Digite o seu código de convite e siga os passos: autorizar a coleta, conectar o Chrome e conectar a sua IA (Claude ou ChatGPT). As atualizações chegam pelo próprio robô." },
];

export default function Observer() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<Ok | null>(null);

  useEffect(() => {
    document.title = "Veehtor Observer";
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!code.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(RPC_URL, {
        method: "POST",
        headers: { apikey: API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ p_codigo: normalize(code) }),
      });
      const json = await res.json();
      if (json && json.ok === true) setData(json as Ok);
      else setError((json && MSGS[json.motivo]) || MSG_DEFAULT);
    } catch {
      setError(MSG_DEFAULT);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-14 md:py-20">
        <header className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Veehtor Observer</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Entenda para onde vai o seu tempo de trabalho e onde dá para melhorar. Tudo fica no seu Mac.
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
              <a
                href={`${data.url}?download=${encodeURIComponent(data.arquivo)}`}
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-primary text-primary-foreground px-6 py-4 text-lg font-semibold"
              >
                <Download className="h-5 w-5" />
                Baixar o Veehtor Observer {data.versao}
              </a>
              <p className="text-sm text-muted-foreground">{Math.round(Number(data.tamanho) / 1048576)} MB</p>
              <p className="flex items-start gap-2 rounded-lg border border-primary/40 bg-primary/10 p-4 text-left font-medium">
                <KeyRound className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                Guarde o seu código: o robô vai pedir na primeira vez que abrir.
              </p>
            </div>
          )}
        </section>

        <ol className="space-y-4 mb-10">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold mb-1">{i + 1}. {s.t}</h2>
                <p className="text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="flex gap-4 rounded-xl border border-border bg-card p-5 mb-12">
          <ShieldCheck className="h-6 w-6 shrink-0 text-primary" />
          <div>
            <h2 className="font-semibold mb-1">Privacidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              Seus dados ficam cifrados no seu Mac. A Veehtor só vê se o robô está coletando, nunca o que você faz. Os relatórios com IA usam a sua própria conta.
            </p>
          </div>
        </section>

        <footer className="text-center text-sm text-muted-foreground">
          Veehtor Observer para Mac (macOS 14 ou mais novo). Dúvidas: fale com quem te enviou o convite.
        </footer>
      </div>
    </main>
  );
}
