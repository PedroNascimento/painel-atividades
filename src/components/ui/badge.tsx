interface BadgeProps {
  variant: "warning" | "info" | "success";
  children: React.ReactNode;
}

const variants = {
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  success: "bg-accent-soft text-accent",
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
