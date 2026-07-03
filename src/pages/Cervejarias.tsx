import React, { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=5511973022058";

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
      style={{
        letterSpacing: "0.24em",
        color: onCream ? "#0f766e" : TEAL,
        ...sans,
      }}
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
        "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-medium transition-all hover:scale-[1.02] hover:shadow-lg " +
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
      style={{
        background: "rgba(10, 12, 16, 0.75)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2" style={sans}>
          <span
            className="text-lg tracking-tight"
            style={{ color: "#e8e4dd", fontWeight: 500 }}
          >
            Veehtor
          </span>
          <span
            className="text-lg tracking-tight italic"
            style={{ color: MINT, ...serif }}
          >
            AI
          </span>
        </div>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-[1.03]"
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
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-110"
      style={{
        width: 60,
        height: 60,
        background: MINT,
        boxShadow: "0 10px 30px rgba(46, 230, 168, 0.4)",
      }}
    >
      <svg viewBox="0 0 24 24" width="30" height="30" fill={DARK}>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.78 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.24 8.24 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.98-.14.16-.29.19-.54.06-.25-.12-1.05-.39-2-1.23a7.5 7.5 0 0 1-1.38-1.72c-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14 0-.31-.02-.47-.02s-.43.06-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.68 4.24 3.76.59.26 1.05.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z" />
      </svg>
    </a>
  );
}

function TitleWithItalic({
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
      className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight"
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
      className="relative pt-32 pb-24 px-6 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top right, rgba(15, 76, 65, 0.35), transparent 60%), radial-gradient(ellipse at bottom left, rgba(46, 230, 168, 0.08), transparent 55%), #0a0c10",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <Label>Para donos de cervejaria</Label>
        <TitleWithItalic
          before="Menos tempo perdido. Menos dinheiro jogado fora. "
          italic="Menos erro na operação."
        />
        <p
          className="mt-8 max-w-3xl text-lg md:text-xl leading-relaxed"
          style={{ ...sans, color: "#b8b3a8" }}
        >
          A gente melhorou a operação da Complô — 5 cervejarias — unificando tudo
          num só painel inteligente. A folha de pagamento que tomava um dia agora
          leva 30 minutos. Segurança jurídica para a empresa e para os colaboradores.
          O padrão de qualidade, auditado por IA em cada abertura e fechamento. E
          você só investe no que se paga.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <CTA />
          <a
            href="#case"
            className="text-sm underline underline-offset-4 transition-colors"
            style={{ color: TEAL, ...sans }}
          >
            Ver o que a gente fez ↓
          </a>
        </div>
      </div>
    </section>
  );
}

function ProofBar() {
  return (
    <section
      id="case"
      className="px-6 py-16 border-y"
      style={{ background: "#0d1014", borderColor: "rgba(255,255,255,0.05)" }}
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_auto] gap-10 items-center">
        <div>
          <Label>Projeto real, resultado real</Label>
          <p
            className="text-lg md:text-xl leading-relaxed"
            style={{ ...sans, color: "#cfc9bc" }}
          >
            Durante 3 meses, desenvolvemos o projeto com a Complô — uma rede de 5
            cervejarias consolidada e em plena operação. Mapeamos o negócio e
            construímos ponto eletrônico, controle de qualidade, gestão financeira,
            marketing e treinamento: tudo num só lugar, potencializado por
            inteligência artificial.
          </p>
        </div>
        <div
          className="flex items-center justify-center rounded-xl border-2 border-dashed px-10 py-8 min-w-[180px]"
          style={{ borderColor: "rgba(46,230,168,0.3)", color: "#6b6558", ...sans }}
        >
          <span className="text-sm">logo Complô</span>
        </div>
      </div>
    </section>
  );
}

function PainMirror() {
  const cols = [
    {
      emoji: "💸",
      title: "O risco que já custou caro",
      body:
        "Freelancer em pico é a regra da operação - e uma bomba-relógio. Um pedido de vínculo na Justiça do Trabalho pode passar de R$ 80 mil, mesmo com contrato assinado. A maioria dos donos só descobre o tamanho do rombo quando a intimação chega.",
    },
    {
      emoji: "🧾",
      title: "A gestão no escuro",
      body:
        "Qual das suas unidades está furando o caixa? Qual freela rende de verdade? Qual produto some do estoque sem explicação? Se a resposta mora numa planilha ou na cabeça do gerente, você está decidindo no achismo.",
    },
    {
      emoji: "🔥",
      title: "O padrão que não se sustenta",
      body:
        "O CO2 acaba no meio do movimento. A unidade abre torta e ninguém percebe. Cada gerente faz do seu jeito. Quanto mais lojas, mais difícil garantir que todas entreguem o mesmo padrão - e o cliente sente na primeira visita ruim.",
    },
  ];
  return (
    <section className="px-6 py-24" style={{ background: CREAM }}>
      <div className="max-w-6xl mx-auto">
        <Label onCream>A realidade de quem toca cervejaria</Label>
        <TitleWithItalic
          before="Você não tem um problema de cerveja. Você tem um problema de "
          italic="operação"
          after="."
          onCream
        />
        <p
          className="mt-6 max-w-3xl text-lg leading-relaxed"
          style={{ ...sans, color: "#4a4638" }}
        >
          A cerveja é boa, o público aparece. Mas nos bastidores é tudo no braço - e é
          aí que o dinheiro escorre.
        </p>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {cols.map((c) => (
            <div
              key={c.title}
              className="bg-white rounded-2xl p-8 shadow-sm"
              style={{ border: "1px solid rgba(0,0,0,0.04)" }}
            >
              <div className="text-3xl mb-4">{c.emoji}</div>
              <h3
                className="text-2xl mb-4 leading-snug"
                style={{ ...serif, color: DARK }}
              >
                {c.title}
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ ...sans, color: "#4a4638" }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TheShift() {
  const cards = [
    {
      emoji: "⏱",
      title: "Economia de tempo",
      body: "Folha, relatórios e conferências deixam de ser trabalho manual.",
    },
    {
      emoji: "💰",
      title: "Redução de gastos",
      body:
        "Risco trabalhista documentado, equipe dimensionada pelo movimento real, compras e promoções baseadas em dados.",
    },
    {
      emoji: "🎯",
      title: "Mitigação de erros",
      body:
        "Abertura e fechamento auditados por IA. Alerta no WhatsApp quando algo sai do padrão, em qualquer unidade.",
    },
  ];
  return (
    <section className="px-6 py-28" style={{ background: DARK }}>
      <div className="max-w-5xl mx-auto">
        <Label>A solução</Label>
        <TitleWithItalic
          before="Seus dados já existem. "
          italic="Eles só não dizem nada."
        />
        <div className="mt-10 space-y-6 max-w-3xl text-lg leading-relaxed" style={{ ...sans, color: "#b8b3a8" }}>
          <p>
            Toda cervejaria gera dados o dia inteiro: vendas no PDV, estoque, horas
            da equipe, avaliações no Google, resultado de anúncio. Mas cada
            informação está num lugar - planilha, sistema, caderno, cabeça do
            gerente. Isolados, esses números não significam nada.
          </p>
          <p>
            O caminho do crescimento é outro: coletar tudo, guardar num lugar só e
            transformar esses dados em informação útil - o que está funcionando, o
            que está dando prejuízo, o que fazer a respeito.
          </p>
          <p>
            Foi isso que a gente construiu na Complô: um sistema único que junta
            todos os dados da operação e usa IA pra transformá-los em insights e
            planos de ação. O gerente não recebe números. Recebe respostas.
          </p>
          <p style={{ color: "#e8e4dd" }}>Na prática, isso se resume a três coisas:</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl p-7"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="text-3xl mb-3">{c.emoji}</div>
              <h3 className="text-xl mb-3" style={{ ...serif, color: MINT }}>
                {c.title}
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ ...sans, color: "#b8b3a8" }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Modules() {
  const modules = [
    {
      n: "01",
      title: "Ponto, freelancers e proteção jurídica",
      dor:
        "Cervejaria depende de freelancer. Processos de vínculo empregatício custam caro - na Complô, já tinham passado de R$ 100 mil. E fechar a folha dos freelancers tomava um dia por semana do gerente.",
      faz:
        "Ponto com verificação por GPS. Contrato digital assinado pelo freelancer no primeiro login e arquivado no banco de dados. Horas registradas automaticamente e folha enviada pronta para o financeiro.",
      muda:
        "A documentação que protege a empresa é gerada todo dia, sozinha. O fechamento da folha caiu de um dia para 30 minutos.",
    },
    {
      n: "02",
      title: "Qualidade auditada por IA",
      dor:
        "Cada unidade abre e fecha do seu jeito. Erros como CO2 no fim ou geladeira vazia só aparecem quando o cliente reclama.",
      faz:
        "Checklist de abertura e fechamento com foto obrigatória em cada etapa. A IA analisa cada foto e dá uma nota. Nota baixa gera alerta imediato no WhatsApp do gerente, com foto, item, horário e responsável.",
      muda:
        "Todas as unidades seguem o mesmo padrão, sem o gerente precisar estar presente. O painel mostra quem executa bem e quem não.",
    },
    {
      n: "03",
      title: "Painel único da operação",
      dor:
        "Faturamento num sistema, estoque noutro. Perguntas básicas - qual loja rende menos, qual produto some, quem são os melhores clientes - não têm resposta.",
      faz:
        "Integramos seus sistemas (Cardápio Web, Bier Held ou qualquer outro, mesmo sem API) num painel único: faturamento por loja e horário, ticket médio, estoque, produtos e combos mais vendidos, perfil dos clientes. Uma IA analisa os dados e envia insights e planos de ação por unidade, toda semana.",
      muda: "As decisões passam a ser tomadas com dados, não por estimativa.",
    },
    {
      n: "04",
      title: "Avaliações e satisfação do cliente",
      dor:
        "Avaliações negativas no Google ficam sem resposta e o dono descobre o problema semanas depois.",
      faz:
        "Toda avaliação do Google entra no painel automaticamente, junto com uma pesquisa NPS aplicada em cada unidade. A IA identifica o que está derrubando a nota. Reclamações recorrentes viram alerta. As respostas são feitas pelo próprio painel.",
      muda:
        "O problema chega até você em dias, não semanas - com indicação clara do que corrigir em cada loja.",
    },
    {
      n: "05",
      title: "Marketing e treinamento de equipe",
      dor:
        "Investimento em anúncio sem saber o retorno. Treinamento de novos funcionários informal, sem padrão.",
      faz:
        "Dados do Instagram e Meta Ads no painel: o que engaja, o que dá retorno, quando um anúncio perde desempenho. E uma plataforma de treinamento onde a IA monta cursos sob demanda - vídeo, apostila e prova. O gerente delega o curso com prazo e acompanha pelo ranking.",
      muda:
        "O investimento em marketing passa a ser medido. Funcionário novo só assume a função depois de aprovado no treinamento.",
    },
  ];

  return (
    <section className="px-6 py-28" style={{ background: CREAM }}>
      <div className="max-w-6xl mx-auto">
        <Label onCream>O que roda dentro do app</Label>
        <TitleWithItalic
          before=""
          italic="Uma operação inteira"
          after=" em cinco módulos."
          onCream
        />
        <div className="mt-16 space-y-6">
          {modules.map((m) => (
            <div
              key={m.n}
              className="bg-white rounded-2xl p-8 md:p-10 shadow-sm grid md:grid-cols-[auto_1fr] gap-8"
              style={{ border: "1px solid rgba(0,0,0,0.04)" }}
            >
              <div
                className="text-6xl md:text-7xl leading-none"
                style={{ ...serif, color: MINT }}
              >
                {m.n}
              </div>
              <div>
                <h3
                  className="text-2xl md:text-3xl mb-6"
                  style={{ ...serif, color: DARK }}
                >
                  {m.title}
                </h3>
                <div className="grid md:grid-cols-3 gap-6" style={sans}>
                  <div>
                    <div
                      className="text-xs uppercase mb-2"
                      style={{ letterSpacing: "0.18em", color: "#c14a4a" }}
                    >
                      A dor
                    </div>
                    <p className="text-[15px] leading-relaxed" style={{ color: "#4a4638" }}>
                      {m.dor}
                    </p>
                  </div>
                  <div>
                    <div
                      className="text-xs uppercase mb-2"
                      style={{ letterSpacing: "0.18em", color: "#0f766e" }}
                    >
                      O que fazemos
                    </div>
                    <p className="text-[15px] leading-relaxed" style={{ color: "#4a4638" }}>
                      {m.faz}
                    </p>
                  </div>
                  <div>
                    <div
                      className="text-xs uppercase mb-2"
                      style={{ letterSpacing: "0.18em", color: "#0f766e" }}
                    >
                      O que muda
                    </div>
                    <p className="text-[15px] leading-relaxed" style={{ color: "#4a4638" }}>
                      {m.muda}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RealResults() {
  return (
    <section className="px-6 py-28" style={{ background: DARK }}>
      <div className="max-w-5xl mx-auto">
        <Label>O que já mudou na Complô</Label>
        <TitleWithItalic
          before="Sem promessa inflada. Só "
          italic="números reais"
          after="."
        />
        <div className="mt-16 grid md:grid-cols-2 gap-14">
          <div>
            <div
              className="text-6xl md:text-7xl leading-none mb-4"
              style={{ ...serif, color: MINT }}
            >
              1 dia → 30 min
            </div>
            <div
              className="text-xs uppercase mb-3"
              style={{ letterSpacing: "0.22em", color: TEAL, ...sans }}
            >
              Fechamento da folha de freelancers
            </div>
            <p className="text-base leading-relaxed" style={{ ...sans, color: "#b8b3a8" }}>
              O que tomava um dia por semana do gerente agora leva 30 minutos.
            </p>
          </div>
          <div>
            <div
              className="text-6xl md:text-7xl leading-none mb-4"
              style={{ ...serif, color: MINT }}
            >
              R$ 100 mil+
            </div>
            <div
              className="text-xs uppercase mb-3"
              style={{ letterSpacing: "0.22em", color: TEAL, ...sans }}
            >
              Em risco trabalhista, agora documentado
            </div>
            <p className="text-base leading-relaxed" style={{ ...sans, color: "#b8b3a8" }}>
              Valor que a Complô já havia perdido em processos de vínculo. Hoje, cada
              freelancer assina contrato digital no primeiro login - e a documentação
              que protege a empresa se constrói sozinha, todo dia.
            </p>
          </div>
        </div>
        <p
          className="mt-16 max-w-3xl italic text-base leading-relaxed"
          style={{ ...sans, color: "#8a8578" }}
        >
          A implementação na Complô é recente. Os indicadores de faturamento, ticket
          médio e satisfação ainda estão sendo medidos - e nós não inventamos
          números. O que apresentamos aqui é o que já foi comprovado. O restante,
          medimos junto com você, na sua operação.
        </p>
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
        "Conversamos e analisamos sua operação: sistemas, equipe, unidades, onde o tempo e o dinheiro estão indo embora. Você recebe um mapa claro dos problemas e do que resolver primeiro.",
    },
    {
      n: "02",
      title: "Proposta sob medida",
      body:
        "Nem toda cervejaria precisa dos 5 módulos. Montamos o escopo a partir do diagnóstico, com projeção de quando o investimento se paga. Você aprova antes de qualquer implementação.",
    },
    {
      n: "03",
      title: "Implementação e acompanhamento",
      body:
        "Colocamos o sistema pra rodar por fases, treinamos sua equipe e acompanhamos os indicadores. O que não funcionar, ajustamos.",
    },
  ];
  return (
    <section className="px-6 py-28" style={{ background: CREAM }}>
      <div className="max-w-6xl mx-auto">
        <Label onCream>Como funciona</Label>
        <TitleWithItalic
          before="Três etapas. "
          italic="Só isso"
          after="."
          onCream
        />
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="bg-white rounded-2xl p-8 shadow-sm"
              style={{ border: "1px solid rgba(0,0,0,0.04)" }}
            >
              <div
                className="text-5xl mb-6 leading-none"
                style={{ ...serif, color: MINT }}
              >
                {s.n}
              </div>
              <h3 className="text-2xl mb-4" style={{ ...serif, color: DARK }}>
                {s.title}
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ ...sans, color: "#4a4638" }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="px-6 py-28" style={{ background: DARK }}>
      <div className="max-w-4xl mx-auto">
        <Label>Quanto custa</Label>
        <TitleWithItalic
          before="Você só investe no que "
          italic="se paga"
          after="."
        />
        <div className="mt-10 space-y-6 text-lg leading-relaxed" style={{ ...sans, color: "#b8b3a8" }}>
          <p>
            Nossa precificação parte de uma conta simples: quanto a sua operação
            perde hoje em tempo, risco e erro - e em quanto tempo o investimento
            retorna. Se a conta não fechar a seu favor, a gente é o primeiro a dizer
            que não vale a pena.
          </p>
          <p>
            O modelo: um valor de desenvolvimento do projeto + uma mensalidade de
            acompanhamento. Os valores dependem do diagnóstico, porque cada operação
            é diferente.
          </p>
        </div>
        <div className="mt-10">
          <CTA />
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "Preciso trocar meu sistema atual?",
      a: "Não. A gente integra com o que você já usa - Cardápio Web, Bier Held ou qualquer outro sistema, mesmo os que não têm API.",
    },
    {
      q: "Funciona pra quem tem uma unidade só?",
      a: "Sim. O sistema foi construído numa rede de 5 cervejarias, mas os módulos funcionam de forma independente. No diagnóstico, definimos o que faz sentido pro seu tamanho.",
    },
    {
      q: "Quanto tempo leva pra implementar?",
      a: "Depende do escopo. A entrega é feita por fases - os primeiros módulos entram em operação enquanto os demais são desenvolvidos. O prazo é definido no diagnóstico.",
    },
    {
      q: "Minha equipe vai saber usar?",
      a: "Sim. A interface é simples — login por CPF, checklist com foto, alertas no WhatsApp. Além disso, desenvolvemos um treinamento específico para o uso da ferramenta e oferecemos acompanhamento mensal, garantindo que a equipe aproveite tudo o que o sistema entrega.",
    },
    {
      q: "E se não funcionar pra minha operação?",
      a: "Por isso começamos pelo diagnóstico. Antes de qualquer contrato de implementação, você recebe a análise da sua operação e a projeção de retorno. Sem surpresa.",
    },
  ];
  return (
    <section className="px-6 py-28" style={{ background: CREAM }}>
      <div className="max-w-3xl mx-auto">
        <Label onCream>Perguntas frequentes</Label>
        <h2
          className="text-4xl md:text-5xl leading-tight mb-10"
          style={{ ...serif, color: DARK }}
        >
          O que você precisa saber antes de conversar.
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {items.map((it, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
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
      className="px-6 py-32 text-center"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(46, 230, 168, 0.10), transparent 60%), #0a0c10",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <Label>Vamos conversar</Label>
        <TitleWithItalic
          before="Quer ver o que isso faz "
          italic="na sua cervejaria"
          after="?"
        />
        <p
          className="mt-8 text-lg leading-relaxed"
          style={{ ...sans, color: "#b8b3a8" }}
        >
          Chama no WhatsApp. A gente conversa sobre a sua operação, sem compromisso -
          e você decide se faz sentido seguir pro diagnóstico.
        </p>
        <div className="mt-10">
          <CTA />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="px-6 py-10 border-t"
      style={{
        background: "#080a0d",
        borderColor: "rgba(255,255,255,0.05)",
        ...sans,
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center md:justify-between gap-4 text-sm" style={{ color: "#6b6558" }}>
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
    document.title = "Veehtor AI - Operação inteligente para cervejarias";
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
      "Menos tempo perdido, menos dinheiro jogado fora, menos erro na operação. Painel único com IA para cervejarias: ponto, qualidade, gestão, avaliações e treinamento."
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
        <PainMirror />
        <TheShift />
        <Modules />
        <RealResults />
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
