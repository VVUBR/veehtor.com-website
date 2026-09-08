import type { Language } from "@/i18n/translations";

export type Sector =
  | "Agribusiness"
  | "Food & Beverage"
  | "Nonprofit"
  | "Construction";

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
  "Construction": { en: "Construction", pt: "Construção" },
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

/**
 * Anonymized client identity. Four organizations, ten implementations.
 * Client ids are neutral and never carry a real client name.
 */
export type ClientId = "agri-dealership" | "electrical" | "nonprofit" | "brewery";

export const CLIENTS: Record<ClientId, LS> = {
  "agri-dealership": {
    pt: "Rede de concessionárias de máquinas agrícolas",
    en: "Agricultural equipment dealership network",
  },
  electrical: {
    pt: "Empresa de serviços elétricos nos EUA",
    en: "US electrical contractor",
  },
  nonprofit: {
    pt: "Instituto de apoio a organizações sociais",
    en: "Nonprofit support organization",
  },
  brewery: {
    pt: "Cervejaria com diversos pontos de venda",
    en: "Multi-location brewery",
  },
};

/**
 * Proof classification for a documented metric.
 *  - measured    RESULTADO MEDIDO
 *  - operational RESULTADO OPERACIONAL
 *  - system      SISTEMA EM OPERAÇÃO
 *  - estimated   IMPACTO ESTIMADO
 *  - scale       ESCALA / COBERTURA / VOLUME
 * Never use `measured` for projection, coverage, volume or availability.
 * A metric only ships when its evidence record is confirmed by the owner
 * (see docs/case-metrics-matrix.md); nothing is promoted automatically.
 */
export type ProofClass =
  | "measured"
  | "operational"
  | "system"
  | "estimated"
  | "scale";

export interface Metric {
  value: LS;
  label: LS;
  proof: ProofClass;
}

export interface CaseStudy {
  /** Stable, neutral analytics/reference id. Independent of the slug. */
  id: string;
  /** Public address segment under /case-studies/. */
  slug: string;
  /** Previous addresses kept for compatibility only. */
  legacySlugs: string[];
  clientId: ClientId;
  /** Editorial order, identical in both languages. */
  order: number;
  sector: Sector;
  areas: Area[];
  title: LS;
  summary: LS;
  bottleneck: LS;
  implemented: LS;
  changed: LS;
  /** Up to two qualitative highlights. */
  highlights: LS[];
  /** Case-specific CTA question. */
  cta: LS;
  /** Only metrics with a confirmed evidence record. Empty by default. */
  metrics?: Metric[];
  /** "Como medimos" / "Measurement scope". Only when there is real content. */
  measurement?: LS;
  seoDescription: LS;
  /** Short variant reused on the home page. Same record, no separate copy. */
  home?: { context: LS; short: LS };
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
    id: "credit-analysis",
    slug: "agricultural-equipment-credit-analysis",
    legacySlugs: ["dcarvalho-credit-scoring"],
    clientId: "agri-dealership",
    order: 1,
    sector: "Agribusiness",
    areas: ["Finance"],
    title: {
      pt: "Análise de crédito com histórico do cliente e recomendação para o comitê",
      en: "Credit analysis grounded in customer history, ready for committee review",
    },
    summary: {
      pt: "Uma rede de máquinas agrícolas reuniu comportamento de pagamento, dados externos e políticas internas em um sistema que prepara recomendações de crédito. A aprovação continua com o comitê.",
      en: "An agricultural equipment network brought payment history, external data, and internal policies into a system that prepares credit recommendations. The committee retains final approval.",
    },
    bottleneck: {
      pt: "A rede precisava analisar clientes considerando mais do que a consulta a uma base externa. O histórico de compras, atrasos e renegociações dentro da própria empresa também era relevante para avaliar uma nova operação.",
      en: "The network needed to assess customers using more than an external credit check. Purchase history, late payments, and renegotiations within the business also mattered when evaluating a new transaction.",
    },
    implemented: {
      pt: "A Veehtor construiu um sistema que reúne esses dados e os cruza com sinais do contexto agrícola. A partir das políticas da empresa, o sistema prepara uma recomendação de limite, taxa e entrada para avaliação do comitê.",
      en: "Veehtor built a system that brings these records together with signals from the agricultural market. It uses company policies to prepare a recommended credit limit, rate, and down payment for committee review.",
    },
    changed: {
      pt: "O comitê passou a receber uma recomendação estruturada, apoiada no histórico do cliente e nos critérios da empresa. O sistema organiza a análise que sustenta a decisão; a aprovação final permanece humana.",
      en: "The committee now receives a structured recommendation informed by customer history and company criteria. The system organizes the analysis supporting the decision; final approval remains with the committee.",
    },
    highlights: [
      {
        pt: "Histórico de pagamento e critérios internos reunidos.",
        en: "Payment history and internal criteria brought together.",
      },
      {
        pt: "Recomendação estruturada para o comitê.",
        en: "Structured recommendations for committee review.",
      },
    ],
    cta: {
      pt: "A análise de crédito está segurando propostas na sua operação? Converse com a Veehtor sobre essa rotina.",
      en: "Is credit analysis holding up proposals? Talk to Veehtor about the workflow.",
    },
    seoDescription: {
      pt: "Uma rede de concessionárias de máquinas agrícolas reuniu comportamento de pagamento, dados externos e políticas internas em um sistema que prepara recomendações de crédito para o comitê.",
      en: "An agricultural equipment dealership network brought payment history, external data, and internal policies into a system that prepares credit recommendations for committee review.",
    },
    home: {
      context: { pt: "Crédito B2B", en: "B2B credit" },
      short: {
        pt: "Histórico de pagamento, dados externos e políticas internas reunidos em uma recomendação de crédito para o comitê.",
        en: "Payment history, external data, and internal policies brought together into a credit recommendation for the committee.",
      },
    },
  },
  {
    id: "field-productivity",
    slug: "electrical-contractor-field-productivity",
    legacySlugs: ["robbin-field-productivity"],
    clientId: "electrical",
    order: 2,
    sector: "Construction",
    areas: ["Operations"],
    title: {
      pt: "Menos tempo em deslocamentos e compras. Mais capacidade em campo.",
      en: "Less time on travel and supply runs. More field capacity.",
    },
    summary: {
      pt: "Separar horas de serviço, deslocamento e compra de material mostrou onde a equipe perdia capacidade. Os dados passaram a orientar compras, preparação de materiais e rotas.",
      en: "Separating job time, travel, and supply runs revealed where paid hours were going. The data then informed purchasing, material preparation, and routing.",
    },
    bottleneck: {
      pt: "Parte das horas pagas era consumida por deslocamentos não planejados e idas à loja de material. Sem separar esses tempos, a gestão não conseguia enxergar com clareza quanto da semana estava disponível para executar serviços.",
      en: "Unplanned travel and supply-store visits consumed part of the crew's paid week. Without separate time categories, management could not clearly see how much capacity remained for delivering jobs.",
    },
    implemented: {
      pt: "A partir dos registros de jornada, a Veehtor ajudou a transformar a medição em rotina: compras consolidadas, conferência de materiais antes da saída, roteamento por região e acompanhamento semanal do tempo não faturável.",
      en: "Using time records, Veehtor helped turn measurement into an operating routine: consolidated purchasing, material checks before departure, routing by area, and weekly tracking of non-billable time.",
    },
    changed: {
      pt: "A gestão passou a enxergar a distribuição das horas pagas e a usar essa informação no planejamento das equipes. A combinação de medição e mudanças na rotina liberou capacidade para execução de serviços.",
      en: "Management gained visibility into the distribution of paid hours and used it to plan field work. Measurement and changes to daily routines together released capacity for service delivery.",
    },
    highlights: [
      {
        pt: "Tempo não faturável acompanhado por semana.",
        en: "Weekly visibility into non-billable time.",
      },
      {
        pt: "Compras, materiais e rotas organizados a partir dos dados.",
        en: "Purchasing, materials, and routes planned using operating data.",
      },
    ],
    cta: {
      pt: "Sua equipe perde capacidade entre deslocamentos, compras e execução? Converse com a Veehtor sobre como medir essa rotina.",
      en: "Is your crew losing capacity between travel, purchasing, and delivery? Talk to Veehtor about measuring that workflow.",
    },
    seoDescription: {
      pt: "Uma empresa de serviços elétricos nos EUA separou horas de serviço, deslocamento e compra de material e passou a organizar compras, materiais e rotas a partir desses dados.",
      en: "A US electrical contractor separated job time, travel, and supply runs, then used that data to organize purchasing, materials, and routing.",
    },
    home: {
      context: { pt: "Operações de campo", en: "Field operations" },
      short: {
        pt: "Horas de serviço, deslocamento e compra de material separadas para orientar compras, materiais e rotas.",
        en: "Job time, travel, and supply runs separated to guide purchasing, materials, and routing.",
      },
    },
  },
  {
    id: "grant-screening",
    slug: "nonprofit-grant-screening",
    legacySlugs: ["phomenta-grant-prospecting"],
    clientId: "nonprofit",
    order: 3,
    sector: "Nonprofit",
    areas: ["Sales"],
    title: {
      pt: "Critérios de edital transformados em uma seleção rastreável de organizações",
      en: "Grant criteria turned into a traceable shortlist of organizations",
    },
    summary: {
      pt: "Uma base pública nacional passou a ser filtrada pelos critérios de cada seleção. A equipe recebe organizações compatíveis com as regras aplicadas e a justificativa da triagem.",
      en: "A national public database is filtered against the criteria of each selection process. The team receives matching organizations and the rationale behind the screening.",
    },
    bottleneck: {
      pt: "A cada edital, a equipe precisava buscar organizações compatíveis com requisitos como localização, natureza jurídica e área de atuação. Repetir a leitura manual dos registros limitava a capacidade de preparar a seleção dentro do prazo.",
      en: "Each grant required the team to identify organizations that matched requirements such as location, legal status, and area of work. Repeated manual review limited how quickly the team could prepare a shortlist.",
    },
    implemented: {
      pt: "A Veehtor construiu um fluxo que aplica filtros objetivos à base e registra os critérios usados. A IA entra depois da triagem para preparar abordagens personalizadas às organizações selecionadas.",
      en: "Veehtor built a workflow that applies objective filters and records the criteria used. AI then prepares personalized outreach for organizations that pass the screening.",
    },
    changed: {
      pt: "A equipe passou a trabalhar com uma lista filtrada e com os critérios de seleção registrados. A saída apoia a revisão e o contato com as organizações; a elegibilidade final e a concessão do recurso dependem do processo do edital.",
      en: "The team now works from a filtered list with documented selection criteria. The output supports review and outreach; final eligibility and funding decisions remain part of the grant process.",
    },
    highlights: [
      { pt: "Triagem por critérios definidos.", en: "Screening against defined criteria." },
      {
        pt: "Justificativas disponíveis para revisão.",
        en: "Selection rationale available for review.",
      },
    ],
    cta: {
      pt: "Sua equipe precisa conferir muitos registros contra critérios específicos? Converse com a Veehtor sobre essa triagem.",
      en: "Does your team need to check large numbers of records against specific criteria? Talk to Veehtor about that workflow.",
    },
    seoDescription: {
      pt: "Um instituto de apoio a organizações sociais passou a filtrar uma base pública nacional pelos critérios de cada edital, com as justificativas da triagem registradas para revisão.",
      en: "A nonprofit support organization filters a national public database against each grant's criteria, with screening rationale recorded for review.",
    },
    home: {
      context: { pt: "Triagem para editais", en: "Grant screening" },
      short: {
        pt: "Critérios de edital aplicados a uma base pública nacional, com justificativas registradas para revisão.",
        en: "Grant criteria applied to a national public database, with rationale recorded for review.",
      },
    },
  },
  {
    id: "outreach-research",
    slug: "nonprofit-outreach-research",
    legacySlugs: ["phomenta-linkedin-leads"],
    clientId: "nonprofit",
    order: 4,
    sector: "Nonprofit",
    areas: ["Sales"],
    title: {
      pt: "Pesquisa e abordagem comercial preparadas antes da revisão do time",
      en: "Contact research and outreach drafts prepared for team review",
    },
    summary: {
      pt: "Um fluxo pesquisa contatos nas empresas-alvo, confere cargo e aderência aos critérios e prepara mensagens personalizadas. A equipe revisa o material e conduz o contato.",
      en: "A workflow researches contacts at target companies, checks role and fit against defined criteria, and prepares personalized messages. The team reviews the output and manages outreach.",
    },
    bottleneck: {
      pt: "Encontrar a pessoa adequada em cada empresa exigia pesquisar perfil, cargo e relação com temas de impacto social. Depois, ainda era necessário escrever uma mensagem conectada ao contexto daquela empresa.",
      en: "Finding the right person at each company required checking their profile, role, and connection to social-impact themes. The team then had to write an outreach message grounded in that company's context.",
    },
    implemented: {
      pt: "A Veehtor construiu um fluxo que parte da lista de empresas-alvo, pesquisa os perfis, aplica os critérios de seleção e cria os registros no CRM. A IA prepara um resumo de afinidade, um convite de conexão e uma mensagem de acompanhamento para revisão humana.",
      en: "Veehtor built a workflow that starts with target accounts, researches profiles, applies selection criteria, and creates CRM records. AI prepares a fit summary, a connection invitation, and a follow-up draft for human review.",
    },
    changed: {
      pt: "A pesquisa e a preparação inicial das mensagens passaram a ser feitas pelo fluxo. A equipe recebe o material para revisar e usa esse ponto de partida para conduzir as conversas e desenvolver relacionamentos.",
      en: "Research and initial message preparation now run through the workflow. The team receives material to review and uses it as a starting point for conversations and relationship development.",
    },
    highlights: [
      {
        pt: "Contatos pesquisados segundo critérios definidos.",
        en: "Contacts researched against defined criteria.",
      },
      {
        pt: "Mensagens preparadas para revisão humana.",
        en: "Outreach drafts prepared for human review.",
      },
    ],
    cta: {
      pt: "A pesquisa está consumindo o tempo de quem deveria conversar com clientes e parceiros? Converse com a Veehtor.",
      en: "Is research taking time away from conversations with customers and partners? Talk to Veehtor.",
    },
    seoDescription: {
      pt: "Um instituto de apoio a organizações sociais passou a pesquisar contatos, aplicar critérios, criar registros no CRM e preparar mensagens personalizadas para revisão humana.",
      en: "A nonprofit support organization researches contacts, applies criteria, creates CRM records, and prepares personalized outreach drafts for human review.",
    },
  },
  {
    id: "receivables",
    slug: "electrical-contractor-receivables",
    legacySlugs: ["robbin-receivables-cash"],
    clientId: "electrical",
    order: 5,
    sector: "Construction",
    areas: ["Finance"],
    title: {
      pt: "Saldos em atraso passaram a gerar cobrança e regras para novos serviços",
      en: "Overdue balances now trigger collection follow-up and booking rules",
    },
    summary: {
      pt: "A integração com o financeiro e uma revisão semanal de recebíveis deram visibilidade a saldos pendentes. Lembretes, entrada antecipada e critérios de agendamento passaram a fazer parte da rotina.",
      en: "Accounting integration and a weekly receivables review made outstanding balances visible. Payment reminders, upfront deposits, and booking criteria became part of the operating routine.",
    },
    bottleneck: {
      pt: "Faturas e custos eram lançados manualmente no sistema financeiro. Ao mesmo tempo, saldos em aberto podiam passar despercebidos, inclusive quando clientes em atraso solicitavam novos serviços.",
      en: "Invoices and costs were entered manually into the accounting system. At the same time, outstanding balances could go unnoticed, including when overdue customers requested new work.",
    },
    implemented: {
      pt: "A Veehtor automatizou a extração de dados de faturas e os lançamentos previstos no fluxo do QuickBooks. A revisão de recebíveis passou a orientar lembretes de pagamento, exigência de entrada em projetos maiores e critérios para agendar novos trabalhos. A gestão também incorporou verificações de custo de material e preço dos serviços.",
      en: "Veehtor automated invoice data extraction and the accounting entries included in the QuickBooks workflow. Receivables reviews informed scheduled reminders, upfront deposits for larger projects, and criteria for booking additional work. Management also added checks on material costs and job pricing.",
    },
    changed: {
      pt: "Pendências passaram a ter visibilidade e encaminhamento dentro de uma rotina de cobrança. A empresa passou a aplicar critérios de pagamento e agendamento aos novos serviços, com acompanhamento dos saldos em aberto.",
      en: "Outstanding balances gained visibility and a defined follow-up process. The business began applying payment and booking criteria to new jobs while tracking open receivables.",
    },
    highlights: [
      { pt: "Recebíveis com acompanhamento semanal.", en: "Weekly receivables monitoring." },
      {
        pt: "Cobrança e novos agendamentos orientados por regras.",
        en: "Collection follow-up and bookings guided by business rules.",
      },
    ],
    cta: {
      pt: "Existem saldos em aberto sem próximo passo definido na sua empresa? Converse com a Veehtor sobre a rotina de recebíveis.",
      en: "Does your business have outstanding balances with no clear next action? Talk to Veehtor about your receivables workflow.",
    },
    seoDescription: {
      pt: "Uma empresa de serviços elétricos nos EUA integrou faturas ao financeiro e criou uma revisão semanal de recebíveis, com lembretes, entrada antecipada e critérios de agendamento.",
      en: "A US electrical contractor integrated invoices with accounting and built a weekly receivables review, with reminders, upfront deposits, and booking criteria.",
    },
  },
  {
    id: "brewery-time-tracking",
    slug: "multi-location-brewery-time-tracking",
    legacySlugs: ["complo-time-tracking"],
    clientId: "brewery",
    order: 6,
    sector: "Food & Beverage",
    areas: ["Human Resources"],
    title: {
      pt: "Jornadas e cálculo de pagamentos reunidos para conferência",
      en: "Time records and payment calculations brought together for review",
    },
    summary: {
      pt: "Uma cervejaria com vários pontos de venda substituiu o controle manual de jornadas por registros no celular e cálculo automatizado. A gestão recebe horas e valores organizados para revisar o fechamento.",
      en: "A multi-location brewery replaced manual time tracking with mobile records and automated calculations. Management receives organized hours and payment amounts for review.",
    },
    bottleneck: {
      pt: "Toda semana, a gestão precisava consolidar as horas de profissionais que atuavam em diferentes pontos de venda e calcular quanto cada um tinha a receber. Os registros manuais dificultavam a conferência.",
      en: "Every week, management had to consolidate time worked across different locations and calculate the amount owed to each worker. Manual records made that review difficult.",
    },
    implemented: {
      pt: "A Veehtor construiu um aplicativo de entrada e saída pelo celular, com geolocalização no registro. O fluxo sinaliza batidas esquecidas e prepara o cálculo semanal com horas, valores e dados de pagamento, enviado à gestão pelo WhatsApp.",
      en: "Veehtor built a mobile clock-in and clock-out application with location captured at the time of entry. The workflow flags missing entries and prepares weekly hours, amounts, and payment details for management through WhatsApp.",
    },
    changed: {
      pt: "Os registros e o cálculo passaram a chegar organizados para conferência da gestão. Esse primeiro módulo também abriu caminho para ampliar a plataforma a outras rotinas da mesma operação.",
      en: "Time records and payment calculations are now brought together for management review. This first module also provided a starting point for extending the platform to other workflows in the same business.",
    },
    highlights: [
      { pt: "Registro de jornadas pelo celular.", en: "Mobile time records." },
      {
        pt: "Cálculo semanal preparado para conferência.",
        en: "Weekly payment calculations prepared for review.",
      },
    ],
    cta: {
      pt: "Fechar jornadas de várias unidades está tomando tempo da gestão? Converse com a Veehtor sobre essa rotina.",
      en: "Is consolidating time across locations taking up management time? Talk to Veehtor about the workflow.",
    },
    seoDescription: {
      pt: "Uma cervejaria com vários pontos de venda trocou o controle manual de jornadas por registros no celular e cálculo semanal automatizado, preparado para conferência da gestão.",
      en: "A multi-location brewery replaced manual time tracking with mobile records and automated weekly calculations prepared for management review.",
    },
    home: {
      context: { pt: "Fechamento de jornadas", en: "Timesheet closing" },
      short: {
        pt: "Registros de ponto pelo celular e cálculo semanal preparado para a conferência da gestão.",
        en: "Mobile time records and weekly calculations prepared for management review.",
      },
    },
  },
  {
    id: "payroll",
    slug: "electrical-contractor-payroll",
    legacySlugs: ["robbin-payroll"],
    clientId: "electrical",
    order: 7,
    sector: "Construction",
    areas: ["Human Resources"],
    title: {
      pt: "Folha calculada com as regras de cada profissional e exceções para revisão",
      en: "Payroll calculated using each worker's rules, with exceptions flagged for review",
    },
    summary: {
      pt: "Os registros de jornada passaram a alimentar o cálculo semanal da folha. Regras individuais de pagamento são aplicadas no fluxo, com identificação de inconsistências para conferência.",
      en: "Time records now feed weekly payroll calculations. The workflow applies individual pay rules and identifies data inconsistencies for review.",
    },
    bottleneck: {
      pt: "A equipe registrava a jornada em um sistema de campo, mas a folha ainda exigia cálculo manual. Diárias, horas extras, intervalos e tratamento dos deslocamentos variavam conforme as regras documentadas de cada profissional.",
      en: "The crew tracked time in a field-service system, but payroll still required manual calculations. Day rates, overtime, breaks, and travel treatment varied according to each worker's documented arrangements.",
    },
    implemented: {
      pt: "A Veehtor construiu um fluxo que lê os registros, aplica essas regras e identifica inconsistências nos dados. As horas ficam separadas entre serviço, deslocamento e compra de material, permitindo revisar o cálculo e entender a composição do tempo pago.",
      en: "Veehtor built a workflow that reads time records, applies those rules, and identifies inconsistencies. Hours are separated into job time, travel, and supply runs, allowing the team to review calculations and understand how paid time is distributed.",
    },
    changed: {
      pt: "A equipe passou a conferir os cálculos preparados pelo sistema. A mesma organização dos dados também sustentou o trabalho de produtividade em campo descrito em outro módulo desta operação.",
      en: "The team now checks calculations prepared by the system. The same time data also supported the field-productivity work described in another module for this business.",
    },
    highlights: [
      {
        pt: "Regras individuais aplicadas ao cálculo.",
        en: "Individual rules applied to payroll calculations.",
      },
      {
        pt: "Inconsistências identificadas para revisão.",
        en: "Data inconsistencies flagged for review.",
      },
    ],
    cta: {
      pt: "Sua folha ainda depende de recalcular regras toda semana? Converse com a Veehtor sobre esse fechamento.",
      en: "Does payroll still require recalculating pay rules every week? Talk to Veehtor about the workflow.",
    },
    seoDescription: {
      pt: "Uma empresa de serviços elétricos nos EUA passou a calcular a folha a partir dos registros de jornada, aplicando as regras de cada profissional e identificando inconsistências para revisão.",
      en: "A US electrical contractor now calculates payroll from time records, applying each worker's rules and flagging inconsistencies for review.",
    },
  },
  {
    id: "brewery-checklists",
    slug: "multi-location-brewery-checklists",
    legacySlugs: ["complo-ai-checklists"],
    clientId: "brewery",
    order: 8,
    sector: "Food & Beverage",
    areas: ["Operations"],
    title: {
      pt: "Abertura e fechamento com registros e alertas para os gerentes",
      en: "Opening and closing checks with records and manager alerts",
    },
    summary: {
      pt: "Checklists digitais reúnem as verificações de cada unidade. Nos itens com foto, uma avaliação por IA ajuda a sinalizar o que precisa de atenção do responsável.",
      en: "Digital checklists bring each location's checks into one workflow. For items with photo evidence, AI provides an initial assessment to help flag issues for the responsible manager.",
    },
    bottleneck: {
      pt: "Abrir e fechar uma unidade exige repetir verificações de abastecimento, limpeza e condições operacionais. A gestão precisava acompanhar a execução e identificar os pontos que mereciam conferência.",
      en: "Opening and closing each location requires repeated checks on supplies, cleanliness, and operating conditions. Management needed a way to follow execution and identify items that required attention.",
    },
    implemented: {
      pt: "A Veehtor colocou checklists no aplicativo da operação. Nos itens definidos para registro fotográfico, a equipe envia uma imagem, a IA faz uma avaliação inicial e o fluxo alerta o gerente quando identifica uma possível pendência. Os registros ficam disponíveis para consulta.",
      en: "Veehtor added checklists to the operation's application. For designated photo-based items, staff submit an image, AI provides an initial assessment, and the workflow alerts the manager to a potential issue. Records remain available for review.",
    },
    changed: {
      pt: "A operação passou a contar com um fluxo de registro e encaminhamento de exceções. O responsável pela unidade recebe os alertas, confirma os problemas e conduz a ação corretiva.",
      en: "The operation gained a workflow for recording checks and routing exceptions. The location manager receives alerts, confirms issues, and carries out corrective action.",
    },
    highlights: [
      { pt: "Verificações registradas por unidade.", en: "Checks recorded by location." },
      {
        pt: "Evidências e alertas para o responsável.",
        en: "Evidence and alerts routed to the responsible manager.",
      },
    ],
    cta: {
      pt: "Como você acompanha a execução das rotinas em cada unidade? Converse com a Veehtor sobre esse processo.",
      en: "How do you track routine execution across locations? Talk to Veehtor about that process.",
    },
    seoDescription: {
      pt: "Uma cervejaria com vários pontos de venda passou a registrar abertura e fechamento em checklists digitais, com avaliação por IA nos itens com foto e alertas para o gerente da unidade.",
      en: "A multi-location brewery records opening and closing checks in digital checklists, with AI assessment on photo items and alerts routed to the location manager.",
    },
  },
  {
    id: "brewery-dashboard",
    slug: "multi-location-brewery-management-dashboard",
    legacySlugs: ["complo-ai-dashboard"],
    clientId: "brewery",
    order: 9,
    sector: "Food & Beverage",
    areas: ["Finance", "Operations"],
    title: {
      pt: "Vendas e custos reunidos para acompanhar cada unidade",
      en: "Sales and costs brought together for location-level management",
    },
    summary: {
      pt: "Dados dos sistemas integrados passaram a compor uma visão por unidade e da rede. A IA apoia a leitura dos indicadores para orientar a conferência de custos e o planejamento operacional.",
      en: "Data from integrated systems now supports both location-level and network-wide views. AI helps interpret indicators for cost review and operational planning.",
    },
    bottleneck: {
      pt: "Vendas, pedidos e custos estavam distribuídos entre sistemas e planilhas. Para entender uma variação no desempenho, a gestão precisava reunir essas informações manualmente.",
      en: "Sales, orders, and costs were spread across systems and spreadsheets. Understanding a change in performance required management to bring those records together manually.",
    },
    implemented: {
      pt: "A Veehtor construiu um painel que consolida os dados integrados. Os gerentes acompanham suas unidades, enquanto os sócios acessam a visão conjunta. A IA ajuda a interpretar os indicadores e a sinalizar relações que merecem análise, como a distribuição das vendas ao longo da semana e o custo de profissionais por turno.",
      en: "Veehtor built a dashboard that consolidates the integrated data. Managers follow their own locations, while owners see the combined view. AI helps interpret indicators and flag relationships worth examining, such as sales by day of the week and staffing costs.",
    },
    changed: {
      pt: "A gestão passou a ter uma visão consolidada para apoiar decisões da rotina. Gerentes e sócios conseguem consultar os dados conforme sua responsabilidade e usar essa informação na análise de vendas, custos e escalas.",
      en: "Management gained a consolidated view to support operating decisions. Managers and owners can access the data relevant to their responsibilities and use it to review sales, costs, and staffing.",
    },
    highlights: [
      { pt: "Visão por unidade e consolidada.", en: "Location-level and network-wide views." },
      {
        pt: "Indicadores reunidos para apoiar decisões.",
        en: "Consolidated indicators to support decisions.",
      },
    ],
    cta: {
      pt: "Você consegue comparar vendas e custos entre unidades sem consolidar tudo manualmente? Converse com a Veehtor.",
      en: "Can you compare sales and costs across locations without combining records by hand? Talk to Veehtor.",
    },
    seoDescription: {
      pt: "Uma cervejaria com vários pontos de venda reuniu vendas, pedidos e custos em um painel com visão por unidade e da rede, com apoio de IA na leitura dos indicadores.",
      en: "A multi-location brewery brought sales, orders, and costs into one dashboard with location-level and network-wide views, with AI support for reading indicators.",
    },
  },
  {
    id: "brewery-reviews",
    slug: "multi-location-brewery-customer-reviews",
    legacySlugs: ["complo-customer-voice"],
    clientId: "brewery",
    order: 10,
    sector: "Food & Beverage",
    areas: ["Customer Relations"],
    title: {
      pt: "Avaliações de clientes organizadas em uma fila de atenção para os gerentes",
      en: "Customer reviews organized into a manager action queue",
    },
    summary: {
      pt: "A coleta periódica reúne avaliações do Google no painel da operação, destaca comentários que precisam de atenção e permite responder pelo mesmo ambiente.",
      en: "Scheduled collection brings Google reviews into the operating dashboard, highlights comments that need attention, and lets managers respond in the same workspace.",
    },
    bottleneck: {
      pt: "Ler avaliações uma a uma dificultava acompanhar as pendências e perceber quais temas voltavam a aparecer. A gestão precisava transformar comentários dispersos em uma rotina de acompanhamento.",
      en: "Reading reviews individually made it difficult to track unanswered comments and notice recurring themes. Management needed to turn scattered feedback into a regular review process.",
    },
    implemented: {
      pt: "A Veehtor integrou as avaliações ao painel usado pelos gerentes. O fluxo coleta os comentários semanalmente, organiza por nota e destaca reclamações e avaliações sem resposta. O gerente pode responder no próprio ambiente.",
      en: "Veehtor integrated reviews into the dashboard used by managers. The workflow collects comments weekly, organizes them by rating, and highlights complaints and unanswered reviews. Managers can respond from the same workspace.",
    },
    changed: {
      pt: "A entrega organiza a revisão dos comentários e o acompanhamento dos temas recorrentes. Com esse histórico, a equipe pode observar a evolução das reclamações após suas ações e definir o que precisa de atenção em cada unidade.",
      en: "The implementation organizes comment review and makes recurring themes easier to follow. The history allows the team to monitor complaints after taking action and identify what needs attention at each location.",
    },
    highlights: [
      {
        pt: "Avaliações reunidas no painel da operação.",
        en: "Reviews brought into the operating dashboard.",
      },
      {
        pt: "Reclamações e respostas pendentes priorizadas.",
        en: "Complaints and unanswered comments prioritized.",
      },
    ],
    cta: {
      pt: "O que seus clientes dizem está virando ação na operação? Converse com a Veehtor sobre essa rotina.",
      en: "Is customer feedback turning into action in your operation? Talk to Veehtor about the workflow.",
    },
    seoDescription: {
      pt: "Uma cervejaria com vários pontos de venda passou a reunir as avaliações do Google no painel da operação, priorizando reclamações e respostas pendentes para os gerentes.",
      en: "A multi-location brewery brings Google reviews into its operating dashboard, prioritizing complaints and unanswered comments for managers.",
    },
  },
];

/** Editorial order, identical in both languages. */
export const sortedCases = (list: CaseStudy[] = CASE_STUDIES): CaseStudy[] =>
  [...list].sort((a, b) => a.order - b.order);

/** The first three cases get visual priority in the catalog, without duplication. */
export const FEATURED_COUNT = 3;

export const featuredCases = (): CaseStudy[] => sortedCases().slice(0, FEATURED_COUNT);

export const getClientName = (c: CaseStudy): LS => CLIENTS[c.clientId];

export const bySlug = (slug?: string): CaseStudy | undefined =>
  slug ? CASE_STUDIES.find((c) => c.slug === slug) : undefined;

export const byLegacySlug = (slug?: string): CaseStudy | undefined =>
  slug ? CASE_STUDIES.find((c) => c.legacySlugs.includes(slug)) : undefined;

export const byId = (id: string): CaseStudy | undefined =>
  CASE_STUDIES.find((c) => c.id === id);

/** Other implementations for the same organization, in editorial order. */
export const siblingCases = (c: CaseStudy): CaseStudy[] =>
  sortedCases().filter((o) => o.clientId === c.clientId && o.id !== c.id);

/** Localized labels for proof badges. Rendered only for documented metrics. */
export const PROOF_LABELS: Record<ProofClass, LS> = {
  measured: { en: "Measured result", pt: "Resultado medido" },
  operational: { en: "Operational result", pt: "Resultado operacional" },
  system: { en: "System in operation", pt: "Sistema em operação" },
  estimated: { en: "Estimated impact", pt: "Impacto estimado" },
  scale: { en: "Scale", pt: "Escala" },
};

export const ALL_SLUGS = CASE_STUDIES.map((c) => c.slug);
