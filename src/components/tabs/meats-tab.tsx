"use client";

import { useCallback } from "react";
import { Card } from "../ui/card";
import { calcMeatForType, calcTotalMeatKg } from "../../lib/calculations";
import { supabase } from "../../lib/supabase";
import type { MeatDistribution } from "../../lib/types";
import { AlertTriangle } from "lucide-react";

interface MeatsTabProps {
  eventId: string;
  totalPeople: number;
  meats: MeatDistribution[];
  onUpdate: (meats: MeatDistribution[]) => void;
}

const MEAT_INFO: Record<string, { name: string; sub: string }> = {
  bovina: { name: "Carne bovina", sub: "Picanha, alcatra, fraldinha..." },
  suina: { name: "Carne suína", sub: "Costelinha, lombo, pernil..." },
  frango: { name: "Frango", sub: "Coxa, sobrecoxa, asa..." },
  linguica: { name: "Linguiça", sub: "Calabresa, toscana..." },
};

export function MeatsTab({ eventId, totalPeople, meats, onUpdate }: MeatsTabProps) {
  const totalMeat = calcTotalMeatKg(totalPeople);
  const pctSum = meats.reduce((sum, m) => sum + m.percentage, 0);

  const updatePercentage = useCallback(
    async (meatType: string, percentage: number) => {
      const updated = meats.map((m) =>
        m.meat_type === meatType ? { ...m, percentage } : m
      );
      onUpdate(updated);
      await supabase
        .from("meat_distribution")
        .update({ percentage })
        .eq("event_id", eventId)
        .eq("meat_type", meatType);
    },
    [eventId, meats, onUpdate]
  );

  const updateBuyer = useCallback(
    async (meatType: string, buyerName: string) => {
      const updated = meats.map((m) =>
        m.meat_type === meatType ? { ...m, buyer_name: buyerName } : m
      );
      onUpdate(updated);
      await supabase
        .from("meat_distribution")
        .update({ buyer_name: buyerName })
        .eq("event_id", eventId)
        .eq("meat_type", meatType);
    },
    [eventId, meats, onUpdate]
  );

  return (
    <div className="space-y-3">
      <Card>
        <p className="mb-1 text-sm font-medium text-text-primary">
          Distribuição das carnes por tipo
        </p>
        <p className="mb-4 text-xs text-text-secondary">
          Ajuste o percentual de cada tipo. Total recomendado: ~400g por pessoa.
        </p>

        {/* Total bar */}
        <div className="mb-4 flex items-center justify-between rounded-xl bg-bg-elevated px-4 py-3">
          <span className="text-sm text-text-secondary">
            Total de carne estimado
          </span>
          <span className="text-xl font-medium text-text-primary">
            {totalMeat}
          </span>
        </div>

        {/* Meat sliders grid */}
        <div className="mb-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {meats.map((meat) => {
            const info = MEAT_INFO[meat.meat_type];
            const calc = calcMeatForType(totalPeople, meat.percentage);
            return (
              <div
                key={meat.meat_type}
                className="rounded-xl bg-bg-elevated p-3"
              >
                <p className="text-sm font-medium text-text-primary">
                  {info?.name}
                </p>
                <p className="mb-2 text-xs text-text-secondary">{info?.sub}</p>
                <div className="mb-1">
                  <span className="text-lg font-medium text-text-primary">
                    {calc.gramsPerPerson}g
                  </span>{" "}
                  <span className="text-xs text-text-secondary">
                    por pessoa · {calc.totalKg.toFixed(1)} kg total
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={meat.percentage}
                    onChange={(e) =>
                      updatePercentage(meat.meat_type, parseInt(e.target.value))
                    }
                    className="flex-1"
                  />
                  <span className="min-w-[36px] text-right text-xs font-medium text-text-primary">
                    {meat.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning if sum != 100% */}
        {pctSum !== 100 && (
          <div className="flex items-center gap-2 rounded-lg bg-warning-soft px-3 py-2 text-xs text-warning">
            <AlertTriangle size={14} />
            <span>
              Atenção: a soma dos percentuais é {pctSum}% (deve ser 100%)
            </span>
          </div>
        )}

        {/* Buyer table */}
        <div className="mt-4 border-t border-border pt-3">
          <p className="mb-2 text-xs text-text-secondary">
            Responsável pela compra de cada tipo
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-text-secondary">
                  <th className="w-[30%] pb-2 font-medium">Tipo</th>
                  <th className="w-[45%] pb-2 font-medium">Quem compra / leva</th>
                  <th className="w-[25%] pb-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {meats.map((meat) => {
                  const info = MEAT_INFO[meat.meat_type];
                  const calc = calcMeatForType(totalPeople, meat.percentage);
                  return (
                    <tr key={meat.meat_type} className="border-b border-border-subtle">
                      <td className="py-2 text-text-primary">{info?.name}</td>
                      <td className="py-2">
                        <input
                          type="text"
                          placeholder="nome..."
                          value={meat.buyer_name ?? ""}
                          onChange={(e) => updateBuyer(meat.meat_type, e.target.value)}
                          className="w-full border-b border-border bg-transparent pb-0.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                        />
                      </td>
                      <td className="py-2 text-sm text-text-primary">
                        {totalPeople === 0 ? "—" : calc.totalKg.toFixed(1) + " kg"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
