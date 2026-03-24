"use client";

import { useCallback } from "react";
import { Card } from "../ui/card";
import { Counter } from "../ui/counter";
import { Badge } from "../ui/badge";
import { calcEstimates, calcTotalMeatKg, calcArrozKg } from "../../lib/calculations";
import { supabase } from "../../lib/supabase";
import type { Participants } from "../../lib/types";
import { Users, UserCheck, Beef, CookingPot } from "lucide-react";

interface ParticipantsTabProps {
  eventId: string;
  participants: Participants;
  onUpdate: (p: Participants) => void;
}

export function ParticipantsTab({ eventId, participants, onUpdate }: ParticipantsTabProps) {
  const total = participants.confirmed + participants.interested;
  const estimates = calcEstimates(total);
  const totalMeat = calcTotalMeatKg(total);
  const totalRice = calcArrozKg(total);

  const updateCount = useCallback(
    async (field: "confirmed" | "interested", value: number) => {
      const updated = { ...participants, [field]: value };
      onUpdate(updated);
      await supabase
        .from("participants")
        .update({ [field]: value })
        .eq("event_id", eventId);
    },
    [eventId, participants, onUpdate]
  );

  const stats = [
    { icon: UserCheck, label: "confirmados", value: participants.confirmed },
    { icon: Users, label: "com interesse", value: participants.interested },
    { icon: Beef, label: "total de carne", value: totalMeat },
    { icon: CookingPot, label: "arroz", value: totalRice },
  ];

  return (
    <div className="space-y-3">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-border bg-bg-surface/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-[0_8px_30px_rgb(16,185,129,0.15)]"
          >
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-teal-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 transition-transform duration-300 group-hover:scale-110">
              <s.icon size={20} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-text-primary">
              {s.value}
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Counters */}
      <Card>
        <Counter
          label="Homens confirmados"
          value={participants.confirmed}
          onChange={(v) => updateCount("confirmed", v)}
        />
        <Counter
          label="Demonstraram interesse (ainda não confirmados)"
          value={participants.interested}
          onChange={(v) => updateCount("interested", v)}
        />
        <div className="mt-3 border-t border-border pt-3 text-sm text-text-secondary">
          Calculando para{" "}
          <span className="font-medium text-text-primary">{total}</span> pessoas
          (confirmados + interesse)
        </div>
      </Card>

      {/* Estimated items */}
      <Card>
        <p className="mb-3 text-sm font-medium text-text-primary">
          Outros itens estimados
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-text-secondary">
                <th className="w-[35%] pb-2 font-medium">Item</th>
                <th className="w-[20%] pb-2 font-medium">Por pessoa</th>
                <th className="w-[20%] pb-2 font-medium">Total</th>
                <th className="w-[25%] pb-2 font-medium">Obs.</th>
              </tr>
            </thead>
            <tbody className="text-text-primary">
              <tr className="border-b border-border-subtle">
                <td className="py-2">Arroz</td>
                <td className="py-2">100g</td>
                <td className="py-2">{estimates.arroz}</td>
                <td className="py-2" />
              </tr>
              <tr className="border-b border-border-subtle">
                <td className="py-2">Feijão (feijoada)</td>
                <td className="py-2">120g cru</td>
                <td className="py-2">{estimates.feijao}</td>
                <td className="py-2">
                  <Badge variant="info">preparar antes</Badge>
                </td>
              </tr>
              <tr className="border-b border-border-subtle">
                <td className="py-2">Farofa</td>
                <td className="py-2">50g</td>
                <td className="py-2">{estimates.farofa}</td>
                <td className="py-2" />
              </tr>
              <tr className="border-b border-border-subtle">
                <td className="py-2">Refrigerante/suco</td>
                <td className="py-2">750ml</td>
                <td className="py-2">{estimates.refrigerante}</td>
                <td className="py-2" />
              </tr>
              <tr>
                <td className="py-2">Carvão</td>
                <td className="py-2">1kg/4 pess.</td>
                <td className="py-2">{estimates.carvao}</td>
                <td className="py-2" />
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
