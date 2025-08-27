/*
  # Módulo de Integração JIRA - Estrutura do Banco de Dados

  1. Novas Tabelas
    - `configuracao_jira`
      - `id` (uuid, primary key)
      - `jira_url` (text)
      - `user_email` (text)
      - `api_token` (text, criptografado)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `jira_issues`
      - `issue_id` (text, primary key - ex: "EVIN-579")
      - `issue_type` (text)
      - `summary` (text)
      - `start_date` (date)
      - `due_date` (date)
      - `status` (text)
      - `progress` (integer, 0-100)
      - `last_synced_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Enable RLS em todas as tabelas
    - Políticas para operações CRUD
*/

-- Criar tabela de configuração do JIRA (apenas uma linha)
CREATE TABLE IF NOT EXISTS configuracao_jira (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jira_url text NOT NULL,
  user_email text NOT NULL,
  api_token text NOT NULL, -- Será criptografado
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de cache local dos issues do JIRA
CREATE TABLE IF NOT EXISTS jira_issues (
  issue_id text PRIMARY KEY, -- Ex: "EVIN-579"
  issue_type text NOT NULL,
  summary text NOT NULL,
  start_date date,
  due_date date,
  status text NOT NULL,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  last_synced_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE configuracao_jira ENABLE ROW LEVEL SECURITY;
ALTER TABLE jira_issues ENABLE ROW LEVEL SECURITY;

-- Políticas para configuracao_jira
CREATE POLICY "Permitir leitura de configuração JIRA"
  ON configuracao_jira
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir inserção de configuração JIRA"
  ON configuracao_jira
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de configuração JIRA"
  ON configuracao_jira
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Permitir exclusão de configuração JIRA"
  ON configuracao_jira
  FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para jira_issues
CREATE POLICY "Permitir leitura de issues JIRA"
  ON jira_issues
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir inserção de issues JIRA"
  ON jira_issues
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de issues JIRA"
  ON jira_issues
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Permitir exclusão de issues JIRA"
  ON jira_issues
  FOR DELETE
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_configuracao_jira_updated_at
  BEFORE UPDATE ON configuracao_jira
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jira_issues_updated_at
  BEFORE UPDATE ON jira_issues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Garantir que apenas uma configuração JIRA existe
CREATE UNIQUE INDEX IF NOT EXISTS single_jira_config ON configuracao_jira ((true));