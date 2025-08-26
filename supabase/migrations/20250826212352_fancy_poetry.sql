/*
  # Criação das tabelas para o sistema de cronograma

  1. Novas Tabelas
    - `areas_responsaveis`
      - `id` (uuid, primary key)
      - `nome` (text, unique)
      - `created_at` (timestamp)
      - `usage_count` (integer, default 0)
    
    - `times_squads`
      - `id` (uuid, primary key)
      - `nome` (text, unique)
      - `created_at` (timestamp)
      - `usage_count` (integer, default 0)
    
    - `itens_cronograma`
      - `id` (uuid, primary key)
      - `nome` (text)
      - `area_id` (uuid, foreign key)
      - `time_id` (uuid, foreign key)
      - `data_inicio` (date)
      - `data_termino` (date)
      - `progresso` (integer, 0-100)
      - `status` (text)
      - `comentarios` (text)
      - `links` (text array)
      - `fonte` (text)
      - `is_manual_edit` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Enable RLS em todas as tabelas
    - Políticas para operações CRUD
*/

-- Criar tabela de áreas responsáveis
CREATE TABLE IF NOT EXISTS areas_responsaveis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  usage_count integer DEFAULT 0
);

-- Criar tabela de times/squads
CREATE TABLE IF NOT EXISTS times_squads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  usage_count integer DEFAULT 0
);

-- Criar tabela principal de itens do cronograma
CREATE TABLE IF NOT EXISTS itens_cronograma (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  area_id uuid REFERENCES areas_responsaveis(id) ON DELETE SET NULL,
  time_id uuid REFERENCES times_squads(id) ON DELETE SET NULL,
  data_inicio date NOT NULL,
  data_termino date NOT NULL,
  progresso integer DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
  status text DEFAULT 'A fazer' CHECK (status IN ('A fazer', 'Em andamento', 'Concluído')),
  comentarios text DEFAULT '',
  links text[] DEFAULT '{}',
  fonte text DEFAULT 'Manual',
  is_manual_edit boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE areas_responsaveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE times_squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_cronograma ENABLE ROW LEVEL SECURITY;

-- Políticas para areas_responsaveis
CREATE POLICY "Permitir leitura de áreas"
  ON areas_responsaveis
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir inserção de áreas"
  ON areas_responsaveis
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de áreas"
  ON areas_responsaveis
  FOR UPDATE
  TO authenticated
  USING (true);

-- Políticas para times_squads
CREATE POLICY "Permitir leitura de times"
  ON times_squads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir inserção de times"
  ON times_squads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de times"
  ON times_squads
  FOR UPDATE
  TO authenticated
  USING (true);

-- Políticas para itens_cronograma
CREATE POLICY "Permitir leitura de itens"
  ON itens_cronograma
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir inserção de itens"
  ON itens_cronograma
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de itens"
  ON itens_cronograma
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Permitir exclusão de itens"
  ON itens_cronograma
  FOR DELETE
  TO authenticated
  USING (true);

-- Inserir dados iniciais para áreas responsáveis
INSERT INTO areas_responsaveis (nome, usage_count) VALUES
  ('Engenharia', 3),
  ('Produto', 2),
  ('Infraestrutura', 2)
ON CONFLICT (nome) DO NOTHING;

-- Inserir dados iniciais para times/squads
INSERT INTO times_squads (nome, usage_count) VALUES
  ('Backend Squad', 1),
  ('Platform Squad', 1),
  ('UX Squad', 1),
  ('Architecture Squad', 1),
  ('Analytics Squad', 1),
  ('SRE Squad', 1)
ON CONFLICT (nome) DO NOTHING;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_itens_cronograma_updated_at
  BEFORE UPDATE ON itens_cronograma
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();