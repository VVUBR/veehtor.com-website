import { useEffect, useRef } from "react";
import vaiMark from "@/assets/vai-mark.png";
import { useLanguage } from "@/i18n/LanguageContext";
import { useHomeContent } from "@/i18n/homeContent";

export const HOME_STACK_BREAKPOINT = 980;

const LABELS = {
  pt: {
    request: "Solicitação entra",
    analysis: "Análise",
    approval: "Aprovação",
    execution: "Execução",
    response: "resposta: 11 min",
    wait: "espera: 18h",
    stuck: "trabalho parado",
    organized: "dados organizados",
    exception: "exceção enviada ao responsável",
    chip: "EXEMPLO DE IMPACTO",
  },
  en: {
    request: "Request comes in",
    analysis: "Analysis",
    approval: "Approval",
    execution: "Execution",
    response: "response: 11 min",
    wait: "wait: 18h",
    stuck: "work stalled",
    organized: "data organized",
    exception: "exception routed to owner",
    chip: "SAMPLE IMPACT",
  },
} as const;

export default function OpMap({ reducedOrSmall }: { reducedOrSmall: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { language } = useLanguage();
  const L = LABELS[language];
  const C = useHomeContent();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (reducedOrSmall) {
      svg.classList.add("done");
    } else {
      const t = window.setTimeout(() => svg.classList.add("play"), 250);
      return () => window.clearTimeout(t);
    }
  }, [reducedOrSmall]);

  return (
    <svg
      ref={svgRef}
      id="opmap"
      viewBox="0 0 560 400"
      role="img"
      aria-label={C.hero.mapAria}
    >
      <path
        className="p-main draw"
        d="M52 150 L204 122 L352 150"
        pathLength={1}
        fill="none"
        stroke="#111828"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g className="n-1 appear">
        <circle cx={52} cy={150} r={7} fill="#111828" />
        <text className="nodelabel" x={62} y={178} textAnchor="middle">{L.request}</text>
      </g>

      <g className="n-2 appear">
        <circle cx={204} cy={122} r={7} fill="#111828" />
        <text className="nodelabel" x={204} y={100} textAnchor="middle">{L.analysis}</text>
      </g>

      <g className="n-3 appear">
        <circle cx={352} cy={150} r={7} fill="#111828" />
        <text className="nodelabel" x={352} y={178} textAnchor="middle">{L.approval}</text>
      </g>


      <g className="leak-group">
        <g className="leak appear">
          <path
            d="M356 156 C392 220,414 268,424 316"
            fill="none"
            stroke="#F87316"
            strokeWidth={2}
            strokeDasharray="5 6"
            strokeLinecap="round"
          />
          <circle cx={426} cy={326} r={5.5} fill="none" stroke="#F87316" strokeWidth={2} />
          <text className="leaklabel" x={440} y={326}>{L.wait}</text>
          <text className="leaklabel" x={440} y={340}>{L.stuck}</text>
        </g>
        <circle className="leak-dot appear" cx={356} cy={156} r={6} fill="#F87316" />
      </g>

      <path
        className="p-fix draw"
        d="M352 150 C392 196,452 210,492 152 L492 128"
        pathLength={1}
        fill="none"
        stroke="#15B7A8"
        strokeWidth={2.8}
        strokeLinecap="round"
      />

      <defs>
        <clipPath id="vaiLogoClip">
          <circle cx={421} cy={226} r={38} />
        </clipPath>
      </defs>

      <g className="vai appear">
        <circle className="logo-halo" cx={421} cy={226} r={42} fill="#E6E7E9" opacity={0.98} />
        <image
          className="brand-logo"
          x={389}
          y={194}
          width={64}
          height={64}
          preserveAspectRatio="xMidYMid slice"
          href={vaiMark}
          clipPath="url(#vaiLogoClip)"
        />
      </g>

      <text className="interlabel" x={421} y={286} textAnchor="middle">{L.organized}</text>
      <text className="interlabel" x={421} y={299} textAnchor="middle">{L.exception}</text>

      <g className="n-4 appear">
        <circle cx={492} cy={128} r={7.5} fill="#111828" stroke="#15B7A8" strokeWidth={3} />
        <text className="nodelabel" x={492} y={106} textAnchor="middle">{L.execution}</text>
        <text className="resultlabel" x={492} y={92} textAnchor="middle">{L.response}</text>
      </g>

      <g className="chip-final appear">
        <rect x={372} y={22} width={162} height={26} rx={13} fill="#FFFFFF" stroke="#21C65D" strokeWidth={1.2} />
        <circle cx={388} cy={35} r={3.5} fill="#21C65D" />
        <text className="chiplabel" x={398} y={39}>{L.chip}</text>
      </g>
    </svg>
  );
}
