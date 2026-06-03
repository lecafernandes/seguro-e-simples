type Level = "safe" | "warn" | "danger";

export function RiskMeter({ score, level }: { score: number; level: Level }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  const color =
    level === "safe" ? "var(--safe)" : level === "warn" ? "var(--warn)" : "var(--danger)";
  const label =
    level === "safe" ? "Parece seguro" : level === "warn" ? "Atenção" : "Perigoso";

  const hint =
    level === "safe"
      ? "Quanto menor, mais seguro"
      : level === "warn"
        ? "Risco moderado de golpe"
        : "Alto risco de golpe";

  return (
    <div className="relative grid place-items-center">
      <svg width="220" height="220" viewBox="0 0 220 220" className="-rotate-90">
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke="var(--muted)"
          strokeWidth="18"
          fill="none"
        />
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke={color}
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div className="px-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Risco de golpe
          </p>
          <p className="font-display text-5xl font-extrabold text-foreground tabular-nums leading-none mt-1">
            {clamped}
            <span className="text-2xl text-muted-foreground">%</span>
          </p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wider" style={{ color }}>
            {label}
          </p>
          <p className="mt-1 text-[11px] leading-tight text-muted-foreground">
            {hint}
          </p>
        </div>
      </div>
    </div>
  );
}