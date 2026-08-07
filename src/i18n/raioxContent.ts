/**
 * Operations X-Ray (Raio-X da Operação) dictionaries.
 * Ported verbatim from the validated standalone prototype.
 * `br` = Portuguese / BRL market, `us` = English / USD market.
 * Market is derived from the site LanguageContext (pt -> br, en -> us).
 */

export type MarketKey = "br" | "us";

export const WA_NUM = "5511973022058";
export const LEAD_MAILTO = "vitor@veehtor.com";
export const HORAS_MES = 160;
export const SEMANAS_ANO = 48;
export const RETRABALHO_ADM = 1.2;
export const TAXA_CONSOLIDACAO = 0.8;
export const MARGEM_REF = 0.1;
export const RECUP_MIN = 0.2;
export const RECUP_MAX = 0.3;
export const TAXAS: Record<string, number> = { adm: 0.7, ops: 0.6 };

export type Opt = [string, string, number | null];
export type AreaKey = "adm" | "ops" | "com" | "fin";

const fmtBR = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmtHBR = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const fmtUS = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtHUS = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const MKT = {
  br: {
    lang: "pt-BR",
    docTitle: "Veehtor AI · Raio-X da Operação",
    enc: 1.6,
    fmt: fmtBR,
    fmtH: fmtHBR,
    compact: (v: number) =>
      v >= 1e6
        ? "R$ " + (v / 1e6).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + " mi"
        : v >= 1000
        ? "R$ " + Math.round(v / 1000).toLocaleString("pt-BR") + " mil"
        : fmtBR.format(Math.round(v)),
    porteSal: { a20: 2800, "21a50": 3200, "51a200": 3800, m200: 4500 } as Record<string, number>,
    salDef: 3200,
    fat: {
      a20: { mid: 2.5e6, txt: "até R$ 5 mi" },
      "21a50": { mid: 9e6, txt: "R$ 5 a 15 mi" },
      "51a200": { mid: 30e6, txt: "R$ 15 a 60 mi" },
      m200: { mid: 100e6, txt: "acima de R$ 60 mi" },
    } as Record<string, { mid: number; txt: string }>,
    porteLabel: { a20: "Até 20", "21a50": "21 a 50", "51a200": "51 a 200", m200: "Mais de 200" } as Record<string, string>,
    sal: { ate3k: 2200, "3a5k": 4000, "5a8k": 6500, "8a12k": 10000, m12k: 14000, nao: null } as Record<string, number | null>,
    salOpt: [
      ["ate3k", "Até R$ 3 mil", null],
      ["3a5k", "R$ 3 a 5 mil", null],
      ["5a8k", "R$ 5 a 8 mil", null],
      ["8a12k", "R$ 8 a 12 mil", null],
      ["m12k", "Acima de R$ 12 mil", null],
      ["nao", "Não sei", null],
    ] as Opt[],
    leadsOpt: [
      ["l5", "Menos de 5", 3],
      ["l15", "5 a 15", 10],
      ["l40", "15 a 40", 25],
      ["l100", "40 a 100", 60],
      ["l100p", "Mais de 100", 100],
    ] as Opt[],
    ticketOpt: [
      ["t500", "Até R$ 500", 350],
      ["t2k", "R$ 500 a 2 mil", 1250],
      ["t10k", "R$ 2 a 10 mil", 6000],
      ["t50k", "R$ 10 a 50 mil", 30000],
      ["t50kp", "Acima de 50 mil", 50000],
    ] as Opt[],
    demoraOpt: [
      ["hora", "Tenho na hora", 0],
      ["horas", "Algumas horas", 1],
      ["dia", "Um dia ou mais", 2],
      ["nsei", "Não sei dizer", -1],
    ] as Opt[],
    precisaOpt: [
      ["diario", "Diariamente", 250],
      ["semanal", "Semanalmente", 48],
      ["mensal", "No fechamento do mês", 12],
      ["decisao", "Quando surge uma decisão", null],
    ] as Opt[],
    consolOpt: [
      ["c1", "Menos de 1h", 0.5],
      ["c3", "1 a 3h", 2],
      ["c6", "3 a 6h", 4.5],
      ["c6p", "Mais de 6h", 8],
    ] as Opt[],
    atrasoOpt: [
      ["ok", "Está sempre atualizado", 0],
      ["d2", "1 a 2 dias", 1.5],
      ["d7", "Uma semana ou mais", 7],
      ["nsei", "Nem sei dizer, uso o que tem", -1],
    ] as Opt[],
    usoOpt: [
      ["diario", "Diariamente", 250],
      ["semanal", "Semanalmente", 48],
      ["mensal", "Mensalmente", 12],
    ] as Opt[],
    hscale: [
      [5, 9, "menos de 10h por semana"],
      [10, 19, "de 10 a 19h por semana"],
      [20, 29, "de 20 a 29h por semana"],
      [30, 44, "de 30 a 44h por semana"],
      [45, 60, "o tempo de uma pessoa inteira, ou mais"],
    ] as [number, number, string][],
    areaName: { adm: "Administrativo", ops: "Operação", com: "Comercial", fin: "Financeiro" } as Record<AreaKey, string>,
    areaSub: {
      adm: "Papelada, digitação, tarefas repetitivas",
      ops: "Equipe, agenda, logística, execução",
      com: "Leads, propostas, follow-up",
      fin: "Caixa, relatórios, números espalhados",
    } as Record<AreaKey, string>,
    sint: {
      adm: [
        "A equipe copia informações entre sistemas",
        "O mesmo relatório é feito manualmente toda semana",
        "Erros de cadastro geram retrabalho",
      ],
      ops: [
        "Muito tempo gasto organizando agenda e equipe",
        "Atualizações ficam espalhadas em ligações e WhatsApp",
        "Mudanças no dia exigem reorganizar tudo manualmente",
      ],
      com: [
        "Leads esperam demais por uma resposta",
        "Propostas demoram e o cliente esfria",
        "Follow-ups dependem de alguém lembrar",
      ],
      fin: [
        "Não consigo ver caixa e margem rapidamente",
        "Os números estão espalhados em vários lugares",
        "Quando o relatório chega, o número já está velho",
      ],
    } as Record<AreaKey, string[]>,
    prob: {
      adm: {
        g: "Horas da equipe estão indo para tarefa repetitiva.",
        s: [
          "Gente qualificada copiando dado de um sistema para outro.",
          "O mesmo relatório, refeito na mão, toda semana.",
          "Erro de cadastro virando retrabalho e correção.",
        ],
      },
      ops: {
        g: "A operação depende de coordenação manual.",
        s: [
          "Horas indo para montar agenda e distribuir a equipe.",
          "O status da operação mora em ligação e WhatsApp.",
          "Qualquer mudança no dia derruba o planejamento.",
        ],
      },
      com: {
        g: "Oportunidades estão esfriando dentro do funil.",
        s: [
          "Leads estão esfriando antes da resposta.",
          "Propostas demoram e o cliente esfria.",
          "Follow-up esquecido é venda que morre em silêncio.",
        ],
      },
      fin: {
        g: "Os números não chegam na hora da decisão.",
        s: [
          "Caixa e margem não aparecem quando você precisa.",
          "Cada número mora em um sistema diferente.",
          "O relatório chega depois da decisão.",
        ],
      },
    } as Record<AreaKey, { g: string; s: string[] }>,
    changes: {
      adm: [
        "Informação passando entre sistemas sem digitação",
        "Erros barrados antes de virar retrabalho",
        "Horas da equipe de volta para o que gera valor",
      ],
      ops: [
        "Agenda e distribuição do dia prontas de manhã",
        "Mudanças reorganizadas na hora, sem telefonema",
        "A operação inteira visível em uma tela",
      ],
      com: ["Responder novos leads imediatamente", "Não esquecer nenhum follow-up", "Tirar propostas da fila mais rápido"],
      fin: [
        "Caixa e margem atualizados todo dia",
        "Aviso automático quando algo sai da curva",
        "Fechamento sem planilha na mão",
      ],
    } as Record<AreaKey, string[]>,
    bench: {
      adm: "Empresas que automatizam entrada de dados cortam 50 a 90% do esforço manual (Forrester, Deloitte).",
      ops: "Operações com visão em tempo real gastam 15 a 25% menos em campo (McKinsey).",
      com: "Responder em 5 minutos multiplica por 21 a chance do lead virar conversa (InsideSales, HBR).",
      fin: "Automatizar a rotina financeira corta 60 a 80% do custo por documento (Ardent Partners).",
    } as Record<AreaKey, string>,
    objLabel: {
      tempo: "Ganhar tempo da equipe",
      erros: "Reduzir erros e retrabalho",
      escala: "Crescer sem aumentar a equipe",
      visib: "Tomar decisões com números melhores",
    } as Record<string, string>,
    idleDesc: {
      adm: "Horas da equipe presas em digitação e retrabalho",
      ops: "Agenda, equipe e execução organizadas na mão",
      com: "Leads e propostas esfriando na fila",
      fin: "Decisões esperando números que demoram",
    } as Record<AreaKey, string>,
    t: {
      eyebrow: "Raio-X da Operação",
      h1: "Onde sua empresa está perdendo dinheiro?",
      sub: "Responda algumas perguntas e veja quais processos estão consumindo tempo, margem ou receita. E qual vale atacar primeiro.",
      q1: "Quantas pessoas trabalham na empresa?",
      q2: "Onde sua empresa mais perde tempo ou dinheiro hoje?",
      q3: "Qual dessas situações mais parece com sua empresa?",
      q3Locked: "Escolha a área acima primeiro.",
      q4Def: "Qual o tamanho do problema?",
      q4Locked: "Responda as perguntas acima primeiro.",
      q4LockedFin: "Escolha a situação acima primeiro.",
      q5Def: "Contexto do impacto",
      q6: "O que mais importa para você?",
      reset: "↺ limpar respostas",
      noteb: "Talvez ainda seja cedo para trabalhar conosco.",
      notes:
        "Nossos projetos costumam gerar mais retorno em empresas com mais de 20 pessoas, onde processos manuais começam a consumir tempo, margem e capacidade de crescimento.",
      notei: "Você ainda pode explorar o Raio-X.",
      idleLabel: "Por onde o dinheiro costuma vazar",
      idleHint: "Responda ao lado para ver onde está o seu vazamento.",
      leak: "Seu maior vazamento",
      change: "O que pode mudar",
      next: "Próximo passo",
      nextP: "Validamos esse número com você e mostramos o primeiro processo que atacaríamos.",
      ctaTitle: "Quanto desse resultado dá para capturar?",
      ctaTitleA20: "Guarde esse número no radar.",
      q4Eff: "Somando toda a equipe, quantas horas por semana isso consome?",
      q4Com: "Quantos leads por mês acabam esperando demais ou ficando sem retorno?",
      q4Dem: "Quando você precisa desse número para decidir, quanto tempo leva para consegui-lo?",
      q4Cons: "Quantas horas por semana alguém gasta juntando esses números?",
      q4Rel: "Quando o relatório chega, quantos dias de atraso ele costuma ter?",
      q5Sal: "Quanto custa aproximadamente essa função para a empresa?",
      q5SalSub:
        "Salário base aproximado da função, não de uma pessoa específica. A conta soma 60% de encargos.",
      q5Ticket: "Quanto vale, em média, um cliente fechado?",
      q5Freq: "Com que frequência você precisa desse número?",
      q5Uso: "Com que frequência você usa esse relatório para decidir?",
      drag: "arraste para responder",
      h5: "5h",
      h60: "60h / semana",
      perYear: "/ ano",
      perMonth: "/ mês",
      decYr: "decisões / ano",
      metaSize: (pl: string, ft: string) => pl + " pessoas · fat. típico " + ft + "/ano",
      refPorte: ", usando custo de referência do porte",
      moEff: (v: string) => "cerca de " + v + " por mês em custo de trabalho manual que a automação devolve",
      cavEff: (v: string) =>
        "Com margem líquida de 10%, recuperar esse custo vale o mesmo que vender cerca de <b>" + v + " a mais por ano</b>.",
      calcEff: (sal: string, ch: string, h: number, pct: number, ha: number, rew: boolean) =>
        "De onde veio: " +
        sal +
        " × 1,6 encargos ÷ 160h = " +
        ch +
        "/h · " +
        h +
        "h/sem × " +
        pct +
        "% automatizável × 48 semanas" +
        (rew ? " · + 20% de retrabalho evitado" : ""),
      moCons: (v: string) => "cerca de " + v + " por mês só no trabalho de juntar números",
      cavCons:
        "E a conta não captura o principal: <b>o número pronto na hora da decisão</b>, não uma semana depois.",
      calcCons: (sal: string, ch: string, h: number) =>
        "De onde veio: " + sal + " × 1,6 encargos ÷ 160h = " + ch + "/h · " + h + "h/sem × 80% automatizável × 48 semanas",
      moCom: (ano: string) => "em oportunidades que entram, mas não viram conversa a tempo. No ano, cerca de " + ano + ".",
      cavCom: (a: string, b: string) =>
        "<b>Não é perda garantida: é o que passa sem resposta.</b> Com resposta imediata e follow-up vivo, recuperar 2 a 3 de cada 10 é realista: <b>" +
        a +
        " a " +
        b +
        " por ano</b> de volta.",
      cavPct: (p: string) => " Esse volume equivale a cerca de " + p + " do faturamento típico do seu porte.",
      cavHigh: " Número alto assim é a primeira coisa que conferimos na conversa.",
      calcCom: (l: string, n: number, tk: string, m: string) =>
        "De onde veio: " + l + " leads (" + n + ") × ticket médio " + tk + " = " + m + " por mês",
      pctLow: "menos de 1%",
      pctHigh: "mais de 100%",
      dQual: [
        "Você tem o número quando precisa. O gargalo está no aviso: hoje você só descobre que a margem caiu se for olhar.",
        "Algumas horas de espera não travam a operação, mas travam a decisão rápida: ou ela sai sem o número, ou espera o número chegar.",
        "Um dia ou mais entre precisar e ter significa que decisão urgente e número atualizado não se encontram.",
        "Quando ninguém sabe quanto tempo leva, a pergunta quase não é feita. Ninguém registra a decisão que deixou de ser tomada.",
      ],
      moDem: "momentos por ano em que você precisa do número e ele não está pronto.",
      calcDem: (f: string, d: string) => "De onde veio: " + f + " × demora de " + d,
      rQual: [
        "O relatório chega atualizado. O ganho está em parar de montá-lo na mão e em ser avisado quando algo sai da curva.",
        "Um ou dois dias de defasagem significam decidir sempre olhando para ontem. Em semana de caixa apertado, é a diferença entre corrigir e constatar.",
        "Uma semana de atraso significa que o relatório descreve uma empresa que já não existe.",
        "Usar o relatório sem saber de quando ele é significa decidir sem conhecer a margem de erro do próprio dado.",
      ],
      moRel: (per: string) => "tomadas com dado de " + per + " atrás.",
      calcRel: (f: string, a: string) => "De onde veio: " + f + " × atraso de " + a,
      d12: "1 a 2 dias",
      d7: "uma semana ou mais",
      mbEff: "Impacto estimado",
      mbRisk: "Receita em risco",
      mbNoNum: "Sem número na mão",
      mbStale: "Dado defasado",
      mbGo: "Ver resultado",
      mbYr: " / ano",
      mbMo: " / mês",
      mbDec: " decisões / ano",
      sumHi: "Olá! Fiz o Raio-X da Operação no site da Veehtor.",
      sumSize: "Equipe: ",
      sumSizeSuf: " pessoas",
      sumArea: "Área: ",
      sumSit: "Situação: ",
      sumPri: "Prioridade: ",
      sumBye: "Quero validar esse resultado.",
      sumEff: (v: string) => "Impacto estimado: " + v + " por ano em trabalho manual",
      sumCons: (v: string) => "Impacto estimado: " + v + " por ano juntando números manualmente",
      sumCom: (v: string) => "Receita em risco: cerca de " + v + " por mês",
      sumDem: (n: number) => "Situação: cerca de " + n + " decisões por ano sem número atualizado",
      sumRel: (n: number) => "Situação: cerca de " + n + " decisões por ano com relatório defasado",
      fuSub: "",
      fuAsk: "",
      fuText: "",
      fuMail: "",
      phFirst: "",
      phMobile: "",
      phEmail: "",
      fuSend: "",
      fuMicro: "Sua simulação já vai junto. Sem começar do zero.",
      fuDone: "",
      fuErr: "",
      waCta: "Validar meu resultado no WhatsApp →",
    },
  },
  us: {
    lang: "en-US",
    docTitle: "Veehtor AI · Operations X-Ray",
    enc: 1.3,
    fmt: fmtUS,
    fmtH: fmtHUS,
    compact: (v: number) =>
      v >= 1e6
        ? "$" + (v / 1e6).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "M"
        : v >= 1000
        ? "$" + Math.round(v / 1000).toLocaleString("en-US") + "k"
        : fmtUS.format(Math.round(v)),
    porteSal: { a20: 3800, "21a50": 4200, "51a200": 4800, m200: 5500 } as Record<string, number>,
    salDef: 4200,
    fat: {
      a20: { mid: 1.5e6, txt: "up to $3M" },
      "21a50": { mid: 7e6, txt: "$3M to $15M" },
      "51a200": { mid: 25e6, txt: "$15M to $50M" },
      m200: { mid: 80e6, txt: "over $50M" },
    } as Record<string, { mid: number; txt: string }>,
    porteLabel: { a20: "20 or fewer", "21a50": "21-50", "51a200": "51-200", m200: "200+" } as Record<string, string>,
    sal: { ate3k: 2500, "3a5k": 4000, "5a8k": 6500, "8a12k": 10000, m12k: 14000, nao: null } as Record<string, number | null>,
    salOpt: [
      ["ate3k", "Up to $3k", null],
      ["3a5k", "$3k to $5k", null],
      ["5a8k", "$5k to $8k", null],
      ["8a12k", "$8k to $12k", null],
      ["m12k", "Over $12k", null],
      ["nao", "Not sure", null],
    ] as Opt[],
    leadsOpt: [
      ["l5", "Fewer than 5", 3],
      ["l15", "5 to 15", 10],
      ["l40", "15 to 40", 25],
      ["l100", "40 to 100", 60],
      ["l100p", "100+", 100],
    ] as Opt[],
    ticketOpt: [
      ["t500", "Up to $500", 350],
      ["t2k", "$500 to $2k", 1250],
      ["t10k", "$2k to $10k", 6000],
      ["t50k", "$10k to $50k", 30000],
      ["t50kp", "Over $50k", 60000],
    ] as Opt[],
    demoraOpt: [
      ["hora", "I have it right away", 0],
      ["horas", "A few hours", 1],
      ["dia", "A day or more", 2],
      ["nsei", "Can't say", -1],
    ] as Opt[],
    precisaOpt: [
      ["diario", "Daily", 250],
      ["semanal", "Weekly", 48],
      ["mensal", "At month-end close", 12],
      ["decisao", "When a decision comes up", null],
    ] as Opt[],
    consolOpt: [
      ["c1", "Less than 1h", 0.5],
      ["c3", "1 to 3h", 2],
      ["c6", "3 to 6h", 4.5],
      ["c6p", "More than 6h", 8],
    ] as Opt[],
    atrasoOpt: [
      ["ok", "It's always up to date", 0],
      ["d2", "1-2 days", 1.5],
      ["d7", "A week or more", 7],
      ["nsei", "Can't say, I use what's there", -1],
    ] as Opt[],
    usoOpt: [
      ["diario", "Daily", 250],
      ["semanal", "Weekly", 48],
      ["mensal", "Monthly", 12],
    ] as Opt[],
    hscale: [
      [5, 9, "under 10h a week"],
      [10, 19, "10 to 19h a week"],
      [20, 29, "20 to 29h a week"],
      [30, 44, "30 to 44h a week"],
      [45, 60, "a full person's time, or more"],
    ] as [number, number, string][],
    areaName: { adm: "Administrative", ops: "Operations", com: "Sales", fin: "Finance" } as Record<AreaKey, string>,
    areaSub: {
      adm: "Paperwork, data entry, repetitive tasks",
      ops: "Team, scheduling, logistics, execution",
      com: "Leads, quotes, follow-up",
      fin: "Cash, reports, scattered numbers",
    } as Record<AreaKey, string>,
    sint: {
      adm: [
        "The team copies information between systems",
        "The same report is built by hand every week",
        "Data entry errors create rework",
      ],
      ops: [
        "Too much time spent organizing schedules and crews",
        "Updates live in phone calls and text threads",
        "Any change in the day means reorganizing everything by hand",
      ],
      com: [
        "Leads wait too long for a response",
        "Quotes take days and the customer goes cold",
        "Follow-ups depend on someone remembering",
      ],
      fin: [
        "I can't see cash and margin quickly",
        "The numbers live in different places",
        "By the time the report arrives, it's already old",
      ],
    } as Record<AreaKey, string[]>,
    prob: {
      adm: {
        g: "Team hours are going into repetitive work.",
        s: [
          "Skilled people copying data from one system to another.",
          "The same report, rebuilt by hand, every week.",
          "Entry errors turning into rework and corrections.",
        ],
      },
      ops: {
        g: "The operation runs on manual coordination.",
        s: [
          "Hours going into building schedules and dispatching the team.",
          "The status of the operation lives in calls and texts.",
          "One change in the day breaks the whole plan.",
        ],
      },
      com: {
        g: "Opportunities are going cold inside your funnel.",
        s: [
          "Leads are going cold before your team responds.",
          "Quotes take days and customers go cold.",
          "A forgotten follow-up is a sale that dies quietly.",
        ],
      },
      fin: {
        g: "The numbers don't show up when decisions are made.",
        s: [
          "Cash and margin aren't there when you need them.",
          "Every number lives in a different system.",
          "The report arrives after the decision.",
        ],
      },
    } as Record<AreaKey, { g: string; s: string[] }>,
    changes: {
      adm: [
        "Information moving between systems without typing",
        "Errors caught before they become rework",
        "Team hours back on work that generates value",
      ],
      ops: [
        "Schedules and assignments ready every morning",
        "Changes reorganized on the spot, no phone calls",
        "The whole operation visible on one screen",
      ],
      com: ["Respond to new leads immediately", "Never miss a follow-up", "Get quotes out of the queue faster"],
      fin: ["Cash and margin updated daily", "Automatic alerts when something drifts", "Closing without manual spreadsheets"],
    } as Record<AreaKey, string[]>,
    bench: {
      adm: "Companies that automate data entry cut manual effort by 50 to 90% (Forrester, Deloitte).",
      ops: "Operations with real-time visibility spend 15 to 25% less in the field (McKinsey).",
      com: "Responding within 5 minutes makes a lead 21x more likely to turn into a conversation (InsideSales, HBR).",
      fin: "Automating finance routines cuts cost per document by 60 to 80% (Ardent Partners).",
    } as Record<AreaKey, string>,
    objLabel: {
      tempo: "Free up my team's time",
      erros: "Cut errors and rework",
      escala: "Grow without adding headcount",
      visib: "Make decisions with better numbers",
    } as Record<string, string>,
    idleDesc: {
      adm: "Team hours stuck in data entry and rework",
      ops: "Scheduling, crews and execution managed by hand",
      com: "Leads and quotes going cold in the queue",
      fin: "Decisions waiting on numbers that take too long",
    } as Record<AreaKey, string>,
    t: {
      eyebrow: "Operations X-Ray",
      h1: "Where is your business leaking money?",
      sub: "Answer a few questions to see which processes may be costing you time, margin, or revenue. And which one is worth fixing first.",
      q1: "How many people work at the company?",
      q2: "Where does your business lose the most time or money today?",
      q3: "Which of these sounds most like your company?",
      q3Locked: "Choose the area above first.",
      q4Def: "How big is the problem?",
      q4Locked: "Answer the questions above first.",
      q4LockedFin: "Choose the situation above first.",
      q5Def: "Context of the impact",
      q6: "What matters most to you?",
      reset: "↺ clear answers",
      noteb: "It might be a bit early for us to work together.",
      notes:
        "Our projects tend to generate the strongest returns in companies with more than 20 people, where manual processes start to eat time, margin, and growth capacity.",
      notei: "You're still welcome to explore the X-Ray.",
      idleLabel: "Where money usually leaks",
      idleHint: "Answer on the left to see where your leak is.",
      leak: "Your biggest leak",
      change: "What could change",
      next: "Next step",
      nextP: "We validate this number with you and show the first process we'd go after.",
      ctaTitle: "How much of this can you actually capture?",
      ctaTitleA20: "Keep this number on your radar.",
      q4Eff: "Adding up the whole team, how many hours per week does this consume?",
      q4Com: "How many leads per month end up waiting too long or getting no reply?",
      q4Dem: "When you need this number to make a decision, how long does it take to get it?",
      q4Cons: "How many hours per week does someone spend pulling these numbers together?",
      q4Rel: "When the report arrives, how many days old is it usually?",
      q5Sal: "Roughly how much does this role cost the company?",
      q5SalSub: "Approximate base salary for the role, not a specific person. We add 30% for payroll costs.",
      q5Ticket: "On average, how much is a closed customer worth?",
      q5Freq: "How often do you need this number?",
      q5Uso: "How often do you use this report to decide?",
      drag: "drag to answer",
      h5: "5h",
      h60: "60h / week",
      perYear: "/ year",
      perMonth: "/ month",
      decYr: "decisions / yr",
      metaSize: (pl: string, ft: string) => pl + " people · typical revenue " + ft + "/yr",
      refPorte: ", using a size-based reference cost",
      moEff: (v: string) => "about " + v + " per month in manual-work cost that automation gives back",
      cavEff: (v: string) =>
        "At a 10% net margin, getting this cost back is worth about <b>" + v + " in additional sales per year</b>.",
      calcEff: (sal: string, ch: string, h: number, pct: number, ha: number, rew: boolean) =>
        "Where this comes from: " +
        sal +
        " × 1.3 payroll ÷ 160h = " +
        ch +
        "/h · " +
        h +
        "h/wk × " +
        pct +
        "% automatable × 48 weeks" +
        (rew ? " · + 20% avoided rework" : ""),
      moCons: (v: string) => "about " + v + " per month just pulling numbers together",
      cavCons:
        "And the math misses the main thing: <b>the number ready when the decision happens</b>, not a week later.",
      calcCons: (sal: string, ch: string, h: number) =>
        "Where this comes from: " + sal + " × 1.3 payroll ÷ 160h = " + ch + "/h · " + h + "h/wk × 80% automatable × 48 weeks",
      moCom: (ano: string) =>
        "in revenue at risk: opportunities that come in without a timely response. About " + ano + " per year.",
      cavCom: (a: string, b: string) =>
        "<b>This isn't guaranteed loss: it's what goes unanswered.</b> With immediate response and live follow-up, recovering 2 to 3 out of 10 is realistic: <b>" +
        a +
        " to " +
        b +
        " per year</b> back.",
      cavPct: (p: string) => " That's about " + p + " of typical revenue for your size.",
      cavHigh: " A number this high is the first thing we check in a conversation.",
      calcCom: (l: string, n: number, tk: string, m: string) =>
        "Where this comes from: " + l + " leads (" + n + ") × average ticket " + tk + " = " + m + " per month",
      pctLow: "less than 1%",
      pctHigh: "more than 100%",
      dQual: [
        "You have the number when you need it. The gap is in the alert: today you only find out margin dropped if you go look.",
        "A few hours of waiting don't stall the operation, but they stall fast decisions: either they go out without the number, or they wait for it.",
        "A day or more between needing and having means urgent decisions and fresh numbers never meet.",
        "When nobody knows how long it takes, the question mostly stops being asked. Nobody logs the decision that never got made.",
      ],
      moDem: "times a year you need the number and it isn't ready.",
      calcDem: (f: string, d: string) => "Where this comes from: " + f + " × a delay of " + d,
      rQual: [
        "The report arrives up to date. The gain is in no longer building it by hand, and being alerted when something drifts.",
        "One or two days of lag means always deciding by looking at yesterday. In a tight-cash week, that is the difference between correcting and finding out.",
        "A week of delay means the report describes a company that no longer exists.",
        "Using the report without knowing how old it is means deciding without knowing your data's margin of error.",
      ],
      moRel: (per: string) => "made with data from " + per + " ago.",
      calcRel: (f: string, a: string) => "Where this comes from: " + f + " × a lag of " + a,
      d12: "1-2 days",
      d7: "a week or more",
      mbEff: "Estimated impact",
      mbRisk: "Revenue at risk",
      mbNoNum: "No number in hand",
      mbStale: "Stale data",
      mbGo: "See result",
      mbYr: " / yr",
      mbMo: " / mo",
      mbDec: " decisions / yr",
      sumHi: "New Operations X-Ray lead (veehtor.com)",
      sumSize: "Team size: ",
      sumSizeSuf: " people",
      sumArea: "Area: ",
      sumSit: "Situation: ",
      sumPri: "Priority: ",
      sumBye: "",
      sumEff: (v: string) => "Estimated impact: " + v + " per year in manual work",
      sumCons: (v: string) => "Estimated impact: " + v + " per year pulling numbers together by hand",
      sumCom: (v: string) => "Revenue at risk: about " + v + " per month",
      sumDem: (n: number) => "Situation: about " + n + " decisions a year without an up-to-date number",
      sumRel: (n: number) => "Situation: about " + n + " decisions a year made on a stale report",
      fuSub: "Get your result reviewed by our team.",
      fuAsk: "How should we follow up?",
      fuText: "Text me",
      fuMail: "Email me",
      phFirst: "First name",
      phMobile: "Mobile number",
      phEmail: "Work email",
      fuSend: "Send my X-Ray →",
      fuMicro: "Your simulation goes with it. No need to start over.",
      fuDone: "Got it. Your X-Ray is on its way to our team, and we'll reach out shortly.",
      fuErr: "Please fill in your name and a valid contact.",
      waCta: "",
    },
  },
};

export type Market = typeof MKT.br;
