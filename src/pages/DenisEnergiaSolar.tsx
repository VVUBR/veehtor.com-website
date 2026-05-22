import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const WHATSAPP = "https://api.whatsapp.com/send?phone=5511973022058";

const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=Hanken+Grotesk:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;600;700&display=swap');
    .font-display { font-family: 'Bricolage Grotesque', sans-serif; letter-spacing: -0.02em; }
    .font-body { font-family: 'Hanken Grotesk', sans-serif; }
    .font-serif { font-family: 'Fraunces', serif; font-variation-settings: "opsz" 144; }
    .denis-root { font-family: 'Hanken Grotesk', sans-serif; color: #1E293B; background: #FAFAF8; }
    .sun-glow {
      background:
        radial-gradient(ellipse 80% 60% at 50% 110%, rgba(245,158,11,0.45) 0%, rgba(251,146,60,0.25) 25%, rgba(15,23,42,0) 60%),
        radial-gradient(ellipse 60% 40% at 50% 100%, rgba(251,146,60,0.35) 0%, rgba(15,23,42,0) 55%),
        #0F172A;
    }
    .denis-slider {
      -webkit-appearance: none; appearance: none;
      width: 100%; height: 6px; border-radius: 999px;
      background: linear-gradient(to right, #F59E0B var(--val,50%), #E2E8F0 var(--val,50%));
      outline: none;
    }
    .denis-slider::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none;
      width: 22px; height: 22px; border-radius: 50%;
      background: #0D9488; border: 3px solid #FAFAF8;
      box-shadow: 0 2px 8px rgba(13,148,136,0.4); cursor: pointer;
      transition: transform 0.15s;
    }
    .denis-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
    .denis-slider::-moz-range-thumb {
      width: 22px; height: 22px; border-radius: 50%;
      background: #0D9488; border: 3px solid #FAFAF8;
      box-shadow: 0 2px 8px rgba(13,148,136,0.4); cursor: pointer;
    }
    .denis-slider:focus-visible { box-shadow: 0 0 0 3px rgba(13,148,136,0.3); }
    .pillar-card:hover .pillar-detail { max-height: 600px; opacity: 1; margin-top: 1.25rem; }
    .pillar-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -20px rgba(13,148,136,0.25); }
  `}</style>
);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as any },
  }),
};

function Section({ id, children, className = "" }: any) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function Reveal({ children, i = 0, className = "" }: any) {
  return (
    <motion.div variants={fadeUp} custom={i} className={className}>
      {children}
    </motion.div>
  );
}

function brl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function Nav() {
  const links = [
    { href: "#diagnostico", label: "Diagnóstico" },
    { href: "#solucao", label: "Solução" },
    { href: "#investimento", label: "Investimento" },
    { href: "#proximo", label: "Próximo passo" },
  ];
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[#0F172A]/80 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="font-display text-white text-lg font-bold tracking-tight">
          Veehtor <span className="text-[#F59E0B]">AI</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-white/70 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-[#F59E0B] text-[#0F172A] text-sm font-semibold hover:bg-[#FB923C] transition-colors">
            Agendar conversa
          </a>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2" aria-label="Menu">
          <div className="w-5 h-0.5 bg-white mb-1.5" />
          <div className="w-5 h-0.5 bg-white mb-1.5" />
          <div className="w-5 h-0.5 bg-white" />
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#0F172A] border-t border-white/5 px-5 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-white/80 py-1">{l.label}</a>
          ))}
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
            className="mt-2 px-4 py-3 rounded-full bg-[#F59E0B] text-[#0F172A] font-semibold text-center">
            Agendar conversa
          </a>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section id="top" className="sun-glow relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 px-5 lg:px-8">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[#F59E0B] text-xs md:text-sm uppercase tracking-[0.2em] font-semibold mb-5">
          Proposta preparada para Denis
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-balance">
          Seu processo comercial, transformado em uma <span className="font-serif italic text-[#F59E0B]">máquina de vendas</span> previsível.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 md:mt-8 text-white/75 text-lg md:text-xl max-w-2xl leading-relaxed">
          Captação inteligente, qualificação com IA e visibilidade total do funil. Do primeiro contato ao fechamento, com foco em resultado mensurável para Uberlândia e o Triângulo Mineiro.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row gap-3">
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
            className="px-7 py-4 rounded-full bg-[#F59E0B] text-[#0F172A] font-semibold hover:bg-[#FB923C] transition-all hover:shadow-[0_10px_30px_-5px_rgba(245,158,11,0.5)] text-center">
            Agendar conversa
          </a>
          <a href="#diagnostico"
            className="px-7 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors text-center">
            Ver a proposta
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Diagnostico() {
  const items = [
    "Geração e captação de leads ainda não sistematizada.",
    "Velocidade de resposta e qualificação ainda manuais.",
    "Acompanhamento de oportunidades sem funil visível.",
    "Dificuldade de medir de onde vêm os melhores clientes.",
  ];
  return (
    <Section id="diagnostico" className="py-24 md:py-32 px-5 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-[#0D9488] text-xs uppercase tracking-[0.2em] font-semibold mb-4">Diagnóstico</p>
        </Reveal>
        <Reveal i={1}>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            O serviço já tem demanda. <span className="font-serif italic text-[#0D9488]">Falta estrutura</span> para converter.
          </h2>
        </Reveal>
        <div className="mt-14 md:mt-20 grid md:grid-cols-2 gap-x-16 gap-y-10">
          {items.map((t, i) => (
            <Reveal key={i} i={i + 2}>
              <div className="flex gap-5 items-start">
                <span className="font-serif text-3xl text-[#F59E0B] leading-none mt-1">0{i + 1}</span>
                <p className="text-lg md:text-xl text-[#1E293B] leading-relaxed">{t}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Pilares() {
  const pillars = [
    {
      n: "01",
      title: "Captação Inteligente",
      lead: "Leads chegando de forma sistemática, com prioridade geográfica.",
      detail: [
        "Formulário inteligente integrado ao WhatsApp",
        "Automação de entrada de leads de Instagram, Facebook e anúncios",
        "Inteligência competitiva sobre anúncios e comentários públicos de concorrentes",
        "Priorização geográfica de Uberlândia e Triângulo Mineiro",
      ],
    },
    {
      n: "02",
      title: "Qualificação e Follow-up com IA",
      lead: "Cada lead atendido em minutos, classificado e nutrido.",
      detail: [
        "Agente de IA para qualificação inicial",
        "Classificação por nível de interesse",
        "Mensagens personalizadas para WhatsApp",
        "Follow-up semiautomático com lembretes",
        "Funil: Novo, Em Atendimento, Proposta, Negociação, Fechamento",
      ],
    },
    {
      n: "03",
      title: "Dashboard e Visibilidade",
      lead: "Tudo o que importa, em uma tela.",
      detail: [
        "Volume de leads, origem, status e oportunidades quentes",
        "Histórico por lead",
        "Indicadores de performance",
        "Recomendações de melhoria contínua",
      ],
    },
  ];
  return (
    <Section id="solucao" className="py-24 md:py-32 px-5 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[#0D9488] text-xs uppercase tracking-[0.2em] font-semibold mb-4">Os três pilares</p>
        </Reveal>
        <Reveal i={1}>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            O que vamos construir.
          </h2>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <Reveal key={p.n} i={i + 2}>
              <article className="pillar-card h-full p-7 md:p-8 rounded-2xl bg-[#FAFAF8] border border-[#E2E8F0] transition-all duration-300 cursor-default">
                <div className="font-serif text-2xl text-[#F59E0B] mb-6">{p.n}</div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-[#0F172A]">{p.title}</h3>
                <p className="mt-3 text-[#64748B] leading-relaxed">{p.lead}</p>
                <ul className="pillar-detail overflow-hidden max-h-0 opacity-0 transition-all duration-500 space-y-2 text-sm text-[#1E293B] md:max-h-0 max-h-none md:opacity-0 opacity-100 md:mt-0 mt-4">
                  {p.detail.map((d, j) => (
                    <li key={j} className="flex gap-2 items-start">
                      <span className="text-[#0D9488] mt-0.5">→</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Calculadora() {
  const [leads, setLeads] = useState(100);
  const [ticket, setTicket] = useState(20000);
  const [fechamento, setFechamento] = useState(8);
  const [perdidos, setPerdidos] = useState(20);

  const recuperados = leads * (perdidos / 100) * (fechamento / 100);
  const receitaMes = recuperados * ticket;
  const receitaAno = receitaMes * 12;

  const SliderRow = ({ label, value, suffix, min, max, set }: any) => {
    const pct = ((value - min) / (max - min)) * 100;
    return (
      <div>
        <div className="flex justify-between items-baseline mb-3">
          <label className="text-sm text-[#64748B] font-medium">{label}</label>
          <span className="font-serif text-xl text-[#0F172A]">
            {suffix === "R$" ? brl(value) : `${value}${suffix}`}
          </span>
        </div>
        <input
          type="range" min={min} max={max} value={value}
          onChange={(e) => set(Number(e.target.value))}
          className="denis-slider"
          style={{ ["--val" as any]: `${pct}%` }}
          aria-label={label}
        />
      </div>
    );
  };

  return (
    <Section id="calculadora" className="py-24 md:py-32 px-5 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[#0D9488] text-xs uppercase tracking-[0.2em] font-semibold mb-4">Calculadora</p>
        </Reveal>
        <Reveal i={1}>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            Quanto você pode estar deixando <span className="font-serif italic text-[#F59E0B]">na mesa</span>.
          </h2>
        </Reveal>
        <div className="mt-14 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <Reveal i={2}>
            <div className="space-y-7 p-7 md:p-8 rounded-2xl bg-white border border-[#E2E8F0]">
              <SliderRow label="Leads por mês" value={leads} suffix="" min={10} max={300} set={setLeads} />
              <SliderRow label="Ticket médio" value={ticket} suffix="R$" min={5000} max={60000} set={setTicket} />
              <SliderRow label="Taxa de fechamento atual" value={fechamento} suffix="%" min={1} max={20} set={setFechamento} />
              <SliderRow label="Leads perdidos por falta de follow-up" value={perdidos} suffix="%" min={0} max={40} set={setPerdidos} />
            </div>
          </Reveal>
          <Reveal i={3}>
            <div className="p-7 md:p-10 rounded-2xl sun-glow text-white">
              <p className="text-white/70 text-sm uppercase tracking-wider">Receita potencial recuperada</p>
              <p className="mt-4 font-serif text-5xl md:text-6xl text-[#F59E0B] font-semibold leading-none tabular-nums">
                {brl(receitaMes)}
              </p>
              <p className="text-white/60 mt-2">por mês</p>
              <div className="my-6 h-px bg-white/10" />
              <p className="text-white/70 text-sm uppercase tracking-wider">No ano</p>
              <p className="mt-2 font-serif text-3xl md:text-4xl text-white tabular-nums">{brl(receitaAno)}</p>
              <p className="mt-6 text-xs text-white/50 leading-relaxed">
                Estimativa para fins de ilustração, baseada nos parâmetros informados. Os números reais são definidos após a medição do baseline na Semana 1.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function Indicadores() {
  const cards = [
    "Tempo de resposta ao lead",
    "Leads contatados em até 10 minutos",
    "Taxa de qualificação",
    "Cadência de follow-up cumprida",
    "Conversão por etapa do funil",
  ];
  return (
    <Section className="py-24 md:py-32 px-5 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[#0D9488] text-xs uppercase tracking-[0.2em] font-semibold mb-4">Indicadores de sucesso</p>
        </Reveal>
        <Reveal i={1}>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            O que define que <span className="font-serif italic text-[#0D9488]">está funcionando</span>.
          </h2>
        </Reveal>
        <Reveal i={2}>
          <p className="mt-5 text-[#64748B] text-lg max-w-2xl leading-relaxed">
            A primeira entrega é medir o baseline atual. As metas são definidas em conjunto depois dessa medição.
          </p>
        </Reveal>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c, i) => (
            <Reveal key={c} i={i + 3}>
              <div className="p-6 rounded-2xl bg-[#FAFAF8] border border-[#E2E8F0] h-full hover:border-[#0D9488]/40 transition-colors">
                <h3 className="font-display text-lg font-bold text-[#0F172A]">{c}</h3>
                <p className="mt-3 text-xs text-[#64748B] uppercase tracking-wider">
                  Baseline na Semana 1, meta definida em conjunto
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Cronograma() {
  const steps = [
    { w: "Semana 1", t: "Diagnóstico, instrumentação do baseline, desenho do funil e definição de canais." },
    { w: "Semana 2", t: "Base de leads, formulário, consentimento LGPD e automações iniciais." },
    { w: "Semana 3", t: "Agente de IA e mensagens de qualificação." },
    { w: "Semana 4", t: "Dashboard, inteligência competitiva, testes e ajustes." },
    { w: "Semanas 5 e 6", t: "Otimização, treinamento e melhoria com base nos primeiros leads reais." },
  ];
  return (
    <Section className="py-24 md:py-32 px-5 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[#0D9488] text-xs uppercase tracking-[0.2em] font-semibold mb-4">Cronograma</p>
        </Reveal>
        <Reveal i={1}>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            Da assinatura ao primeiro resultado em <span className="font-serif italic text-[#F59E0B]">6 semanas</span>.
          </h2>
        </Reveal>
        <div className="mt-14 relative">
          <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-[#0D9488] via-[#F59E0B] to-[#FB923C]" />
          <div className="grid md:grid-cols-5 gap-8 md:gap-4">
            {steps.map((s, i) => (
              <Reveal key={s.w} i={i + 2}>
                <div className="relative md:pt-0 pl-8 md:pl-0">
                  <div className="md:mx-auto w-3 h-3 rounded-full bg-[#0D9488] ring-4 ring-[#FAFAF8] md:relative absolute left-0 top-2 md:top-0 md:mb-6" />
                  <div className="md:hidden absolute left-1.5 top-5 bottom-0 w-px bg-[#E2E8F0]" />
                  <p className="font-serif text-[#F59E0B] text-lg">{s.w}</p>
                  <p className="mt-2 text-[#1E293B] leading-relaxed text-sm md:text-base">{s.t}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Confianca() {
  return (
    <Section className="py-24 md:py-32 px-5 lg:px-8 bg-[#0F172A] text-white">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <p className="text-[#F59E0B] text-xs uppercase tracking-[0.2em] font-semibold mb-4">Confiança e transparência</p>
        </Reveal>
        <Reveal i={1}>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
            Números honestos, porque sua <span className="font-serif italic text-[#F59E0B]">reputação</span> depende disso.
          </h2>
        </Reveal>
        <Reveal i={2}>
          <p className="mt-8 text-white/75 text-lg leading-relaxed max-w-3xl">
            Quando construirmos o módulo de simulação de economia, ele será calibrado pela Lei 14.300. O Fio B está em 60% em 2026 e sobe no cronograma até 100% em 2029. Calibrar por isso garante que a economia mostrada ao seu cliente seja realista e se sustente no pós-venda. Confiança se constrói com número que se confirma na conta de luz.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

function Investimento() {
  const planos = [
    {
      nome: "Essencial", impl: "R$ 6.500", mens: "R$ 1.200/mês", perm: "6 meses",
      inclui: "Organizar captação e funil comercial (Pilares 1 e 3, sem agente de IA de qualificação).",
    },
    {
      nome: "Recomendada", impl: "R$ 9.900", mens: "R$ 1.800/mês", perm: "12 meses",
      inclui: "Captação, qualificação com IA, WhatsApp, dashboard e inteligência competitiva (os três pilares completos).",
      destaque: true,
    },
    {
      nome: "Crescimento", impl: "R$ 16.500", mens: "R$ 2.500/mês", perm: "12 meses",
      inclui: "Tudo da Recomendada, mais o Módulo de Análise de Conta calibrado pelo Fio B, a trilha de integração com a CEMIG e a base para o totem.",
    },
  ];
  return (
    <Section id="investimento" className="py-24 md:py-32 px-5 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[#0D9488] text-xs uppercase tracking-[0.2em] font-semibold mb-4">Investimento</p>
        </Reveal>
        <Reveal i={1}>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            Três planos. O valor compõe ao longo do tempo, por isso há <span className="font-serif italic text-[#0D9488]">permanência mínima</span>.
          </h2>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-3 gap-5 items-stretch">
          {planos.map((p, i) => (
            <Reveal key={p.nome} i={i + 2}>
              <div className={`relative h-full p-7 md:p-8 rounded-2xl flex flex-col transition-all ${
                p.destaque
                  ? "bg-[#FAFAF8] border-2 border-[#0D9488] shadow-[0_20px_50px_-15px_rgba(13,148,136,0.3)] md:-translate-y-3"
                  : "bg-[#FAFAF8] border border-[#E2E8F0]"
              }`}>
                {p.destaque && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#0D9488] text-white text-xs font-semibold uppercase tracking-wider">
                    Recomendada
                  </span>
                )}
                <h3 className="font-display text-2xl font-bold text-[#0F172A]">{p.nome}</h3>
                <div className="mt-6 space-y-3">
                  <div>
                    <p className="text-xs text-[#64748B] uppercase tracking-wider">Implantação</p>
                    <p className="font-serif text-3xl text-[#0F172A] mt-1">{p.impl}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B] uppercase tracking-wider">Mensalidade</p>
                    <p className="font-serif text-2xl text-[#F59E0B] mt-1">{p.mens}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B] uppercase tracking-wider">Permanência</p>
                    <p className="text-[#1E293B] mt-1">{p.perm}</p>
                  </div>
                </div>
                <p className="mt-6 text-sm text-[#64748B] leading-relaxed flex-1">{p.inclui}</p>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                  className={`mt-7 px-5 py-3 rounded-full text-sm font-semibold text-center transition-colors ${
                    p.destaque
                      ? "bg-[#0D9488] text-white hover:bg-[#0F766E]"
                      : "border border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white"
                  }`}>
                  Quero esse plano
                </a>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal i={6}>
          <p className="mt-10 text-xs text-[#64748B] max-w-3xl leading-relaxed">
            Ferramentas externas, APIs, anúncios pagos e custos de plataformas de terceiros não estão incluídos, salvo quando especificado. A API de WhatsApp tem custo por conversa.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

function Condicoes() {
  return (
    <Section className="py-14 px-5 lg:px-8 bg-[#FAFAF8] border-y border-[#E2E8F0]">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-sm text-[#64748B] leading-relaxed">
            <span className="text-[#0F172A] font-semibold">Condições e LGPD. </span>
            50% na assinatura, 50% na entrega da Fase 1. Mensalidade após a entrega ou após 30 dias. Consentimento LGPD configurado no formulário de captação. Inteligência competitiva limitada a conteúdo publicamente acessível.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

function ProximoPasso() {
  return (
    <section id="proximo" className="sun-glow py-28 md:py-40 px-5 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center">
        <p className="text-[#F59E0B] text-xs uppercase tracking-[0.2em] font-semibold mb-5">Próximo passo</p>
        <h2 className="font-display text-white text-4xl md:text-6xl font-bold leading-tight">
          Vamos validar a <span className="font-serif italic text-[#F59E0B]">Fase 1</span>.
        </h2>
        <p className="mt-6 text-white/75 text-lg max-w-2xl mx-auto leading-relaxed">
          Confirmar os canais prioritários, nomear o sponsor interno e agendar o mapeamento do processo comercial.
        </p>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
          className="mt-10 inline-block px-9 py-5 rounded-full bg-[#F59E0B] text-[#0F172A] font-semibold text-lg hover:bg-[#FB923C] transition-all hover:shadow-[0_15px_40px_-10px_rgba(245,158,11,0.6)]">
          Agendar conversa
        </a>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white/60 py-12 px-5 lg:px-8 text-center border-t border-white/5">
      <p className="font-display text-white text-lg">
        Veehtor <span className="text-[#F59E0B]">AI</span>
      </p>
      <p className="mt-2 text-sm">Seu processo comercial, mais inteligente.</p>
      <p className="mt-1 text-xs">veehtor.com</p>
    </footer>
  );
}

export default function DenisEnergiaSolar() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    const prevTitle = document.title;
    document.title = "Proposta Veehtor AI · Denis Energia Solar";
    return () => {
      document.documentElement.style.scrollBehavior = "";
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="denis-root min-h-screen">
      <FontStyles />
      <Nav />
      <Hero />
      <Diagnostico />
      <Pilares />
      <Calculadora />
      <Indicadores />
      <Cronograma />
      <Confianca />
      <Investimento />
      <Condicoes />
      <ProximoPasso />
      <Footer />
    </div>
  );
}
