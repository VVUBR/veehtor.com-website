import React, { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import complotap from "@/assets/complo-tap.jpg.asset.json";
import comploGarden from "@/assets/complo-garden.jpg.asset.json";
import comploCheers from "@/assets/complo-cheers.jpg.asset.json";

const WHATSAPP_NUMBER = "5511973022058";
const WHATSAPP_TEXT =
  "Olá! Vi o projeto da Cervejaria Complô e gostaria de entender o que poderia ser aplicado na minha operação.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_TEXT,
)}`;

const DARK = "#0a0c10";
const CREAM = "#f5f0e6";
const MINT = "#2EE6A8";
const TEAL = "#4fd6b0";

const serif: React.CSSProperties = { fontFamily: "'Instrument Serif', serif" };
const sans: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif" };

function Label({ children, onCream = false }: { children: React.ReactNode; onCream?: boolean }) {
  return (
    <div
      className="text-xs uppercase mb-6"
      style={{ letterSpacing: "0.24em", color: onCream ? "#0f766e" : TEAL, ...sans }}
    >
      {children}
    </div>
  );
}

function CTA({
  children = "Falar no WhatsApp →",
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-medium transition-all hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0c10] " +
        className
      }
      style={{ background: MINT, color: DARK, ...sans }}
    >
      {children}
    </a>
  );
}

function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b"
      style={{ background: "rgba(10, 12, 16, 0.75)", borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/cervejarias" className="flex items-center gap-2" style={sans} aria-label="Veehtor AI">
          <span className="text-lg tracking-tight" style={{ color: "#e8e4dd", fontWeight: 500 }}>
            Veehtor
          </span>
          <span className="text-lg tracking-tight italic" style={{ color: MINT, ...serif }}>
            AI
          </span>
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0c10]"
          style={{ background: MINT, color: DARK, ...sans }}
        >
          Falar no WhatsApp
        </a>
      </div>
    </header>
  );
}

function WhatsAppFAB() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0c10]"
      style={{
        width: 60,
        height: 60,
        background: MINT,
        boxShadow: "0 10px 30px rgba(46, 230, 168, 0.4)",
      }}
    >
      <svg viewBox="0 0 24 24" width="30" height="30" fill={DARK} aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.78 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.24 8.24 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.98-.14.16-.29.19-.54.06-.25-.12-1.05-.39-2-1.23a7.5 7.5 0 0 1-1.38-1.72c-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14 0-.31-.02-.47-.02s-.43.06-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.68 4.24 3.76.59.26 1.05.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z" />
      </svg>
    </a>
  );
}

function SectionTitle({
  before,
  italic,
  after = "",
  onCream = false,
}: {
  before: string;
  italic: string;
  after?: string;
  onCream?: boolean;
}) {
  return (
    <h2
      className="text-4xl md:text-5xl leading-[1.1] tracking-tight"
      style={{ ...serif, color: onCream ? "#0a0c10" : "#f0ece5" }}
    >
      {before}
      <em className="italic font-normal" style={{ color: MINT }}>
        {italic}
      </em>
      {after}
    </h2>
  );
}

/* ---------------- Sections ---------------- */

function Hero() {
  return (
    <section
      className="relative pt-32 pb-20 px-6 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top right, rgba(15, 76, 65, 0.35), transparent 60%), radial-gradient(ellipse at bottom left, rgba(46, 230, 168, 0.08), transparent 55%), #0a0c10",
      }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-[1.15fr_1fr] gap-12 md:gap-16 items-center">
        <div>
          <Label>Para donos de cervejaria</Label>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight"
            style={{ ...serif, color: "#f0ece5" }}
          >
            Sua cervejaria não precisa de mais uma ferramenta.
          </h1>
          <p
            className="mt-6 text-xl md:text-2xl leading-snug"
            style={{ ...serif, color: MINT }}
          >
            Precisa perder menos tempo, dinheiro e controle.
          </p>
          <div
            className="mt-8 space-y-4 max-w-xl text-base md:text-lg leading-relaxed"
            style={{ ...sans, color: "#b8b3a8" }}
          >
            <p>
              Na Cervejaria Complô, uma rede com 5 unidades, transformamos processos manuais e informações espalhadas em uma operação centralizada.
            </p>
            <p>
              A folha de freelancers, que consumia um dia inteiro do gerente toda semana, passou a levar cerca de 2 horas por mês.
            </p>
            <p>
              Também organizamos atendimento, indicadores, controle de qualidade, treinamento e processos internos em um único sistema.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CTA>Falar sobre minha cervejaria</CTA>
            <a
              href="#case"
              className="inline-flex items-center rounded-full px-5 py-3 text-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0c10]"
              style={{ color: TEAL, border: "1px solid rgba(79,214,176,0.35)", ...sans }}
            >
              Ver o projeto da Complô ↓
            </a>
          </div>
          <p className="mt-6 text-xs" style={{ ...sans, color: "#6b6558", letterSpacing: "0.04em" }}>
            Projeto desenvolvido para uma rede com 5 unidades.
          </p>
        </div>
        <div className="relative w-full max-w-md justify-self-center md:justify-self-end">
          <img
            src={complotap.url}
            alt="Chopp da Cervejaria Complô sendo servido em uma chopeira de madeira"
            className="w-full h-[380px] md:h-[520px] object-cover rounded-2xl"
            style={{ filter: "brightness(0.88)" }}
            loading="eager"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              boxShadow: "inset 0 0 80px 20px rgba(10,12,16,0.75)",
              background:
                "radial-gradient(ellipse at center, transparent 55%, rgba(10,12,16,0.55) 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

function ProofBar() {
  return (
    <section
      id="case"
      className="px-6 py-20 border-y scroll-mt-24"
      style={{ background: "#0d1014", borderColor: "rgba(255,255,255,0.05)" }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <div>
          <Label>Projeto real. Operação real.</Label>
          <SectionTitle before="O que construímos para a " italic="Cervejaria Complô" after="." />
          <p className="mt-6 text-lg leading-relaxed" style={{ ...sans, color: "#cfc9bc" }}>
            Durante 3 meses, entramos na operação da Complô, identificamos os principais gargalos e desenvolvemos uma estrutura integrada para suas 5 unidades.
          </p>
          <ul className="mt-6 space-y-3 text-[15px]" style={{ ...sans, color: "#cfc9bc" }}>
            {[
              "Registro de ponto e gestão de freelancers",
              "Controle de qualidade com IA",
              "Indicadores financeiros e operacionais",
              "Gestão das avaliações dos clientes",
              "Marketing e treinamento da equipe",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span aria-hidden="true" style={{ color: MINT }}>→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[15px] leading-relaxed" style={{ ...sans, color: "#b8b3a8" }}>
            O resultado foi menos trabalho manual, mais controle e decisões baseadas no que realmente acontece na operação.
          </p>
        </div>
        <div
          className="relative flex items-center justify-center rounded-2xl overflow-hidden px-10 py-16 min-h-[240px] bg-cover bg-center"
          style={{ backgroundImage: `url(${comploGarden.url})` }}
          role="img"
          aria-label="Área externa da Cervejaria Complô"
        >
          <div aria-hidden="true" className="absolute inset-0" style={{ background: "rgba(10,12,16,0.7)" }} />
          <img
            src="/complo-logo-white.png"
            alt="Logo Cervejaria Complô"
            className="relative max-h-[140px] w-auto object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

function Pain() {
  const cards = [
    {
      title: "Tempo perdido",
      body:
        "O gerente perde horas fechando folhas, conferindo informações e montando relatórios manualmente.",
    },
    {
      title: "Informação espalhada",
      body:
        "Vendas, estoque, equipe e avaliações ficam divididos entre sistemas, planilhas, WhatsApp e a cabeça das pessoas.",
    },
    {
      title: "Falta de padrão",
      body:
        "Cada unidade executa os processos de um jeito, e o problema só aparece depois que já virou reclamação, retrabalho ou prejuízo.",
    },
  ];
  return (
    <section className="px-6 py-24" style={{ background: CREAM }}>
      <div className="max-w-6xl mx-auto">
        <Label onCream>A realidade da operação</Label>
        <SectionTitle before="O problema não está na " italic="cerveja" after="." onCream />
        <p className="mt-4 text-lg" style={{ ...sans, color: "#4a4638" }}>
          Está no que acontece nos bastidores.
        </p>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <article
              key={c.title}
              className="bg-white rounded-2xl p-8 shadow-sm"
              style={{ border: "1px solid rgba(0,0,0,0.04)" }}
            >
              <h3 className="text-2xl mb-3 leading-snug" style={{ ...serif, color: DARK }}>
                {c.title}
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ ...sans, color: "#4a4638" }}>
                {c.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solution() {
  return (
    <section className="px-6 py-24" style={{ background: DARK }}>
      <div className="max-w-4xl mx-auto">
        <Label>Uma visão única da operação</Label>
        <SectionTitle
          before="Seus dados já existem. "
          italic="Eles só não trabalham juntos"
          after="."
        />
        <div className="mt-8 space-y-4 text-lg leading-relaxed" style={{ ...sans, color: "#b8b3a8" }}>
          <p>
            Sua cervejaria gera informações todos os dias: vendas, estoque, horas da equipe, avaliações, anúncios e resultados por unidade.
          </p>
          <p>
            Nós conectamos esses dados em um único ambiente e usamos inteligência artificial para transformar números em respostas práticas.
          </p>
        </div>
        <ul className="mt-8 grid sm:grid-cols-2 gap-3 text-[15px]" style={{ ...sans, color: "#cfc9bc" }}>
          {[
            "Onde a operação está perdendo dinheiro",
            "Qual unidade precisa de atenção",
            "O que está saindo do padrão",
            "Qual ação deve ser tomada primeiro",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span aria-hidden="true" style={{ color: MINT }}>→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p
          className="mt-10 text-xl md:text-2xl leading-snug"
          style={{ ...serif, color: "#f0ece5" }}
        >
          O gerente deixa de receber apenas números.{" "}
          <em className="italic" style={{ color: MINT }}>
            Passa a receber respostas.
          </em>
        </p>
      </div>
    </section>
  );
}

function Modules() {
  const modules = [
    {
      n: "01",
      title: "Ponto, freelancers e documentação",
      body: [
        "O colaborador registra o ponto pelo aplicativo, com verificação de localização.",
        "Freelancers assinam o contrato digital no primeiro acesso.",
        "As horas são consolidadas automaticamente e a folha chega pronta para o financeiro.",
      ],
      highlight:
        "Na Complô, o processo caiu de um dia por semana para cerca de 2 horas por mês.",
    },
    {
      n: "02",
      title: "Qualidade acompanhada por IA",
      body: [
        "A equipe realiza checklists de abertura e fechamento com fotos.",
        "A IA analisa os registros e identifica falhas de padrão.",
        "Quando algo sai do esperado, o gerente recebe um alerta no WhatsApp com unidade, horário, responsável e item que precisa ser corrigido.",
      ],
    },
    {
      n: "03",
      title: "Painel central da operação",
      body: [
        "Integramos as informações dos sistemas que a cervejaria já utiliza.",
        "O painel pode reunir faturamento, estoque, ticket médio, produtos mais vendidos, horários, desempenho por unidade e perfil dos clientes.",
        "Toda semana, a gestão recebe os principais insights e pontos de ação.",
      ],
    },
    {
      n: "04",
      title: "Avaliações e satisfação dos clientes",
      body: [
        "Avaliações do Google e pesquisas de satisfação entram no painel automaticamente.",
        "A IA identifica reclamações recorrentes, tendências e problemas específicos de cada unidade.",
        "Assim, a gestão corrige o problema antes que ele vire padrão.",
      ],
    },
    {
      n: "05",
      title: "Marketing e treinamento",
      body: [
        "Dados de Instagram e anúncios podem ser acompanhados junto aos resultados da operação.",
        "Também criamos treinamentos com vídeos, materiais, avaliações e acompanhamento da equipe.",
        "O funcionário deixa de aprender apenas observando outra pessoa.",
      ],
    },
  ];

  return (
    <section className="px-6 py-24" style={{ background: CREAM }}>
      <div className="max-w-4xl mx-auto">
        <Label onCream>O que roda dentro do projeto</Label>
        <SectionTitle before="Cinco frentes. " italic="Um único projeto" after="." onCream />
        <div className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {modules.map((m, i) => (
              <AccordionItem
                key={m.n}
                value={`module-${i}`}
                style={{ borderColor: "rgba(10,12,16,0.12)" }}
              >
                <AccordionTrigger
                  className="text-left hover:no-underline py-5"
                  style={{ ...sans, color: DARK }}
                >
                  <span className="flex items-baseline gap-4">
                    <span
                      className="text-3xl leading-none"
                      style={{ ...serif, color: MINT }}
                      aria-hidden="true"
                    >
                      {m.n}
                    </span>
                    <span className="text-lg md:text-xl" style={{ fontWeight: 500 }}>
                      {m.title}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    className="pl-12 space-y-3 text-[15px] leading-relaxed"
                    style={{ ...sans, color: "#4a4638" }}
                  >
                    {m.body.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                    {m.highlight && (
                      <p
                        className="mt-4 rounded-lg px-4 py-3 text-sm"
                        style={{
                          background: "rgba(46, 230, 168, 0.14)",
                          color: "#0f766e",
                          fontWeight: 500,
                        }}
                      >
                        {m.highlight}
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

function Results() {
  const cards = [
    {
      metric: "1 dia por semana → cerca de 2 horas por mês",
      caption: "Tempo dedicado à organização da folha dos freelancers.",
      featured: true,
    },
    {
      metric: "Mais segurança documental",
      caption:
        "Contratos, pontos e registros passam a ser gerados e armazenados dentro do processo.",
    },
    {
      metric: "Mais consistência entre unidades",
      caption:
        "Checklists, treinamentos e alertas ajudam todas as lojas a seguir o mesmo padrão.",
    },
    {
      metric: "Decisões com contexto",
      caption:
        "A gestão recebe informações organizadas e pontos de ação, não apenas números espalhados.",
    },
  ];
  return (
    <section className="px-6 py-24" style={{ background: DARK }}>
      <div className="max-w-6xl mx-auto">
        <Label>Resultados do projeto</Label>
        <SectionTitle before="O que mudou " italic="na prática" after="." />
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {cards.map((c) => (
            <article
              key={c.metric}
              className={`rounded-2xl p-8 ${c.featured ? "md:col-span-2" : ""}`}
              style={{
                background: c.featured ? "rgba(46,230,168,0.06)" : "rgba(255,255,255,0.03)",
                border: c.featured
                  ? "1px solid rgba(46,230,168,0.25)"
                  : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className={`${c.featured ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"} leading-tight mb-3`}
                style={{ ...serif, color: c.featured ? MINT : "#f0ece5" }}
              >
                {c.metric}
              </div>
              <p className="text-[15px] leading-relaxed" style={{ ...sans, color: "#b8b3a8" }}>
                {c.caption}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Diagnóstico",
      body:
        "Analisamos sistemas, equipe, unidades e processos. Você recebe uma visão clara de onde tempo, dinheiro e controle estão escapando.",
    },
    {
      n: "02",
      title: "Projeto sob medida",
      body:
        "Sua cervejaria não precisa necessariamente de todos os módulos. Definimos o escopo com base nos gargalos identificados e no retorno esperado.",
    },
    {
      n: "03",
      title: "Implementação",
      body:
        "Construímos por etapas, treinamos a equipe e acompanhamos os resultados. O que precisar ser ajustado, é ajustado.",
    },
  ];
  return (
    <section className="px-6 py-24" style={{ background: CREAM }}>
      <div className="max-w-6xl mx-auto">
        <Label onCream>Como funciona</Label>
        <SectionTitle before="Três etapas. " italic="Só isso" after="." onCream />
        <ol className="mt-12 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <li
              key={s.n}
              className="bg-white rounded-2xl p-8 shadow-sm"
              style={{ border: "1px solid rgba(0,0,0,0.04)" }}
            >
              <div
                className="text-5xl mb-4 leading-none"
                style={{ ...serif, color: MINT }}
                aria-hidden="true"
              >
                {s.n}
              </div>
              <h3 className="text-2xl mb-3" style={{ ...serif, color: DARK }}>
                {s.title}
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ ...sans, color: "#4a4638" }}>
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="px-6 py-24" style={{ background: DARK }}>
      <div className="max-w-3xl mx-auto">
        <Label>Investimento</Label>
        <SectionTitle
          before="Você investe no que "
          italic="fizer sentido"
          after=" para a operação."
        />
        <div className="mt-8 space-y-4 text-lg leading-relaxed" style={{ ...sans, color: "#b8b3a8" }}>
          <p>O projeto tem um valor de desenvolvimento e uma mensalidade de acompanhamento.</p>
          <p>
            O investimento depende do escopo, porque uma cervejaria com uma unidade não enfrenta os mesmos problemas de uma rede com cinco.
          </p>
          <p>
            Antes de qualquer implementação, calculamos o impacto esperado. Se a conta não fechar a favor da cervejaria, não recomendamos o projeto.
          </p>
        </div>
        <div className="mt-8">
          <CTA>Quero fazer essa conta</CTA>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "Preciso trocar meu sistema atual?",
      a: "Não necessariamente. Podemos integrar as ferramentas que você já utiliza.",
    },
    {
      q: "Funciona para cervejaria com uma unidade?",
      a: "Sim, desde que exista um problema operacional que justifique o investimento.",
    },
    {
      q: "Preciso contratar alguém de tecnologia?",
      a: "Não. Nós desenvolvemos, implementamos e treinamos a equipe.",
    },
    {
      q: "Minha equipe vai conseguir usar?",
      a: "O sistema é criado para a rotina da operação, não para especialistas em tecnologia.",
    },
    {
      q: "E se o projeto não fizer sentido para minha cervejaria?",
      a: "Nós falamos isso durante o diagnóstico.",
    },
  ];
  return (
    <section className="px-6 py-24" style={{ background: CREAM }}>
      <div className="max-w-3xl mx-auto">
        <Label onCream>Perguntas frequentes</Label>
        <h2 className="text-4xl md:text-5xl leading-tight mb-8" style={{ ...serif, color: DARK }}>
          Perguntas frequentes
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {items.map((it, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              style={{ borderColor: "rgba(10,12,16,0.12)" }}
            >
              <AccordionTrigger
                className="text-left text-lg hover:no-underline"
                style={{ ...sans, color: DARK, fontWeight: 500 }}
              >
                {it.q}
              </AccordionTrigger>
              <AccordionContent
                className="text-[15px] leading-relaxed"
                style={{ ...sans, color: "#4a4638" }}
              >
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section
      className="relative px-6 py-28 text-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${comploCheers.url})` }}
      aria-label="Convite para conversar sobre a sua operação"
    >
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "rgba(10,12,16,0.84)" }} />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(46, 230, 168, 0.12), transparent 60%)",
        }}
      />
      <div className="relative max-w-3xl mx-auto">
        <Label>Vamos conversar</Label>
        <SectionTitle before="Vamos conversar sobre " italic="a sua operação" after="?" />
        <div className="mt-6 space-y-3 text-lg leading-relaxed" style={{ ...sans, color: "#cfc9bc" }}>
          <p>Sem apresentação genérica de inteligência artificial.</p>
          <p>
            A conversa começa pelos problemas que estão consumindo tempo, dinheiro ou controle dentro da sua cervejaria.
          </p>
        </div>
        <div className="mt-8">
          <CTA>Falar no WhatsApp</CTA>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="px-6 py-10 border-t"
      style={{ background: "#080a0d", borderColor: "rgba(255,255,255,0.05)", ...sans }}
    >
      <div
        className="max-w-6xl mx-auto flex flex-wrap justify-center md:justify-between gap-4 text-sm"
        style={{ color: "#6b6558" }}
      >
        <div>© 2026 Veehtor AI LLC.</div>
        <div className="flex gap-6">
          <a href="https://veehtor.com" className="hover:text-white transition-colors">
            veehtor.com
          </a>
          <a href="mailto:vitor@veehtor.com" className="hover:text-white transition-colors">
            vitor@veehtor.com
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Cervejarias() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "IA e automação para cervejarias | Veehtor AI";
    const meta =
      document.querySelector('meta[name="description"]') ||
      (() => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
        return m;
      })();
    const prevDesc = meta.getAttribute("content");
    meta.setAttribute(
      "content",
      "Veja como a Veehtor AI ajudou uma rede de 5 cervejarias a reduzir trabalho manual, organizar a operação e transformar dados em decisões.",
    );
    return () => {
      document.title = prevTitle;
      if (prevDesc) meta.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ background: DARK }}>
      <Header />
      <main>
        <Hero />
        <ProofBar />
        <Pain />
        <Solution />
        <Modules />
        <Results />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
