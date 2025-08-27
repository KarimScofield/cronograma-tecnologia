import React, { useState, useEffect, useRef } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { useJiraIntegration } from '../../hooks/useJiraIntegration';
import { JiraIssue } from '../../types/jira';

interface JiraSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSelectIssue: (issue: JiraIssue) => void;
  placeholder?: string;
}

export function JiraSearchField({ 
  value, 
  onChange, 
  onSelectIssue, 
  placeholder = "Buscar Épico ou História no JIRA..." 
}: JiraSearchFieldProps) {
  const { issues } = useJiraIntegration();
  const [searchResults, setSearchResults] = useState<JiraIssue[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Busca com debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length < 2) {
      setSearchResults([]);
      setIsOpen(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    debounceRef.current = setTimeout(() => {
      const searchTerm = value.toLowerCase();
      const results = issues
        .filter(issue => 
          issue.summary.toLowerCase().includes(searchTerm) ||
          issue.issue_id.toLowerCase().includes(searchTerm)
        )
        .slice(0, 5);
      
      setSearchResults(results);
      setIsOpen(results.length > 0);
      setIsSearching(false);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, issues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSelectIssue = (issue: JiraIssue) => {
    onChange(issue.summary);
    onSelectIssue(issue);
    setIsOpen(false);
  };

  const getIssueTypeColor = (issueType: string) => {
    switch (issueType.toLowerCase()) {
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'story': return 'bg-blue-100 text-blue-800';
      case 'task': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('concluído') || statusLower.includes('done')) {
      return 'bg-green-100 text-green-800';
    }
    if (statusLower.includes('andamento') || statusLower.includes('progress')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative" ref={searchRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Buscar Épico ou História no JIRA *
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown com resultados */}
      {isOpen && searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
          {searchResults.map((issue) => (
            <button
              key={issue.issue_id}
              onClick={() => handleSelectIssue(issue)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-blue-600">
                      {issue.issue_id}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getIssueTypeColor(issue.issue_type)}`}>
                      {issue.issue_type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-900 line-clamp-2 mb-2">
                    {issue.summary}
                  </p>
                  
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className={`inline-flex px-2 py-1 rounded-full ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                    {issue.progress > 0 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {issue.progress}% concluído
                      </span>
                    )}
                    {issue.due_date && (
                      <span>
                        Prazo: {new Date(issue.due_date).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
                
                <ExternalLink className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Estado vazio */}
      {isOpen && searchResults.length === 0 && !isSearching && value.trim().length >= 2 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-3 text-base ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-2 text-sm text-gray-500 text-center">
            Nenhum item encontrado para "{value}"
          </div>
        </div>
      )}

      <p className="mt-1 text-sm text-gray-500">
        Digite pelo menos 2 caracteres para buscar itens sincronizados do JIRA
      </p>
    </div>
  );
}