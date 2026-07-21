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
      viewBox="0 0 560 400"
      role="img"
      aria-label="Mapa de um fluxo de vendas em que um vazamento de receita é identificado e fechado pela v.AI."
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
        <text className="nodelabel" x={52} y={178} textAnchor="middle">Lead entra</text>
      </g>

      <g className="n-2 appear">
        <circle cx={204} cy={122} r={7} fill="#111828" />
        <text className="nodelabel" x={204} y={100} textAnchor="middle">Resposta</text>
      </g>

      <g className="n-3 appear">
        <circle cx={352} cy={150} r={7} fill="#111828" />
        <text className="nodelabel" x={352} y={178} textAnchor="middle">Follow-up</text>
      </g>

      <g className="anno">
        <text className="annolabel anno-only" x={204} y={78} textAnchor="middle">
          espera: 18h
        </text>
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
          <text className="leaklabel" x={440} y={330}>receita escapa</text>
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

      <g className="vai appear">
        <circle className="logo-halo" cx={421} cy={226} r={42} fill="#E6E7E9" opacity={0.98} />
        <image
          className="brand-logo"
          x={385}
          y={190}
          width={72}
          height={72}
          preserveAspectRatio="xMidYMid meet"
          href={vaiMark}
        />
      </g>

      <g className="n-4 appear">
        <circle cx={492} cy={128} r={7.5} fill="#111828" stroke="#15B7A8" strokeWidth={3} />
        <text className="nodelabel" x={492} y={106} textAnchor="middle">Reunião</text>
      </g>

      <g className="chip-final appear">
        <rect x={372} y={22} width={162} height={26} rx={13} fill="#FFFFFF" stroke="#21C65D" strokeWidth={1.2} />
        <circle cx={388} cy={35} r={3.5} fill="#21C65D" />
        <text className="chiplabel" x={398} y={39}>EXEMPLO DE IMPACTO</text>
      </g>
    </svg>
  );
}
