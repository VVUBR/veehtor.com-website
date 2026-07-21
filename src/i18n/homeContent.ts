// Home content in PT and EN. Consumers should use `useHomeContent()` to get
// the localized bundle. English copy is natural and commercial for U.S. buyers.

import { useLanguage } from "@/i18n/LanguageContext";

type Stat = {
  client: string;
  num: string;
  label: string;
  badge: "measured" | "operational" | "system" | "estimated";
  badgeLabel: string;
};

type CaseItem = {
  client: string;
  context: string;
  h3: string;
  desc: string;
  metric: string;
  metricLabel: string;
  badge: "measured" | "operational" | "system" | "estimated";
  badgeLabel: string;
  href: string;
};

export interface HomeContentBundle {
  meta: { title: string; description: string };
  nav: {
    opportunities: string;
    cases: string;
    about: string;
    cta: string;
    logoAria: string;
    mainAria: string;
    openMenu: string;
    closeMenu: string;
    skip: string;
  };
  hero: {
    h1a: string;
    h1b: string;
    body: string;
    qual: string;
    ctaPrimary: string;
    ctaSecondary: string;
    micro: string;
    mapAria: string;
    legend: { color: string; label: string }[];
    legendAria: string;
  };
  vals: {
    eyebrow: string;
    h2: string;
    sub: string;
    items: { title: string; body: string; metric: string }[];
  };
  proof: {
    eyebrow: string;
    h2: string;
    sub: string;
    stats: Stat[];
    note: string;
    link: string;
  };
  cases: {
    eyebrow: string;
    h2: string;
    sub: string;
    items: CaseItem[];
    more: string;
    detailsCta: string;
  };
  rules: {
    eyebrow: string;
    h2: string;
    items: string[];
    phrase: string;
  };
  founder: {
    eyebrow: string;
    h3: string;
    body: string;
    quote: string;
  };
  closing: {
    h2: string;
    body: string;
    cta: string;
    micro: string;
    contactAria: string;
    agora: string;
  };
}

const pt: HomeContentBundle = {
  meta: {
    title: "Automação e agentes de IA com impacto mensurável | v.AI",
    description:
      "Mapeamos processos que drenam receita, margem e horas do time. Construímos automações, sistemas internos e agentes de IA com baseline, piloto e medição de resultado.",
  },
  nav: {
    opportunities: "Oportunidades",
    cases: "Cases",
    about: "Sobre",
    cta: "Mapear meu processo",
    logoAria: "v.AI",
    mainAria: "Navegação principal",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    skip: "Ir para o conteúdo",
  },
  hero: {
    h1a: "A IA sai do palco.",
    h1b: "Entra na operação.",
    body:
      "Automação, sistemas internos e agentes de IA com impacto mensurável.\n\nSe um processo drena receita, margem ou horas do time, ele vira sistema. Construímos a menor solução capaz de corrigir o gargalo e provar valor.",
    qual: "Para empresas com processos recorrentes, múltiplas pessoas envolvidas e impacto financeiro mensurável.",
    ctaPrimary: "Mapear meu processo",
    ctaSecondary: "Ver soluções entregues",
    micro: "30 minutos. Direto no processo. Sem apresentação genérica.",
    mapAria: "Mapa de um fluxo de vendas em que um vazamento de receita é identificado e fechado pela v.AI.",
    legend: [
      { color: "#111828", label: "processo" },
      { color: "#F87316", label: "vazamento" },
      { color: "#15B7A8", label: "intervenção" },
      { color: "#21C65D", label: "resultado" },
    ],
    legendAria: "Legenda do mapa",
  },
  vals: {
    eyebrow: "ONDE ENCONTRAMOS VALOR",
    h2: "O vazamento começa no processo. O relatório só mostra depois.",
    sub:
      "Mapeamos processos que afetam receita, margem, capacidade e risco.\u00a0\nA solução pode ser uma automação simples, um sistema interno, um agente de IA ou uma combinação dos três.",
    items: [
      { title: "Gerar receita", body: "Leads, follow-up, reativação e vendas.", metric: "Conversão, receita recuperada e velocidade de resposta" },
      { title: "Proteger margem", body: "Erros, retrabalho e horas não faturáveis.", metric: "Custo por processo, margem e capacidade faturável" },
      { title: "Liberar capacidade", body: "Relatórios, documentos e tarefas repetitivas.", metric: "Horas recuperadas e tempo de ciclo" },
      { title: "Reduzir risco", body: "Crédito, compliance, jornada e auditoria.", metric: "Erros, atrasos, exceções e exposição financeira" },
    ],
  },
  proof: {
    eyebrow: "RESULTADOS REAIS",
    h2: "Sistemas em operação.\u00a0\nMudanças que aparecem no processo.",
    sub: "Cada número abaixo vem de um sistema entregue para uma operação real.",
    stats: [
      { client: "D.CARVALHO - JOHN DEERE", num: "5 a 7 dias → minutos", label: "Tempo de decisão de crédito", badge: "operational", badgeLabel: "Resultado operacional" },
      { client: "Robbin Services", num: "20% → 5%", label: "Participação de horas não faturáveis", badge: "measured", badgeLabel: "Resultado medido" },
      { client: "CERVEJARIA COMPLÔ", num: "1 dia → minutos", label: "Fechamento de folha semanal", badge: "operational", badgeLabel: "Resultado operacional" },
    ],
    note: "Cada case separa resultado medido, impacto estimado e escala de uso.",
    link: "Ver soluções entregues",
  },
  cases: {
    eyebrow: "COMO APARECE NA PRÁTICA",
    h2: "Problemas diferentes. Sistemas construídos em torno da operação real.",
    sub: "Cada card é uma solução que já vive na operação do cliente.",
    items: [
      {
        client: "D.CARVALHO - JOHN DEERE",
        context: "Crédito B2B",
        h3: "Decisões de crédito que levavam 5 a 7 dias agora saem em minutos",
        desc: "Motor de crédito integrado a score do Serasa e regras internas do time comercial.",
        metric: "5 a 7 dias → minutos",
        metricLabel: "Tempo de decisão",
        badge: "operational",
        badgeLabel: "Resultado operacional",
        href: "/case-studies/dcarvalho-credit-scoring",
      },
      {
        client: "CERVEJARIA COMPLÔ",
        context: "FECHAMENTO DE FOLHA",
        h3: "Um dia inteiro de fechamento de folha agora leva minutos",
        desc: "Sistema interno consolida horas, insumos e taxas para gerar o fechamento sem planilha.",
        metric: "1 dia → minutos",
        metricLabel: "Ciclo de fechamento semanal",
        badge: "operational",
        badgeLabel: "Resultado operacional",
        href: "/case-studies/complo-time-tracking",
      },
      {
        client: "Robbin Services",
        context: "Operações de campo",
        h3: "Horas não faturáveis caíram de até 18,2% para menos de 5%",
        desc: "Dashboard operacional cruza apontamento, ordens e SLA em tempo real.",
        metric: "20% → 5%",
        metricLabel: "Horas não faturáveis",
        badge: "measured",
        badgeLabel: "Resultado medido",
        href: "/case-studies/robbin-field-productivity",
      },
    ],
    more: "Ver todos os cases",
    detailsCta: "Ver detalhes",
  },
  rules: {
    eyebrow: "REGRAS DA CASA",
    h2: "Sem teatro. Na prática.",
    items: [
      "Se uma automação simples resolve, não usamos IA.",
      "Falamos em receita, custo, tempo e risco. Não em tecnologia pela tecnologia.",
      "Não ampliamos um projeto que ainda não provou valor.",
    ],
    phrase: "Promessa não entra na planilha. Resultado entra",
  },
  founder: {
    eyebrow: "QUEM CONSTRÓI",
    h3: "Por trás da v.AI está o Vitor.",
    body:
      "Começo pedindo para alguém me mostrar como o trabalho acontece hoje. Onde a planilha entra, quem precisa cobrar quem e em qual etapa o cliente começa a esperar, onde trava. A tecnologia vem depois.",
    quote: "\"Se uma planilha resolve, eu não vou te vender um agente.\"",
  },
  closing: {
    h2: "Qual processo da sua operação custa mais do que deveria?",
    body:
      "Mostre o fluxo. Identificamos onde está o gargalo, qual número precisa mudar e se realmente vale construir alguma coisa.",
    cta: "Mapear meu processo",
    micro: "30 minutos. Direto no processo. Sem apresentação genérica.",
    contactAria: "Contato",
    agora: "Agora v.AI.",
  },
};

const en: HomeContentBundle = {
  meta: {
    title: "Automation and AI agents with measurable impact | v.AI",
    description:
      "We map the processes that drain revenue, margin and team hours. We ship automations, internal systems and AI agents with a baseline, a pilot and a measured result.",
  },
  nav: {
    opportunities: "Opportunities",
    cases: "Cases",
    about: "About",
    cta: "Map my process",
    logoAria: "v.AI",
    mainAria: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skip: "Skip to content",
  },
  hero: {
    h1a: "AI leaves the stage.",
    h1b: "It enters the operation.",
    body:
      "Automation, internal systems and AI agents with measurable impact.\n\nWhen a process drains revenue, margin or team hours, we turn it into a system. We build the smallest solution that can fix the bottleneck and prove its value.",
    qual: "Built for companies with recurring processes, multiple people involved and measurable financial impact.",
    ctaPrimary: "Map my process",
    ctaSecondary: "See delivered solutions",
    micro: "30 minutes. Straight to the process. No generic pitch.",
    mapAria: "A sales flow map where a revenue leak is identified and closed by v.AI.",
    legend: [
      { color: "#111828", label: "process" },
      { color: "#F87316", label: "leak" },
      { color: "#15B7A8", label: "intervention" },
      { color: "#21C65D", label: "result" },
    ],
    legendAria: "Map legend",
  },
  vals: {
    eyebrow: "WHERE WE FIND VALUE",
    h2: "The leak starts in the process. The report only shows it later.",
    sub:
      "We map processes that hit revenue, margin, capacity and risk.\u00a0\nThe answer can be a simple automation, an internal system, an AI agent, or a combination of the three.",
    items: [
      { title: "Grow revenue", body: "Leads, follow-up, reactivation and sales.", metric: "Conversion, recovered revenue and response speed" },
      { title: "Protect margin", body: "Errors, rework and non-billable hours.", metric: "Cost per process, margin and billable capacity" },
      { title: "Free up capacity", body: "Reports, documents and repetitive tasks.", metric: "Hours recovered and cycle time" },
      { title: "Reduce risk", body: "Credit, compliance, customer journey and audit.", metric: "Errors, delays, exceptions and financial exposure" },
    ],
  },
  proof: {
    eyebrow: "REAL RESULTS",
    h2: "Systems in operation.\u00a0\nChanges that show up in the process.",
    sub: "Every number below comes from a system shipped into a real operation.",
    stats: [
      { client: "D.CARVALHO - JOHN DEERE", num: "5 to 7 days → minutes", label: "Credit decision turnaround", badge: "operational", badgeLabel: "Operational result" },
      { client: "Robbin Services", num: "20% → 5%", label: "Share of non-billable hours", badge: "measured", badgeLabel: "Measured result" },
      { client: "CERVEJARIA COMPLÔ", num: "1 day → minutes", label: "Weekly payroll close", badge: "operational", badgeLabel: "Operational result" },
    ],
    note: "Every case separates measured result, estimated impact and scale of use.",
    link: "See delivered solutions",
  },
  cases: {
    eyebrow: "HOW IT SHOWS UP IN PRACTICE",
    h2: "Different problems. Systems built around the real operation.",
    sub: "Every card is a solution already running inside the client's operation.",
    items: [
      {
        client: "D.CARVALHO - JOHN DEERE",
        context: "B2B credit",
        h3: "Credit decisions that used to take 5 to 7 days now clear in minutes",
        desc: "A credit engine wired into Serasa scores and the sales team's own internal rules.",
        metric: "5 to 7 days → minutes",
        metricLabel: "Decision turnaround",
        badge: "operational",
        badgeLabel: "Operational result",
        href: "/case-studies/dcarvalho-credit-scoring",
      },
      {
        client: "CERVEJARIA COMPLÔ",
        context: "PAYROLL CLOSE",
        h3: "A full day of weekly payroll now takes minutes",
        desc: "An internal system that consolidates hours, inputs and fees and closes the week without a spreadsheet.",
        metric: "1 day → minutes",
        metricLabel: "Weekly close cycle",
        badge: "operational",
        badgeLabel: "Operational result",
        href: "/case-studies/complo-time-tracking",
      },
      {
        client: "Robbin Services",
        context: "Field operations",
        h3: "Non-billable hours dropped from up to 18.2% to under 5%",
        desc: "An operational dashboard that ties time entries, work orders and SLAs together in real time.",
        metric: "20% → 5%",
        metricLabel: "Non-billable hours",
        badge: "measured",
        badgeLabel: "Measured result",
        href: "/case-studies/robbin-field-productivity",
      },
    ],
    more: "See all cases",
    detailsCta: "See details",
  },
  rules: {
    eyebrow: "HOUSE RULES",
    h2: "No theater. Just execution.",
    items: [
      "If a simple automation solves it, we don't use AI.",
      "We talk revenue, cost, time and risk. Not technology for its own sake.",
      "We don't scale a project that hasn't proven its value yet.",
    ],
    phrase: "Promises don't hit the spreadsheet. Results do",
  },
  founder: {
    eyebrow: "WHO BUILDS IT",
    h3: "Behind v.AI is Vitor.",
    body:
      "I get in to understand how the operation actually works, not how it looks on the org chart. I map the process, find the bottleneck and work with the team until the system becomes routine.",
    quote: "\"If a spreadsheet solves it, I'm not going to sell you an agent.\"",
  },
  closing: {
    h2: "Which process in your operation costs more than it should?",
    body:
      "Show us the flow. We identify where the bottleneck is, which number needs to move, and whether it's actually worth building anything.",
    cta: "Map my process",
    micro: "30 minutes. Straight to the process. No generic pitch.",
    contactAria: "Contact",
    agora: "Now, v.AI.",
  },
};

export const homeContent = { pt, en };

export function useHomeContent(): HomeContentBundle {
  const { language } = useLanguage();
  return homeContent[language];
}
