export function Logo({ className = "", textColor = "#111828" }: { className?: string; textColor?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="24"
      viewBox="0 0 32 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="v.AI"
    >
      <text
        x="0"
        y="18.5"
        fontFamily="var(--font-sans, 'Instrument Sans', 'Helvetica Neue', Arial, sans-serif)"
        fontSize="18.4"
        fontWeight="700"
        letterSpacing="-0.08em"
      >
        <tspan fill={textColor}>v</tspan>
        <tspan fill="#F87316">.</tspan>
        <tspan fill={textColor}>AI</tspan>
      </text>
    </svg>
  );
}
