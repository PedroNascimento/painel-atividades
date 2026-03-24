-- ==============================================
-- Painel de Atividades — Supabase Schema
-- Rodar no SQL Editor do Supabase Dashboard
-- ==============================================

-- Tabela principal: evento
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  location TEXT,
  event_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contadores de participantes
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  confirmed INT DEFAULT 0,
  interested INT DEFAULT 0,
  UNIQUE(event_id)
);

-- Distribuição de carnes (percentuais)
CREATE TABLE IF NOT EXISTS meat_distribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  meat_type TEXT NOT NULL,
  percentage INT DEFAULT 0,
  buyer_name TEXT,
  UNIQUE(event_id, meat_type)
);

-- Comida: quem prepara o quê
CREATE TABLE IF NOT EXISTS food_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  assigned_to TEXT,
  status TEXT DEFAULT 'a definir',
  UNIQUE(event_id, item_name)
);

-- Tipo de churrasqueira
CREATE TABLE IF NOT EXISTS grill_option (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  option TEXT,
  UNIQUE(event_id)
);

-- Responsabilidades (funções)
CREATE TABLE IF NOT EXISTS responsibilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL,
  role_description TEXT,
  assigned_to TEXT,
  note TEXT,
  UNIQUE(event_id, role_name)
);

-- Checklist
CREATE TABLE IF NOT EXISTS checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0
);

-- Logística (itens + transporte)
CREATE TABLE IF NOT EXISTS logistics_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  carrier_name TEXT,
  confirmed BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0
);

-- ==============================================
-- RLS: habilitar e criar políticas públicas
-- ==============================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE meat_distribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grill_option ENABLE ROW LEVEL SECURITY;
ALTER TABLE responsibilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_items ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público (sem autenticação)
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'events', 'participants', 'meat_distribution',
    'food_assignments', 'grill_option', 'responsibilities',
    'checklist_items', 'logistics_items'
  ])
  LOOP
    EXECUTE format('CREATE POLICY "public_select" ON %I FOR SELECT USING (true)', tbl);
    EXECUTE format('CREATE POLICY "public_insert" ON %I FOR INSERT WITH CHECK (true)', tbl);
    EXECUTE format('CREATE POLICY "public_update" ON %I FOR UPDATE USING (true) WITH CHECK (true)', tbl);
    EXECUTE format('CREATE POLICY "public_delete" ON %I FOR DELETE USING (true)', tbl);
  END LOOP;
END $$;
