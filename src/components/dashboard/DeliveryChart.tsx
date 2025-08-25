import React from 'react';
import { BarChart3 } from 'lucide-react';

interface DeliveryData {
  mes: string;
  entregas: number;
}

interface DeliveryChartProps {
  data: DeliveryData[];
}

export function DeliveryChart({ data }: DeliveryChartProps) {
  const maxEntregas = Math.max(...data.map(d => d.entregas), 1);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <BarChart3 className="h-5 w-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Entregas por Período</h3>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = maxEntregas > 0 ? (item.entregas / maxEntregas) * 100 : 0;
          
          return (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 text-sm font-medium text-gray-700 text-right">
                {item.mes}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-blue-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    >
                      {item.entregas > 0 && (
                        <span className="text-white text-xs font-medium">
                          {item.entregas}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900 w-8">
                    {item.entregas}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {data.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            Nenhuma entrega planejada
          </p>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total de entregas:</span>
          <span className="font-medium text-gray-900">
            {data.reduce((acc, item) => acc + item.entregas, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}