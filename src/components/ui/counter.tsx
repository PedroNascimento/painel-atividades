"use client";

import { Minus, Plus } from "lucide-react";

interface CounterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function Counter({ label, value, onChange }: CounterProps) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="flex-1 text-sm text-text-primary">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-transparent text-text-primary transition-colors hover:bg-bg-elevated focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Diminuir ${label}`}
        >
          <Minus size={16} />
        </button>
        <span className="min-w-[32px] text-center text-base font-medium text-text-primary">
          {value}
        </span>
        <button
          onClick={() => onChange(value + 1)}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-transparent text-text-primary transition-colors hover:bg-bg-elevated focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Aumentar ${label}`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
