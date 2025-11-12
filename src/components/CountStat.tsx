import { useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';
import { useReducedMotion } from 'framer-motion';

interface CountStatProps {
  value: number | string;
  suffix?: string;
  label: string;
  duration?: number;
  className?: string;
  labelClassName?: string;
}

export default function CountStat({ value, suffix = '', label, duration = 1.5, className = '', labelClassName = '' }: CountStatProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (!ref.current || shouldReduce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [shouldReduce]);

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const isNumeric = !isNaN(numericValue);

  return (
    <div ref={ref} className="text-center">
      <div className={`text-3xl md:text-4xl font-bold mb-2 ${className || 'text-primary'}`}>
        {isNumeric && hasStarted && !shouldReduce ? (
          <>
            <CountUp end={numericValue} duration={duration} separator="," />
            {suffix}
          </>
        ) : (
          `${value}${suffix}`
        )}
      </div>
      <p className={`text-sm md:text-base ${labelClassName || 'text-muted-foreground'}`}>{label}</p>
    </div>
  );
}
