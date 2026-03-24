export interface EventData {
  id: string;
  title: string;
  subtitle: string | null;
  location: string | null;
  event_date: string;
  created_at: string;
}

export interface Participants {
  id: string;
  event_id: string;
  confirmed: number;
  interested: number;
}

export interface MeatDistribution {
  id: string;
  event_id: string;
  meat_type: "bovina" | "suina" | "frango" | "linguica";
  percentage: number;
  buyer_name: string | null;
}

export interface FoodAssignment {
  id: string;
  event_id: string;
  item_name: string;
  assigned_to: string | null;
  status: "a definir" | "confirmado";
}

export interface GrillOption {
  id: string;
  event_id: string;
  option: "tijolo" | "portatil" | "ambas" | null;
}

export interface Responsibility {
  id: string;
  event_id: string;
  role_name: string;
  role_description: string | null;
  assigned_to: string | null;
  note: string | null;
}

export interface ChecklistItem {
  id: string;
  event_id: string;
  description: string;
  completed: boolean;
  sort_order: number;
}

export interface LogisticsItem {
  id: string;
  event_id: string;
  item_name: string;
  carrier_name: string | null;
  confirmed: boolean;
  sort_order: number;
}

export interface Estimates {
  arroz: string;
  feijao: string;
  farofa: string;
  refrigerante: string;
  carvao: string;
}

export interface MeatCalc {
  gramsPerPerson: number;
  totalKg: number;
}
