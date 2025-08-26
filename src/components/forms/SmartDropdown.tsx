import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Search, X } from 'lucide-react';

interface Option {
  id: string;
  nome: string;
  usage_count: number;
}

interface SmartDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  onAddNew: (name: string) => Promise<void>;
  placeholder?: string;
  required?: boolean;
}

export function SmartDropdown({
  label,
  value,
  onChange,
  options,
  onAddNew,
  placeholder = "Selecione uma opção",
  required = false
}: SmartDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAddingNew(false);
        setSearchTerm('');
        setNewValue('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrar e ordenar opções
  const filteredOptions = React.useMemo(() => {
    let filtered = options;
    
    if (searchTerm) {
      filtered = options.filter(option =>
        option.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Separar top 5 mais usados do resto
    const sortedByUsage = [...filtered].sort((a, b) => b.usage_count - a.usage_count);
    const top5 = sortedByUsage.slice(0, 5);
    const remaining = sortedByUsage.slice(5).sort((a, b) => a.nome.localeCompare(b.nome));

    return { top5, remaining };
  }, [options, searchTerm]);

  const selectedOption = options.find(opt => opt.id === value);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleAddNew = async () => {
    if (!newValue.trim()) return;
    
    setIsLoading(true);
    try {
      await onAddNew(newValue.trim());
      setIsAddingNew(false);
      setNewValue('');
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar novo item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isAddingNew) {
      e.preventDefault();
      handleAddNew();
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      setIsAddingNew(false);
      setSearchTerm('');
      setNewValue('');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <span className="block truncate">
            {selectedOption ? selectedOption.nome : placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
            {!isAddingNew ? (
              <>
                {/* Campo de busca */}
                <div className="sticky top-0 bg-white px-3 py-2 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar..."
                      className="w-full pl-10 pr-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>

                {/* Top 5 mais usados */}
                {!searchTerm && filteredOptions.top5.length > 0 && (
                  <>
                    <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50">
                      Mais utilizados
                    </div>
                    {filteredOptions.top5.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSelect(option.id)}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between"
                      >
                        <span>{option.nome}</span>
                        <span className="text-xs text-gray-400">
                          {option.usage_count} uso{option.usage_count !== 1 ? 's' : ''}
                        </span>
                      </button>
                    ))}
                  </>
                )}

                {/* Outras opções */}
                {filteredOptions.remaining.length > 0 && (
                  <>
                    {!searchTerm && (
                      <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50">
                        Outras opções
                      </div>
                    )}
                    {filteredOptions.remaining.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSelect(option.id)}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between"
                      >
                        <span>{option.nome}</span>
                        <span className="text-xs text-gray-400">
                          {option.usage_count} uso{option.usage_count !== 1 ? 's' : ''}
                        </span>
                      </button>
                    ))}
                  </>
                )}

                {/* Nenhum resultado encontrado */}
                {searchTerm && filteredOptions.top5.length === 0 && filteredOptions.remaining.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Nenhum resultado encontrado
                  </div>
                )}

                {/* Botão adicionar novo */}
                <div className="border-t border-gray-200 mt-1">
                  <button
                    onClick={() => setIsAddingNew(true)}
                    className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar novo
                  </button>
                </div>
              </>
            ) : (
              /* Modo de adição */
              <div className="p-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder={`Digite o nome da nova ${label.toLowerCase()}`}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  <button
                    onClick={handleAddNew}
                    disabled={!newValue.trim() || isLoading}
                    className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingNew(false);
                      setNewValue('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}