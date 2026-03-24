"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type {
  EventData,
  Participants,
  MeatDistribution,
  FoodAssignment,
  GrillOption,
  Responsibility,
  ChecklistItem,
  LogisticsItem,
} from "../lib/types";
import { TabGroup } from "../components/ui/tab-group";
import { ParticipantsTab } from "../components/tabs/participants-tab";
import { MeatsTab } from "../components/tabs/meats-tab";
import { FoodTab } from "../components/tabs/food-tab";
import { ResponsibilitiesTab } from "../components/tabs/responsibilities-tab";
import { ChecklistTab } from "../components/tabs/checklist-tab";
import { LogisticsTab } from "../components/tabs/logistics-tab";
import {
  CalendarDays,
  MapPin,
  Loader2,
} from "lucide-react";

const TABS = [
  { id: "participantes", label: "Participantes" },
  { id: "carnes", label: "Carnes" },
  { id: "comida", label: "Comida" },
  { id: "responsabilidades", label: "Responsabilidades" },
  { id: "checklist", label: "Checklist" },
  { id: "logistica", label: "Logística" },
];



// Default data to seed a new event
const DEFAULT_MEATS = [
  { meat_type: "bovina", percentage: 40 },
  { meat_type: "suina", percentage: 25 },
  { meat_type: "frango", percentage: 20 },
  { meat_type: "linguica", percentage: 15 },
];

const DEFAULT_FOODS = [
  "Arroz",
  "Feijão (feijoada)",
  "Carne (churrasco)",
  "Farofa",
  "Vinagrete",
  "Pão de alho",
  "Refrigerante/sucos",
  "Sobremesa",
];

const DEFAULT_RESPONSIBILITIES = [
  {
    role_name: "Churrasqueiro",
    role_description: "🔥 Churrasqueiro principal",
    note: "quem vai cuidar da churrasqueira no dia?",
  },
  {
    role_name: "Feijoada",
    role_description: "🫘 Responsável pela feijoada",
    note: "tem que preparar na véspera",
  },
  {
    role_name: "Convite",
    role_description: "📋 Quem faz o convite / organiza",
    note: "confirmar com o grupo no WhatsApp",
  },
  {
    role_name: "Cadeiras/Mesas",
    role_description: "🪑 Transporte de cadeiras e mesas",
    note: "",
  },
  {
    role_name: "Compras",
    role_description: "🛒 Responsável pelas compras",
    note: "",
  },
  {
    role_name: "Transporte",
    role_description: "🚗 Transporte de itens e pessoas",
    note: "",
  },
];

const DEFAULT_CHECKLIST = [
  "Definir local e data com o grupo",
  "Confirmar presença dos irmãos",
  "Definir menu (tipos de carne, acompanhamentos)",
  "Dividir responsabilidades (quem compra o quê)",
  "Comprar carnes",
  "Comprar acompanhamentos e bebidas",
  "Preparar feijoada (véspera)",
  "Preparar temperos e marinadas",
  "Levar churrasqueira, carvão e acessórios",
  "Levar mesas, cadeiras e toalhas",
  "Levar pratos, talheres e copos",
  "Organizar transporte de ida e volta",
];

const DEFAULT_LOGISTICS = [
  "Churrasqueira portátil",
  "Carvão + álcool",
  "Mesas dobráveis",
  "Cadeiras",
  "Pratos e talheres",
  "Copos",
  "Panela da feijoada",
  "Recipientes de arroz/farofa",
  "Gelo + isopor",
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [participants, setParticipants] = useState<Participants>({
    id: "",
    event_id: "",
    confirmed: 0,
    interested: 0,
  });
  const [meats, setMeats] = useState<MeatDistribution[]>([]);
  const [foods, setFoods] = useState<FoodAssignment[]>([]);
  const [grillOption, setGrillOption] = useState<GrillOption | null>(null);
  const [responsibilities, setResponsibilities] = useState<Responsibility[]>(
    []
  );
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [logistics, setLogistics] = useState<LogisticsItem[]>([]);

  // Load or create the event
  useEffect(() => {
    async function init() {
      // Check for existing event
      const { data: events } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      let eventId: string;

      if (events && events.length > 0) {
        setEventData(events[0]);
        eventId = events[0].id;
      } else {
        // Seed a new event
        const { data: newEvent } = await supabase
          .from("events")
          .insert({
            title: "Churrasco + Feijoada",
            subtitle: "Atividade do Quórum",
            location: "Área de lazer / Chácara",
            event_date: "2026-03-28",
          })
          .select()
          .single();

        if (!newEvent) return;
        setEventData(newEvent);
        eventId = newEvent.id;

        // Seed participants
        await supabase
          .from("participants")
          .insert({ event_id: eventId, confirmed: 0, interested: 0 });

        // Seed meat distribution
        await supabase.from("meat_distribution").insert(
          DEFAULT_MEATS.map((m) => ({
            event_id: eventId,
            meat_type: m.meat_type,
            percentage: m.percentage,
            buyer_name: null,
          }))
        );

        // Seed food assignments
        await supabase.from("food_assignments").insert(
          DEFAULT_FOODS.map((name) => ({
            event_id: eventId,
            item_name: name,
            assigned_to: null,
            status: "a definir",
          }))
        );

        // Seed grill option
        await supabase
          .from("grill_option")
          .insert({ event_id: eventId, option: null });

        // Seed responsibilities
        await supabase.from("responsibilities").insert(
          DEFAULT_RESPONSIBILITIES.map((r) => ({
            event_id: eventId,
            role_name: r.role_name,
            role_description: r.role_description,
            assigned_to: null,
            note: r.note,
          }))
        );

        // Seed checklist
        await supabase.from("checklist_items").insert(
          DEFAULT_CHECKLIST.map((desc, i) => ({
            event_id: eventId,
            description: desc,
            completed: false,
            sort_order: i,
          }))
        );

        // Seed logistics
        await supabase.from("logistics_items").insert(
          DEFAULT_LOGISTICS.map((name, i) => ({
            event_id: eventId,
            item_name: name,
            carrier_name: null,
            confirmed: false,
            sort_order: i,
          }))
        );
      }

      // Load all data
      const [pRes, mRes, fRes, gRes, rRes, cRes, lRes] = await Promise.all([
        supabase
          .from("participants")
          .select("*")
          .eq("event_id", eventId)
          .single(),
        supabase.from("meat_distribution").select("*").eq("event_id", eventId),
        supabase.from("food_assignments").select("*").eq("event_id", eventId),
        supabase
          .from("grill_option")
          .select("*")
          .eq("event_id", eventId)
          .single(),
        supabase.from("responsibilities").select("*").eq("event_id", eventId),
        supabase
          .from("checklist_items")
          .select("*")
          .eq("event_id", eventId)
          .order("sort_order"),
        supabase
          .from("logistics_items")
          .select("*")
          .eq("event_id", eventId)
          .order("sort_order"),
      ]);

      if (pRes.data) setParticipants(pRes.data);
      if (mRes.data) setMeats(mRes.data);
      if (fRes.data) setFoods(fRes.data);
      if (gRes.data) setGrillOption(gRes.data);
      if (rRes.data) setResponsibilities(rRes.data);
      if (cRes.data) setChecklist(cRes.data);
      if (lRes.data) setLogistics(lRes.data);

      setLoading(false);
    }

    init();
  }, []);

  const totalPeople = participants.confirmed + participants.interested;

  const renderTab = useCallback(
    (activeTab: string) => {
      if (!eventData) return null;

      switch (activeTab) {
        case "participantes":
          return (
            <ParticipantsTab
              eventId={eventData.id}
              participants={participants}
              onUpdate={setParticipants}
            />
          );
        case "carnes":
          return (
            <MeatsTab
              eventId={eventData.id}
              totalPeople={totalPeople}
              meats={meats}
              onUpdate={setMeats}
            />
          );
        case "comida":
          return (
            <FoodTab
              eventId={eventData.id}
              foods={foods}
              grillOption={grillOption}
              onUpdateFoods={setFoods}
              onUpdateGrill={setGrillOption}
            />
          );
        case "responsabilidades":
          return (
            <ResponsibilitiesTab
              eventId={eventData.id}
              responsibilities={responsibilities}
              onUpdate={setResponsibilities}
            />
          );
        case "checklist":
          return (
            <ChecklistTab
              items={checklist}
              onUpdate={setChecklist}
            />
          );
        case "logistica":
          return (
            <LogisticsTab
              items={logistics}
              onUpdate={setLogistics}
            />
          );
        default:
          return null;
      }
    },
    [
      eventData,
      participants,
      totalPeople,
      meats,
      foods,
      grillOption,
      responsibilities,
      checklist,
      logistics,
    ]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-text-muted">
          Erro ao carregar evento. Tente recarregar.
        </p>
      </div>
    );
  }

  const formattedDate = new Date(eventData.event_date + "T12:00:00").toLocaleDateString(
    "pt-BR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <main className="mx-auto max-w-4xl px-4 pb-8 pt-6 sm:px-6">
      {/* Header */}
      <header className="mb-8 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-5xl">
          {eventData.title}
        </h1>
        <p className="mt-1.5 text-base font-medium text-text-secondary sm:text-xl">
          {eventData.subtitle}
        </p>
        <div className="mt-4 flex flex-wrap justify-center items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs sm:text-sm text-text-muted">
            <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {formattedDate}
          </span>
          {eventData.location && (
            <span className="flex items-center gap-1.5 text-xs sm:text-sm text-text-muted">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {eventData.location}
            </span>
          )}
        </div>
      </header>

      {/* Tabs */}
      <TabGroup tabs={TABS}>{renderTab}</TabGroup>
    </main>
  );
}
