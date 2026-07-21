// PT-BR strings for the new home. Structured so it can become { pt, en } later
// without changing consumers. Switcher intentionally NOT rendered yet.

export const homeContent = {
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
    h1a: "Automação e agentes de IA",
    h1b: "com impacto mensurável.",
    body:
      "Se um processo drena receita, margem ou horas do time, ele vira sistema. Automação, ferramenta interna ou agente de IA. Escolhemos com o time do cliente o que gera mais valor no menor prazo.",
    qual: "Trabalhamos com empresas de 10 a 500 pessoas onde o processo já existe e precisa virar sistema.",
    ctaPrimary: "Mapear meu processo",
    ctaSecondary: "Ver soluções entregues",
    micro: "30 minutos. Você traz um processo real. Mergulhamos juntos na sua realidade.",
    legend: [
      { color: "#111828", label: "processo" },
      { color: "#F87316", label: "vazamento" },
      { color: "#15B7A8", label: "intervenção" },
      { color: "#21C65D", label: "resultado" },
    ],
  },
  vals: {
    eyebrow: "Onde encontramos valor",
    h2: "Dinheiro costuma escapar antes de aparecer nos relatórios da empresa.",
    sub:
      "Mapeamos processos que afetam receita, margem, capacidade e risco. A solução pode ser uma automação simples, um sistema interno, um agente de IA ou uma combinação dos três.",
    items: [
      { title: "Gerar receita", body: "Leads, follow-up, reativação e vendas.", metric: "Conversão, receita recuperada e velocidade de resposta" },
      { title: "Proteger margem", body: "Erros, retrabalho e horas não faturáveis.", metric: "Custo por processo, margem e capacidade faturável" },
      { title: "Liberar capacidade", body: "Relatórios, documentos e tarefas repetitivas.", metric: "Horas recuperadas e tempo de ciclo" },
      { title: "Reduzir risco", body: "Crédito, compliance, jornada e auditoria.", metric: "Erros, atrasos, exceções e exposição financeira" },
    ],
  },
  proof: {
    eyebrow: "Resultados reais",
    h2: "Sistemas em operação. Mudanças que aparecem no processo.",
    sub: "Cada número abaixo vem de um sistema entregue para uma operação real.",
    stats: [
      { client: "D.Carvalho", num: "5 a 7 dias → minutos", label: "Tempo de decisão de crédito", badge: "operational" as const, badgeLabel: "Resultado operacional" },
      { client: "Robbin Services", num: "18,2% → menos de 5%", label: "Participação de horas não faturáveis", badge: "measured" as const, badgeLabel: "Resultado medido" },
      { client: "Complô", num: "1 dia → minutos", label: "Fechamento de folha semanal", badge: "operational" as const, badgeLabel: "Resultado operacional" },
    ],
    note: "Números vindos de operações reais. Sem projeções nem receita de cliente.",
    link: "Ver soluções entregues",
  },
  cases: {
    eyebrow: "Como aparece na prática",
    h2: "Problemas diferentes. Sistemas construídos em torno da operação real.",
    sub: "Cada card é um sistema que já vive na operação do cliente.",
    items: [
      {
        client: "D.Carvalho",
        context: "Crédito B2B",
        h3: "Decisões de crédito que levavam 5 a 7 dias agora saem em minutos",
        desc: "Motor de crédito integrado a score do Serasa e regras internas do time comercial.",
        metric: "5-7 dias → minutos",
        metricLabel: "Tempo de decisão",
        badge: "operational" as const,
        badgeLabel: "Resultado operacional",
        href: "/case-studies/dcarvalho-motor-credito",
      },
      {
        client: "Complô",
        context: "Fechamento de folha",
        h3: "Um dia inteiro de fechamento de folha agora leva minutos",
        desc: "Sistema interno consolida horas, insumos e taxas para gerar o fechamento sem planilha.",
        metric: "1 dia → minutos",
        metricLabel: "Ciclo de fechamento semanal",
        badge: "operational" as const,
        badgeLabel: "Resultado operacional",
        href: "/case-studies/complo-fechamento-folha",
      },
      {
        client: "Robbin Services",
        context: "Operações de campo",
        h3: "Horas não faturáveis caíram de até 18,2% para menos de 5%",
        desc: "Dashboard operacional cruza apontamento, ordens e SLA em tempo real.",
        metric: "18,2% → <5%",
        metricLabel: "Horas não faturáveis",
        badge: "measured" as const,
        badgeLabel: "Resultado medido",
        href: "/case-studies/robbin-services-operacao",
      },
    ],
    more: "Ver todos os cases",
  },
  rules: {
    eyebrow: "Regras da casa",
    h2: "Sem teatro. Na prática.",
    items: [
      "Se uma automação simples resolve, não usamos IA.",
      "Trabalhamos com métricas de negócio e na mesma língua do cliente.",
      "Não ampliamos um projeto que ainda não provou valor.",
    ],
    phrase: "Promessa não entra na planilha (resultado entra)",
  },
  founder: {
    eyebrow: "Quem constrói",
    h3: "Por trás da v.AI tem o Vitor.",
    body:
      "Eu entro para entender como o negócio funciona de verdade, não como aparece no organograma. Mapeio o processo, encontro o gargalo, desenho o sistema e trabalho com o time até a solução virar rotina.",
    quote: "\"Se uma planilha resolve, eu não vou te vender um agente.\"",
  },
  closing: {
    h2: "Tem um processo que custa mais do que deveria?",
    body:
      "Mostre o fluxo. A gente identifica onde está o gargalo, qual número precisa mudar e se IA realmente faz sentido.",
    cta: "Mapear meu processo",
    micro: "30 minutos. Direto no seu processo. Sem apresentação genérica.",
  },
  footer: {
    tag: "Sistemas aplicados à operação.",
    links: [
      { label: "Cases", href: "/case-studies", external: false },
      { label: "Sobre", href: "#sobre", external: false },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/vitorungari/", external: true },
      { label: "Privacidade", href: "https://www.veehtor.com/privacy", external: true },
      { label: "Termos", href: "https://www.veehtor.com/terms", external: true },
    ],
    copy: "© 2026 Veehtor AI LLC",
  },
} as const;

export type HomeContent = typeof homeContent;
