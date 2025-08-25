import React from 'react';
import { AlertTriangle, Calendar, TrendingDown } from 'lucide-react';
import { RoadmapItem } from '../../types';

interface RiskProjectsListProps {
  projects: RoadmapItem[];
}

export function RiskProjectsList({ projects }: RiskProjectsListProps) {
  const getAreaColor = (area: string) => {
    switch (area) {
      case 'Engenharia': return 'bg-blue-100 text-blue-800';
      case 'Produto': return 'bg-green-100 text-green-800';
      case 'Infraestrutura': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevel = (item: RoadmapItem) => {
    const today = new Date();
    const startDate = new Date(item.dataInicio);
    const endDate = new Date(item.dataTermino);
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedTime = today.getTime() - startDate.getTime();
    const expectedProgress = Math.max(0, Math.min(100, (elapsedTime / totalDuration) * 100));
    const gap = expectedProgress - item.progresso;
    
    if (gap > 30) return { level: 'Alto', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (gap > 15) return { level: 'Médio', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { level: 'Baixo', color: 'text-orange-600', bgColor: 'bg-orange-50' };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Projetos em Risco</h3>
        </div>
        <span className="text-sm text-gray-500">{projects.length} projetos</span>
      </div>

      <div className="space-y-4">
        {projects.slice(0, 5).map((project) => {
          const risk = getRiskLevel(project);
          const daysToDeadline = Math.ceil((new Date(project.dataTermino).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000));
          
          return (
            <div key={project.id} className={`${risk.bgColor} rounded-lg p-4 border border-gray-200`}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{project.nome}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAreaColor(project.area)}`}>
                      {project.area}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      <span>{project.progresso}% concluído</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {daysToDeadline > 0 
                          ? `${daysToDeadline} dias restantes`
                          : `${Math.abs(daysToDeadline)} dias em atraso`
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Progresso atual</span>
                      <span>{project.progresso}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${project.progresso}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className={`ml-4 px-2 py-1 ${risk.color} text-xs font-medium rounded`}>
                  Risco {risk.level}
                </div>
              </div>
            </div>
          );
        })}
        
        {projects.length === 0 && (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">Nenhum projeto em risco detectado</p>
            <p className="text-xs text-gray-400 mt-1">Parabéns! Todos os projetos estão no prazo</p>
          </div>
        )}
      </div>
    </div>
  );
}