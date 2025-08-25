import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Calendar, Users, Target } from 'lucide-react';
import { useRoadmap } from '../../context/RoadmapContext';
import { RoadmapItem } from '../../types';
import { FilterPanel } from '../filters/FilterPanel';
import { ItemForm } from './ItemForm';

export function DatabaseView() {
  const { filteredItems, deleteItem } = useRoadmap();
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'Engenharia': return 'bg-blue-100 text-blue-800';
      case 'Produto': return 'bg-green-100 text-green-800';
      case 'Infraestrutura': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído': return 'bg-green-100 text-green-800';
      case 'Em andamento': return 'bg-yellow-100 text-yellow-800';
      case 'A fazer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (item: RoadmapItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Base de Dados</h2>
          <p className="text-gray-600">Gerencie todos os itens do cronograma</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </button>
      </div>

      <FilterPanel />

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Área/Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progresso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fonte
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{item.nome}</div>
                      {item.comentarios && (
                        <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                          {item.comentarios}
                        </div>
                      )}
                      {item.links.length > 0 && (
                        <div className="flex items-center mt-2">
                          <ExternalLink className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">
                            {item.links.length} link(s)
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAreaColor(item.area)} mb-1`}>
                        {item.area}
                      </span>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {item.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{new Date(item.dataInicio).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{new Date(item.dataTermino).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${item.progresso}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-900">{item.progresso}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span>{item.fonte}</span>
                      {item.isManualEdit && (
                        <span className="text-xs text-blue-600 mt-1">✓ Editado manualmente</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <ItemForm
          item={editingItem}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}