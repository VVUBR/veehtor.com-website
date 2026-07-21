import { useEffect, useRef } from "react";
import vaiMark from "@/assets/vai-mark.png";

// Same breakpoint used by the CSS (@media max-width: 980px stacks the hero).
export const HOME_STACK_BREAKPOINT = 980;

export default function OpMap({ reducedOrSmall }: { reducedOrSmall: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);

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
      viewBox="0 0 560 430"
      role="img"
      aria-labelledby="opmapTitle opmapDesc"
    >
      <title id="opmapTitle">Mapa de processo comercial</title>
      <desc id="opmapDesc">
        Um fluxo de vendas com quatro etapas: lead entra, resposta, follow-up e reunião. Depois do
        follow-up, uma oportunidade esfria. A intervenção da v.AI fecha o fluxo até a reunião.
        Demonstração visual, marcada como exemplo de impacto.
      </desc>
      <defs>
        <marker id="arrEnd" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#111828" />
        </marker>
        <marker id="arrTeal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#15B7A8" />
        </marker>
      </defs>

      <path
        className="p-main draw"
        d="M50 168 L192 138 L326 166"
        pathLength={1}
        fill="none"
        stroke="#111828"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd="url(#arrEnd)"
      />

      <g className="n-1 appear">
        <circle cx={50} cy={168} r={7} fill="#111828" />
        <text className="nodelabel" x={50} y={196} textAnchor="middle">Lead entra</text>
      </g>
      <g className="n-2 appear">
        <circle cx={192} cy={138} r={7} fill="#111828" />
        <text className="nodelabel" x={192} y={116} textAnchor="middle">Resposta</text>
      </g>
      <g className="n-3 appear">
        <circle cx={330} cy={168} r={7} fill="#111828" />
        <text className="nodelabel" x={330} y={196} textAnchor="middle">Follow-up</text>
      </g>

      <g className="leak-group">
        <g className="leak appear">
          <path
            d="M334 174 C 372 240, 398 288, 408 330"
            fill="none"
            stroke="#F87316"
            strokeWidth={2}
            strokeDasharray="5 6"
            strokeLinecap="round"
          />
          <circle cx={410} cy={338} r={5.5} fill="none" stroke="#F87316" strokeWidth={2} />
          <text className="leaklabel" x={424} y={342}>oportunidade esfria</text>
        </g>
        <circle className="leak-dot appear" cx={334} cy={174} r={6} fill="#F87316" />
      </g>

      <path
        className="p-fix draw"
        d="M330 168 C 372 212, 448 224, 502 168 L502 146"
        pathLength={1}
        fill="none"
        stroke="#15B7A8"
        strokeWidth={2.8}
        strokeLinecap="round"
        markerEnd="url(#arrTeal)"
      />

      <g className="vai appear">
        <circle className="logo-halo" cx={421} cy={226} r={42} fill="#E6E7E9" opacity={0.98} />
        <g className="brand-logo">
          <image x={385} y={190} width={72} height={72} preserveAspectRatio="xMidYMid meet" href={vaiMark} />
        </g>
      </g>

      <g className="n-4 appear">
        <circle cx={502} cy={138} r={7.5} fill="#111828" stroke="#15B7A8" strokeWidth={3} />
        <text className="nodelabel" x={502} y={116} textAnchor="middle">Reunião</text>
      </g>

      <g className="chip-final appear">
        <rect x={372} y={42} width={162} height={26} rx={13} fill="#FFFFFF" stroke="#21C65D" strokeWidth={1.2} />
        <circle cx={388} cy={55} r={3.5} fill="#21C65D" />
        <text className="chiplabel" x={398} y={59}>EXEMPLO DE IMPACTO</text>
      </g>
    </svg>
  );
}
