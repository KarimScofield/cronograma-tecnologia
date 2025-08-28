/*
  # Adicionar relação entre ItensCronograma e JiraIssues

  1. Modificações na Tabela
    - Adicionar coluna `jira_issue_id_fk` na tabela `itens_cronograma`
    - Criar chave estrangeira referenciando `jira_issues.issue_id`
    - Permitir valores nulos (para itens manuais)

  2. Benefícios
    - Rastreabilidade entre itens do cronograma e JIRA
    - Base para funcionalidades futuras (botão "Ver no JIRA")
    - Possibilidade de atualizações automáticas
*/

-- Adicionar coluna de relacionamento com JIRA
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'itens_cronograma' AND column_name = 'jira_issue_id_fk'
  ) THEN
    ALTER TABLE itens_cronograma 
    ADD COLUMN jira_issue_id_fk text;
  END IF;
END $$;

-- Criar chave estrangeira se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'itens_cronograma_jira_issue_fk'
  ) THEN
    ALTER TABLE itens_cronograma
    ADD CONSTRAINT itens_cronograma_jira_issue_fk
    FOREIGN KEY (jira_issue_id_fk) REFERENCES jira_issues(issue_id) ON DELETE SET NULL;
  END IF;
END $$;

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_itens_cronograma_jira_issue 
ON itens_cronograma(jira_issue_id_fk);