import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useRoadmap } from '../../context/RoadmapContext';
import { RoadmapItem } from '../../types';

interface ItemFormProps {
  item?: RoadmapItem | null;
  onClose: () => void;
}

export function ItemForm({ item, onClose }: ItemFormProps) {
  const { addItem, updateItem } = useRoadmap();
  const [formData, setFormData] = useState({
    nome: item?.nome || '',
    area: item?.area || 'Engenharia' as const,
    time: item?.time || '',
    dataInicio: item?.dataInicio || '',
    dataTermino: item?.dataTermino || '',
    progresso: item?.progresso || 0,
    status: item?.status || 'A fazer' as const,
    comentarios: item?.comentarios || '',
    links: item?.links || [''],
    fonte: item?.fonte || 'Manual',
    swimlane: item?.swimlane || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      ...formData,
      links: formData.links.filter(link => link.trim() !== ''),
      isManualEdit: true,
      swimlane: undefined // Remove swimlane personalizada
    };

    if (item) {
      updateItem(item.id, itemData);
    } else {
      addItem(itemData);
    }
    
    onClose();
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.links];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, links: newLinks }));
  };

  const addLink = () => {
    setFormData(prev => ({ ...prev, links: [...prev.links, ''] }));
  };

  const removeLink = (index: number) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, links: newLinks }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {item ? 'Editar Item' : 'Novo Item'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Entrega *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área Responsável *
              </label>
              <select
                required
                value={formData.area}
                onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value as any }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Engenharia">Engenharia</option>
                <option value="Produto">Produto</option>
                <option value="Infraestrutura">Infraestrutura</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time/Squad *
              </label>
              <input
                type="text"
                required
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Swimlane Personalizada
              </label>
              <input
                type="text"
                value={formData.swimlane}
                onChange={(e) => setFormData(prev => ({ ...prev, swimlane: e.target.value }))}
                placeholder="Ex: Iniciativas Estratégicas Q1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Início *
              </label>
              <input
                type="date"
                required
                value={formData.dataInicio}
                onChange={(e) => setFormData(prev => ({ ...prev, dataInicio: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Término *
              </label>
              <input
                type="date"
                required
                value={formData.dataTermino}
                onChange={(e) => setFormData(prev => ({ ...prev, dataTermino: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progresso (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progresso}
                onChange={(e) => setFormData(prev => ({ ...prev, progresso: Number(e.target.value) }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="A fazer">A fazer</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentários/Insights
            </label>
            <textarea
              rows={3}
              value={formData.comentarios}
              onChange={(e) => setFormData(prev => ({ ...prev, comentarios: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Adicione contexto, observações ou insights sobre este item..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Links Úteis
            </label>
            <div className="space-y-2">
              {formData.links.map((link, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    placeholder="https://..."
                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLink}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Link
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fonte do Item
            </label>
            <input
              type="text"
              value={formData.fonte}
              onChange={(e) => setFormData(prev => ({ ...prev, fonte: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: JIRA - Projeto ABC, Manual, etc."
            />
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {item ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}