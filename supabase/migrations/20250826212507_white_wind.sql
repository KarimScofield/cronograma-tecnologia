/*
  # Funções para incrementar contadores de uso

  1. Funções
    - `increment_area_usage` - Incrementa usage_count de uma área
    - `increment_time_usage` - Incrementa usage_count de um time
*/

-- Função para incrementar usage_count de área
CREATE OR REPLACE FUNCTION increment_area_usage(area_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE areas_responsaveis 
  SET usage_count = usage_count + 1 
  WHERE id = area_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para incrementar usage_count de time
CREATE OR REPLACE FUNCTION increment_time_usage(time_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE times_squads 
  SET usage_count = usage_count + 1 
  WHERE id = time_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;