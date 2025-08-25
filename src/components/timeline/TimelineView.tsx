import React, { useState } from 'react';
import { Calendar, Download, Share2, Flag, Plus } from 'lucide-react';
import { useRoadmap } from '../../context/RoadmapContext';
import { FilterPanel } from '../filters/FilterPanel';
import { GanttChart } from './GanttChart';
import { MilestoneForm } from './MilestoneForm';

export function TimelineView() {
  const { filteredItems, milestones } = useRoadmap();
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  
  // Calculate date range for Gantt chart
  const calculateDateRange = () => {
    if (filteredItems.length === 0) {
      // Default to current year if no items
      const now = new Date();
      const startDate = new Date(now.getFullYear(), 0, 1); // January 1st
      const endDate = new Date(now.getFullYear(), 11, 31); // December 31st
      return { startDate, endDate };
    }

    const dates = filteredItems.flatMap(item => [
      new Date(item.dataInicio),
      new Date(item.dataTermino)
    ]);
    
    const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const endDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // Add some padding
    startDate.setMonth(startDate.getMonth() - 1);
    endDate.setMonth(endDate.getMonth() + 1);
    
    return { startDate, endDate };
  };

  const { startDate, endDate } = calculateDateRange();
  
  const exportChart = () => {
    // Simulação de exportação
    alert('Funcionalidade de exportação será implementada em breve!');
  };

  const shareChart = () => {
    // Simulação de compartilhamento
    const url = `${window.location.origin}/share/roadmap-123`;
    navigator.clipboard.writeText(url);
    alert('Link copiado para a área de transferência!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cronograma</h2>
          <p className="text-gray-600">Visualização em linha do tempo dos projetos</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowMilestoneForm(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Flag className="h-4 w-4 mr-2" />
            Adicionar Marco
          </button>
          <button
            onClick={shareChart}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </button>
          <button
            onClick={exportChart}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      <FilterPanel />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                {filteredItems.length} projetos exibidos
              </span>
              <span className="text-sm text-gray-600">
                {milestones.length} marcos definidos
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-xs text-gray-500">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                Hoje
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <div className="w-3 h-3 bg-yellow-500 transform rotate-45 mr-1"></div>
                Marco
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <div className="w-4 h-2 bg-blue-600 rounded mr-1"></div>
                Progresso
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <GanttChart 
            items={filteredItems} 
            milestones={milestones}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>

      {showMilestoneForm && (
        <MilestoneForm onClose={() => setShowMilestoneForm(false)} />
      )}
    </div>
  );
}