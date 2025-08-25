import React from 'react';
import { PieChart } from 'lucide-react';

interface AreaAllocationData {
  area: string;
  count: number;
  progresso: number;
}

interface AreaAllocationChartProps {
  data: AreaAllocationData[];
}

export function AreaAllocationChart({ data }: AreaAllocationChartProps) {
  const total = data.reduce((acc, item) => acc + item.count, 0);
  
  const getAreaColor = (area: string) => {
    switch (area) {
      case 'Engenharia': return { bg: 'bg-blue-500', text: 'text-blue-600' };
      case 'Produto': return { bg: 'bg-green-500', text: 'text-green-600' };
      case 'Infraestrutura': return { bg: 'bg-orange-500', text: 'text-orange-600' };
      default: return { bg: 'bg-gray-500', text: 'text-gray-600' };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <PieChart className="h-5 w-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Alocação por Área</h3>
      </div>

      <div className="space-y-4">
        {data.map((item) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
          const colors = getAreaColor(item.area);
          
          return (
            <div key={item.area} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 ${colors.bg} rounded`} />
                <span className="text-sm font-medium text-gray-900">{item.area}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{item.count} projetos</div>
                  <div className="text-xs text-gray-500">{Math.round(item.progresso)}% progresso médio</div>
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className={`${colors.bg} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 w-10 text-right">{percentage}%</span>
              </div>
            </div>
          );
        })}
        
        {data.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            Nenhum projeto encontrado
          </p>
        )}
      </div>
    </div>
  );
}