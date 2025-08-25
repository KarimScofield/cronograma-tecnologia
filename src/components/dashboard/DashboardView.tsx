import React from 'react';
import { AlertTriangle, TrendingUp, Calendar, Target } from 'lucide-react';
import { useRoadmap } from '../../context/RoadmapContext';
import { MetricsCards } from './MetricsCards';
import { AreaAllocationChart } from './AreaAllocationChart';
import { RiskProjectsList } from './RiskProjectsList';
import { DeliveryChart } from './DeliveryChart';
import { FilterPanel } from '../filters/FilterPanel';

export function DashboardView() {
  const { filteredItems, getDashboardMetrics, alerts } = useRoadmap();
  const metrics = getDashboardMetrics();

  const totalProjects = filteredItems.length;
  const completedProjects = filteredItems.filter(item => item.status === 'Concluído').length;
  const inProgressProjects = filteredItems.filter(item => item.status === 'Em andamento').length;
  const averageProgress = totalProjects > 0 
    ? Math.round(filteredItems.reduce((acc, item) => acc + item.progresso, 0) / totalProjects)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Gerencial</h2>
          <p className="text-gray-600">Visão consolidada dos projetos e métricas</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Última atualização: Hoje, 08:30</span>
          {alerts.length > 0 && (
            <div className="flex items-center text-red-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {alerts.length} alertas
            </div>
          )}
        </div>
      </div>

      <FilterPanel />

      <MetricsCards
        totalProjects={totalProjects}
        completedProjects={completedProjects}
        inProgressProjects={inProgressProjects}
        averageProgress={averageProgress}
        riskProjectsCount={metrics.projetosEmRisco.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaAllocationChart data={metrics.alocacaoPorArea} />
        <DeliveryChart data={metrics.entregasPorPeriodo} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RiskProjectsList projects={metrics.projetosEmRisco} />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Alertas Recentes</h3>
          <div className="space-y-4">
            {alerts.slice(0, 3).map(alert => (
              <div key={alert.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.tipo === 'risco' ? 'bg-red-500' :
                  alert.tipo === 'prazo' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{alert.titulo}</p>
                  <p className="text-sm text-gray-500 mt-1">{alert.descricao}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(alert.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhum alerta pendente
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}