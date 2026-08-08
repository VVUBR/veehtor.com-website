import { useEffect, useMemo, useState } from "react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import {
  MKT,
  WA_NUM,
  LEAD_MAILTO,
  HORAS_MES,
  SEMANAS_ANO,
  RETRABALHO_ADM,
  TAXA_CONSOLIDACAO,
  MARGEM_REF,
  RECUP_MIN,
  RECUP_MAX,
  TAXAS,
  type Opt,
  type AreaKey,
} from "@/i18n/raioxContent";
import "@/styles/home.css";
import "@/styles/raiox.css";

const FIN_MODO = ["demora", "consolidacao", "relatorio"] as const;
const AREAS: AreaKey[] = ["adm", "ops", "com", "fin"];
const PORTES = ["a20", "21a50", "51a200", "m200"];
const OBJS = ["tempo", "erros", "escala", "visib"];

const roundTo = (v: number, s: number) => Math.round(v / s) * s;
const val = (opts: Opt[], k: string | null) => {
  const f = opts.find((o) => o[0] === k);
  return f ? f[2] : null;
};
const lab = (opts: Opt[], k: string | null) => {
  const f = opts.find((o) => o[0] === k);
  return f ? f[1] : "";
};

const AreaIcon = ({ area }: { area: AreaKey }) => {
  const p = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (area === "adm")
    return (
      <svg {...p}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8M8 17h5" />
      </svg>
    );
  if (area === "ops")
    return (
      <svg {...p}>
        <circle cx="5" cy="6" r="2.2" />
        <circle cx="19" cy="18" r="2.2" />
        <path d="M7 7.5c3.5 2 6.5 1 9 3.5s1.5 5 1.5 5" />
      </svg>
    );
  if (area === "com")
    return (
      <svg {...p}>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </svg>
    );
  return (
    <svg {...p}>
      <path d="M4 20V10M10 20V4M16 20v-9M22 20H2" />
    </svg>
  );
};

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
  </svg>
);

export default function RaioX() {
  const { language } = useLanguage();
  const mkt = language === "pt" ? "br" : "us";
  const M = MKT[mkt];
  const t = M.t;

  const [porte, setPorte] = useState<string | null>(null);
  const [area, setArea] = useState<AreaKey | null>(null);
  const [sintIdx, setSintIdx] = useState<number | null>(null);
  const [m1, setM1] = useState<string | number | null>(null);
  const [m2, setM2] = useState<string | null>(null);
  const [obj, setObj] = useState<string | null>(null);

  const [fuMode, setFuMode] = useState<"text" | "email" | null>(null);
  const [fuName, setFuName] = useState("");
  const [fuContact, setFuContact] = useState("");
  const [fuError, setFuError] = useState(false);
  const [fuDone, setFuDone] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    document.title = M.docTitle;
  }, [M.docTitle]);

  const money = (v: number) => M.fmt.format(Math.round(v));
  const compact = (v: number) => M.compact(v);
  const fmtPct = (p: number) => {
    if (p < 1) return t.pctLow;
    if (p > 100) return t.pctHigh;
    return p.toLocaleString(M.lang, { maximumFractionDigits: p < 10 ? 1 : 0 }) + "%";
  };

  const modo = useMemo(() => {
    if (!area) return null;
    if (area === "fin") return sintIdx === null ? null : FIN_MODO[sintIdx];
    return area === "com" ? "consequencia" : "esforco";
  }, [area, sintIdx]);

  const economiaHoras = (horas: number, taxa: number) => {
    const salInf = m2 && m2 !== "nao" ? M.sal[m2] : null;
    const salBase = salInf || M.porteSal[porte || ""] || M.salDef;
    const custoHora = (salBase * M.enc) / HORAS_MES;
    const horasAno = horas * taxa * SEMANAS_ANO;
    return { salInf, salBase, custoHora, horasAno, anual: horasAno * custoHora };
  };

  // ---- result model -------------------------------------------------------
  type Result = {
    ecoOn: boolean;
    risk: boolean;
    ecoVal: string;
    ecoUnit: string;
    ecoMo: string;
    ecoCaveat: string | null;
    ecoCalc: string;
    qual: string | null;
    impactLine: string;
    mbTag: string;
    mbVal: string;
    mbRisk: boolean;
  };

  const result: Result | null = useMemo(() => {
    const base: Result = {
      ecoOn: false, risk: false, ecoVal: "", ecoUnit: "", ecoMo: "",
      ecoCaveat: null, ecoCalc: "", qual: null, impactLine: "", mbTag: "", mbVal: "", mbRisk: false,
    };
    if (!area) return null;

    if (modo === "esforco" && typeof m1 === "number") {
      const r = economiaHoras(m1, TAXAS[area]);
      const fator = area === "adm" ? RETRABALHO_ADM : 1;
      const anual = roundTo(r.anual * fator, 100);
      return {
        ...base,
        ecoOn: true,
        ecoVal: money(anual),
        ecoUnit: t.perYear,
        ecoMo: t.moEff(money(roundTo(anual / 12, 10))) + (r.salInf ? "" : t.refPorte) + ".",
        ecoCaveat: t.cavEff(compact(roundTo(anual / MARGEM_REF, 10000))),
        ecoCalc: t.calcEff(money(r.salBase), M.fmtH.format(r.custoHora), m1, Math.round(TAXAS[area] * 100), Math.round(r.horasAno), fator > 1),
        impactLine: t.sumEff(money(anual)),
        mbTag: t.mbEff,
        mbVal: "≈ " + money(anual) + t.mbYr,
      };
    }

    if (modo === "consolidacao" && typeof m1 === "string") {
      const horas = val(M.consolOpt, m1) as number;
      const r = economiaHoras(horas, TAXA_CONSOLIDACAO);
      const anual = roundTo(r.anual, 100);
      return {
        ...base,
        ecoOn: true,
        ecoVal: money(anual),
        ecoUnit: t.perYear,
        ecoMo: t.moCons(money(roundTo(anual / 12, 10))) + (r.salInf ? "" : t.refPorte) + ".",
        ecoCaveat: t.cavCons,
        ecoCalc: t.calcCons(money(r.salBase), M.fmtH.format(r.custoHora), horas),
        impactLine: t.sumCons(money(anual)),
        mbTag: t.mbEff,
        mbVal: "≈ " + money(anual) + t.mbYr,
      };
    }

    if (modo === "consequencia" && typeof m1 === "string" && m2) {
      const leads = val(M.leadsOpt, m1) as number;
      const ticket = val(M.ticketOpt, m2) as number;
      const mensal = leads * ticket;
      const anualRisco = mensal * 12;
      let cavHtml = t.cavCom(compact(roundTo(anualRisco * RECUP_MIN, 10000)), compact(roundTo(anualRisco * RECUP_MAX, 10000)));
      if (porte) {
        const p = (anualRisco / M.fat[porte].mid) * 100;
        cavHtml += t.cavPct(fmtPct(p));
        if (p > 30) cavHtml += t.cavHigh;
      }
      return {
        ...base,
        ecoOn: true,
        risk: true,
        ecoVal: compact(roundTo(mensal, 1000)),
        ecoUnit: t.perMonth,
        ecoMo: t.moCom(compact(roundTo(anualRisco, 10000))),
        ecoCaveat: cavHtml,
        ecoCalc: t.calcCom(lab(M.leadsOpt, m1).toLowerCase(), leads, money(ticket), money(mensal)),
        impactLine: t.sumCom(compact(roundTo(mensal, 1000))),
        mbTag: t.mbRisk,
        mbVal: "≈ " + compact(roundTo(mensal, 1000)) + t.mbMo,
        mbRisk: true,
      };
    }

    if (modo === "demora" && typeof m1 === "string") {
      const d = val(M.demoraOpt, m1) as number;
      const vezes = m2 ? (val(M.precisaOpt, m2) as number | null) : undefined;
      const qi = d === 0 ? 0 : d === 1 ? 1 : d === 2 ? 2 : 3;
      const r: Result = { ...base, qual: t.dQual[qi] };
      if (d !== 0 && vezes) {
        r.ecoOn = true;
        r.risk = true;
        r.ecoVal = String(vezes);
        r.ecoUnit = t.decYr;
        r.ecoMo = t.moDem;
        r.ecoCalc = t.calcDem(lab(M.precisaOpt, m2).toLowerCase(), lab(M.demoraOpt, m1).toLowerCase());
        r.impactLine = t.sumDem(vezes);
        r.mbTag = t.mbNoNum;
        r.mbVal = vezes + t.mbDec;
        r.mbRisk = true;
      }
      return r;
    }

    if (modo === "relatorio" && typeof m1 === "string") {
      const dias = val(M.atrasoOpt, m1) as number;
      const usos = m2 ? (val(M.usoOpt, m2) as number | null) : undefined;
      const qi = dias === 0 ? 0 : dias === 1.5 ? 1 : dias === 7 ? 2 : 3;
      const r: Result = { ...base, qual: t.rQual[qi] };
      if (dias > 0 && usos) {
        const per = dias === 1.5 ? t.d12 : t.d7;
        r.ecoOn = true;
        r.risk = true;
        r.ecoVal = String(usos);
        r.ecoUnit = t.decYr;
        r.ecoMo = t.moRel(per);
        r.ecoCalc = t.calcRel(lab(M.usoOpt, m2).toLowerCase(), lab(M.atrasoOpt, m1).toLowerCase());
        r.impactLine = t.sumRel(usos);
        r.mbTag = t.mbStale;
        r.mbVal = usos + t.mbDec;
        r.mbRisk = true;
      }
      return r;
    }

    return base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area, modo, m1, m2, porte, mkt]);

  const impactLine = result?.impactLine || "";

  const summaryLines = () => {
    const L: string[] = [];
    if (porte) L.push(t.sumSize + M.porteLabel[porte] + t.sumSizeSuf);
    if (area) L.push(t.sumArea + M.areaName[area]);
    if (area && sintIdx !== null) L.push(t.sumSit + M.sint[area][sintIdx]);
    if (impactLine) L.push(impactLine);
    if (obj) L.push(t.sumPri + M.objLabel[obj]);
    return L;
  };

  const waHref = useMemo(() => {
    const bt = MKT.br.t;
    const L: string[] = [bt.sumHi];
    if (porte) L.push(bt.sumSize + MKT.br.porteLabel[porte] + bt.sumSizeSuf);
    if (area) L.push(bt.sumArea + MKT.br.areaName[area]);
    if (area && sintIdx !== null) L.push(bt.sumSit + MKT.br.sint[area][sintIdx]);
    if (impactLine) L.push(impactLine);
    if (obj) L.push(bt.sumPri + MKT.br.objLabel[obj]);
    L.push(bt.sumBye);
    return "https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(L.join("\n"));
  }, [porte, area, sintIdx, obj, impactLine]);

  // ---- handlers -----------------------------------------------------------
  const onArea = (a: AreaKey) => {
    setArea(a);
    setSintIdx(null);
    setM1(null);
    setM2(null);
  };
  const onSint = (i: number) => {
    setSintIdx(i);
    if (area === "fin") {
      setM1(null);
      setM2(null);
    }
  };
  const reset = () => {
    setPorte(null); setArea(null); setSintIdx(null); setM1(null); setM2(null); setObj(null);
  };

  const validate = () => {
    const okName = fuName.trim().length >= 2;
    const c = fuContact.trim();
    const okC = fuMode === "text" ? c.replace(/\D/g, "").length >= 10 : /^\S+@\S+\.\S+$/.test(c);
    return okName && okC;
  };

  const fuSubmit = async () => {
    if (fuDone || !fuMode || sending) return;
    if (!validate()) {
      setFuError(true);
      return;
    }
    setFuError(false);
    setSending(true);
    const name = fuName.trim();
    const contact = fuContact.trim();
    const lines = [
      t.sumHi,
      ...summaryLines(),
      "Follow-up: " + (fuMode === "text" ? t.fuText : t.fuMail),
      "Name: " + name,
      (fuMode === "text" ? "Mobile: " : "Email: ") + contact,
    ];
    const payload = {
      market: "us",
      size: porte,
      area,
      situation: area && sintIdx !== null ? M.sint[area][sintIdx] : null,
      impact: impactLine,
      priority: obj,
      followup: fuMode,
      name,
      contact,
    };
    const { error } = await supabase.from("raiox_leads").insert(payload);
    if (error) {
      window.location.href =
        "mailto:" + LEAD_MAILTO + "?subject=" + encodeURIComponent("Operations X-Ray lead") + "&body=" + encodeURIComponent(lines.join("\n"));
    }
    setSending(false);
    setFuDone(true);
  };

  // ---- pill helpers -------------------------------------------------------
  const optPills = (opts: Opt[], selected: string | null, onPick: (k: string) => void) => (
    <div className="pills">
      {opts.map((o) => (
        <button key={o[0]} type="button" className={"pill" + (selected === o[0] ? " sel" : "")} onClick={() => onPick(o[0])}>
          {o[1]}
        </button>
      ))}
    </div>
  );

  const q4 = () => {
    if (!modo) {
      return <div className="qsub">{area === "fin" ? t.q4LockedFin : t.q4Locked}</div>;
    }
    if (modo === "esforco") {
      const v = typeof m1 === "number" ? m1 : 5;
      const scale = M.hscale.find(([a, b]) => v >= a && v <= b);
      return (
        <div className="slider-block">
          <div className="slider-readout">
            <span className={"sval" + (typeof m1 === "number" ? "" : " zero")}>{typeof m1 === "number" ? m1 + "h" : "—"}</span>
            <span className="sdesc">{typeof m1 === "number" ? (scale ? scale[2] : "") : t.drag}</span>
          </div>
          <input
            type="range"
            min={5}
            max={60}
            step={1}
            value={v}
            aria-label={t.q4Eff}
            style={{ ["--p" as string]: (typeof m1 === "number" ? ((v - 5) / 55) * 100 : 0) + "%" }}
            onChange={(e) => setM1(+e.target.value)}
          />
          <div className="scale-ends">
            <span>{t.h5}</span>
            <span>{t.h60}</span>
          </div>
        </div>
      );
    }
    const opts =
      modo === "consequencia" ? M.leadsOpt : modo === "demora" ? M.demoraOpt : modo === "consolidacao" ? M.consolOpt : M.atrasoOpt;
    return optPills(opts, typeof m1 === "string" ? m1 : null, (k) => setM1(k));
  };

  const q4Label = !modo
    ? t.q4Def
    : modo === "esforco"
    ? t.q4Eff
    : modo === "consequencia"
    ? t.q4Com
    : modo === "demora"
    ? t.q4Dem
    : modo === "consolidacao"
    ? t.q4Cons
    : t.q4Rel;

  const q5Label = !modo
    ? t.q5Def
    : modo === "esforco" || modo === "consolidacao"
    ? t.q5Sal
    : modo === "consequencia"
    ? t.q5Ticket
    : modo === "demora"
    ? t.q5Freq
    : t.q5Uso;

  const q5 = () => {
    if (!modo) return <div className="qsub">{area === "fin" ? t.q4LockedFin : t.q4Locked}</div>;
    const opts =
      modo === "esforco" || modo === "consolidacao"
        ? M.salOpt
        : modo === "consequencia"
        ? M.ticketOpt
        : modo === "demora"
        ? M.precisaOpt
        : M.usoOpt;
    return (
      <>
        {(modo === "esforco" || modo === "consolidacao") && <div className="qsub">{t.q5SalSub}</div>}
        {optPills(opts, m2, (k) => setM2(k))}
      </>
    );
  };

  const showResult = !!area;
  const hasMobbar = !!(result && result.mbVal);

  return (
    <div className={"home raiox" + (hasMobbar ? " has-mobbar" : "")}>
      <SiteNav />

      <main className="rx-main" id="main">
        <div className="pg-head">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1>{t.h1}</h1>
          <p>{t.sub}</p>
        </div>

        <div className="canvas">
          <div className="q-col">
            <div className="qblock">
              <div className="qhead">
                <span className="qn">01</span>
                <span className="qt">{t.q1}</span>
              </div>
              <div className="pills">
                {PORTES.map((p) => (
                  <button key={p} type="button" className={"pill" + (porte === p ? " sel" : "")} onClick={() => setPorte(p)}>
                    {M.porteLabel[p]}
                  </button>
                ))}
              </div>
            </div>

            <div className="qblock">
              <div className="qhead">
                <span className="qn">02</span>
                <span className="qt">{t.q2}</span>
              </div>
              <div className="pills">
                {AREAS.map((a) => (
                  <button key={a} type="button" className={"pill" + (area === a ? " sel" : "")} onClick={() => onArea(a)}>
                    {M.areaName[a]}
                    <span className="sub">{M.areaSub[a]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="qblock">
              <div className="qhead">
                <span className="qn">03</span>
                <span className="qt">{t.q3}</span>
              </div>
              {!area && <div className="qsub">{t.q3Locked}</div>}
              <div className={"pills" + (area ? "" : " locked")}>
                {area &&
                  M.sint[area].map((txt, i) => (
                    <button key={txt} type="button" className={"pill wide" + (sintIdx === i ? " sel" : "")} onClick={() => onSint(i)}>
                      {txt}
                    </button>
                  ))}
              </div>
            </div>

            <div className="qblock">
              <div className="qhead">
                <span className="qn">04</span>
                <span className="qt">{q4Label}</span>
              </div>
              {q4()}
            </div>

            <div className="qblock">
              <div className="qhead">
                <span className="qn">05</span>
                <span className="qt">{q5Label}</span>
              </div>
              {q5()}
            </div>

            <div className="qblock">
              <div className="qhead">
                <span className="qn">06</span>
                <span className="qt">{t.q6}</span>
              </div>
              <div className="pills">
                {OBJS.map((o) => (
                  <button key={o} type="button" className={"pill" + (obj === o ? " sel" : "")} onClick={() => setObj(o)}>
                    {M.objLabel[o]}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" className="reset-btn" onClick={reset}>
              {t.reset}
            </button>
          </div>

          <div className="r-col" id="rx-result">
            <div className="r-inner">
              {!showResult && (
                <div className="idle">
                  <div className="idle-label">{t.idleLabel}</div>
                  {AREAS.map((a) => (
                    <div className="ia-card" key={a}>
                      <AreaIcon area={a} />
                      <div>
                        <div className="ia-name">{M.areaName[a]}</div>
                        <div className="ia-desc">{M.idleDesc[a]}</div>
                      </div>
                    </div>
                  ))}
                  <div className="idle-hint">{t.idleHint}</div>
                </div>
              )}

              {showResult && area && (
                <>
                  <div className="rb">
                    <div className="rtag leak">{t.leak}</div>
                    <div className="r-meta">
                      {[M.areaName[area], porte ? t.metaSize(M.porteLabel[porte], M.fat[porte].txt) : null].filter(Boolean).join(" · ")}
                    </div>
                    <div className="r-prob">{sintIdx !== null ? M.prob[area].s[sintIdx] : M.prob[area].g}</div>
                  </div>

                  {result?.ecoOn && (
                    <div className={"eco" + (result.risk ? " risk" : "")}>
                      <div className="eco-big">
                        <span className="ap">≈</span>
                        <span>{result.ecoVal}</span> <span className="u">{result.ecoUnit}</span>
                      </div>
                      <div className="eco-mo">{result.ecoMo}</div>
                      {result.ecoCaveat && <div className="eco-caveat" dangerouslySetInnerHTML={{ __html: result.ecoCaveat }} />}
                      <div className="eco-calc">{result.ecoCalc}</div>
                    </div>
                  )}

                  {result?.qual && (
                    <div className="qual">
                      <p>{result.qual}</p>
                    </div>
                  )}

                  <div className="rb">
                    <div className="rtag">{t.change}</div>
                    <ul className="chlist">
                      {M.changes[area].map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                    <div className="bench">{M.bench[area]}</div>
                  </div>

                  <div className="cta">
                    <div className="cta-title">{t.ctaTitle}</div>

                    {mkt === "br" ? (
                      <div>
                        <a className="cta-btn" href={waHref} target="_blank" rel="noopener">
                          <WhatsAppIcon />
                          <span>{t.waCta}</span>
                        </a>
                        <div className="cta-micro">{t.fuMicro}</div>
                      </div>
                    ) : fuDone ? (
                      <div className="cta-done">{t.fuDone}</div>
                    ) : (
                      <div>
                        <div className="fu-sub">{t.fuSub}</div>
                        <div className="fu-ask">{t.fuAsk}</div>
                        <div className="fu-pills">
                          <button type="button" className={"fu-pill" + (fuMode === "text" ? " sel" : "")} onClick={() => setFuMode("text")}>
                            {t.fuText}
                          </button>
                          <button type="button" className={"fu-pill" + (fuMode === "email" ? " sel" : "")} onClick={() => setFuMode("email")}>
                            {t.fuMail}
                          </button>
                        </div>
                        {fuMode && (
                          <div className="fu-fields">
                            <input
                              className={"fu-input" + (fuError && fuName.trim().length < 2 ? " err" : "")}
                              autoComplete="given-name"
                              placeholder={t.phFirst}
                              value={fuName}
                              onChange={(e) => setFuName(e.target.value)}
                            />
                            <input
                              className={"fu-input" + (fuError && !validate() ? " err" : "")}
                              type={fuMode === "text" ? "tel" : "email"}
                              inputMode={fuMode === "text" ? "tel" : "email"}
                              autoComplete={fuMode === "text" ? "tel" : "email"}
                              placeholder={fuMode === "text" ? t.phMobile : t.phEmail}
                              value={fuContact}
                              onChange={(e) => setFuContact(e.target.value)}
                            />
                            {fuError && <div className="fu-err">{t.fuErr}</div>}
                            <button type="button" className="cta-btn" onClick={fuSubmit} disabled={sending}>
                              {t.fuSend}
                            </button>
                          </div>
                        )}
                        <div className="cta-micro">{t.fuMicro}</div>
                      </div>
                    )}
                  </div>

                  <div className="next">
                    <div className="rtag">{t.next}</div>
                    <p>{t.nextP}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {hasMobbar && result && (
        <div className={"mobbar" + (result.mbRisk ? " risk" : "")}>
          <div className="mb-txt">
            <div className="mb-tag">{result.mbTag}</div>
            <div className="mb-val">{result.mbVal}</div>
          </div>
          <button type="button" onClick={() => document.getElementById("rx-result")?.scrollIntoView({ behavior: "smooth" })}>
            {t.mbGo}
          </button>
        </div>
      )}

      <div className="dark">
        <SiteFooter />
      </div>
    </div>
  );
}
