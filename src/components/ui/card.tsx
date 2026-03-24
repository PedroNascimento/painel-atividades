interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`animate-fade-in-up rounded-2xl border border-border bg-bg-surface/80 p-4 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-bg-surface sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}
