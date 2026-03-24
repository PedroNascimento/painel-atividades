"use client";

import { useCallback } from "react";
import { Card } from "../ui/card";
import { ProgressBar } from "../ui/progress-bar";
import { supabase } from "../../lib/supabase";
import type { ChecklistItem } from "../../lib/types";
import { Check } from "lucide-react";

interface ChecklistTabProps {
  items: ChecklistItem[];
  onUpdate: (items: ChecklistItem[]) => void;
}

export function ChecklistTab({ items, onUpdate }: ChecklistTabProps) {
  const doneCount = items.filter((i) => i.completed).length;

  const toggleItem = useCallback(
    async (itemId: string) => {
      const updated = items.map((i) =>
        i.id === itemId ? { ...i, completed: !i.completed } : i
      );
      onUpdate(updated);
      const item = items.find((i) => i.id === itemId);
      if (item) {
        await supabase
          .from("checklist_items")
          .update({ completed: !item.completed })
          .eq("id", itemId);
      }
    },
    [items, onUpdate]
  );

  return (
    <div className="space-y-3">
      <Card>
        <ProgressBar value={doneCount} max={items.length} />
      </Card>

      <Card>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-secondary">
          Organização prévia
        </p>
        <div className="divide-y divide-border-subtle">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="flex w-full cursor-pointer items-start gap-3 py-2.5 text-left transition-colors hover:bg-bg-elevated/50"
            >
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  item.completed
                    ? "border-accent bg-accent text-bg-primary"
                    : "border-border bg-transparent"
                }`}
              >
                {item.completed && <Check size={12} strokeWidth={3} />}
              </div>
              <span
                className={`text-sm leading-relaxed ${
                  item.completed
                    ? "text-text-muted line-through"
                    : "text-text-primary"
                }`}
              >
                {item.description}
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
