"use client";

import { useCallback } from "react";
import { Card } from "../ui/card";
import { supabase } from "../../lib/supabase";
import type { Responsibility } from "../../lib/types";

interface ResponsibilitiesTabProps {
  eventId: string;
  responsibilities: Responsibility[];
  onUpdate: (r: Responsibility[]) => void;
}

export function ResponsibilitiesTab({
  eventId,
  responsibilities,
  onUpdate,
}: ResponsibilitiesTabProps) {
  const updateAssignment = useCallback(
    async (roleName: string, assignedTo: string) => {
      const updated = responsibilities.map((r) =>
        r.role_name === roleName ? { ...r, assigned_to: assignedTo } : r
      );
      onUpdate(updated);
      await supabase
        .from("responsibilities")
        .update({ assigned_to: assignedTo })
        .eq("event_id", eventId)
        .eq("role_name", roleName);
    },
    [eventId, responsibilities, onUpdate]
  );

  return (
    <div className="space-y-3">
      <Card>
        <p className="mb-3 text-sm font-medium text-text-primary">
          Funções da atividade
        </p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {responsibilities.map((resp) => (
            <div
              key={resp.role_name}
              className="rounded-xl bg-bg-elevated p-3"
            >
              <p className="mb-1 text-xs text-text-secondary">
                {resp.role_description || resp.role_name}
              </p>
              <input
                type="text"
                placeholder="quem?"
                value={resp.assigned_to ?? ""}
                onChange={(e) =>
                  updateAssignment(resp.role_name, e.target.value)
                }
                className="w-full border-b border-border bg-transparent pb-0.5 text-sm font-medium text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
              />
              {resp.note && (
                <p className="mt-1.5 text-[11px] text-text-muted">
                  {resp.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
