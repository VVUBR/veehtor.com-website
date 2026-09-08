import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Logo } from "@/components/site/Logo";
import complotap from "@/assets/complo-tap.jpg.asset.json";
import comploGarden from "@/assets/complo-garden.jpg.asset.json";
import vitorPhoto from "@/assets/vitor-ungari.jpg.asset.json";

const WHATSAPP_NUMBER = "17816559279";
const WHATSAPP_TEXT =
  "Olá, Vitor. Vi a página para cervejarias e quero falar sobre a rotina que está travando a minha operação.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

const NAVY = "#111828";
const TEAL = "#15B7A8";
const TEAL_DARK = "#0E8F84";
const ORANGE = "#F87316";
const GREEN = "#21C65D";
const INK = "#030619";
const LIGHT_1 = "#E6E7E9";
const LIGHT_2 = "#DBDCE0";

const display: React.CSSProperties = {
  fontFamily: "'Carlito', 'Calibri', 'Inter', system-ui, sans-serif",
  fontWeight: 700,
};
const body: React.CSSProperties = {
  fontFamily: "'Inter', 'Carlito', system-ui, sans-serif",
};

/* ---------------- Primitives ---------------- */

function Kicker({ children, onLight = false }: { children: React.ReactNode; onLight?: boolean }) {
  return (
    <div
      className="uppercase mb-5"
      style={{
        ...body,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: "0.14em",
        color: onLight ? TEAL_DARK : TEAL,
      }}
    >
      {children}
    </div>
  );
}

function H2({ children, onLight = false }: { children: React.ReactNode; onLight?: boolean }) {
  return (
    <h2
      className="text-[26px] sm:text-[32px] md:text-[40px] leading-[1.1] mb-6"
      style={{ ...display, color: onLight ? INK : "#FFFFFF" }}
    >
      {children}
    </h2>
  );
}




function ScrollButton({
  children,
  variant = "solid",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
}) {
  const solid: React.CSSProperties = { background: TEAL, color: NAVY };
  const ghost: React.CSSProperties = {
    background: "transparent",
    color: "#FFFFFF",
    border: "1px solid rgba(255,255,255,0.35)",
  };
  return (
    <a
      href="#conversa"
      className={
        "inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[16px] transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111828] " +
        className
      }
      style={{ ...body, fontWeight: 600, ...(variant === "solid" ? solid : ghost) }}
    >
      {children}
    </a>
  );
}

/* ---------------- Sections ---------------- */

function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md"
      style={{ background: "rgba(17, 24, 40, 0.9)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <a href="/" aria-label="Veehtor AI" className="flex items-center">
          <Logo textColor="#FFFFFF" className="h-6 w-auto" />
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-4 py-2 text-[14px] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111828]"
          style={{ ...body, fontWeight: 600, background: TEAL, color: NAVY }}
        >
          Falar sobre minha operação
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="px-6 pt-28 pb-20 md:pt-36 md:pb-28" style={{ background: NAVY }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-16 items-center">
        <div>
          <Kicker>Para donos de cervejaria e rede de bares</Kicker>
          <h1
            className="text-[32px] sm:text-[40px] md:text-[56px] lg:text-[60px] leading-[1.08]"
            style={{ ...display, color: "#FFFFFF", maxWidth: "20ch" }}
          >
            Sua cervejaria precisa perder menos tempo, dinheiro e controle.
          </h1>
          <p
            className="mt-7 text-[17px] md:text-[19px] leading-[1.6]"
            style={{ ...body, color: "rgba(255,255,255,0.82)", maxWidth: "68ch" }}
          >
            Você já tentou várias ferramentas. Trocou de PDV, montou planilha, comprou automação, colocou alguém do time para cuidar. E na sexta-feira o gerente continua fechando a folha na mão. A gente ataca sua rotina prioritária, coloca a solução dentro das ferramentas que a casa já usa, e mede o antes e o depois. Em 21 dias.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[16px] transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111828]"
              style={{ ...body, fontWeight: 600, background: TEAL, color: NAVY }}
            >
              Quero falar sobre a rotina que está travando
            </a>
            <a
              href="#case"
              className="inline-flex items-center rounded-full px-5 py-3.5 text-[15px] transition-colors hover:text-white"
              style={{ ...body, color: TEAL, border: "1px solid rgba(21,183,168,0.45)" }}
            >
              Ver o que construímos na Cervejaria Complô
            </a>
          </div>
          <p className="mt-6 text-[14px]" style={{ ...body, color: "rgba(255,255,255,0.55)" }}>
            Focamos nossa conversa nas rotinas da sua operação.
          </p>
        </div>
        <div className="w-full max-w-md justify-self-center md:justify-self-end">
          <img
            src={complotap.url}
            alt="Chopp sendo servido na torneira do bar durante o expediente"
            className="w-full h-[320px] md:h-[520px] object-cover rounded-2xl"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}

function Problema() {
  const cards = [
    {
      title: "O fechamento come o gerente.",
      text: "Folha de freela, conferência de comanda, fechamento de caixa, escala da semana. Quem deveria estar no salão passa o dia numa planilha, e o erro só aparece quando alguém reclama do pagamento.",
    },
    {
      title: "O dado existe, mas não conversa.",
      text: "Venda no PDV, taxa na maquininha, estoque numa planilha, avaliação no Google, escala no grupo do WhatsApp, pagamento de freelas. Cada número mora num lugar, e comparar uma unidade com a outra vira trabalho manual toda vez.",
    },
    {
      title: "Cada casa faz de um jeito.",
      text: "Abertura do bar, fechamento de caixa, limpeza de linha, troca de barril. Existe o padrão no papel (ou na cabeça do dono) e existe o que acontece na prática. A diferença aparece na nota baixa do Google, na reclamação de cliente, na quebra do estoque ou no CMV do mês, sempre depois.",
    },
  ];
  return (
    <section className="px-6 py-20 md:py-28" style={{ background: LIGHT_1 }}>
      <div className="max-w-6xl mx-auto">
        <Kicker onLight>A realidade da operação</Kicker>
        <H2 onLight>
          Assumimos que você entende de cerveja, e muito.{"\n"}O problema acontece antes e depois de servir a cerveja.
        </H2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div key={c.title} className="rounded-2xl p-7" style={{ background: LIGHT_2 }}>
              <h3 className="text-[20px] md:text-[22px] mb-3" style={{ ...display, color: INK }}>
                {c.title}
              </h3>
              <p className="text-[17px] leading-[1.6]" style={{ ...body, color: "#3A3F4C" }}>
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ParaQuem() {
  const yes = [
    "Sua operação roda quase todo dia, com equipe fixa e freela.",
    "Você tem mais de uma unidade, ou uma unidade com volume que já não cabe na cabeça de uma pessoa.",
    "A casa tem vários anos de operação.",
    "Você já tentou resolver isso com sistema, planilha ou automação, e o gargalo continua igual.",
    "A pessoa tomadora de decisão senta conosco na conversa.",
  ];
  const no = [
    "Você quer uma sistema mágico e lindo com IA que faz tudo \u201cplug and play\u201d (procure o coach guru, a gente é mais pragmático).",
    "Você quer trocar todos os sistemas da casa de uma vez.",
    "Não existe ninguém do lado de dentro da empresa que responda pelo processo.",
    "Você está feliz em receber reclamações de clientes e não quer encarar os problemas da sua operação.",
  ];
  const Item = ({ text, color }: { text: string; color: string }) => (
    <li className="flex gap-3 text-[17px] leading-[1.6]" style={{ ...body, color: "rgba(255,255,255,0.85)" }}>
      <span aria-hidden="true" style={{ color, fontWeight: 700 }}>
        •
      </span>
      <span>{text}</span>
    </li>
  );
  return (
    <section className="px-6 py-20 md:py-28" style={{ background: NAVY }}>
      <div className="max-w-5xl mx-auto">
        <H2>Isto não é para toda cervejaria.</H2>
        <div className="mt-10 grid md:grid-cols-2 gap-10 md:gap-14">
          <div>
            <h3 className="text-[20px] mb-5" style={{ ...display, color: TEAL }}>
              Faz sentido se
            </h3>
            <ul className="space-y-3">
              {yes.map((t) => (
                <Item key={t} text={t} color={TEAL} />
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[20px] mb-5" style={{ ...display, color: "rgba(255,255,255,0.6)" }}>
              Não faz sentido se
            </h3>
            <ul className="space-y-3">
              {no.map((t) => (
                <Item key={t} text={t} color="rgba(255,255,255,0.45)" />
              ))}
            </ul>
          </div>
        </div>
        <p
          className="mt-12 text-[17px] md:text-[19px] leading-[1.6]"
          style={{ ...body, color: ORANGE, maxWidth: "68ch" }}
        >
          Se cair na coluna da direita, a gente fala isso na primeira conversa e não propõe projeto.
        </p>
      </div>
    </section>
  );
}

function Prova() {
  return (
    <section id="case" className="px-6 py-20 md:py-28 scroll-mt-20" style={{ background: LIGHT_1 }}>
      <div className="max-w-5xl mx-auto">
        <Kicker onLight>Projeto real, operação real</Kicker>
        <H2 onLight>O que mudou na Cervejaria Complô, uma rede de cervejarias com 6 unidades</H2>

        <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 items-start">
          <div className="space-y-5">
            <p className="text-[17px] md:text-[19px] leading-[1.6]" style={{ ...body, color: "#3A3F4C", maxWidth: "68ch" }}>
              A rede operava com dezenas de freelancers por semana, checklist de abertura e fechamento no papel, sem foto e sem prova de que foi feito, e venda espalhada entre o sistema de pedidos, a maquininha e a planilha. O fechamento da folha de freela tomava um dia todo do gerente por semana.
            </p>
            <p className="text-[17px] md:text-[19px] leading-[1.6]" style={{ ...body, color: "#3A3F4C", maxWidth: "68ch" }}>
              Hoje o freela bate ponto pelo celular dentro da unidade com geolocalização, o checklist sai com foto conferida contra o padrão da casa, o pagamento é calculado e enviado por WhatsApp. 


Além disso, a gestão conta com um HUB de Inteligência completo da cervejaria, com um painel único de vendas, clientes, produtos, equipe e avaliações, além de um resumo semanal que indica o que olhar primeiro.
            </p>
          </div>
          <div className="w-full">
            <img
              src={comploGarden.url}
              alt="Beergarden cheio em noite de operação, com mesas ocupadas e equipe atendendo"
              className="w-full h-[240px] md:h-[300px] object-cover rounded-2xl"
              loading="lazy"
            />
            <img
              src="/complo-logo-white.png"
              alt="Logo da Cervejaria Complô"
              className="mt-6 h-10 w-auto"
              style={{ filter: "invert(1)" }}
              loading="lazy"
            />
          </div>
        </div>

        <div className="mt-12 rounded-2xl p-8 md:p-10" style={{ background: LIGHT_2 }}>
          <div className="text-[15px] uppercase mb-2" style={{ ...body, fontWeight: 700, letterSpacing: "0.14em", color: INK }}>
            Folha de freelancers
          </div>
          <div className="text-[36px] sm:text-[44px] md:text-[56px] leading-[1.05]" style={{ ...display, color: GREEN }}>
            De 1 dia para 15 min por semana
          </div>
          <p className="mt-4 text-[13px] leading-[1.5]" style={{ ...body, color: "#5B6070", maxWidth: "68ch" }}>
            Resultado medido na rotina de fechamento da folha. 
Os demais ganhos desta operação não foram medidos e não são apresentados aqui como resultado.
          </p>
        </div>

        <p className="mt-10 text-[17px] md:text-[19px] leading-[1.6]" style={{ ...body, color: "#3A3F4C", maxWidth: "68ch" }}>
          Essa rede não comprou tudo isso de uma vez. Foi uma frente por vez, cada uma funcionando e aprovada antes da próxima começar. É exatamente assim que a gente trabalha.
        </p>
      </div>
    </section>
  );
}

function Metodo() {
  const steps = [
    {
      n: "01",
      title: "Raio-X",
      text: "A gente entra em poucas rotinas ligadas à dor que você já sente. Não é diagnóstico da empresa inteira. É descobrir onde tempo e dinheiro estão vazando, com números na mão.",
    },
    {
      n: "02",
      title: "Prioridade Zero",
      text: "Escolhemos UMA rotina. A que junta retorno relevante, dado suficiente para construir, e chance real de a sua equipe usar no dia a dia.",
    },
    {
      n: "03",
      title: "Sistema Vivo",
      text: "Construímos a solução capaz de mudar aquela rotina, dentro das ferramentas que sua empresa já usa. É o fluxo rodando no trabalho real.",
    },
    {
      n: "04",
      title: "Antes e Depois",
      text: "Comparamos com a medida que registramos antes de construir. O que foi medido aparece como medido, o que é projeção aparece como projeção, separados. E aí você decide manter, corrigir, encerrar ou ampliar.",
    },
  ];
  return (
    <section className="px-6 py-20 md:py-28" style={{ background: NAVY }}>
      <div className="max-w-5xl mx-auto">
        <Kicker>O método</Kicker>
        <H2>Quatro etapas. 21 dias.</H2>
        <ol className="mt-10 grid md:grid-cols-2 gap-8 md:gap-10">
          {steps.map((s) => (
            <li key={s.n}>
              <div className="text-[32px] leading-none mb-3" style={{ ...display, color: TEAL }} aria-hidden="true">
                {s.n}
              </div>
              <h3 className="text-[22px] mb-2" style={{ ...display, color: "#FFFFFF" }}>
                {s.title}
              </h3>
              <p className="text-[17px] leading-[1.6]" style={{ ...body, color: "rgba(255,255,255,0.82)", maxWidth: "68ch" }}>
                {s.text}
              </p>
            </li>
          ))}
        </ol>
        <p
          className="mt-12 text-[17px] md:text-[19px] leading-[1.6]"
          style={{ ...body, color: "#FFFFFF", maxWidth: "68ch", fontWeight: 600 }}
        >
          Se não dá para medir como é hoje, criar essa medida é a primeira parte do trabalho. Sem isso, não existe antes e depois, e sem antes e depois você não tem como cobrar resultado de ninguém.
        </p>
      </div>
    </section>
  );
}

function UmaRotina() {
  return (
    <section className="px-6 py-20 md:py-24" style={{ background: TEAL }}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[26px] sm:text-[32px] md:text-[40px] leading-[1.1] mb-6" style={{ ...display, color: NAVY }}>
          Uma rotina por vez. Sempre.
        </h2>
        <p className="text-[17px] md:text-[19px] leading-[1.6]" style={{ ...body, color: NAVY, maxWidth: "68ch" }}>
          A gente não vende pacote com cinco frentes. Você vê uma coisa funcionar, sua equipe usa, o número muda, e só então você decide se quer a próxima. Projeto grande em cervejaria morre no meio, porque a operação não para para o projeto acontecer.
        </p>
      </div>
    </section>
  );
}

function NaoFazemos() {
  const items = [
    "Não troca todos os seus sistemas.",
    "Não implanta ERP nem monta repositório de dados.",
    "Não promete transformar a cervejaria em 21 dias.",
    "Não garante faturamento nem economia.",
    "Não entrega prateleira de automação sem uma rotina prioritária.",
  ];
  return (
    <section className="px-6 py-20 md:py-28" style={{ background: LIGHT_1 }}>
      <div className="max-w-4xl mx-auto">
        <H2 onLight>O que a gente não faz</H2>
        <ul className="space-y-3">
          {items.map((t) => (
            <li key={t} className="flex gap-3 text-[17px] md:text-[19px] leading-[1.6]" style={{ ...body, color: "#3A3F4C" }}>
              <span aria-hidden="true" style={{ color: TEAL_DARK, fontWeight: 700 }}>
                •
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <figure className="mt-12 rounded-2xl p-7 md:p-9 flex flex-col sm:flex-row items-start gap-6" style={{ background: LIGHT_2 }}>
          <img
            src={vitorPhoto.url}
            alt="Vitor Ungari, fundador da Veehtor AI"
            className="w-20 h-20 rounded-full object-cover flex-shrink-0"
            loading="lazy"
          />
          <div>
            <blockquote className="text-[22px] md:text-[26px] leading-[1.25]" style={{ ...display, color: INK }}>
              “Se uma planilha resolve, eu não vou te vender um agente.”
            </blockquote>
            <figcaption className="mt-3 text-[14px]" style={{ ...body, color: "#5B6070" }}>
              Vitor Ungari, fundador da Veehtor AI
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    {
      q: "Preciso trocar meu sistema atual?",
      a: "Não. A gente constrói dentro do que você já usa: PDV, maquininha, planilha, grupo de WhatsApp. Trocar sistema é outro tipo de projeto, e não é o que a gente vende.",
    },
    {
      q: "O Raio-X é cobrado à parte?",
      a: "Não. Ele é a primeira etapa da Intervenção. A empresa não vende diagnóstico separado, em nenhuma forma.",
    },
    {
      q: "Funciona para cervejaria de uma unidade só?",
      a: "Funciona quando existe uma rotina repetida, manual, com custo que dá para observar, e que possa mudar sem parar a casa. Se não existe, a gente fala isso e não propõe.",
    },
    {
      q: "E se vocês descobrirem que não vale a pena?",
      a: "A gente diz no fim do Raio-X e não apresenta proposta. Recusar cedo custa muito menos que um projeto que morre no meio.",
    },
    {
      q: "O que minha equipe precisa fazer?",
      a: "Menos do que você imagina, e mais do que zero. Precisa de alguém que responda pelo processo e libere os acessos. Sem isso, ninguém consegue prometer 21 dias com honestidade.",
    },
    {
      q: "Minha equipe vai conseguir usar?",
      a: "Essa é a pergunta certa, e ela entra na escolha da rotina. A gente não escolhe o gargalo de maior retorno teórico, escolhe o que junta retorno relevante com chance real de adoção.",
    },
    {
      q: "Preciso contratar alguém de tecnologia?",
      a: "Não. A gente constrói, coloca no ar e treina a equipe.",
    },
    {
      q: "Por que 21 dias e não três meses?",
      a: "Porque em 21 dias você consegue ver uma rotina mudar e cobrar o resultado. Projeto de três meses em operação de bar atravessa duas trocas de equipe e um fim de ano.",
    },
  ];
  return (
    <section className="px-6 py-20 md:py-28" style={{ background: LIGHT_1 }}>
      <div className="max-w-3xl mx-auto">
        <H2 onLight>Perguntas frequentes</H2>
        <Accordion type="single" collapsible className="w-full">
          {items.map((it, i) => (
            <AccordionItem key={i} value={`item-${i}`} style={{ borderColor: "rgba(3,6,25,0.12)" }}>
              <AccordionTrigger
                className="text-left text-[17px] md:text-[19px] hover:no-underline"
                style={{ ...display, color: INK }}
              >
                {it.q}
              </AccordionTrigger>
              <AccordionContent className="text-[17px] leading-[1.6]" style={{ ...body, color: "#3A3F4C" }}>
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

const FIELDS = [
  { name: "nome", label: "Nome", type: "input" as const },
  { name: "cervejaria", label: "Nome da cervejaria", type: "input" as const },
  { name: "unidades", label: "Quantas unidades", type: "input" as const },
  { name: "whatsapp", label: "WhatsApp", type: "input" as const },
  { name: "rotina", label: "Qual rotina está travando", type: "textarea" as const },
  { name: "tentativas", label: "O que você já tentou para resolver", type: "textarea" as const },
];

function buildWhatsAppUrl(values: Record<string, string>) {
  const text = [
    "Olá, Vitor. Quero falar sobre a rotina que está travando na minha operação.",
    "",
    `Nome: ${values.nome}`,
    `Cervejaria: ${values.cervejaria}`,
    `Unidades: ${values.unidades}`,
    `WhatsApp: ${values.whatsapp}`,
    `Rotina que está travando: ${values.rotina}`,
    `O que já tentei: ${values.tentativas}`,
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function ChamadaFinal() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [url, setUrl] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const link = buildWhatsAppUrl(values);
    setUrl(link);
    setSent(true);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="conversa" className="px-6 py-20 md:py-28 scroll-mt-16" style={{ background: NAVY }}>
      <div className="max-w-3xl mx-auto">
        <H2>Vamos falar da SUA OPERAÇÃO, não de inteligência artificial.</H2>
        <p className="text-[17px] md:text-[19px] leading-[1.6]" style={{ ...body, color: "rgba(255,255,255,0.82)", maxWidth: "68ch" }}>
          A conversa começa por uma rotina: qual é a que mais consome tempo, dinheiro ou controle na sua casa hoje.
        </p>

        {sent ? (
          <div className="mt-10 rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.06)" }}>
            <p className="text-[19px] md:text-[22px]" style={{ ...display, color: "#FFFFFF" }}>
              Recebemos suas respostas. Obrigado.
            </p>
            <p className="mt-3 text-[17px] leading-[1.6]" style={{ ...body, color: "rgba(255,255,255,0.82)" }}>
              Quer adiantar? Chama no WhatsApp.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[16px]"
              style={{ ...body, fontWeight: 600, background: TEAL, color: NAVY }}
            >
              Chamar no WhatsApp
            </a>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 grid sm:grid-cols-2 gap-5">
            {FIELDS.map((f) => (
              <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                <label
                  htmlFor={f.name}
                  className="block mb-2 text-[14px]"
                  style={{ ...body, color: "rgba(255,255,255,0.7)" }}
                >
                  {f.label}
                </label>
                {f.type === "input" ? (
                  <input
                    id={f.name}
                    name={f.name}
                    required
                    value={values[f.name] || ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-[17px] outline-none focus:ring-2"
                    style={{
                      ...body,
                      background: "rgba(255,255,255,0.06)",
                      color: "#FFFFFF",
                      border: "1px solid rgba(255,255,255,0.18)",
                    }}
                  />
                ) : (
                  <textarea
                    id={f.name}
                    name={f.name}
                    required
                    rows={2}
                    value={values[f.name] || ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-[17px] outline-none focus:ring-2"
                    style={{
                      ...body,
                      background: "rgba(255,255,255,0.06)",
                      color: "#FFFFFF",
                      border: "1px solid rgba(255,255,255,0.18)",
                    }}
                  />
                )}
              </div>
            ))}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-[16px] transition-transform hover:scale-[1.02]"
                style={{ ...body, fontWeight: 600, background: ORANGE, color: "#FFFFFF" }}
              >
                Enviar
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-12" style={{ background: NAVY, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <Logo textColor="#FFFFFF" className="h-6 w-auto" />
        <div className="flex flex-wrap items-center gap-5 text-[14px]" style={{ ...body, color: "rgba(255,255,255,0.6)" }}>
          <span>© {new Date().getFullYear()} Veehtor AI</span>
          <a href="/" className="hover:text-white transition-colors">
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
    document.title = "Veehtor AI para cervejarias: uma rotina por vez, em 21 dias";
    const desc = document.querySelector('meta[name="description"]');
    const prev = desc?.getAttribute("content") || "";
    desc?.setAttribute(
      "content",
      "Intervenção de 21 dias para cervejarias e redes de bares: escolhemos a rotina que mais custa tempo e dinheiro, construímos dentro das ferramentas que a casa já usa e comparamos o antes e o depois.",
    );
    return () => {
      if (desc) desc.setAttribute("content", prev);
    };
  }, []);

  return (
    <div style={{ background: NAVY }}>
      <Header />
      <main>
        <Hero />
        <Problema />
        <ParaQuem />
        <Prova />
        <Metodo />
        <UmaRotina />
        <NaoFazemos />
        <Faq />
        <ChamadaFinal />
      </main>
      <Footer />
    </div>
  );
}
