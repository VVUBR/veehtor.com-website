import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

export interface MapDialogHandle {
  open: (source: string, opener: HTMLElement | null) => void;
}

const WA_NUMBER = "5511973022058";
const SMS_NUMBER = "+17815449279";
const SMS_DISPLAY = "(781) 544-9279";
const LEAD_MAILTO = "vitor@veehtor.com";

type Market = "br" | "us";

const COPY = {
  br: {
    title: "Analisar meu processo",
    subtitle: "Conte onde a operação trava. A conversa já começa com contexto.",
    close: "Fechar",
    processLabel: "Qual processo está incomodando?",
    processPlaceholder: "Ex.: propostas levam cinco dias para sair e dependem de três planilhas.",
    errProcess: "Descreva o processo para começarmos.",
    impactLabel: "Qual impacto ele causa hoje?",
    errImpact: "Selecione um impacto.",
    impacts: [
      "Perda de receita",
      "Custo ou retrabalho",
      "Tempo da equipe",
      "Atraso para o cliente",
      "Risco ou erro",
      "Ainda não sei medir",
    ],
    yourInfo: "Seus dados",
    namePlaceholder: "Nome",
    errName: "Informe seu nome.",
    companyPlaceholder: "Empresa",
    contactPlaceholder: "Email ou telefone",
    errContact: "Informe um email válido ou um telefone.",
    privacy: "Seus dados serão usados apenas para avaliar este processo e entrar em contato.",
    submit: "Analisar meu processo →",
    submitting: "Enviando...",
    submitMicro: "Sem apresentação genérica.",
    liveInvalid: "Revise os campos destacados antes de enviar.",
    liveSending: "Enviando suas respostas.",
    liveReceived: "Recebido.",
    successTitle: "Recebido.",
    successBody: "Nosso time vai revisar o processo e entrar em contato com você.",
    successAsk: "Quer falar agora?",
    ctaNow: "Continuar no WhatsApp →",
    smsHint: "",
  },
  us: {
    title: "Review my process",
    subtitle: "Show us where the work gets stuck. We'll start the conversation with context.",
    close: "Close",
    processLabel: "What process is causing the most friction?",
    processPlaceholder: "e.g., proposals take five days to go out and depend on three spreadsheets.",
    errProcess: "Describe the process so we can start.",
    impactLabel: "What's the impact today?",
    errImpact: "Select one impact.",
    impacts: [
      "Lost revenue",
      "Cost or rework",
      "Team time",
      "Customer delays",
      "Risk or errors",
      "Not sure yet",
    ],
    yourInfo: "Your details",
    namePlaceholder: "Name",
    errName: "Please enter your name.",
    companyPlaceholder: "Company",
    contactPlaceholder: "Work email or mobile",
    errContact: "Enter a valid email or a phone number.",
    privacy: "Your details are used only to review this process and get back to you.",
    submit: "Review my process →",
    submitting: "Sending...",
    submitMicro: "No generic pitch.",
    liveInvalid: "Please review the highlighted fields before submitting.",
    liveSending: "Sending your answers.",
    liveReceived: "Got it.",
    successTitle: "Got it.",
    successBody: "Our team will review your process and follow up.",
    successAsk: "Want to keep the conversation going now?",
    ctaNow: "Text us →",
    smsHint: "Text us at",
  },
} as const;

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
  </svg>
);

const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
const isPhone = (v: string) => (v.replace(/\D/g, "").length >= 10);
const truncate = (v: string, n = 200) => (v.length > n ? v.slice(0, n).trimEnd() + "..." : v);

const isMobileDevice = () =>
  typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

const MapDialog = forwardRef<MapDialogHandle>((_props, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const startedRef = useRef(false);
  const { language } = useLanguage();
  const market: Market = language === "pt" ? "br" : "us";
  const S = COPY[market];

  const [process, setProcess] = useState("");
  const [impact, setImpact] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");

  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [leadId, setLeadId] = useState<string | null>(null);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useImperativeHandle(ref, () => ({
    open: (source, opener) => {
      openerRef.current = opener;
      if (sent) {
        setSent(false);
        setProcess("");
        setImpact(null);
        setName("");
        setCompany("");
        setContact("");
        setLeadId(null);
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

  const logEvent = (event: "whatsapp" | "text") => {
    track("accelerator_clicked", { event, market });
    if (!leadId) return;
    void supabase.from("process_lead_events").insert({ lead_id: leadId, event });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const next: Record<string, boolean> = {};
    if (!process.trim()) next.process = true;
    if (!impact) next.impact = true;
    if (name.trim().length < 2) next.name = true;
    const c = contact.trim();
    if (!(isEmail(c) || isPhone(c))) next.contact = true;
    setInvalid(next);
    if (Object.keys(next).length) {
      if (liveRef.current) liveRef.current.textContent = S.liveInvalid;
      const firstKey = ["process", "impact", "name", "contact"].find((k) => next[k]);
      const el = dialogRef.current?.querySelector<HTMLElement>(`#f-${firstKey}`);
      el?.focus();
      return;
    }

    setSubmitting(true);
    if (liveRef.current) liveRef.current.textContent = S.liveSending;

    const newId = (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : String(Date.now());
    const payload = {
      id: newId,
      market,
      process: process.trim(),
      impact,
      name: name.trim(),
      company: company.trim(),
      contact: c,
    };

    const { error } = await supabase.from("process_leads").insert(payload);

    if (error) {
      const body = [
        `Market: ${market}`,
        `Process: ${payload.process}`,
        `Impact: ${payload.impact}`,
        `Name: ${payload.name}`,
        `Company: ${payload.company}`,
        `Contact: ${payload.contact}`,
      ].join("\n");
      try {
        window.open(
          `mailto:${LEAD_MAILTO}?subject=${encodeURIComponent(S.title)}&body=${encodeURIComponent(body)}`,
          "_blank",
        );
      } catch {
        /* nunca bloquear a confirmação */
      }
    } else {
      setLeadId(newId);
    }

    track("form_submitted", { market });
    setSubmitting(false);
    setSent(true);
    if (liveRef.current) liveRef.current.textContent = S.liveReceived;
  };

  const summary = truncate(process.trim());
  const waHref =
    "https://wa.me/" +
    WA_NUMBER +
    "?text=" +
    encodeURIComponent(
      [
        "Olá! Acabei de enviar um processo para análise no site da Veehtor.",
        `Processo: ${summary}`,
        `Impacto: ${impact ?? ""}`,
        "Gostaria de conversar sobre ele.",
      ].join("\n"),
    );
  const smsBody = "Hi Vitor, I want to know where to best apply AI in my business";
  const smsHref = `sms:${SMS_NUMBER}?&body=${encodeURIComponent(smsBody)}`;
  const mobile = isMobileDevice();

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
            <h3 id="maptitle">{S.title}</h3>
            <p className="modal-sub">{S.subtitle}</p>
          </div>
          <button className="x" type="button" aria-label={S.close} onClick={closeDialog}>✕</button>
        </div>

        <p className="form-live" aria-live="polite" ref={liveRef} />

        <form className="map" noValidate onSubmit={handleSubmit} onInput={handleInput}>
          <div className={`field${invalid.process ? " invalid" : ""}`}>
            <label htmlFor="f-process">{S.processLabel}</label>
            <textarea
              id="f-process"
              value={process}
              onChange={(e) => setProcess(e.target.value)}
              aria-describedby="e-process"
              aria-invalid={invalid.process ? "true" : "false"}
              placeholder={S.processPlaceholder}
            />
            <p className="err" id="e-process">{S.errProcess}</p>
          </div>

          <div className={`field${invalid.impact ? " invalid" : ""}`}>
            <span className="lbl" id="f-impact">{S.impactLabel}</span>
            <div className="pills" role="radiogroup" aria-labelledby="f-impact">
              {S.impacts.map((label) => (
                <button
                  type="button"
                  key={label}
                  role="radio"
                  aria-checked={impact === label}
                  className={`pill${impact === label ? " on" : ""}`}
                  onClick={() => {
                    handleInput();
                    setImpact(label);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="err" id="e-impact">{S.errImpact}</p>
          </div>

          <div className="field">
            <span className="lbl">{S.yourInfo}</span>
            <div className="grid2">
              <div className={`field${invalid.name ? " invalid" : ""}`} style={{ margin: 0 }}>
                <input
                  id="f-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={invalid.name ? "true" : "false"}
                  placeholder={S.namePlaceholder}
                />
                <p className="err">{S.errName}</p>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <input
                  id="f-company"
                  type="text"
                  autoComplete="organization"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={S.companyPlaceholder}
                />
              </div>
              <div className={`field${invalid.contact ? " invalid" : ""}`} style={{ margin: 0, gridColumn: "1 / -1" }}>
                <input
                  id="f-contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  aria-invalid={invalid.contact ? "true" : "false"}
                  placeholder={S.contactPlaceholder}
                />
                <p className="err">{S.errContact}</p>
              </div>
            </div>
          </div>

          <p className="consent">{S.privacy}</p>

          <div className="modal-foot">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? S.submitting : S.submit}
            </button>
            <span className="modal-micro">{S.submitMicro}</span>
          </div>
        </form>

        <div className="success">
          <div className="ok" aria-hidden="true"><CheckIcon /></div>
          <h4>{S.successTitle}</h4>
          <p>{S.successBody}</p>
          <p className="ask">{S.successAsk}</p>
          <div className="success-actions">
            {market === "br" ? (
              <a
                className="btn btn-primary"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logEvent("whatsapp")}
              >
                <WhatsAppIcon />
                {S.ctaNow}
              </a>
            ) : mobile ? (
              <a className="btn btn-primary" href={smsHref} onClick={() => logEvent("text")}>
                <MessageIcon />
                {S.ctaNow}
              </a>
            ) : (
              <a
                className="btn btn-primary"
                href={`tel:${SMS_NUMBER}`}
                onClick={(e) => {
                  e.preventDefault();
                  logEvent("text");
                }}
              >
                <MessageIcon />
                {S.smsHint} {SMS_DISPLAY}
              </a>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
});

MapDialog.displayName = "MapDialog";
export default MapDialog;
