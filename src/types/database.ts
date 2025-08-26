export interface AreaResponsavel {
  id: string;
  nome: string;
  created_at: string;
  usage_count: number;
}

export interface TimeSquad {
  id: string;
  nome: string;
  created_at: string;
  usage_count: number;
}

export interface ItemCronograma {
  id: string;
  nome: string;
  area_id: string | null;
  time_id: string | null;
  data_inicio: string;
  data_termino: string;
  progresso: number;
  status: 'A fazer' | 'Em andamento' | 'Concluído';
  comentarios: string;
  links: string[];
  fonte: string;
  is_manual_edit: boolean;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  areas_responsaveis?: AreaResponsavel;
  times_squads?: TimeSquad;
}