import type { Estimates, MeatCalc } from "./types";

const GRAMS_PER_PERSON = 400;

// Quantidades por pessoa (valores em kg por multiplicação)
const PER_PERSON = {
  arroz: 0.1,       // 100g cru → ~250g cozido
  feijao: 0.12,     // 120g cru → ~300g cozido (feijoada como prato principal)
  farofa: 0.05,     // 50g
  paodeAlho: 3,     // 3 unidades por pessoa
  vinagrete: 0.06,  // 60g
};

export function calcEstimates(total: number): Estimates {
  if (total === 0) {
    return {
      arroz: "—",
      feijao: "—",
      farofa: "—",
      refrigerante: "—",
      carvao: "—",
    };
  }

  return {
    arroz: `${(Math.round(total * PER_PERSON.arroz * 10) / 10).toFixed(1)} kg`,
    feijao: `${(Math.round(total * PER_PERSON.feijao * 10) / 10).toFixed(1)} kg`,
    farofa: `${(Math.round(total * PER_PERSON.farofa * 10) / 10).toFixed(1)} kg`,
    refrigerante: `${Math.ceil(total * 0.75)} L`,
    carvao: `${Math.ceil(total / 4)} kg`,
  };
}

export function calcMeatForType(
  total: number,
  percentage: number
): MeatCalc {
  const gramsPerPerson = Math.round((GRAMS_PER_PERSON * percentage) / 100);
  const totalKg =
    total === 0 ? 0 : Math.round((total * gramsPerPerson) / 100) / 10;
  return { gramsPerPerson, totalKg };
}

export function calcTotalMeatKg(total: number): string {
  if (total === 0) return "0 kg";
  return ((Math.round(total * GRAMS_PER_PERSON / 1000 * 10) / 10)).toFixed(1) + " kg";
}

export function calcArrozKg(total: number): string {
  if (total === 0) return "0 kg";
  return (Math.round(total * PER_PERSON.arroz * 10) / 10).toFixed(1) + " kg";
}
