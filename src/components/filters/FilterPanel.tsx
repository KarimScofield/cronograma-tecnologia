import React from 'react';
import { Filter, X } from 'lucide-react';
import { useRoadmap } from '../../context/RoadmapContext';

export function FilterPanel() {
  const { filters, setFilters, items } = useRoadmap();
  
  const areas = [...new Set(items.map(item => item.area))];
  const times = [...new Set(items.map(item => item.time))];
  const statusOptions = ['A fazer', 'Em andamento', 'Concluído'];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const semestres = ['H1', 'H2'];
  const trimestres = ['Q1', 'Q2', 'Q3', 'Q4'];

  const updateFilter = (type: keyof typeof filters, value: any) => {
    setFilters({ ...filters, [type]: value });
  };

  const toggleArrayFilter = (type: 'areas' | 'times' | 'status', value: string) => {
    const current = filters[type] as string[];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFilter(type, updated);
  };

  const togglePeriodFilter = (type: 'semestres' | 'trimestres', value: string) => {
    const current = filters.periodo[type];
    
    if (type === 'semestres') {
      // Lógica para seleção de semestre
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      
      // Se selecionando um semestre, limpar trimestres conflitantes
      let updatedTrimestres = filters.periodo.trimestres;
      if (updated.includes(value)) {
        if (value === 'H1') {
          // H1 selecionado: remover Q3 e Q4 se existirem
          updatedTrimestres = updatedTrimestres.filter(q => !['Q3', 'Q4'].includes(q));
        } else if (value === 'H2') {
          // H2 selecionado: remover Q1 e Q2 se existirem
          updatedTrimestres = updatedTrimestres.filter(q => !['Q1', 'Q2'].includes(q));
        }
      }
      
      updateFilter('periodo', { 
        ...filters.periodo, 
        [type]: updated,
        trimestres: updatedTrimestres
      });
    } else {
      // Lógica para seleção de trimestre
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      
      // Se selecionando um trimestre, ajustar semestres automaticamente
      let updatedSemestres = filters.periodo.semestres;
      if (updated.includes(value)) {
        if (['Q1', 'Q2'].includes(value)) {
          // Q1 ou Q2 selecionado: remover H2 se existir
          updatedSemestres = updatedSemestres.filter(s => s !== 'H2');
        } else if (['Q3', 'Q4'].includes(value)) {
          // Q3 ou Q4 selecionado: remover H1 se existir
          updatedSemestres = updatedSemestres.filter(s => s !== 'H1');
        }
      }
      
      updateFilter('periodo', { 
        ...filters.periodo, 
        [type]: updated,
        semestres: updatedSemestres
      });
    }
  };

  // Função para verificar se um trimestre deve estar desabilitado
  const isQuarterDisabled = (quarter: string) => {
    const selectedSemestres = filters.periodo.semestres;
    if (selectedSemestres.length === 0) return false;
    
    if (selectedSemestres.includes('H1') && ['Q3', 'Q4'].includes(quarter)) {
      return true;
    }
    if (selectedSemestres.includes('H2') && ['Q1', 'Q2'].includes(quarter)) {
      return true;
    }
    return false;
  };

  // Função para verificar se um semestre deve estar desabilitado
  const isSemesterDisabled = (semester: string) => {
    const selectedTrimestres = filters.periodo.trimestres;
    if (selectedTrimestres.length === 0) return false;
    
    if (semester === 'H1' && selectedTrimestres.some(q => ['Q3', 'Q4'].includes(q))) {
      return true;
    }
    if (semester === 'H2' && selectedTrimestres.some(q => ['Q1', 'Q2'].includes(q))) {
      return true;
    }
    return false;
  };

  const clearFilters = () => {
    setFilters({
      areas: [],
      times: [],
      status: [],
      periodo: {
        ano: currentYear,
        semestres: [],
        trimestres: []
      }
    });
  };

  const hasActiveFilters = filters.areas.length > 0 || 
                          filters.times.length > 0 || 
                          filters.status.length > 0 || 
                          filters.periodo.semestres.length > 0 ||
                          filters.periodo.trimestres.length > 0;

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'Engenharia': return 'bg-blue-500 hover:bg-blue-600 border-blue-300';
      case 'Produto': return 'bg-green-500 hover:bg-green-600 border-green-300';
      case 'Infraestrutura': return 'bg-orange-500 hover:bg-orange-600 border-orange-300';
      default: return 'bg-gray-500 hover:bg-gray-600 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído': return 'bg-green-500 hover:bg-green-600 border-green-300';
      case 'Em andamento': return 'bg-yellow-500 hover:bg-yellow-600 border-yellow-300';
      case 'A fazer': return 'bg-gray-500 hover:bg-gray-600 border-gray-300';
      default: return 'bg-gray-500 hover:bg-gray-600 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar Filtros
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Filtros de Período */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Período</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ano */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Ano *</label>
              <select
                value={filters.periodo.ano}
                onChange={(e) => updateFilter('periodo', { ...filters.periodo, ano: Number(e.target.value) })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Semestres */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Semestre</label>
              <div className="flex flex-wrap gap-2">
                {semestres.map(semestre => (
                  <button
                    key={semestre}
                    onClick={() => togglePeriodFilter('semestres', semestre)}
                    disabled={isSemesterDisabled(semestre)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isSemesterDisabled(semestre)
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                        : filters.periodo.semestres.includes(semestre)
                          ? 'bg-purple-500 text-white shadow-sm'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {semestre}
                  </button>
                ))}
              </div>
            </div>

            {/* Trimestres */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Trimestre</label>
              <div className="flex flex-wrap gap-2">
                {trimestres.map(trimestre => (
                  <button
                    key={trimestre}
                    onClick={() => togglePeriodFilter('trimestres', trimestre)}
                    disabled={isQuarterDisabled(trimestre)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isQuarterDisabled(trimestre)
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                        : filters.periodo.trimestres.includes(trimestre)
                          ? 'bg-indigo-500 text-white shadow-sm'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {trimestre}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * Ano é obrigatório. Trimestre tem prioridade sobre semestre quando ambos estão selecionados.
          </p>
        </div>

        {/* Outros Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Áreas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Áreas</label>
            <div className="flex flex-wrap gap-2">
              {areas.map(area => (
                <button
                  key={area}
                  onClick={() => toggleArrayFilter('areas', area)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    filters.areas.includes(area)
                      ? `text-white shadow-sm ${getAreaColor(area)}`
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Times */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Times</label>
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {times.map(time => (
                <button
                  key={time}
                  onClick={() => toggleArrayFilter('times', time)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    filters.times.includes(time)
                      ? 'bg-blue-500 text-white shadow-sm hover:bg-blue-600'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(status => (
                <button
                  key={status}
                  onClick={() => toggleArrayFilter('status', status)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    filters.status.includes(status)
                      ? `text-white shadow-sm ${getStatusColor(status)}`
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resumo dos Filtros Ativos */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Filtros ativos:</span>
            <div className="flex flex-wrap gap-1">
              {filters.areas.length > 0 && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {filters.areas.length} área(s)
                </span>
              )}
              {filters.times.length > 0 && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  {filters.times.length} time(s)
                </span>
              )}
              {filters.status.length > 0 && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                  {filters.status.length} status
                </span>
              )}
              {(filters.periodo.semestres.length > 0 || filters.periodo.trimestres.length > 0) && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                  {filters.periodo.ano} - {filters.periodo.trimestres.length > 0 ? filters.periodo.trimestres.join(', ') : filters.periodo.semestres.join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}