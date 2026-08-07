// Public marketing site strings (nav CTA source labels, footer, MapDialog,
// CaseStudies UI chrome, NotFound, Privacy, Terms). Consumers use the
// `useSiteContent()` hook.

import { useLanguage } from "@/i18n/LanguageContext";

export interface ImpactOption {
  /** Stable, language-neutral key sent to the backend. */
  value: string;
  /** Localized label rendered in the UI. */
  label: string;
}

export interface SiteContentBundle {
  footer: {
    tag: string;
    copy: string;
    linkCases: string;
    linkAbout: string;
    linkLinkedIn: string;
    linkPrivacy: string;
    linkTerms: string;
  };
  langSwitcher: {
    toEnglish: string;
    toPortuguese: string;
  };
  mapDialog: {
    title: string;
    subtitle: string;
    close: string;
    liveInvalid: string;
    liveSending: string;
    liveReceived: string;
    processLabel: string;
    processPlaceholder: string;
    errProcess: string;
    impactLegend: string;
    errImpact: string;
    impacts: ImpactOption[];
    yourInfo: string;
    namePlaceholder: string;
    errName: string;
    companyPlaceholder: string;
    errCompany: string;
    emailPlaceholder: string;
    errEmail: string;
    phonePlaceholder: string;
    consent: string;
    consentLink: string;
    submit: string;
    submitting: string;
    submitMicro: string;
    errNetwork: string;
    successTitle: string;
    successBody: string;
    successCta: string;
  };
  caseStudiesUI: {
    metaTitle: string;
    metaDescription: string;
    skip: string;
    eyebrow: string;
    h1a: string;
    h1b: string;
    lede: string;
    filterSector: string;
    filterArea: string;
    allSectors: string;
    allAreas: string;
    counter: (shown: number, total: number) => string;
    empty: string;
    cardCta: string;
    closingEyebrow: string;
    closingH2a: string;
    closingH2b: string;
    closingBody: string;
    closingCta: string;
  };
  caseDetailUI: {
    breadcrumbRoot: string;
    breadcrumbAria: string;
    notFoundTitle: string;
    notFoundMetaTitle: string;
    backToList: string;
    contextEyebrow: string;
    contextH2: string;
    solutionEyebrow: string;
    solutionH2: string;
    resultEyebrow: string;
    resultH2: string;
    scaleEyebrow: string;
    scaleH2: string;
    scaleSector: string;
    scaleSize: string;
    scaleScale: string;
    scaleAreas: string;
    honestyLabel: string;
    nextCase: string;
    closingEyebrow: string;
    closingH2a: string;
    closingH2b: string;
    closingBody: string;
    closingCta: string;
  };
  notFound: {
    metaTitle: string;
    heading: string;
    body: string;
    back: string;
  };
  legalCommon: {
    backHome: string;
    lastUpdated: string;
    contactBlockTitle: string;
    address: string;
  };
  privacy: {
    metaTitle: string;
    title: string;
    disclaimer: string;
    intro: string[];
    sections: { title: string; blocks: (string | { subtitle?: string; text?: string; list?: string[] })[] }[];
  };
  terms: {
    metaTitle: string;
    title: string;
    disclaimer: string;
    intro: string[];
    sections: { title: string; blocks: (string | { subtitle?: string; text?: string; list?: string[] })[] }[];
  };
}

const IMPACTS_PT: ImpactOption[] = [
  { value: "revenue_loss", label: "Perda de receita" },
  { value: "cost_rework", label: "Custo ou retrabalho" },
  { value: "team_time", label: "Tempo do time" },
  { value: "customer_delay", label: "Atraso para o cliente" },
  { value: "risk_error", label: "Risco ou erro" },
  { value: "unknown", label: "Ainda não sei medir" },
];

const IMPACTS_EN: ImpactOption[] = [
  { value: "revenue_loss", label: "Lost revenue" },
  { value: "cost_rework", label: "Cost or rework" },
  { value: "team_time", label: "Team time" },
  { value: "customer_delay", label: "Customer delay" },
  { value: "risk_error", label: "Risk or error" },
  { value: "unknown", label: "Not sure yet" },
];

const pt: SiteContentBundle = {
  footer: {
    tag: "Sistemas aplicados à operação.",
    copy: "© 2026 Veehtor AI LLC",
    linkCases: "Cases",
    linkAbout: "Sobre",
    linkLinkedIn: "LinkedIn",
    linkPrivacy: "Privacidade",
    linkTerms: "Termos",
  },
  langSwitcher: {
    toEnglish: "Switch to English",
    toPortuguese: "Mudar para português",
  },
  mapDialog: {
    title: "Mapear meu processo",
    subtitle: "Conte onde a operação trava. A conversa já começa com contexto.",
    close: "Fechar",
    liveInvalid: "Revise os campos destacados antes de enviar.",
    liveSending: "Enviando suas respostas.",
    liveReceived: "Recebido. Agora escolha um horário de 30 minutos.",
    processLabel: "Qual processo está incomodando?",
    processPlaceholder: "Ex.: propostas levam cinco dias para sair e dependem de três planilhas.",
    errProcess: "Descreva o processo para começarmos.",
    impactLegend: "Qual impacto ele causa hoje?",
    errImpact: "Selecione ao menos um impacto.",
    impacts: IMPACTS_PT,
    yourInfo: "Seus dados",
    namePlaceholder: "Nome",
    errName: "Informe seu nome.",
    companyPlaceholder: "Empresa",
    errCompany: "Informe a empresa.",
    emailPlaceholder: "E-mail",
    errEmail: "Informe um e-mail válido.",
    phonePlaceholder: "WhatsApp/telefone (opcional)",
    consent: "Seus dados serão usados apenas para avaliar este processo e entrar em contato.",
    consentLink: "Política de privacidade",
    submit: "Analisar meu processo",
    submitting: "Enviando...",
    submitMicro: "Sem apresentação genérica.",
    errNetwork: "Não foi possível enviar. Seus dados foram preservados, tente novamente.",
    successTitle: "Recebido.",
    successBody: "Agora escolha um horário de 30 minutos.",
    successCta: "Escolher horário",
  },
  caseStudiesUI: {
    metaTitle: "Cases entregues | Veehtor AI",
    metaDescription:
      "Sistemas em operação com resultados que aparecem no processo. Casos de crédito, folha, checklists por IA e prospecção.",
    skip: "Ir para o conteúdo",
    eyebrow: "SISTEMAS ENTREGUES",
    h1a: "Sistemas em operação.",
    h1b: "Resultados que aparecem no processo.",
    lede: "Cada case informa o que foi resolvido, o que foi medido e a escala em que o sistema opera.",
    filterSector: "SETOR DE INDÚSTRIA",
    filterArea: "ÁREA DA EMPRESA",
    allSectors: "Todos",
    allAreas: "Todas",
    counter: (n, total) => `${n} de ${total} cases`,
    empty: "Nenhum case com essa combinação de setor e área.",
    cardCta: "Ver sistema e resultados",
    closingEyebrow: "Próximo passo",
    closingH2a: "Qual processo da sua operação",
    closingH2b: "custa mais do que deveria?",
    closingBody: "30 minutos. Direto no processo. Sem apresentação genérica.",
    closingCta: "Analisar meu processo →",
  },
  caseDetailUI: {
    breadcrumbRoot: "Cases",
    breadcrumbAria: "Trilha de navegação",
    notFoundTitle: "Case não encontrado",
    notFoundMetaTitle: "Case não encontrado | Veehtor AI",
    backToList: "Voltar para cases entregues",
    contextEyebrow: "Contexto e gargalo",
    contextH2: "O que estava travando",
    solutionEyebrow: "O que construímos",
    solutionH2: "O sistema",
    resultEyebrow: "O que mudou",
    resultH2: "Antes e depois",
    scaleEyebrow: "Escala e operação",
    scaleH2: "Onde o sistema roda",
    scaleSector: "Setor",
    scaleSize: "Porte",
    scaleScale: "Escala",
    scaleAreas: "Áreas",
    honestyLabel: "Nota de honestidade",
    nextCase: "Próximo case",
    closingEyebrow: "Próximo passo",
    closingH2a: "Qual processo da sua operação",
    closingH2b: "custa mais do que deveria?",
    closingBody: "30 minutos. Direto no processo. Sem apresentação genérica.",
    closingCta: "Analisar meu processo →",
  },
  notFound: {
    metaTitle: "Página não encontrada | Veehtor AI",
    heading: "404",
    body: "Página não encontrada.",
    back: "Voltar para a home",
  },
  legalCommon: {
    backHome: "Voltar para a home",
    lastUpdated: "Última atualização: 21 de novembro de 2025",
    contactBlockTitle: "Veehtor AI, LLC",
    address: "Endereço: 30 N Gould St Ste N, Sheridan, WY 82801",
  },
  privacy: {
    metaTitle: "Política de Privacidade | Veehtor AI",
    title: "Política de Privacidade — Veehtor AI, LLC",
    disclaimer:
      "Importante: este documento é um modelo geral e não constitui aconselhamento jurídico. Para conformidade específica com a sua jurisdição (LGPD, GDPR, CCPA etc.), consulte um advogado qualificado.",
    intro: [
      "Esta Política de Privacidade explica como a Veehtor AI, LLC (\"Veehtor AI\", \"nós\") coleta, usa e protege informações quando você visita nosso site, usa nossas ferramentas de IA (Inteligência Artificial) ou interage conosco de qualquer forma.",
      "Ao usar nosso site ou serviços, você concorda com as práticas descritas nesta Política de Privacidade.",
    ],
    sections: [
      {
        title: "1. Informações que coletamos",
        blocks: [
          "Podemos coletar os seguintes tipos de informação:",
          {
            subtitle: "1.1. Informações que você fornece diretamente",
            text: "Podemos coletar informações que você fornece voluntariamente, como:",
            list: [
              "Nome",
              "E-mail",
              "Nome da empresa e cargo",
              "Informações sobre o seu negócio, casos de uso ou processos",
              "Conteúdo enviado por formulários, e-mail, chat, agendamentos ou pedidos de demo/consultoria",
              "Qualquer outra informação que você opte por compartilhar ao se comunicar conosco.",
            ],
          },
          {
            subtitle: "1.2. Informações coletadas automaticamente",
            text: "Ao visitar nosso site ou usar nossas ferramentas online, podemos coletar automaticamente:",
            list: [
              "Endereço IP (Internet Protocol)",
              "Tipo e versão do navegador",
              "Tipo de dispositivo e sistema operacional",
              "Páginas visitadas, data e hora, tempo em cada página e URL de origem",
              "Localização geral (como cidade ou região) derivada do seu IP",
              "Cookies e tecnologias similares (ver seção 4).",
            ],
          },
          {
            subtitle: "1.3. Informações de terceiros",
            text: "Podemos receber informações sobre você de terceiros, como:",
            list: [
              "Provedores de analytics (estatísticas de uso do site)",
              "Plataformas de publicidade e marketing (desempenho de campanhas)",
              "Prestadores de serviço e parceiros de integração.",
            ],
          },
        ],
      },
      {
        title: "2. Como usamos suas informações",
        blocks: [
          "Usamos as informações coletadas para:",
          {
            list: [
              "Prestar, operar e melhorar nosso site, ferramentas de IA e serviços de consultoria",
              "Responder a solicitações, demos e agendamentos",
              "Preparar propostas, escopos e contratos",
              "Configurar, testar e manter agentes de IA, automações e soluções para você",
              "Comunicar atualizações, novidades e avisos relacionados ao serviço",
              "Analisar uso do site e do serviço para melhorar experiência e desempenho",
              "Detectar e prevenir problemas técnicos, de segurança ou de fraude",
              "Cumprir obrigações legais e proteger direitos e acordos.",
            ],
          },
        ],
      },
      {
        title: "3. Como compartilhamos suas informações",
        blocks: [
          "Não vendemos suas informações pessoais.",
          "Podemos compartilhá-las nas seguintes situações:",
          {
            list: [
              "Prestadores de serviço: hospedagem, analytics, e-mail, CRM, meios de pagamento e provedores de infraestrutura de IA.",
              "Consultores profissionais: advogados, contadores, seguradoras ou outros consultores quando necessário.",
              "Motivos legais ou de segurança: quando exigido por lei ou para proteger direitos, propriedade e segurança.",
              "Transferências de negócio: em caso de fusão, aquisição, financiamento ou venda parcial ou total do negócio, sob confidencialidade razoável.",
            ],
          },
        ],
      },
      {
        title: "4. Cookies e tecnologias de rastreamento",
        blocks: [
          "Podemos usar cookies e tecnologias similares para:",
          {
            list: [
              "Lembrar suas preferências",
              "Entender como os visitantes usam o site",
              "Melhorar desempenho e conteúdo",
              "Suportar analytics e, quando aplicável, marketing.",
            ],
          },
          "Você pode configurar seu navegador para recusar cookies. Alguns recursos podem parar de funcionar corretamente.",
        ],
      },
      {
        title: "5. Uso de IA e APIs de terceiros",
        blocks: [
          "Nossos serviços e demos podem processar dados com modelos e APIs de IA de terceiros.",
          "Ao enviar dados (texto, prompts, exemplos) para nossas ferramentas de IA, esses dados podem ser processados por provedores externos para gerar respostas.",
          "Não inclua informações altamente sensíveis (senhas, cartões, dados bancários, informações de saúde) em formulários genéricos de IA sem um acordo escrito de configuração segura.",
        ],
      },
      {
        title: "6. Retenção de dados",
        blocks: [
          "Retemos suas informações apenas pelo tempo necessário para:",
          {
            list: [
              "Prestar e suportar nossos serviços",
              "Manter registros para fins legais, fiscais ou contábeis",
              "Resolver disputas e aplicar nossos acordos",
              "Suportar interesses legítimos do negócio.",
            ],
          },
        ],
      },
      {
        title: "7. Segurança dos dados",
        blocks: [
          "Adotamos medidas técnicas e organizacionais razoáveis para proteger suas informações contra acesso não autorizado, divulgação, alteração ou destruição.",
          "Nenhum método de transmissão pela internet é totalmente seguro, e não podemos garantir segurança absoluta.",
        ],
      },
      {
        title: "8. Seus direitos",
        blocks: [
          "Dependendo do seu país e da legislação aplicável, você pode ter direito a:",
          {
            list: [
              "Acessar e obter cópia das suas informações",
              "Solicitar correção de informações imprecisas",
              "Solicitar exclusão, sujeito a obrigações legais ou contratuais",
              "Opor-se ou restringir determinados usos",
              "Revogar o consentimento quando o tratamento se baseia em consentimento",
              "Descadastrar-se de comunicações de marketing.",
            ],
          },
        ],
      },
      {
        title: "9. Privacidade de crianças",
        blocks: [
          "Nosso site é destinado a usuários profissionais e não é direcionado a menores de 13 anos. Não coletamos conscientemente dados de crianças.",
        ],
      },
      {
        title: "10. Alterações desta política",
        blocks: [
          "Podemos atualizar esta Política periodicamente. Quando isso acontecer, atualizaremos a data de \"Última atualização\" no topo da página.",
        ],
      },
      {
        title: "11. Contato",
        blocks: [
          "Se você tiver dúvidas, entre em contato:",
        ],
      },
    ],
  },
  terms: {
    metaTitle: "Termos de Uso | Veehtor AI",
    title: "Termos de Uso — Veehtor AI, LLC",
    disclaimer:
      "Importante: este documento é um modelo geral e não constitui aconselhamento jurídico. Para uma versão específica da sua jurisdição, consulte um advogado qualificado.",
    intro: [
      "Estes Termos de Uso (\"Termos\") regulam o acesso e uso do site, conteúdo e serviços fornecidos pela Veehtor AI, LLC (\"Veehtor AI\", \"nós\").",
      "Ao acessar ou usar nosso site ou serviços, você concorda com estes Termos. Se não concordar, não use o site ou os serviços.",
    ],
    sections: [
      {
        title: "1. Uso do site",
        blocks: [
          "1.1. Você pode usar nosso site apenas para fins lícitos e conforme estes Termos.",
          "1.2. Você concorda em não usar o site de forma que possa danificá-lo, desabilitá-lo, sobrecarregá-lo ou prejudicar o uso de outros.",
          "1.3. Você concorda em não tentar acesso não autorizado a qualquer parte do site, contas, sistemas ou redes conectadas.",
        ],
      },
      {
        title: "2. Nossos serviços",
        blocks: [
          "2.1. A Veehtor AI presta consultoria em IA, desenho de automações, configuração de agentes e serviços correlatos (\"Serviços\").",
          "2.2. As informações do site, incluindo conteúdo gerado por IA, têm caráter informativo geral e não constituem aconselhamento profissional, jurídico, financeiro ou técnico.",
          "2.3. Serviços específicos são regidos por acordo escrito separado (proposta, escopo, ordem), que prevalece sobre estes Termos em caso de conflito.",
        ],
      },
      {
        title: "3. Ferramentas de IA e conteúdo gerado",
        blocks: [
          "3.1. Nossos Serviços e demos podem usar modelos de IA para gerar texto e outros resultados a partir de prompts ou dados.",
          "3.2. O conteúdo gerado por IA pode conter erros e é fornecido \"como está\", para avaliação e uso por sua conta e risco.",
          "3.3. Você é o único responsável por revisar, validar e aprovar os resultados antes de usá-los.",
          "3.4. Você concorda em não confiar em conteúdo gerado por IA como substituto de julgamento profissional.",
          "3.5. Você concorda em não usar nossas ferramentas de IA para processar informações proibidas ou altamente sensíveis, salvo acordo escrito prévio.",
        ],
      },
      {
        title: "4. Conteúdo do usuário",
        blocks: [
          "4.1. Você pode enviar conteúdo (texto, arquivos, dados, prompts) para que possamos prestar os Serviços.",
          "4.2. Você declara possuir todos os direitos necessários para enviar tal conteúdo e que ele não infringe direitos de terceiros ou leis aplicáveis.",
          "4.3. Você concede à Veehtor AI licença não exclusiva, mundial e gratuita para usar, reproduzir, modificar e processar esse conteúdo apenas na medida necessária para prestar, manter e melhorar os Serviços.",
          "4.4. Você é responsável por garantir que seu conteúdo não seja ilícito, prejudicial ou inadequado.",
        ],
      },
      {
        title: "5. Propriedade intelectual",
        blocks: [
          "5.1. O site, seu conteúdo e materiais dos Serviços pertencem à Veehtor AI ou a seus licenciadores e são protegidos por direitos autorais, marcas e demais leis de propriedade intelectual.",
          "5.2. Concedemos a você licença limitada, não exclusiva, intransferível e revogável para acessar e usar o site para fins internos do seu negócio.",
          "5.3. Você não pode reproduzir, modificar, distribuir, exibir publicamente ou explorar qualquer parte do site sem nosso consentimento prévio por escrito.",
        ],
      },
      {
        title: "6. Serviços e links de terceiros",
        blocks: [
          "6.1. Nosso site e Serviços podem integrar-se ou vincular a serviços de terceiros.",
          "6.2. Não controlamos nem somos responsáveis por conteúdo, políticas ou práticas de terceiros.",
          "6.3. O uso de serviços de terceiros é por sua conta e risco.",
        ],
      },
      {
        title: "7. Isenções de garantia",
        blocks: [
          "7.1. O site, Serviços, ferramentas de IA e conteúdo são fornecidos \"como estão\" e \"conforme disponíveis\", sem garantias de qualquer tipo.",
          "7.2. Na máxima extensão permitida por lei, isentamo-nos de todas as garantias, incluindo comercialização, adequação a um fim específico e não infração.",
          "7.3. Não garantimos que o site ou Serviços sejam ininterruptos, livres de erros, seguros ou sem componentes danosos.",
          "7.4. Qualquer decisão baseada em informações ou conteúdo gerado por IA é por sua conta e risco.",
        ],
      },
      {
        title: "8. Limitação de responsabilidade",
        blocks: [
          "8.1. Na máxima extensão permitida por lei, a Veehtor AI não será responsável por danos indiretos, incidentais, consequenciais, especiais ou punitivos.",
          "8.2. Nossa responsabilidade agregada total será limitada ao maior valor entre (a) o valor pago por Serviços nos 6 meses anteriores ao evento ou (b) US$ 100.",
          "8.3. Algumas jurisdições não permitem limitações de responsabilidade; nesses casos, aplica-se o limite máximo permitido por lei.",
        ],
      },
      {
        title: "9. Indenização",
        blocks: [
          "Você concorda em indenizar e isentar a Veehtor AI, LLC, seus sócios, funcionários e agentes de reclamações, danos, perdas, custos e despesas (incluindo honorários advocatícios razoáveis) decorrentes do seu uso do site ou Serviços, violação destes Termos, violação de direitos de terceiros ou do seu Conteúdo.",
        ],
      },
      {
        title: "10. Alterações destes Termos",
        blocks: [
          "Podemos modificar estes Termos periodicamente. Quando fizermos, atualizaremos a data de \"Última atualização\" no topo da página.",
        ],
      },
      {
        title: "11. Lei aplicável e jurisdição",
        blocks: [
          "Estes Termos são regidos pelas leis do Estado de Wyoming, EUA, sem considerar princípios de conflito de leis.",
          "Disputas serão submetidas à jurisdição exclusiva dos tribunais estaduais e federais localizados em Sheridan, Wyoming ou nas proximidades.",
        ],
      },
      {
        title: "12. Contato",
        blocks: [
          "Se você tiver dúvidas sobre estes Termos, entre em contato:",
        ],
      },
    ],
  },
};

const en: SiteContentBundle = {
  footer: {
    tag: "Systems applied to the operation.",
    copy: "© 2026 Veehtor AI LLC",
    linkCases: "Cases",
    linkAbout: "About",
    linkLinkedIn: "LinkedIn",
    linkPrivacy: "Privacy",
    linkTerms: "Terms",
  },
  langSwitcher: {
    toEnglish: "Switch to English",
    toPortuguese: "Mudar para português",
  },
  mapDialog: {
    title: "Map my process",
    subtitle: "Tell us where the operation gets stuck. The conversation starts with context.",
    close: "Close",
    liveInvalid: "Please review the highlighted fields before submitting.",
    liveSending: "Sending your answers.",
    liveReceived: "Received. Now pick a 30-minute slot.",
    processLabel: "Which process is slowing you down?",
    processPlaceholder: "e.g., proposals take five days to go out and depend on three spreadsheets.",
    errProcess: "Describe the process so we can start.",
    impactLegend: "What impact does it have today?",
    errImpact: "Select at least one impact.",
    impacts: IMPACTS_EN,
    yourInfo: "Your info",
    namePlaceholder: "Name",
    errName: "Please enter your name.",
    companyPlaceholder: "Company",
    errCompany: "Please enter your company.",
    emailPlaceholder: "Email",
    errEmail: "Please enter a valid email.",
    phonePlaceholder: "Phone / WhatsApp (optional)",
    consent: "Your data will only be used to review this process and get in touch.",
    consentLink: "Privacy policy",
    submit: "Analyze my process",
    submitting: "Sending...",
    submitMicro: "No generic pitch.",
    errNetwork: "We couldn't send it. Your data is preserved. Please try again.",
    successTitle: "Received.",
    successBody: "Now pick a 30-minute slot.",
    successCta: "Pick a slot",
  },
  caseStudiesUI: {
    metaTitle: "Delivered systems | Veehtor AI",
    metaDescription:
      "Systems in operation with results that show up in the process. Cases across credit, payroll, AI checklists and prospecting.",
    skip: "Skip to content",
    eyebrow: "DELIVERED SYSTEMS",
    h1a: "Systems in operation.",
    h1b: "Results that show up in the process.",
    lede: "Every case shows what was solved, what was measured and the scale the system runs at.",
    filterSector: "INDUSTRY",
    filterArea: "BUSINESS AREA",
    allSectors: "All",
    allAreas: "All",
    counter: (n, total) => `${n} of ${total} cases`,
    empty: "No case matches this sector and area combination.",
    cardCta: "See the system and results",
    closingEyebrow: "Next step",
    closingH2a: "Which process in your operation",
    closingH2b: "costs more than it should?",
    closingBody: "30 minutes. Straight into the process. No generic pitch.",
    closingCta: "Review my process →",
  },
  caseDetailUI: {
    breadcrumbRoot: "Cases",
    breadcrumbAria: "Breadcrumb",
    notFoundTitle: "Case not found",
    notFoundMetaTitle: "Case not found | Veehtor AI",
    backToList: "Back to delivered cases",
    contextEyebrow: "Context and bottleneck",
    contextH2: "What was in the way",
    solutionEyebrow: "What we built",
    solutionH2: "The system",
    resultEyebrow: "What changed",
    resultH2: "Before and after",
    scaleEyebrow: "Scale and operation",
    scaleH2: "Where the system runs",
    scaleSector: "Sector",
    scaleSize: "Size",
    scaleScale: "Scale",
    scaleAreas: "Areas",
    honestyLabel: "Honesty note",
    nextCase: "Next case",
    closingEyebrow: "Next step",
    closingH2a: "Which process in your operation",
    closingH2b: "costs more than it should?",
    closingBody: "30 minutes. Straight into the process. No generic pitch.",
    closingCta: "Review my process →",
  },
  notFound: {
    metaTitle: "Page not found | Veehtor AI",
    heading: "404",
    body: "Page not found.",
    back: "Back to home",
  },
  legalCommon: {
    backHome: "Back to home",
    lastUpdated: "Last updated: November 21, 2025",
    contactBlockTitle: "Veehtor AI, LLC",
    address: "Address: 30 N Gould St Ste N, Sheridan, WY 82801",
  },
  privacy: {
    metaTitle: "Privacy Policy | Veehtor AI",
    title: "Privacy Policy — Veehtor AI, LLC",
    disclaimer:
      "Important: this document is a general template and does not constitute legal advice. For full compliance with your jurisdiction (GDPR, CCPA, etc.), consult a qualified attorney.",
    intro: [
      "This Privacy Policy explains how Veehtor AI, LLC (\"Veehtor AI\", \"we\", \"us\", or \"our\") collects, uses, and protects information when you visit our website, use our AI (Artificial Intelligence) tools, or interact with us in any way.",
      "By using our website or services, you agree to the practices described in this Privacy Policy.",
    ],
    sections: [
      {
        title: "1. Information We Collect",
        blocks: [
          "We may collect the following types of information:",
          {
            subtitle: "1.1. Information you provide directly",
            text: "We may collect information that you voluntarily provide to us, such as:",
            list: [
              "Name",
              "Email address",
              "Company name and role/title",
              "Information about your business, use cases, or processes",
              "Content you submit through forms, email, chat, bookings, or demo/consultation requests",
              "Any other details you choose to share when communicating with us.",
            ],
          },
          {
            subtitle: "1.2. Information collected automatically",
            text: "When you visit our website or use our online tools, we may automatically collect:",
            list: [
              "IP (Internet Protocol) address",
              "Browser type and version",
              "Device type and operating system",
              "Pages visited, time and date of visit, time spent on pages, and referring URL",
              "General location information (such as city or region) derived from your IP address",
              "Cookies and similar tracking technologies (see Section 4).",
            ],
          },
          {
            subtitle: "1.3. Information from third parties",
            text: "We may receive information about you from third parties, such as:",
            list: [
              "Analytics providers (for example, website traffic and usage statistics)",
              "Advertising and marketing platforms (for example, campaign performance data)",
              "Service providers and integration partners that help us deliver our services.",
            ],
          },
        ],
      },
      {
        title: "2. How We Use Your Information",
        blocks: [
          "We use the information we collect for purposes including:",
          {
            list: [
              "Providing, operating, and improving our website, AI tools, and consulting services",
              "Responding to your inquiries, demo requests, and consultation bookings",
              "Preparing proposals, scopes of work, and service agreements",
              "Configuring, testing, and maintaining AI agents, automations, and solutions for you",
              "Communicating with you about updates, features, offers, and service-related notices",
              "Analyzing website and service usage to improve user experience and performance",
              "Detecting, preventing, and addressing technical, security, or fraud issues",
              "Complying with legal obligations and enforcing our agreements and rights.",
            ],
          },
        ],
      },
      {
        title: "3. How We Share Your Information",
        blocks: [
          "We do not sell your personal information.",
          "We may share your information in the following circumstances:",
          {
            list: [
              "Service providers: hosting, analytics, email, CRM, payment processors and AI infrastructure providers.",
              "Professional advisors: lawyers, accountants, insurers, or other advisors when necessary.",
              "Legal and safety reasons: when required by law or to protect rights, property, and safety.",
              "Business transfers: in the event of a merger, acquisition, financing, or sale of all or part of our business, subject to reasonable confidentiality protections.",
            ],
          },
        ],
      },
      {
        title: "4. Cookies and Tracking Technologies",
        blocks: [
          "We may use cookies and similar technologies to:",
          {
            list: [
              "Remember your preferences and settings",
              "Understand how visitors use our website",
              "Improve site performance and content",
              "Support analytics and, where applicable, marketing efforts.",
            ],
          },
          "You can configure your browser to refuse cookies. Some parts of the website may not function properly if you disable cookies.",
        ],
      },
      {
        title: "5. Use of AI and Third-Party APIs",
        blocks: [
          "Our services and demo tools may involve processing data with third-party AI models and APIs.",
          "When you submit data into our AI tools, that data may be processed by external AI providers to generate outputs.",
          "Avoid including highly sensitive personal information (passwords, payment card numbers, bank details, health information) in general-purpose AI forms unless we have explicitly agreed in writing to a secure, compliant configuration.",
        ],
      },
      {
        title: "6. Data Retention",
        blocks: [
          "We retain your information only for as long as reasonably necessary to:",
          {
            list: [
              "Provide and support our services",
              "Maintain business records for legal, tax, or accounting purposes",
              "Resolve disputes and enforce our agreements",
              "Support our legitimate business interests.",
            ],
          },
        ],
      },
      {
        title: "7. Data Security",
        blocks: [
          "We use reasonable technical and organizational measures designed to protect your information from unauthorized access, disclosure, alteration, or destruction.",
          "No method of transmission over the internet is completely secure, and we cannot guarantee absolute security.",
        ],
      },
      {
        title: "8. Your Rights and Choices",
        blocks: [
          "Depending on your location and applicable law, you may have rights regarding your personal information, including:",
          {
            list: [
              "The right to access and obtain a copy of the information we hold about you",
              "The right to request correction of inaccurate or incomplete information",
              "The right to request deletion of your information, subject to certain legal or contractual obligations",
              "The right to object to or restrict certain types of processing",
              "The right to withdraw consent where processing is based on consent",
              "The right to opt out of marketing communications.",
            ],
          },
        ],
      },
      {
        title: "9. Children's Privacy",
        blocks: [
          "Our website and services are intended for business and professional users and are not directed to children under the age of 13. We do not knowingly collect personal information from children.",
        ],
      },
      {
        title: "10. Changes to This Privacy Policy",
        blocks: [
          "We may update this Privacy Policy from time to time. When we make changes, we will update the \"Last updated\" date at the top of this page.",
        ],
      },
      {
        title: "11. Contact Us",
        blocks: [
          "If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:",
        ],
      },
    ],
  },
  terms: {
    metaTitle: "Terms of Service | Veehtor AI",
    title: "Terms of Service — Veehtor AI, LLC",
    disclaimer:
      "Important: this document is a general template and does not constitute legal advice. For a tailored, jurisdiction-specific version, consult a qualified attorney.",
    intro: [
      "These Terms of Service (\"Terms\") govern your access to and use of the website, content, and services provided by Veehtor AI, LLC (\"Veehtor AI\", \"we\", \"us\", or \"our\").",
      "By accessing or using our website or services, you agree to be bound by these Terms. If you do not agree, please do not use our website or services.",
    ],
    sections: [
      {
        title: "1. Use of the Website",
        blocks: [
          "1.1. You may use our website only for lawful purposes and in accordance with these Terms.",
          "1.2. You agree not to use the website in any way that could damage, disable, overburden, or impair the website, or interfere with any other party's use.",
          "1.3. You agree not to attempt to gain unauthorized access to any part of the website, other accounts, computer systems, or networks connected to the website.",
        ],
      },
      {
        title: "2. Our Services",
        blocks: [
          "2.1. Veehtor AI provides AI consulting, automation design, AI agent configuration, and related services (the \"Services\").",
          "2.2. Information on our website, including AI-generated content, is for general informational purposes only and does not constitute professional, legal, financial, or technical advice.",
          "2.3. Specific Services are governed by a separate written agreement (proposal, statement of work, or order form), which prevails over these Terms in case of conflict.",
        ],
      },
      {
        title: "3. AI Tools and Generated Content",
        blocks: [
          "3.1. Our Services and demo tools may use AI models to generate outputs based on prompts or data you provide.",
          "3.2. AI-generated content may contain errors and is provided \"as is\" for your evaluation and use at your own discretion and risk.",
          "3.3. You are solely responsible for reviewing, validating, and approving AI outputs before using them.",
          "3.4. You agree not to rely on AI-generated content as a substitute for professional judgment.",
          "3.5. You agree not to use our AI tools to process prohibited or highly sensitive information unless we have explicitly agreed in writing.",
        ],
      },
      {
        title: "4. User Content",
        blocks: [
          "4.1. You may submit content to us (text, files, data, prompts, or other materials) so we can provide the Services.",
          "4.2. You represent and warrant that you have all necessary rights and permissions to provide such User Content and that it does not infringe the rights of any third party or violate any law.",
          "4.3. By providing User Content, you grant Veehtor AI a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and process that User Content solely as necessary to provide, maintain, and improve the Services.",
          "4.4. You are responsible for ensuring that your User Content does not contain unlawful, harmful, or inappropriate material.",
        ],
      },
      {
        title: "5. Intellectual Property",
        blocks: [
          "5.1. The website and Service materials are owned by Veehtor AI or its licensors and are protected by copyright, trademark, and other intellectual property laws.",
          "5.2. Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the website for your internal business purposes.",
          "5.3. You may not reproduce, modify, distribute, transmit, publicly display, publicly perform, publish, create derivative works from, or exploit any part of the website without our prior written consent.",
        ],
      },
      {
        title: "6. Third-Party Services and Links",
        blocks: [
          "6.1. Our website and Services may integrate with or link to third-party services.",
          "6.2. We do not control and are not responsible for the content, policies, or practices of any third-party services.",
          "6.3. Your use of third-party services is at your own risk.",
        ],
      },
      {
        title: "7. Disclaimers",
        blocks: [
          "7.1. The website, Services, AI tools, and all related content are provided on an \"as is\" and \"as available\" basis, without warranties of any kind.",
          "7.2. To the fullest extent permitted by law, we disclaim all warranties, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.",
          "7.3. We do not warrant that the website or Services will be uninterrupted, error-free, secure, or free of harmful components.",
          "7.4. Any decisions or actions you take based on AI-generated content are at your own risk.",
        ],
      },
      {
        title: "8. Limitation of Liability",
        blocks: [
          "8.1. To the maximum extent permitted by law, Veehtor AI will not be liable for any indirect, incidental, consequential, special, or punitive damages.",
          "8.2. Our total aggregate liability will be limited to the greater of (a) the amount you paid to us for the Services in the six (6) months preceding the event, or (b) US$100.",
          "8.3. Some jurisdictions do not allow limitations of liability, so some of the above may not apply; in such cases, our liability is limited to the maximum extent permitted by law.",
        ],
      },
      {
        title: "9. Indemnification",
        blocks: [
          "You agree to indemnify, defend, and hold harmless Veehtor AI, LLC and its owners, employees, and agents from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of your use of the website or Services, your violation of these Terms, or your User Content.",
        ],
      },
      {
        title: "10. Changes to These Terms",
        blocks: [
          "We may modify these Terms from time to time. When we do, we will update the \"Last updated\" date at the top of this page.",
        ],
      },
      {
        title: "11. Governing Law and Jurisdiction",
        blocks: [
          "These Terms are governed by the laws of the State of Wyoming, United States, without regard to conflict of law principles.",
          "Any disputes will be subject to the exclusive jurisdiction of the state and federal courts located in or nearest to Sheridan, Wyoming.",
        ],
      },
      {
        title: "12. Contact Us",
        blocks: [
          "If you have any questions about these Terms, please contact us:",
        ],
      },
    ],
  },
};

export const siteContent = { pt, en };

export function useSiteContent(): SiteContentBundle {
  const { language } = useLanguage();
  return siteContent[language];
}
