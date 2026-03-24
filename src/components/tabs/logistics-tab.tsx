"use client";

import { useCallback, useState } from "react";
import { Card } from "../ui/card";
import { supabase } from "../../lib/supabase";
import type { LogisticsItem } from "../../lib/types";
import { Check, Copy, CheckCheck } from "lucide-react";

interface LogisticsTabProps {
  items: LogisticsItem[];
  onUpdate: (items: LogisticsItem[]) => void;
}

export function LogisticsTab({ items, onUpdate }: LogisticsTabProps) {
  const [copied, setCopied] = useState(false);

  const updateCarrier = useCallback(
    async (itemId: string, carrierName: string) => {
      const updated = items.map((i) =>
        i.id === itemId ? { ...i, carrier_name: carrierName } : i
      );
      onUpdate(updated);
      await supabase
        .from("logistics_items")
        .update({ carrier_name: carrierName })
        .eq("id", itemId);
    },
    [items, onUpdate]
  );

  const toggleConfirmed = useCallback(
    async (itemId: string) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;
      const updated = items.map((i) =>
        i.id === itemId ? { ...i, confirmed: !i.confirmed } : i
      );
      onUpdate(updated);
      await supabase
        .from("logistics_items")
        .update({ confirmed: !item.confirmed })
        .eq("id", itemId);
    },
    [items, onUpdate]
  );

  const generateMessage = () => {
    const msg = `Irmãos, tudo bem? 🙏

Estamos organizando nosso Churrasco + Feijoada! 🥩🫘

Precisamos da confirmação de presença de cada um e também definir quem pode ajudar levando algum item.

Itens que precisamos:
${items.map((i) => `• ${i.item_name}${i.carrier_name ? ` → ${i.carrier_name}` : " → a definir"}`).join("\n")}

Por favor, respondam confirmando presença e o que podem levar!

Obrigado! 💪`;

    navigator.clipboard.writeText(msg).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="space-y-3">
      <Card>
        <p className="mb-3 text-sm font-medium text-text-primary">
          Itens e responsável pelo transporte
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-text-secondary">
                <th className="w-[30%] pb-2 font-medium">Item</th>
                <th className="w-[50%] pb-2 font-medium">Quem leva</th>
                <th className="w-[20%] pb-2 font-medium">OK?</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border-subtle">
                  <td className="py-2 text-text-primary">{item.item_name}</td>
                  <td className="py-2">
                    <input
                      type="text"
                      placeholder="nome..."
                      value={item.carrier_name ?? ""}
                      onChange={(e) => updateCarrier(item.id, e.target.value)}
                      className="w-full border-b border-border bg-transparent pb-0.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                    />
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => toggleConfirmed(item.id)}
                      className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                        item.confirmed
                          ? "bg-accent text-bg-primary"
                          : "border border-border bg-transparent"
                      }`}
                      aria-label={`Confirmar ${item.item_name}`}
                    >
                      {item.confirmed && <Check size={18} strokeWidth={3} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <button
            onClick={generateMessage}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-transparent px-4 py-2 text-sm text-text-primary transition-colors hover:bg-bg-elevated"
          >
            {copied ? (
              <>
                <CheckCheck size={16} className="text-accent" />
                Copiado!
              </>
            ) : (
              <>
                <Copy size={16} />
                Gerar mensagem para o grupo
              </>
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}
