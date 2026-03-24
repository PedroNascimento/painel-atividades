interface ProgressBarProps {
  value: number;
  max: number;
}

export function ProgressBar({ value, max }: ProgressBarProps) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`${value} de ${max} tarefas concluídas`}
    >
      <p className="mb-1.5 text-sm text-text-secondary" aria-hidden="true">
        {value} de {max} tarefas concluídas
      </p>
      <div className="h-2 overflow-hidden rounded-full bg-bg-elevated/50 border border-border">
        <div
          className="h-full rounded-full bg-linear-to-r from-emerald-400 to-teal-500 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
