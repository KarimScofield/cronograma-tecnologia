import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ConfiguracaoJira, JiraIssue, JiraSyncResult } from '../types/jira';

export function useJiraIntegration() {
  const [config, setConfig] = useState<ConfiguracaoJira | null>(null);
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar configuração do JIRA
  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracao_jira')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      setConfig(data);
    } catch (err) {
      console.error('Erro ao carregar configuração JIRA:', err);
      setError('Erro ao carregar configuração JIRA');
    }
  };

  // Carregar issues do JIRA
  const loadIssues = async () => {
    try {
      const { data, error } = await supabase
        .from('jira_issues')
        .select('*')
        .order('last_synced_at', { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (err) {
      console.error('Erro ao carregar issues JIRA:', err);
      setError('Erro ao carregar issues JIRA');
    }
  };

  // Salvar configuração do JIRA
  const saveConfig = async (configData: Omit<ConfiguracaoJira, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);

    try {
      // Criptografar o token (simulação - em produção usar crypto real)
      const encryptedToken = btoa(configData.api_token); // Base64 como exemplo

      const configToSave = {
        ...configData,
        api_token: encryptedToken
      };

      let result;
      if (config) {
        // Atualizar configuração existente
        result = await supabase
          .from('configuracao_jira')
          .update(configToSave)
          .eq('id', config.id)
          .select()
          .single();
      } else {
        // Inserir nova configuração
        result = await supabase
          .from('configuracao_jira')
          .insert([configToSave])
          .select()
          .single();
      }

      if (result.error) throw result.error;
      setConfig(result.data);
      return result.data;
    } catch (err) {
      console.error('Erro ao salvar configuração JIRA:', err);
      setError('Erro ao salvar configuração JIRA');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Testar conexão com JIRA
  const testConnection = async (configData: ConfiguracaoJira): Promise<boolean> => {
    try {
      const decryptedToken = atob(configData.api_token); // Descriptografar
      const auth = btoa(`${configData.user_email}:${decryptedToken}`);

      const response = await fetch(`${configData.jira_url}/rest/api/3/myself`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (err) {
      console.error('Erro ao testar conexão JIRA:', err);
      return false;
    }
  };

  // Sincronizar com JIRA
  const syncWithJira = async (): Promise<JiraSyncResult> => {
    if (!config) {
      return {
        success: false,
        message: 'Configuração JIRA não encontrada',
        itemsProcessed: 0
      };
    }

    setSyncing(true);
    setError(null);

    try {
      const decryptedToken = atob(config.api_token);
      const auth = btoa(`${config.user_email}:${decryptedToken}`);
      
      let allIssues: any[] = [];
      let startAt = 0;
      const maxResults = 100;
      let total = 0;

      // Buscar todos os issues com paginação
      do {
        const jql = encodeURIComponent('issuetype in (Epic, Story, Task) ORDER BY updated DESC');
        const url = `${config.jira_url}/rest/api/3/search?jql=${jql}&startAt=${startAt}&maxResults=${maxResults}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Erro na API JIRA: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        allIssues = [...allIssues, ...data.issues];
        total = data.total;
        startAt += maxResults;

      } while (startAt < total);

      // Processar cada issue
      const processedIssues = [];
      for (const issue of allIssues) {
        let progress = 0;

        // Calcular progresso para Épicos
        if (issue.fields.issuetype.name === 'Epic') {
          try {
            const childJql = encodeURIComponent(`parent = "${issue.key}"`);
            const childUrl = `${config.jira_url}/rest/api/3/search?jql=${childJql}`;

            const childResponse = await fetch(childUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });

            if (childResponse.ok) {
              const childData = await childResponse.json();
              const totalChildren = childData.total;
              const completedChildren = childData.issues.filter((child: any) => 
                child.fields.status.name.toLowerCase().includes('concluído') ||
                child.fields.status.name.toLowerCase().includes('done') ||
                child.fields.status.name.toLowerCase().includes('fechado')
              ).length;

              if (totalChildren > 0) {
                progress = Math.round((completedChildren / totalChildren) * 100);
              }
            }
          } catch (err) {
            console.warn(`Erro ao calcular progresso do épico ${issue.key}:`, err);
          }
        }

        const processedIssue = {
          issue_id: issue.key,
          issue_type: issue.fields.issuetype.name,
          summary: issue.fields.summary,
          start_date: issue.fields.customfield_10015 || null, // Campo customizado configurável
          due_date: issue.fields.duedate || null,
          status: issue.fields.status.name,
          progress,
          last_synced_at: new Date().toISOString()
        };

        processedIssues.push(processedIssue);
      }

      // Fazer upsert de todos os issues
      const { error: upsertError } = await supabase
        .from('jira_issues')
        .upsert(processedIssues, { 
          onConflict: 'issue_id',
          ignoreDuplicates: false 
        });

      if (upsertError) throw upsertError;

      // Recarregar issues
      await loadIssues();

      return {
        success: true,
        message: `Sincronização concluída. ${processedIssues.length} itens atualizados.`,
        itemsProcessed: processedIssues.length
      };

    } catch (err) {
      console.error('Erro na sincronização JIRA:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido na sincronização';
      setError(errorMessage);
      
      return {
        success: false,
        message: `Erro na sincronização: ${errorMessage}`,
        itemsProcessed: 0,
        errors: [errorMessage]
      };
    } finally {
      setSyncing(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadConfig();
    loadIssues();
  }, []);

  return {
    config,
    issues,
    loading,
    syncing,
    error,
    saveConfig,
    testConnection,
    syncWithJira,
    refreshData: () => Promise.all([loadConfig(), loadIssues()])
  };
}