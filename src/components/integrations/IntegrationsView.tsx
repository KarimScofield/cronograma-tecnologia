import React, { useState } from 'react';
import { Settings, CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { useJiraIntegration } from '../../hooks/useJiraIntegration';

export function IntegrationsView() {
  const { 
    config, 
    loading, 
    error, 
    saveConfig, 
    testConnection 
  } = useJiraIntegration();

  const [formData, setFormData] = useState({
    jira_url: config?.jira_url || '',
    user_email: config?.user_email || '',
    api_token: config ? atob(config.api_token) : '' // Descriptografar para exibição
  });

  const [testResult, setTestResult] = useState<{
    status: 'success' | 'error' | null;
    message: string;
  }>({ status: null, message: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Atualizar form quando config carrega
  React.useEffect(() => {
    if (config) {
      setFormData({
        jira_url: config.jira_url,
        user_email: config.user_email,
        api_token: atob(config.api_token) // Descriptografar para exibição
      });
    }
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTestResult({ status: null, message: '' });

    try {
      // Salvar configuração
      const savedConfig = await saveConfig(formData);
      
      // Testar conexão imediatamente após salvar
      const connectionSuccess = await testConnection(savedConfig);
      
      if (connectionSuccess) {
        setTestResult({
          status: 'success',
          message: 'Conexão com o JIRA bem-sucedida!'
        });
      } else {
        setTestResult({
          status: 'error',
          message: 'Falha na conexão. Verifique as credenciais.'
        });
      }
    } catch (err) {
      setTestResult({
        status: 'error',
        message: 'Erro ao salvar configuração. Tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar resultado do teste quando dados mudarem
    if (testResult.status) {
      setTestResult({ status: null, message: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Integrações</h2>
          <p className="text-gray-600">Configure as integrações com ferramentas externas</p>
        </div>
        <Settings className="h-8 w-8 text-gray-400" />
      </div>

      {/* Card de Integração JIRA */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">JIRA Integration</h3>
              <p className="text-sm text-gray-500">
                Conecte com o JIRA para sincronizar projetos e tarefas automaticamente
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL do JIRA *
                </label>
                <input
                  type="url"
                  required
                  value={formData.jira_url}
                  onChange={(e) => handleInputChange('jira_url', e.target.value)}
                  placeholder="https://suaempresa.atlassian.net"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  URL base da sua instância do JIRA (ex: https://suaempresa.atlassian.net)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email do Usuário *
                </label>
                <input
                  type="email"
                  required
                  value={formData.user_email}
                  onChange={(e) => handleInputChange('user_email', e.target.value)}
                  placeholder="seu.email@empresa.com"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Email da conta JIRA que será usada para autenticação
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token da API *
                </label>
                <input
                  type="password"
                  required
                  value={formData.api_token}
                  onChange={(e) => handleInputChange('api_token', e.target.value)}
                  placeholder="Seu token de API do JIRA"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Token de API gerado no JIRA. 
                  <a 
                    href="https://id.atlassian.com/manage-profile/security/api-tokens" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 ml-1"
                  >
                    Criar token →
                  </a>
                </p>
              </div>
            </div>

            {/* Resultado do Teste */}
            {testResult.status && (
              <div className={`rounded-md p-4 ${
                testResult.status === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex">
                  {testResult.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                  <div className="ml-3">
                    <p className={`text-sm ${
                      testResult.status === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {testResult.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Salvando e Testando...
                  </>
                ) : (
                  'Salvar e Testar Conexão'
                )}
              </button>
            </div>
          </form>

          {/* Status da Configuração */}
          {config && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Configuração salva em:</span>
                <span>{new Date(config.updated_at).toLocaleString('pt-BR')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}