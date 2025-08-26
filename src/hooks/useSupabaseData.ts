import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AreaResponsavel, TimeSquad, ItemCronograma } from '../types/database';

export function useSupabaseData() {
  const [areas, setAreas] = useState<AreaResponsavel[]>([]);
  const [times, setTimes] = useState<TimeSquad[]>([]);
  const [items, setItems] = useState<ItemCronograma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar áreas responsáveis
  const loadAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('areas_responsaveis')
        .select('*')
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setAreas(data || []);
    } catch (err) {
      console.error('Erro ao carregar áreas:', err);
      setError('Erro ao carregar áreas responsáveis');
    }
  };

  // Carregar times/squads
  const loadTimes = async () => {
    try {
      const { data, error } = await supabase
        .from('times_squads')
        .select('*')
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setTimes(data || []);
    } catch (err) {
      console.error('Erro ao carregar times:', err);
      setError('Erro ao carregar times/squads');
    }
  };

  // Carregar itens do cronograma
  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('itens_cronograma')
        .select(`
          *,
          areas_responsaveis (id, nome),
          times_squads (id, nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Erro ao carregar itens:', err);
      setError('Erro ao carregar itens do cronograma');
    }
  };

  // Adicionar nova área
  const addArea = async (nome: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('areas_responsaveis')
        .insert([{ nome }])
        .select()
        .single();

      if (error) throw error;
      
      await loadAreas(); // Recarregar lista
      return data.id;
    } catch (err) {
      console.error('Erro ao adicionar área:', err);
      throw new Error('Erro ao adicionar nova área');
    }
  };

  // Adicionar novo time
  const addTime = async (nome: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('times_squads')
        .insert([{ nome }])
        .select()
        .single();

      if (error) throw error;
      
      await loadTimes(); // Recarregar lista
      return data.id;
    } catch (err) {
      console.error('Erro ao adicionar time:', err);
      throw new Error('Erro ao adicionar novo time');
    }
  };

  // Adicionar item do cronograma
  const addItem = async (item: Omit<ItemCronograma, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('itens_cronograma')
        .insert([item])
        .select()
        .single();

      if (error) throw error;

      // Incrementar usage_count das áreas e times
      if (item.area_id) {
        await supabase.rpc('increment_area_usage', { area_id: item.area_id });
      }
      if (item.time_id) {
        await supabase.rpc('increment_time_usage', { time_id: item.time_id });
      }

      await Promise.all([loadItems(), loadAreas(), loadTimes()]);
      return data;
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
      throw new Error('Erro ao adicionar item do cronograma');
    }
  };

  // Atualizar item do cronograma
  const updateItem = async (id: string, updates: Partial<ItemCronograma>) => {
    try {
      const { data, error } = await supabase
        .from('itens_cronograma')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await loadItems();
      return data;
    } catch (err) {
      console.error('Erro ao atualizar item:', err);
      throw new Error('Erro ao atualizar item do cronograma');
    }
  };

  // Deletar item do cronograma
  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('itens_cronograma')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await loadItems();
    } catch (err) {
      console.error('Erro ao deletar item:', err);
      throw new Error('Erro ao deletar item do cronograma');
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([loadAreas(), loadTimes(), loadItems()]);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    areas,
    times,
    items,
    loading,
    error,
    addArea,
    addTime,
    addItem,
    updateItem,
    deleteItem,
    refreshData: () => Promise.all([loadAreas(), loadTimes(), loadItems()])
  };
}