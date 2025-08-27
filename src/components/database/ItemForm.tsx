import React, { useState } from 'react';
import { X, Trash2, Settings, FileText } from 'lucide-react';
import { SmartDropdown } from '../forms/SmartDropdown';
import { JiraSearchField } from '../forms/JiraSearchField';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { useJiraIntegration } from '../../hooks/useJiraIntegration';
import { ItemCronograma } from '../../types/database';
import { JiraIssue } from '../../types/jira';

interface ItemFormProps {
  item?: ItemCronograma | null;
  onClose: () => void;
}

export function ItemForm({ item, onClose }: ItemFormProps) {
  const { areas, times, addArea, addTime, addItem, updateItem } = useSupabaseData();
  const { config: jiraConfig } = useJiraIntegration();
  
  const [sourceType, setSourceType] = useState<'manual' | 'jira'>('manual');
  const [formData, setFormData] = useState({
    nome: item?.nome || '',
    area_id: item?.area_id || '',
    time_id: item?.time_id || '',
    data_inicio: item?.data_inicio || '',
    data_termino: item?.data_termino || '',
    progresso: item?.progresso || 0,
    status: item?.status || 'A fazer' as const,
    comentarios: item?.comentarios || '',
    links: item?.links || [''],
    fonte: item?.fonte || 'Manual'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedJiraIssue, setSelectedJiraIssue] = useState<JiraIssue | null>(null);

  // Função para preencher dados do JIRA
  const handleJiraIssueSelect = (issue: JiraIssue) => {
    setSelectedJiraIssue(issue);
    setFormData(prev => ({
      ...prev,
      nome: issue.summary,
      data_inicio: issue.start_date || '',
      data_termino: issue.due_date || '',
      progresso: issue.progress,
      status: mapJiraStatusToLocal(issue.status),
      fonte: `JIRA - ${issue.issue_id}`
    }));
  };

  // Mapear status do JIRA para status local
  const mapJiraStatusToLocal = (jiraStatus: string): 'A fazer' | 'Em andamento' | 'Concluído' => {
    const statusLower = jiraStatus.toLowerCase();
    if (statusLower.includes('concluído') || statusLower.includes('done') || statusLower.includes('fechado')) {
      return 'Concluído';
    }
    if (statusLower.includes('andamento') || statusLower.includes('progress') || statusLower.includes('desenvolvimento')) {
      return 'Em andamento';
    }
    return 'A fazer';
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.area_id || !formData.time_id) {
      alert('Por favor, selecione uma área responsável e um time/squad.');
      return;
    }

    setIsSubmitting(true);
    try {
      const itemData = {
        nome: formData.nome,
        area_id: formData.area_id,
        time_id: formData.time_id,
        data_inicio: formData.data_inicio,
        data_termino: formData.data_termino,
        progresso: formData.progresso,
        status: formData.status,
        comentarios: formData.comentarios,
        links: formData.links.filter(link => link.trim() !== ''),
        fonte: formData.fonte,
        is_manual_edit: true
      };

      if (item) {
        await updateItem(item.id, itemData);
      } else {
        await addItem(itemData);
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      alert('Erro ao salvar item. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
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

  const handleAddArea = async (nome: string) => {
    const newAreaId = await addArea(nome);
    setFormData(prev => ({ ...prev, area_id: newAreaId }));
  };

  const handleAddTime = async (nome: string) => {
    const newTimeId = await addTime(nome);
    setFormData(prev => ({ ...prev, time_id: newTimeId }));
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
          {/* Seletor de Fonte - apenas para novos itens */}
          {!item && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Fonte do Item
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setSourceType('manual')}
                  className={`flex items-center px-4 py-2 rounded-md border transition-colors ${
                    sourceType === 'manual'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Manual
                </button>
                <button
                  type="button"
                  onClick={() => setSourceType('jira')}
                  disabled={!jiraConfig}
                  className={`flex items-center px-4 py-2 rounded-md border transition-colors ${
                    sourceType === 'jira'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } ${!jiraConfig ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  JIRA
                </button>
              </div>
              {!jiraConfig && (
                <p className="mt-2 text-sm text-gray-500">
                  Configure a integração JIRA na seção "Integrações" para usar esta opção
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo Nome - condicional baseado na fonte */}
            {sourceType === 'manual' || item ? (
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
            ) : (
              <div className="md:col-span-2">
                <JiraSearchField
                  value={formData.nome}
                  onChange={(value) => setFormData(prev => ({ ...prev, nome: value }))}
                  onSelectIssue={handleJiraIssueSelect}
                />
              </div>
            )}

            {/* Mostrar informações do item JIRA selecionado */}
            {selectedJiraIssue && sourceType === 'jira' && (
              <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Settings className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Item JIRA Selecionado: {selectedJiraIssue.issue_id}
                  </span>
                </div>
                <p className="text-sm text-blue-700">
                  Os campos abaixo foram preenchidos automaticamente, mas você pode editá-los conforme necessário.
                </p>
              </div>
            )}
            <SmartDropdown
              label="Área Responsável"
              value={formData.area_id}
              onChange={(value) => setFormData(prev => ({ ...prev, area_id: value }))}
              options={areas}
              onAddNew={handleAddArea}
              placeholder="Selecione uma área"
              required
            />

            <SmartDropdown
              label="Time/Squad"
              value={formData.time_id}
              onChange={(value) => setFormData(prev => ({ ...prev, time_id: value }))}
              options={times}
              onAddNew={handleAddTime}
              placeholder="Selecione um time"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Início *
              </label>
              <input
                type="date"
                required
                value={formData.data_inicio}
                onChange={(e) => setFormData(prev => ({ ...prev, data_inicio: e.target.value }))}
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
                value={formData.data_termino}
                onChange={(e) => setFormData(prev => ({ ...prev, data_termino: e.target.value }))}
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
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
              >
                + 
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
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                item ? 'Atualizar' : 'Criar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}