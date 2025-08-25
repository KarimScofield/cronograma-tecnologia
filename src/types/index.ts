export interface RoadmapItem {
  id: string;
  nome: string;
  area: 'Engenharia' | 'Produto' | 'Infraestrutura';
  time: string;
  dataInicio: string;
  dataTermino: string;
  progresso: number;
  status: 'A fazer' | 'Em andamento' | 'Concluído';
  comentarios: string;
  links: string[];
  fonte: string;
  isManualEdit: boolean;
  dependencias?: string[];
  swimlane?: string;
}

export interface Milestone {
  id: string;
  nome: string;
  data: string;
  area: string;
}

export interface NotificationAlert {
  id: string;
  tipo: 'risco' | 'prazo' | 'info';
  titulo: string;
  descricao: string;
  itemId: string;
  data: string;
}

export interface FilterOptions {
  areas: string[];
  times: string[];
  status: string[];
  periodo: {
    ano: number;
    semestres: string[];
    trimestres: string[];
  };
}

export interface DashboardMetrics {
  alocacaoPorArea: {
    area: string;
    count: number;
    progresso: number;
  }[];
  projetosEmRisco: RoadmapItem[];
  entregasPorPeriodo: {
    mes: string;
    entregas: number;
  }[];
}