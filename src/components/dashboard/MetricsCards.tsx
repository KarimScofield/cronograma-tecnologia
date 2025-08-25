import React from 'react';
import { TrendingUp, CheckCircle, Clock, AlertTriangle, BarChart3 } from 'lucide-react';

interface MetricsCardsProps {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  averageProgress: number;
  riskProjectsCount: number;
}

export function MetricsCards({
  totalProjects,
  completedProjects,
  inProgressProjects,
  averageProgress,
  riskProjectsCount
}: MetricsCardsProps) {
  const metrics = [
    {
      name: 'Total de Projetos',
      value: totalProjects.toString(),
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      name: 'Projetos Concluídos',
      value: completedProjects.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      name: 'Em Andamento',
      value: inProgressProjects.toString(),
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      name: 'Progresso Médio',
      value: `${averageProgress}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      name: 'Projetos em Risco',
      value: riskProjectsCount.toString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        
        return (
          <div
            key={metric.name}
            className={`${metric.bgColor} ${metric.borderColor} border rounded-lg p-6 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Icon className={`h-8 w-8 ${metric.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}