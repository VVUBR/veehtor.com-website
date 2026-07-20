import type { Language } from "@/i18n/translations";

export type Sector =
  | "Agribusiness"
  | "Food & Beverage"
  | "Nonprofit"
  | "Construction (USA)";

export type Area =
  | "Sales"
  | "Finance"
  | "Legal"
  | "Marketing"
  | "Operations"
  | "Product"
  | "Human Resources"
  | "Customer Relations"
  | "Technology";

/** Localized string helper: every visible field is authored in EN and PT. */
export type LS = { en: string; pt: string };

export const pick = (v: LS, lang: Language): string => v[lang];

/** Display labels for filters and cards. Enum keys stay English in code. */
export const SECTOR_LABELS: Record<Sector, LS> = {
  "Agribusiness": { en: "Agribusiness", pt: "Agronegócio" },
  "Food & Beverage": { en: "Food & Beverage", pt: "Alimentos e bebidas" },
  "Nonprofit": { en: "Nonprofit", pt: "Terceiro setor" },
  "Construction (USA)": { en: "Construction (USA)", pt: "Construção (EUA)" },
};

export const AREA_LABELS: Record<Area, LS> = {
  "Sales": { en: "Sales", pt: "Vendas" },
  "Finance": { en: "Finance", pt: "Financeiro" },
  "Legal": { en: "Legal", pt: "Jurídico" },
  "Marketing": { en: "Marketing", pt: "Marketing" },
  "Operations": { en: "Operations", pt: "Operações" },
  "Product": { en: "Product", pt: "Produto" },
  "Human Resources": { en: "Human Resources", pt: "Recursos Humanos" },
  "Customer Relations": { en: "Customer Relations", pt: "Relacionamento com o cliente" },
  "Technology": { en: "Technology", pt: "Tecnologia" },
};

export interface Metric {
  value: LS;
  label: LS;
  estimated?: boolean;
}

export interface AboutClient {
  sector: LS;
  size?: LS;
  scale?: LS;
}

export interface CaseStudy {
  slug: string;
  /** Client name is a proper noun; not localized. */
  client: string;
  sector: Sector;
  areas: Area[];
  title: LS;
  summary: LS;
  metrics: [Metric, Metric, Metric];
  challenge: LS;
  solution: LS;
  result: LS;
  aboutClient: AboutClient;
  seoDescription: LS;
  /** Hidden until a real, approved client quote is added. */
  quote?: { text: LS; author: string };
}

export const ALL_AREAS: Area[] = [
  "Sales",
  "Finance",
  "Legal",
  "Marketing",
  "Operations",
  "Product",
  "Human Resources",
  "Customer Relations",
  "Technology",
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "dcarvalho-credit-scoring",
    client: "D.Carvalho (John Deere dealership network)",
    sector: "Agribusiness",
    areas: ["Finance"],
    title: {
      en: "D.Carvalho: credit decisions that took 5 to 7 days now take minutes",
      pt: "D.Carvalho: decisões de crédito que levavam 5 a 7 dias agora saem em minutos",
    },
    summary: {
      en: "How a John Deere dealership network replaced gut-feel credit decisions with its own AI credit-scoring system.",
      pt: "Como uma rede de concessionárias John Deere trocou decisões de crédito no feeling por um sistema próprio de scoring com IA.",
    },
    metrics: [
      {
        value: { en: "5-7 days to minutes", pt: "5-7 dias para minutos" },
        label: { en: "Credit decision time", pt: "Tempo de decisão de crédito" },
      },
      {
        value: { en: "8 of 10", pt: "8 de 10" },
        label: { en: "Dealerships running the system", pt: "Concessionárias rodando o sistema" },
      },
      {
        value: { en: "~4,000", pt: "~4.000" },
        label: { en: "Customers scored", pt: "Clientes pontuados" },
      },
    ],
    challenge: {
      en: "The group makes daily credit decisions on deals that reach millions of dollars. A clean record at the credit bureau did not mean a good payer: many customers with spotless external reputations paid late and renegotiated internally. Every decision was close to a bet, and wrong bets hit the company's cash.",
      pt: "O grupo toma decisões de crédito diárias em negócios que chegam a milhões de dólares. Uma ficha limpa no birô não significava bom pagador: muitos clientes com reputação externa impecável pagavam atrasado e renegociavam internamente. Cada decisão era quase uma aposta, e as apostas erradas mexiam no caixa da empresa.",
    },
    solution: {
      en: "We built the company its own credit-analysis system. It learns from each customer's real purchase and payment behavior, then crosses that with external signals: commodity prices, regional weather, interest rates, government farm-credit policy. Every customer gets a score from 0 to 1,000, and an AI credit-analyst agent trained on the company's own policies delivers a ready recommendation of limit, rate, and down payment.",
      pt: "Construímos para a empresa um sistema próprio de análise de crédito. Ele aprende com o comportamento real de compra e pagamento de cada cliente e cruza isso com sinais externos: preços de commodities, clima regional, taxas de juros, política de crédito rural do governo. Cada cliente recebe uma nota de 0 a 1.000, e um agente de IA analista de crédito, treinado nas políticas da empresa, entrega uma recomendação pronta de limite, taxa e entrada.",
    },
    result: {
      en: "Decisions made in the dark on partial data are now informed decisions with real visibility of each customer's risk. Analysis that could take weeks takes minutes, cash planning got sharper, and a one-off project became an ongoing partnership with new AI projects being built together.",
      pt: "Decisões tomadas no escuro com dados parciais agora são decisões informadas, com visibilidade real do risco de cada cliente. Análises que podiam levar semanas saem em minutos, o planejamento de caixa ficou mais preciso, e um projeto pontual virou uma parceria contínua com novos projetos de IA sendo construídos juntos.",
    },
    aboutClient: {
      sector: {
        en: "Farm equipment dealerships (John Deere)",
        pt: "Concessionárias de máquinas agrícolas (John Deere)",
      },
      size: {
        en: "10 dealerships, ~500 employees",
        pt: "10 concessionárias, ~500 funcionários",
      },
      scale: {
        en: "~4,000 active customers",
        pt: "~4.000 clientes ativos",
      },
    },
    seoDescription: {
      en: "A John Deere dealership network replaced gut-feel credit calls with an AI credit-scoring system: decisions in minutes, ~4,000 customers scored, deployed at 8 of 10 dealerships.",
      pt: "Uma rede de concessionárias John Deere trocou decisões de crédito no feeling por um sistema de scoring com IA: decisões em minutos, ~4.000 clientes pontuados, ativo em 8 de 10 concessionárias.",
    },
  },
  {
    slug: "complo-time-tracking",
    client: "Cervejaria Complô",
    sector: "Food & Beverage",
    areas: ["Human Resources"],
    title: {
      en: "Complô: a full day of payroll closing now takes minutes",
      pt: "Complô: um dia inteiro de fechamento de folha agora leva minutos",
    },
    summary: {
      en: "How a brewery hiring up to 40 freelancers a week replaced manual time tracking with geolocated clock-in and automatic payment.",
      pt: "Como uma cervejaria que contrata até 40 freelancers por semana trocou o controle de horas manual por bater ponto com geolocalização e pagamento automático.",
    },
    metrics: [
      {
        value: { en: "~R$30,000/year", pt: "~R$ 30.000/ano" },
        label: { en: "Management time recovered", pt: "Tempo de gestão recuperado" },
        estimated: true,
      },
      {
        value: { en: "30-40", pt: "30-40" },
        label: { en: "Freelancers paid per week", pt: "Freelancers pagos por semana" },
      },
      {
        value: { en: "1 day to minutes", pt: "1 dia para minutos" },
        label: { en: "Weekly payroll closing", pt: "Fechamento semanal da folha" },
      },
    ],
    challenge: {
      en: "Across eight locations, freelancer hours were tracked by hand. The manager lost every Monday closing what each person was owed, with no proof of who worked when, and hour disputes could turn into labor claims.",
      pt: "Em oito unidades, as horas dos freelancers eram controladas no braço. O gerente perdia toda segunda-feira fechando quanto cada um tinha a receber, sem prova de quem trabalhou quando, e disputas de horas podiam virar reclamação trabalhista.",
    },
    solution: {
      en: "We built an app where each freelancer clocks in and out on their own phone, with geolocation confirming they are at the venue. Forgotten clock-outs close automatically and alert the manager. Every Monday the payment calculation arrives ready on WhatsApp: hours worked, amount owed, and each person's payment key.",
      pt: "Construímos um app onde cada freelancer bate o ponto no próprio celular, com geolocalização confirmando que está na unidade. Batidas esquecidas se encerram sozinhas e alertam o gerente. Toda segunda-feira o cálculo de pagamento chega pronto no WhatsApp: horas trabalhadas, valor devido e a chave de pagamento de cada um.",
    },
    result: {
      en: "Monday closing went from a full day to minutes, paid hours now match worked hours, and the company's exposure to hour disputes dropped. This was module one of a platform that kept growing.",
      pt: "O fechamento de segunda passou de um dia inteiro para minutos, as horas pagas agora batem com as horas trabalhadas, e a exposição da empresa a disputas de horas caiu. Esse foi o módulo um de uma plataforma que continuou crescendo.",
    },
    aboutClient: {
      sector: {
        en: "Brewery with its own production plus bars and restaurants",
        pt: "Cervejaria com produção própria mais bares e restaurantes",
      },
      size: { en: "8 active locations", pt: "8 unidades ativas" },
      scale: { en: "30-40 freelancers per week", pt: "30-40 freelancers por semana" },
    },
    seoDescription: {
      en: "A brewery with 8 locations replaced manual timecards with geolocated clock-in and automatic payroll. Monday closing went from a full day to minutes.",
      pt: "Uma cervejaria com 8 unidades trocou controle de horas manual por ponto com geolocalização e folha automática. O fechamento de segunda passou de um dia inteiro para minutos.",
    },
  },
  {
    slug: "complo-ai-checklists",
    client: "Cervejaria Complô",
    sector: "Food & Beverage",
    areas: ["Operations"],
    title: {
      en: "Complô: AI now verifies opening and closing at all eight locations",
      pt: "Complô: uma IA agora verifica abertura e fechamento nas oito unidades",
    },
    summary: {
      en: "Photo-verified digital checklists, scored by AI, catch problems at opening instead of on a packed Saturday night.",
      pt: "Checklists digitais com foto, avaliados por IA, pegam problemas na abertura em vez de num sábado à noite lotado.",
    },
    metrics: [
      {
        value: { en: "8", pt: "8" },
        label: { en: "Locations standardized", pt: "Unidades padronizadas" },
      },
      {
        value: { en: "1 to 5", pt: "1 a 5" },
        label: { en: "AI score on every photo check", pt: "Nota da IA em cada foto" },
      },
      {
        value: { en: "Same morning", pt: "Na mesma manhã" },
        label: {
          en: "When issues get caught and fixed",
          pt: "Quando os problemas são pegos e resolvidos",
        },
      },
    ],
    challenge: {
      en: "Every location depends on an opening and closing routine that cannot fail: restock the taps, check the nitrogen pressure, clean the bathrooms. Nothing guaranteed it was actually done. Failures surfaced at the worst moment, with a full house, and ended up as negative Google reviews.",
      pt: "Cada unidade depende de uma rotina de abertura e fechamento que não pode falhar: reabastecer as torneiras, checar a pressão do nitrogênio, limpar os banheiros. Nada garantia que era feito de verdade. As falhas apareciam no pior momento, com casa cheia, e viravam avaliação negativa no Google.",
    },
    solution: {
      en: "Staff follow a digital checklist in the app. For critical items they submit a photo, and an AI scores it from 1 to 5. A low score alerts the manager immediately, photo attached, before customers notice. Top-scored photos become the reference standard, and every check is logged.",
      pt: "A equipe segue um checklist digital no app. Nos itens críticos, manda uma foto, e a IA dá uma nota de 1 a 5. Nota baixa alerta o gerente na hora, com foto anexada, antes de o cliente notar. As fotos com nota alta viram referência de padrão, e cada checagem fica registrada.",
    },
    result: {
      en: "The routine stopped depending on memory. Problems are caught at opening and fixed the same morning, and the company has a full audit history of every opening and closing at every location.",
      pt: "A rotina deixou de depender de memória. Os problemas são pegos na abertura e resolvidos na mesma manhã, e a empresa tem um histórico completo de auditoria de cada abertura e fechamento de cada unidade.",
    },
    aboutClient: {
      sector: {
        en: "Brewery with its own production plus bars and restaurants",
        pt: "Cervejaria com produção própria mais bares e restaurantes",
      },
      size: { en: "8 active locations", pt: "8 unidades ativas" },
      scale: { en: "30-40 freelancers per week", pt: "30-40 freelancers por semana" },
    },
    seoDescription: {
      en: "Photo-verified digital checklists scored by AI catch opening and closing failures the same morning across all eight Complô locations.",
      pt: "Checklists digitais com foto avaliados por IA pegam falhas de abertura e fechamento na mesma manhã nas oito unidades da Complô.",
    },
  },
  {
    slug: "complo-ai-dashboard",
    client: "Cervejaria Complô",
    sector: "Food & Beverage",
    areas: ["Finance", "Operations"],
    title: {
      en: "Complô: an AI analyst watching every location, 24/7",
      pt: "Complô: um analista de IA olhando todas as unidades, 24/7",
    },
    summary: {
      en: "One real-time dashboard unified systems that did not talk to each other, with an AI that explains what is happening and what to do.",
      pt: "Um dashboard em tempo real unificou sistemas que não conversavam, com uma IA que explica o que está acontecendo e o que fazer.",
    },
    metrics: [
      {
        value: { en: "All locations", pt: "Todas as unidades" },
        label: { en: "One real-time panel", pt: "Um painel em tempo real" },
      },
      {
        value: { en: "74%", pt: "74%" },
        label: {
          en: "Of revenue found concentrated on weekends",
          pt: "Da receita concentrada nos fins de semana",
        },
      },
      {
        value: { en: "24/7", pt: "24/7" },
        label: { en: "AI analysis on live data", pt: "Análise de IA sobre dados ao vivo" },
      },
    ],
    challenge: {
      en: "Sales, orders, and cost data lived in systems that did not talk to each other: digital menu, POS, spreadsheets. Understanding why sales dropped in a week meant consolidating everything by hand, so it almost never happened, and decisions ran on gut feel.",
      pt: "Dados de vendas, pedidos e custos viviam em sistemas que não conversavam: cardápio digital, POS, planilhas. Entender por que as vendas caíram na semana significava consolidar tudo no braço, então quase nunca era feito, e as decisões saíam no feeling.",
    },
    solution: {
      en: "We built one dashboard that unifies all systems in real time. On top of the numbers, an AI explains what is happening and suggests what to do, like an analyst working around the clock: it flagged that 74% of revenue concentrates on weekends, so weekday staffing can run leaner, and it warns when freelancer cost runs above what that week's sales justify.",
      pt: "Construímos um dashboard que unifica todos os sistemas em tempo real. Em cima dos números, uma IA explica o que está acontecendo e sugere o que fazer, como um analista trabalhando dia e noite: ela mostrou que 74% da receita se concentra nos fins de semana, então a equipe nos dias de semana pode ser mais enxuta, e alerta quando o custo com freelancer sobe acima do que a venda da semana justifica.",
    },
    result: {
      en: "Each manager opens the panel and sees their location; the owners see the whole picture. Correction stopped waiting for month-end close: managers act while the result can still change.",
      pt: "Cada gerente abre o painel e vê sua unidade; os sócios veem o quadro inteiro. A correção deixou de esperar o fechamento do mês: os gerentes agem enquanto o resultado ainda pode mudar.",
    },
    aboutClient: {
      sector: {
        en: "Brewery with its own production plus bars and restaurants",
        pt: "Cervejaria com produção própria mais bares e restaurantes",
      },
      size: { en: "8 active locations", pt: "8 unidades ativas" },
      scale: { en: "30-40 freelancers per week", pt: "30-40 freelancers por semana" },
    },
    seoDescription: {
      en: "One real-time dashboard unified Complô's disconnected systems, with an AI analyst explaining what's happening and what to do 24/7.",
      pt: "Um dashboard em tempo real unificou os sistemas desconectados da Complô, com uma IA analista explicando o que está acontecendo e o que fazer 24/7.",
    },
  },
  {
    slug: "complo-customer-voice",
    client: "Cervejaria Complô",
    sector: "Food & Beverage",
    areas: ["Customer Relations"],
    title: {
      en: "Complô: Google reviews turned into a weekly action list",
      pt: "Complô: avaliações do Google viraram uma lista de ação semanal",
    },
    summary: {
      en: "Every Monday, the week's reviews arrive collected, prioritized, and answerable from the same dashboard managers already use.",
      pt: "Toda segunda-feira, as avaliações da semana chegam coletadas, priorizadas e prontas para responder no mesmo dashboard que os gerentes já usam.",
    },
    metrics: [
      {
        value: { en: "100%", pt: "100%" },
        label: {
          en: "Of weekly reviews collected automatically",
          pt: "Das avaliações semanais coletadas automaticamente",
        },
      },
      {
        value: { en: "Monday", pt: "Segunda-feira" },
        label: {
          en: "Weekly cadence, right after the busy weekend",
          pt: "Cadência semanal, logo depois do fim de semana cheio",
        },
      },
      {
        value: { en: "Week over week", pt: "Semana a semana" },
        label: { en: "Complaint trends tracked", pt: "Tendências de reclamação acompanhadas" },
      },
    ],
    challenge: {
      en: "Reviews were read one by one, so it was hard to see which complaints repeated week after week, and the company reacted late to what customers were saying.",
      pt: "As avaliações eram lidas uma a uma, então era difícil ver quais reclamações se repetiam semana após semana, e a empresa reagia tarde ao que os clientes estavam dizendo.",
    },
    solution: {
      en: "Every Monday the system collects the week's Google reviews into the dashboard, organizes them by rating, automatically surfaces what needs attention first (complaints, unanswered comments), and lets the manager reply from there.",
      pt: "Toda segunda-feira o sistema coleta as avaliações do Google da semana no dashboard, organiza por nota, destaca automaticamente o que precisa de atenção primeiro (reclamações, comentários sem resposta) e deixa o gerente responder dali mesmo.",
    },
    result: {
      en: "It went from \"I hear it's bad\" to \"I can see on the panel what is bad, and where.\" Managers prioritize the real issue, and the company tracks whether a fix actually made the complaint drop.",
      pt: "Passou de \"ouvi dizer que está ruim\" para \"consigo ver no painel o que está ruim e onde\". Os gerentes priorizam o problema real, e a empresa acompanha se a correção fez a reclamação de fato cair.",
    },
    aboutClient: {
      sector: {
        en: "Brewery with its own production plus bars and restaurants",
        pt: "Cervejaria com produção própria mais bares e restaurantes",
      },
      size: { en: "8 active locations", pt: "8 unidades ativas" },
      scale: { en: "30-40 freelancers per week", pt: "30-40 freelancers por semana" },
    },
    seoDescription: {
      en: "Google reviews collected every Monday and turned into a prioritized action list Complô managers act on from their existing dashboard.",
      pt: "Avaliações do Google coletadas toda segunda e transformadas em uma lista de ação priorizada que os gerentes da Complô resolvem no dashboard que já usam.",
    },
  },
  {
    slug: "phomenta-linkedin-leads",
    client: "Instituto Phomenta",
    sector: "Nonprofit",
    areas: ["Sales"],
    title: {
      en: "Phomenta: qualified LinkedIn leads with messages ready to send",
      pt: "Phomenta: leads qualificados no LinkedIn com mensagens prontas para enviar",
    },
    summary: {
      en: "An AI workflow finds the right people at target companies, validates fit, and writes personalized outreach, leaving only the sending to humans.",
      pt: "Um fluxo de IA encontra as pessoas certas nas empresas-alvo, valida o fit e escreve a abordagem personalizada, deixando só o envio para o humano.",
    },
    metrics: [
      {
        value: { en: "15-20 min to seconds", pt: "15-20 min para segundos" },
        label: { en: "Research and validation per lead", pt: "Pesquisa e validação por lead" },
      },
      {
        value: { en: "~80%", pt: "~80%" },
        label: { en: "Of prospecting time eliminated", pt: "Do tempo de prospecção eliminado" },
        estimated: true,
      },
      {
        value: { en: "100%", pt: "100%" },
        label: { en: "Of leads validated for role and fit", pt: "Dos leads validados por cargo e fit" },
      },
    ],
    challenge: {
      en: "Finding the right contact at each target company, checking their role and fit, and writing a personalized message took 15 to 20 minutes of research per lead, plus another 10 minutes of writing. Outreach capacity was capped by the team's hours.",
      pt: "Achar o contato certo em cada empresa-alvo, checar cargo e fit, e escrever uma mensagem personalizada levava de 15 a 20 minutos de pesquisa por lead, mais uns 10 minutos de escrita. A capacidade de prospecção era limitada pelas horas do time.",
    },
    solution: {
      en: "From the target-company base, an automated workflow finds profiles, validates the company, seniority, and fit with social-impact themes, and creates the lead in the CRM. An AI agent then writes a synergy summary plus a personalized connection invite and a follow-up message for each lead. The team reviews and sends manually, keeping compliance and the human touch: the machine does the grunt work, the person does the relationship.",
      pt: "A partir da base de empresas-alvo, um fluxo automatizado encontra perfis, valida a empresa, a senioridade e o fit com temas de impacto social, e cria o lead no CRM. Depois, um agente de IA escreve um resumo de sinergia mais um convite de conexão personalizado e uma mensagem de follow-up para cada lead. O time revisa e envia manualmente, mantendo compliance e o toque humano: a máquina faz o operacional, a pessoa faz o relacionamento.",
    },
    result: {
      en: "Research and validation per lead dropped from 15-20 minutes to seconds, personalized copy from ~10 minutes to seconds, cutting overall prospecting time by roughly 80%. No more generic copy-paste: every lead gets an approach based on their own corporate context, and the team's hours moved from hunting names and titles to conversations and closing.",
      pt: "A pesquisa e validação por lead caiu de 15-20 minutos para segundos, o copy personalizado de ~10 minutos para segundos, cortando o tempo total de prospecção em cerca de 80%. Acabou o copia e cola genérico: cada lead recebe uma abordagem baseada no próprio contexto corporativo, e as horas do time saíram de caçar nomes e cargos para conversas e fechamento.",
    },
    aboutClient: {
      sector: {
        en: "Nonprofit support institute (trains and connects NGOs and companies)",
        pt: "Instituto de apoio a organizações sem fins lucrativos (treina e conecta ONGs e empresas)",
      },
      scale: { en: "National outreach operation", pt: "Operação nacional de outreach" },
    },
    seoDescription: {
      en: "An AI workflow finds and validates LinkedIn leads for Phomenta and writes personalized outreach in seconds, cutting prospecting time by roughly 80%.",
      pt: "Um fluxo de IA encontra e valida leads no LinkedIn para a Phomenta e escreve abordagem personalizada em segundos, cortando o tempo de prospecção em cerca de 80%.",
    },
  },
  {
    slug: "phomenta-grant-prospecting",
    client: "Instituto Phomenta",
    sector: "Nonprofit",
    areas: ["Sales"],
    title: {
      en: "Phomenta: a national nonprofit database filtered for one grant in hours",
      pt: "Phomenta: uma base nacional de ONGs filtrada para um edital em horas",
    },
    summary: {
      en: "A rules-based engine reads a grant's criteria and filters a national public database down to the organizations that can actually win it.",
      pt: "Um motor de regras lê os critérios do edital e filtra uma base pública nacional até as organizações que realmente podem ganhar.",
    },
    metrics: [
      {
        value: { en: "Thousands in minutes", pt: "Milhares em minutos" },
        label: {
          en: "Organizations screened (manual pace was hundreds per week)",
          pt: "Organizações triadas (o ritmo manual era centenas por semana)",
        },
      },
      {
        value: { en: "Hours, not weeks", pt: "Horas, não semanas" },
        label: { en: "To respond to a new grant", pt: "Para responder a um novo edital" },
      },
      {
        value: { en: "~US$20", pt: "~US$ 20" },
        label: {
          en: "Total processing cost for a real grant",
          pt: "Custo total de processamento de um edital real",
        },
      },
    ],
    challenge: {
      en: "For each new grant, finding which nonprofits fit the eligibility criteria meant manually screening a national database of hundreds of thousands of organizations: legal status, category, region, social focus. Weeks of work for every grant cycle, and running AI over the whole database would cost thousands of dollars.",
      pt: "Para cada novo edital, encontrar quais ONGs se encaixavam nos critérios de elegibilidade significava triar manualmente uma base nacional com centenas de milhares de organizações: natureza jurídica, categoria, região, foco social. Semanas de trabalho a cada ciclo de edital, e rodar IA sobre a base inteira custaria milhares de dólares.",
    },
    solution: {
      en: "We built a hybrid pipeline: code where speed and cost matter, AI where context matters. A rules engine reads the grant's criteria and filters the database deterministically: legal-nature codes, exclusion rules, a 0-4 territorial-vulnerability score built from address markers, a 0-4 social-area score, and a strict municipality filter. Only the approved organizations reach the AI, which writes personalized outreach for each one.",
      pt: "Construímos um pipeline híbrido: código onde velocidade e custo importam, IA onde o contexto importa. Um motor de regras lê os critérios do edital e filtra a base de forma determinística: códigos de natureza jurídica, regras de exclusão, uma nota de 0 a 4 de vulnerabilidade territorial construída a partir de marcadores de endereço, uma nota de 0 a 4 de área social e um filtro estrito de município. Só as organizações aprovadas chegam à IA, que escreve a abordagem personalizada para cada uma.",
    },
    result: {
      en: "Screening went from hundreds of organizations per week to thousands in minutes. Delivered on a real federal-bank grant at about US$20 of processing cost, and every approved organization carries an auditable justification (its scores and criteria), which funders can trace. Responding to a new grant now means swapping the PDF and the rules: hours, not weeks.",
      pt: "A triagem passou de centenas de organizações por semana para milhares em minutos. Entregue em um edital real de banco federal por cerca de US$ 20 de custo de processamento, e cada organização aprovada carrega uma justificativa auditável (as notas e critérios), que os financiadores podem rastrear. Responder a um novo edital agora é trocar o PDF e as regras: horas, não semanas.",
    },
    aboutClient: {
      sector: {
        en: "Nonprofit support institute (trains and connects NGOs and companies)",
        pt: "Instituto de apoio a organizações sem fins lucrativos (treina e conecta ONGs e empresas)",
      },
      scale: { en: "National outreach operation", pt: "Operação nacional de outreach" },
    },
    seoDescription: {
      en: "A hybrid rules-plus-AI pipeline filters a national nonprofit database for Phomenta grant cycles in hours, at about US$20 of processing cost per grant.",
      pt: "Um pipeline híbrido de regras e IA filtra uma base nacional de ONGs para os ciclos de editais da Phomenta em horas, por cerca de US$ 20 de custo de processamento por edital.",
    },
  },
  {
    slug: "robbin-payroll",
    client: "Robbin Services",
    sector: "Construction (USA)",
    areas: ["Human Resources"],
    title: {
      en: "Robbin Services: payroll from timecards to payment, calculated automatically",
      pt: "Robbin Services: folha de pagamento do cartão-ponto ao pagamento, calculada automaticamente",
    },
    summary: {
      en: "A North Carolina electrical subcontractor stopped closing crew payroll by hand: each worker's rules applied automatically, every week.",
      pt: "Um subcontratado elétrico da Carolina do Norte parou de fechar a folha da equipe no braço: as regras de cada trabalhador aplicadas automaticamente, toda semana.",
    },
    metrics: [
      {
        value: { en: "~US$15,000/year", pt: "~US$ 15.000/ano" },
        label: {
          en: "Owner and admin time recovered (6 h/week at US$50/h)",
          pt: "Tempo de dono e admin recuperado (6h/semana a US$ 50/h)",
        },
        estimated: true,
      },
      {
        value: { en: "3", pt: "3" },
        label: {
          en: "Time categories tracked per worker: the job, travel, supply runs",
          pt: "Categorias de tempo por trabalhador: obra, deslocamento e compra de material",
        },
      },
      {
        value: { en: "Hours to minutes", pt: "Horas para minutos" },
        label: { en: "Weekly payroll closing", pt: "Fechamento semanal da folha" },
      },
    ],
    challenge: {
      en: "Crew timecards lived in the field-service tool, but payroll was closed by hand: each electrician has their own day rate, overtime rule, lunch window, and travel-time treatment. Weekly closing consumed about 6 hours and invited errors: negative durations, missing lunch entries inflating paid hours.",
      pt: "Os cartões-ponto da equipe viviam na ferramenta de field-service, mas a folha era fechada no braço: cada eletricista tem sua diária, sua regra de hora extra, sua janela de almoço e seu tratamento de tempo de deslocamento. O fechamento semanal consumia cerca de 6 horas e abria espaço para erros: durações negativas, almoços não registrados inflando as horas pagas.",
    },
    solution: {
      en: "We built a pipeline that reads the timecards and applies each person's documented rules automatically: day rates, overtime after 8 hours, lunch detection. Clock-in and clock-out are split into three categories, the job itself, travel time, and supply runs, so every paid hour lands in the right bucket. The pipeline also audits the data, catching inconsistencies that used to distort pay.",
      pt: "Construímos um pipeline que lê os cartões-ponto e aplica automaticamente as regras documentadas de cada pessoa: diárias, hora extra depois de 8 horas, detecção de almoço. As entradas e saídas são separadas em três categorias, a própria obra, tempo de deslocamento e compra de material, então cada hora paga cai no balde certo. O pipeline também audita os dados, pegando inconsistências que antes distorciam o pagamento.",
    },
    result: {
      en: "Weekly closing went from hours of spreadsheet work to minutes of review, with each worker paid exactly by their agreed rules. Clean, categorized time data made it possible to compute each technician's real cost per hour, and exposed where paid hours were leaking, which became the field-productivity case below.",
      pt: "O fechamento semanal saiu de horas de planilha para minutos de revisão, com cada trabalhador pago exatamente pelas regras acordadas. Dados de tempo limpos e categorizados tornaram possível calcular o custo real por hora de cada técnico e expuseram onde as horas pagas estavam vazando, o que virou o caso de produtividade em campo abaixo.",
    },
    aboutClient: {
      sector: {
        en: "Electrical subcontractor for general contractors (North Carolina, USA)",
        pt: "Subcontratado elétrico para general contractors (Carolina do Norte, EUA)",
      },
      size: { en: "Field crew plus virtual assistant", pt: "Equipe de campo mais assistente virtual" },
      scale: { en: "100+ invoices issued", pt: "100+ notas emitidas" },
    },
    seoDescription: {
      en: "A North Carolina electrical subcontractor automated weekly payroll from raw timecards. Closing went from hours to minutes, with each worker's rules applied per line.",
      pt: "Um subcontratado elétrico da Carolina do Norte automatizou a folha semanal a partir dos cartões-ponto brutos. O fechamento passou de horas para minutos, com as regras de cada trabalhador aplicadas linha por linha.",
    },
  },
  {
    slug: "robbin-receivables-cash",
    client: "Robbin Services",
    sector: "Construction (USA)",
    areas: ["Finance"],
    title: {
      en: "Robbin Services: invoices into QuickBooks, and overdue balances that stopped hiding",
      pt: "Robbin Services: notas fiscais entrando no QuickBooks, e saldos em atraso que pararam de se esconder",
    },
    summary: {
      en: "An AI parser posts invoices and monthly costs into QuickBooks, and a weekly receivables review turned unpaid balances into rules, reminders, and protected cash.",
      pt: "Um parser com IA lança faturas e custos mensais no QuickBooks, e uma revisão semanal de recebíveis transformou saldos em aberto em regras, lembretes e caixa protegido.",
    },
    metrics: [
      {
        value: { en: "US$5,000-14,500", pt: "US$ 5.000-14.500" },
        label: {
          en: "In at-risk receivables surfaced and chased per week",
          pt: "Em recebíveis em risco identificados e cobrados por semana",
        },
      },
      {
        value: { en: "50%", pt: "50%" },
        label: {
          en: "Upfront deposit now required on large projects",
          pt: "Sinal obrigatório agora exigido em projetos grandes",
        },
      },
      {
        value: { en: "100+", pt: "100+" },
        label: { en: "Invoices processed automatically", pt: "Faturas processadas automaticamente" },
      },
    ],
    challenge: {
      en: "Every invoice and monthly cost was typed into QuickBooks by hand, and unpaid balances piled up unnoticed: invoices marked as paid still carried open balances, overdue customers kept getting new bookings, and some jobs quietly lost money, with material alone eating most of the revenue.",
      pt: "Cada fatura e custo mensal era digitado no QuickBooks no braço, e os saldos em aberto se acumulavam sem ninguém notar: faturas marcadas como pagas ainda carregavam saldo, clientes em atraso continuavam a receber novos agendamentos, e alguns serviços quietamente perdiam dinheiro, com só o material comendo boa parte da receita.",
    },
    solution: {
      en: "An AI parser reads the invoices, extracts the data, and posts monthly costs directly into QuickBooks Online. On top of clean books, a weekly monitoring routine surfaces open and overdue balances and turned into business rules: automatic payment reminders (1 day before, 3 and 7 days after due date), a 50% upfront deposit on large projects, a booking lock for customers more than 7 days late, and margin checks that flag jobs where material cost is out of proportion, now covered by a minimum-price policy and formal change orders.",
      pt: "Um parser com IA lê as faturas, extrai os dados e lança os custos mensais direto no QuickBooks Online. Sobre livros limpos, uma rotina semanal de monitoramento identifica saldos em aberto e em atraso e virou regra de negócio: lembretes automáticos de pagamento (1 dia antes, 3 e 7 dias depois do vencimento), sinal de 50% em projetos grandes, bloqueio de agendamento para clientes com mais de 7 dias de atraso, e checagens de margem que sinalizam serviços em que o custo de material está fora de proporção, agora cobertos por política de preço mínimo e change orders formais.",
    },
    result: {
      en: "Data entry disappeared and the books stay current. Every week, US$5,000 to US$14,500 in at-risk balances get surfaced and acted on instead of aging silently, and cash became predictable: deposits before big jobs, reminders on schedule, and no new work booked for late payers.",
      pt: "A digitação sumiu e os livros ficam em dia. Toda semana, US$ 5.000 a US$ 14.500 em saldos em risco são identificados e cobrados em vez de envelhecerem em silêncio, e o caixa ficou previsível: sinal antes das obras grandes, lembretes no prazo, e nenhum trabalho novo agendado para maus pagadores.",
    },
    aboutClient: {
      sector: {
        en: "Electrical subcontractor for general contractors (North Carolina, USA)",
        pt: "Subcontratado elétrico para general contractors (Carolina do Norte, EUA)",
      },
      size: { en: "Field crew plus virtual assistant", pt: "Equipe de campo mais assistente virtual" },
      scale: { en: "100+ invoices issued", pt: "100+ notas emitidas" },
    },
    seoDescription: {
      en: "AI posts invoices into QuickBooks and a weekly receivables review turned unpaid balances into deposits, reminders, and protected cash for Robbin Services.",
      pt: "IA lança faturas no QuickBooks e uma revisão semanal de recebíveis transformou saldos em aberto em sinais, lembretes e caixa protegido para a Robbin Services.",
    },
  },
  {
    slug: "robbin-field-productivity",
    client: "Robbin Services",
    sector: "Construction (USA)",
    areas: ["Operations"],
    title: {
      en: "Robbin Services: non-billable hours cut from up to 18% to under 5%",
      pt: "Robbin Services: horas não faturáveis cortadas de até 18% para menos de 5%",
    },
    summary: {
      en: "Tracking work, travel, and supply runs separately exposed where paid hours leaked, and simple routines turned the leak into billable capacity and bigger jobs.",
      pt: "Separar trabalho, deslocamento e compra de material expôs onde as horas pagas vazavam, e rotinas simples transformaram o vazamento em capacidade faturável e serviços maiores.",
    },
    metrics: [
      {
        value: { en: "18.2% to under 5%", pt: "18,2% para menos de 5%" },
        label: {
          en: "Non-billable share of paid hours",
          pt: "Participação de horas não faturáveis nas horas pagas",
        },
      },
      {
        value: { en: "10-15 h/week", pt: "10-15 h/semana" },
        label: {
          en: "Of productive capacity freed (US$300-500/week in payroll)",
          pt: "De capacidade produtiva liberada (US$ 300-500/semana em folha)",
        },
      },
      {
        value: { en: "+50%", pt: "+50%" },
        label: {
          en: "Average job ticket (US$2,101 to US$3,148)",
          pt: "Ticket médio dos serviços (US$ 2.101 para US$ 3.148)",
        },
      },
    ],
    challenge: {
      en: "Paid hours were leaking into supply-store runs and unplanned driving: non-billable time consumed 13.5% to 18.2% of the crew's week, and in one extreme week a technician spent 36.9% of his paid time buying supplies. Nothing measured the leak, so nothing managed it.",
      pt: "Horas pagas vazavam em idas à loja de material e deslocamentos não planejados: o tempo não faturável consumia de 13,5% a 18,2% da semana da equipe, e numa semana extrema um técnico passou 36,9% do tempo pago comprando material. Nada media o vazamento, então nada gerenciava.",
    },
    solution: {
      en: "With clock-in and clock-out already split into job, travel, and supply time (see the payroll case), the leak became visible week by week. We turned measurement into routine: purchases consolidated into two supply runs per week, pre-job material checklists so crews arrive complete, routing by zone, and a weekly report tracking the non-billable share. The freed hours were pointed at higher-ticket jobs and recurring key accounts.",
      pt: "Com as entradas e saídas já separadas em obra, deslocamento e compra de material (ver o caso de folha), o vazamento ficou visível semana a semana. Transformamos a medição em rotina: compras consolidadas em duas idas por semana, checklists de material antes do serviço para a equipe chegar completa, roteamento por zona e um relatório semanal acompanhando a participação de horas não faturáveis. As horas liberadas foram apontadas para serviços de ticket mais alto e clientes-chave recorrentes.",
    },
    result: {
      en: "Whole weeks now close with zero supply hours, non-billable time runs between 0% and 4.7%, and 10 to 15 hours per week came back as billable capacity. The average job ticket rose about 50%, and weekly revenue grew 66% in the first weeks of the new schedule.",
      pt: "Semanas inteiras agora fecham com zero horas de compra de material, o tempo não faturável fica entre 0% e 4,7%, e 10 a 15 horas por semana voltaram como capacidade faturável. O ticket médio dos serviços subiu cerca de 50%, e a receita semanal cresceu 66% nas primeiras semanas do novo cronograma.",
    },
    aboutClient: {
      sector: {
        en: "Electrical subcontractor for general contractors (North Carolina, USA)",
        pt: "Subcontratado elétrico para general contractors (Carolina do Norte, EUA)",
      },
      size: { en: "Field crew plus virtual assistant", pt: "Equipe de campo mais assistente virtual" },
      scale: { en: "100+ invoices issued", pt: "100+ notas emitidas" },
    },
    seoDescription: {
      en: "Splitting paid time into job, travel, and supply runs let Robbin Services cut non-billable hours from up to 18% to under 5% and raise the average ticket by 50%.",
      pt: "Separar o tempo pago em obra, deslocamento e compra de material fez a Robbin Services cortar as horas não faturáveis de até 18% para menos de 5% e elevar o ticket médio em 50%.",
    },
  },
];
