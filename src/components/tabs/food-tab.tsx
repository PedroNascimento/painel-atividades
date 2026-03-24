"use client";

import { useCallback } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { supabase } from "../../lib/supabase";
import type { FoodAssignment, GrillOption } from "../../lib/types";

interface FoodTabProps {
  eventId: string;
  foods: FoodAssignment[];
  grillOption: GrillOption | null;
  onUpdateFoods: (foods: FoodAssignment[]) => void;
  onUpdateGrill: (grill: GrillOption) => void;
}

export function FoodTab({
  eventId,
  foods,
  grillOption,
  onUpdateFoods,
  onUpdateGrill,
}: FoodTabProps) {
  const updateAssignment = useCallback(
    async (itemName: string, assignedTo: string) => {
      const updated = foods.map((f) =>
        f.item_name === itemName ? { ...f, assigned_to: assignedTo } : f
      );
      onUpdateFoods(updated);
      await supabase
        .from("food_assignments")
        .update({ assigned_to: assignedTo })
        .eq("event_id", eventId)
        .eq("item_name", itemName);
    },
    [eventId, foods, onUpdateFoods]
  );

  const updateGrill = useCallback(
    async (option: "tijolo" | "portatil" | "ambas") => {
      const updated = { ...grillOption!, option };
      onUpdateGrill(updated);
      await supabase
        .from("grill_option")
        .update({ option })
        .eq("event_id", eventId);
    },
    [eventId, grillOption, onUpdateGrill]
  );

  return (
    <div className="space-y-3">
      <Card>
        <p className="mb-3 text-sm font-medium text-text-primary">
          Divisão da comida — quem leva / prepara o quê
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-text-secondary">
                <th className="w-[30%] pb-2 font-medium">Item</th>
                <th className="w-[45%] pb-2 font-medium">Quem prepara / traz</th>
                <th className="w-[25%] pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food.item_name} className="border-b border-border-subtle">
                  <td className="py-2 text-text-primary">{food.item_name}</td>
                  <td className="py-2">
                    {food.item_name === "Refrigerante/sucos" ? (
                      <span className="text-xs text-text-secondary">
                        cada um traz o seu?
                      </span>
                    ) : (
                      <input
                        type="text"
                        placeholder="nome..."
                        value={food.assigned_to ?? ""}
                        onChange={(e) =>
                          updateAssignment(food.item_name, e.target.value)
                        }
                        className="w-full border-b border-border bg-transparent pb-0.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                      />
                    )}
                  </td>
                  <td className="py-2">
                    <Badge variant={food.assigned_to ? "success" : "warning"}>
                      {food.assigned_to ? "confirmado" : "a definir"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-medium text-text-primary">
          Churrasqueira disponível
        </p>
        <div className="flex flex-wrap gap-4">
          {[
            { value: "tijolo" as const, label: "Tijolo (Patriarca)" },
            { value: "portatil" as const, label: "Portátil (João tem 2)" },
            { value: "ambas" as const, label: "Ambas" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-text-primary"
            >
              <input
                type="radio"
                name="grill"
                checked={grillOption?.option === opt.value}
                onChange={() => updateGrill(opt.value)}
                className="cursor-pointer"
              />
              {opt.label}
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-text-secondary">
          Confirmar com o Patriarca antes de decidir
        </p>
      </Card>
    </div>
  );
}
