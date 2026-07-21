import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { CALENDAR_URL, submitProcessMapping } from "@/lib/submitProcessMapping";

export interface MapDialogHandle {
  open: (source: string, opener: HTMLElement | null) => void;
}

const IMPACTS = [
  "Perda de receita",
  "Custo ou retrabalho",
  "Tempo do time",
  "Atraso para o cliente",
  "Risco ou erro",
  "Ainda não sei medir",
];

const MapDialog = forwardRef<MapDialogHandle>((_props, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const startedRef = useRef(false);

  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useImperativeHandle(ref, () => ({
    open: (source, opener) => {
      openerRef.current = opener;
      if (sent) {
        setSent(false);
        formRef.current?.reset();
        startedRef.current = false;
      }
      setInvalid({});
      track("form_opened", { source });
      const dlg = dialogRef.current;
      if (!dlg) return;
      dlg.showModal();
      setTimeout(() => {
        (dlg.querySelector("#f-process") as HTMLTextAreaElement | null)?.focus();
      }, 0);
    },
  }));

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) closeDialog();
  };

  const handleClose = () => {
    openerRef.current?.focus();
  };

  const handleInput = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      track("form_started");
    }
  };

  const validate = (): { ok: boolean; focus?: HTMLElement | null } => {
    const form = formRef.current;
    if (!form) return { ok: false };
    const nextInvalid: Record<string, boolean> = {};
    let firstFocus: HTMLElement | null = null;

    const process = form.querySelector<HTMLTextAreaElement>("#f-process")!;
    if (!process.value.trim()) {
      nextInvalid["process"] = true;
      if (!firstFocus) firstFocus = process;
    }

    const checks = form.querySelectorAll<HTMLInputElement>("input[name='impacto']:checked");
    if (checks.length === 0) {
      nextInvalid["impacto"] = true;
      const firstCheck = form.querySelector<HTMLInputElement>("input[name='impacto']");
      if (!firstFocus && firstCheck) firstFocus = firstCheck;
    }

    const nome = form.querySelector<HTMLInputElement>("#f-nome")!;
    if (!nome.value.trim()) {
      nextInvalid["nome"] = true;
      if (!firstFocus) firstFocus = nome;
    }

    const empresa = form.querySelector<HTMLInputElement>("#f-empresa")!;
    if (!empresa.value.trim()) {
      nextInvalid["empresa"] = true;
      if (!firstFocus) firstFocus = empresa;
    }

    const email = form.querySelector<HTMLInputElement>("#f-email")!;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) {
      nextInvalid["email"] = true;
      if (!firstFocus) firstFocus = email;
    }

    setInvalid(nextInvalid);
    if (Object.keys(nextInvalid).length) {
      if (liveRef.current) liveRef.current.textContent = "Revise os campos destacados antes de enviar.";
      return { ok: false, focus: firstFocus };
    }
    return { ok: true };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const v = validate();
    if (!v.ok) {
      v.focus?.focus();
      return;
    }
    const form = formRef.current!;
    const data = {
      processo: (form.querySelector("#f-process") as HTMLTextAreaElement).value.trim(),
      impactos: Array.from(form.querySelectorAll<HTMLInputElement>("input[name='impacto']:checked")).map((c) => c.value),
      nome: (form.querySelector("#f-nome") as HTMLInputElement).value.trim(),
      empresa: (form.querySelector("#f-empresa") as HTMLInputElement).value.trim(),
      email: (form.querySelector("#f-email") as HTMLInputElement).value.trim(),
      whatsapp: (form.querySelector("#f-whats") as HTMLInputElement).value.trim(),
    };
    setSubmitting(true);
    if (liveRef.current) liveRef.current.textContent = "Enviando suas respostas.";
    const res = await submitProcessMapping(data);
    setSubmitting(false);
    if (res.ok) {
      track("form_submitted");
      setSent(true);
      if (liveRef.current) liveRef.current.textContent = "Recebido. Agora escolha um horário de 30 minutos.";
    } else if (liveRef.current) {
      liveRef.current.textContent = "Não foi possível enviar. Seus dados foram preservados, tente novamente.";
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={`home-dialog${sent ? " sent" : ""}`}
      aria-labelledby="maptitle"
      onClick={handleBackdropClick}
      onClose={handleClose}
    >
      <div className="modal-in">
        <div className="modal-head">
          <div>
            <h3 id="maptitle">Mapear meu processo</h3>
            <p className="modal-sub">Conte onde a operação trava. A conversa já começa com contexto.</p>
          </div>
          <button className="x" type="button" aria-label="Fechar" onClick={closeDialog}>✕</button>
        </div>

        <p className="form-live" aria-live="polite" ref={liveRef} />

        <form className="map" ref={formRef} noValidate onSubmit={handleSubmit} onInput={handleInput}>
          <div className={`field${invalid.process ? " invalid" : ""}`}>
            <label htmlFor="f-process">Qual processo está incomodando?</label>
            <textarea
              id="f-process"
              aria-describedby="e-process"
              aria-invalid={invalid.process ? "true" : "false"}
              placeholder="Ex.: propostas levam cinco dias para sair e dependem de três planilhas."
            />
            <p className="err" id="e-process">Descreva o processo para começarmos.</p>
          </div>

          <fieldset className={invalid.impacto ? "invalid" : ""} aria-describedby="e-impacto">
            <legend>Qual impacto ele causa hoje?</legend>
            <div className="checks">
              {IMPACTS.map((label) => (
                <label key={label}>
                  <input type="checkbox" name="impacto" value={label} /> {label}
                </label>
              ))}
            </div>
            <p className="err" id="e-impacto">Selecione ao menos um impacto.</p>
          </fieldset>

          <div className="field">
            <span className="lbl">Seus dados</span>
            <div className="grid2">
              <div className={`field${invalid.nome ? " invalid" : ""}`} style={{ margin: 0 }}>
                <input id="f-nome" type="text" autoComplete="name" aria-describedby="e-nome" aria-invalid={invalid.nome ? "true" : "false"} placeholder="Nome" />
                <p className="err" id="e-nome">Informe seu nome.</p>
              </div>
              <div className={`field${invalid.empresa ? " invalid" : ""}`} style={{ margin: 0 }}>
                <input id="f-empresa" type="text" autoComplete="organization" aria-describedby="e-empresa" aria-invalid={invalid.empresa ? "true" : "false"} placeholder="Empresa" />
                <p className="err" id="e-empresa">Informe a empresa.</p>
              </div>
              <div className={`field${invalid.email ? " invalid" : ""}`} style={{ margin: 0 }}>
                <input id="f-email" type="email" autoComplete="email" aria-describedby="e-email" aria-invalid={invalid.email ? "true" : "false"} placeholder="E-mail" />
                <p className="err" id="e-email">Informe um e-mail válido.</p>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <input id="f-whats" type="tel" autoComplete="tel" placeholder="WhatsApp/telefone (opcional)" />
              </div>
            </div>
          </div>

          <p className="consent">
            Seus dados serão usados apenas para avaliar este processo e entrar em contato.{" "}
            <a href="https://www.veehtor.com/privacy">Política de privacidade</a>
          </p>

          <div className="modal-foot">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Enviando..." : "Analisar meu processo"}
            </button>
            <span className="modal-micro">Sem apresentação genérica.</span>
          </div>
        </form>

        <div className="success">
          <div className="ok" aria-hidden="true">✓</div>
          <h4>Recebido.</h4>
          <p>Agora escolha um horário de 30 minutos.</p>
          <p>
            {CALENDAR_URL && (
              <a
                className="btn btn-primary"
                href={CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("calendar_opened")}
              >
                Escolher horário
              </a>
            )}
          </p>
        </div>
      </div>
    </dialog>
  );
});

MapDialog.displayName = "MapDialog";
export default MapDialog;
