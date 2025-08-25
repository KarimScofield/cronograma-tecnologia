import { RoadmapItem, Milestone, NotificationAlert } from '../types';

export const mockRoadmapItems: RoadmapItem[] = [
  {
    id: '1',
    nome: 'Sistema de Autenticação v2.0',
    area: 'Engenharia',
    time: 'Backend Squad',
    dataInicio: '2025-01-15',
    dataTermino: '2025-03-15',
    progresso: 65,
    status: 'Em andamento',
    comentarios: 'Implementação de OAuth 2.0 e melhorias de segurança. Necessário revisar integração com sistema legado.',
    links: ['https://jira.company.com/AUTH-123', 'https://confluence.company.com/auth-docs'],
    fonte: 'JIRA - Projeto AUTH',
    isManualEdit: false,
    dependencias: ['2'],
    swimlane: 'Iniciativas Estratégicas Q1'
  },
  {
    id: '2',
    nome: 'Migração de Banco de Dados',
    area: 'Infraestrutura',
    time: 'Platform Squad',
    dataInicio: '2025-01-01',
    dataTermino: '2025-02-28',
    progresso: 45,
    status: 'Em andamento',
    comentarios: 'Migração para PostgreSQL. Fase de testes em ambiente de staging concluída.',
    links: ['https://jira.company.com/INFRA-456'],
    fonte: 'JIRA - Projeto INFRA',
    isManualEdit: false,
    swimlane: 'Infraestrutura Core'
  },
  {
    id: '3',
    nome: 'Nova Interface de Usuário - Dashboard',
    area: 'Produto',
    time: 'UX Squad',
    dataInicio: '2025-02-01',
    dataTermino: '2025-04-30',
    progresso: 25,
    status: 'Em andamento',
    comentarios: 'Redesign completo do dashboard principal. Pesquisas com usuários em andamento.',
    links: ['https://figma.com/dashboard-redesign'],
    fonte: 'Manual',
    isManualEdit: true,
    swimlane: 'Experiência do Usuário'
  },
  {
    id: '4',
    nome: 'API Gateway Implementation',
    area: 'Engenharia',
    time: 'Architecture Squad',
    dataInicio: '2025-01-20',
    dataTermino: '2025-03-31',
    progresso: 80,
    status: 'Em andamento',
    comentarios: 'Kong API Gateway configurado. Falta documentação e testes de carga.',
    links: ['https://jira.company.com/ARCH-789'],
    fonte: 'JIRA - Projeto ARCH',
    isManualEdit: false,
    dependencias: ['2'],
    swimlane: 'Arquitetura'
  },
  {
    id: '5',
    nome: 'Análise de Métricas de Produto',
    area: 'Produto',
    time: 'Analytics Squad',
    dataInicio: '2025-01-10',
    dataTermino: '2025-02-15',
    progresso: 90,
    status: 'Em andamento',
    comentarios: 'Implementação do sistema de tracking. Dashboards criados no Mixpanel.',
    links: ['https://mixpanel.com/reports/product'],
    fonte: 'Manual',
    isManualEdit: true,
    swimlane: 'Dados e Analytics'
  },
  {
    id: '6',
    nome: 'Monitoramento e Alertas',
    area: 'Infraestrutura',
    time: 'SRE Squad',
    dataInicio: '2025-02-15',
    dataTermino: '2025-04-15',
    progresso: 15,
    status: 'A fazer',
    comentarios: 'Configuração do Grafana e Prometheus. Aguardando aprovação de orçamento.',
    links: ['https://jira.company.com/SRE-101'],
    fonte: 'JIRA - Projeto SRE',
  }
];

export const mockMilestones: Milestone[] = [
  {
    id: '1',
    nome: 'Release Q1 2025',
    data: '2025-03-31',
    area: 'Geral'
  },
  {
    id: '2',
    nome: 'Demo para Investidores',
    data: '2025-02-28',
    area: 'Produto'
  },
  {
    id: '3',
    nome: 'Migração Produção',
    data: '2025-03-01',
    area: 'Infraestrutura'
  }
];

export const mockAlerts: NotificationAlert[] = [
  {
    id: '1',
    tipo: 'risco',
    titulo: 'Projeto em Risco - Migração de BD',
    descricao: 'O progresso está 20% abaixo do esperado para o prazo atual.',
    itemId: '2',
    data: '2025-01-20T09:00:00Z'
  },
  {
    id: '2',
    tipo: 'prazo',
    titulo: 'Prazo Próximo - Dashboard UI',
    descricao: 'Entrega planejada em 30 dias. Revisar progresso.',
    itemId: '3',
    data: '2025-01-19T14:30:00Z'
  },
  {
    id: '3',
    tipo: 'info',
    titulo: 'Sincronização JIRA',
    descricao: '5 itens atualizados automaticamente do JIRA.',
    itemId: '',
    data: '2025-01-18T08:00:00Z'
  }
];