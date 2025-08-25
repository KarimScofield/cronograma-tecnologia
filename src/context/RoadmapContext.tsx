import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { RoadmapItem, FilterOptions, NotificationAlert, Milestone, DashboardMetrics } from '../types';
import { mockRoadmapItems, mockMilestones, mockAlerts } from '../data/mockData';

interface RoadmapContextType {
  items: RoadmapItem[];
  milestones: Milestone[];
  alerts: NotificationAlert[];
  filters: FilterOptions;
  currentView: 'database' | 'timeline' | 'dashboard';
  setCurrentView: (view: 'database' | 'timeline' | 'dashboard') => void;
  addItem: (item: Omit<RoadmapItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<RoadmapItem>) => void;
  deleteItem: (id: string) => void;
  setFilters: (filters: FilterOptions) => void;
  filteredItems: RoadmapItem[];
  getDashboardMetrics: () => DashboardMetrics;
  addMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  dismissAlert: (alertId: string) => void;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export function RoadmapProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<RoadmapItem[]>(mockRoadmapItems);
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);
  const [alerts, setAlerts] = useState<NotificationAlert[]>(mockAlerts);
  const [currentView, setCurrentView] = useState<'database' | 'timeline' | 'dashboard'>('timeline');
  const [filters, setFilters] = useState<FilterOptions>({
    areas: [],
    times: [],
    status: [],
    periodo: {
      ano: new Date().getFullYear(),
      semestres: [],
      trimestres: []
    }
  });

  const addItem = useCallback((item: Omit<RoadmapItem, 'id'>) => {
    const newItem: RoadmapItem = {
      ...item,
      id: Date.now().toString(),
      isManualEdit: true
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<RoadmapItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates, isManualEdit: true }
        : item
    ));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const addMilestone = useCallback((milestone: Omit<Milestone, 'id'>) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: Date.now().toString()
    };
    setMilestones(prev => [...prev, newMilestone]);
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const areaMatch = filters.areas.length === 0 || filters.areas.includes(item.area);
      const timeMatch = filters.times.length === 0 || filters.times.includes(item.time);
      const statusMatch = filters.status.length === 0 || filters.status.includes(item.status);
      
      let periodoMatch = true;
      if (filters.periodo.semestres.length > 0 || filters.periodo.trimestres.length > 0) {
        const itemStart = new Date(item.dataInicio);
        const itemEnd = new Date(item.dataTermino);
        const itemYear = itemStart.getFullYear();
        const itemMonth = itemStart.getMonth() + 1;
        
        // Se o ano do item não corresponde ao filtro, não exibir
        if (itemYear !== filters.periodo.ano) {
          periodoMatch = false;
        } else {
          let semesterMatch = true;
          let trimesterMatch = true;
          
          if (filters.periodo.semestres.length > 0) {
            const isH1 = itemMonth <= 6;
            const isH2 = itemMonth > 6;
            semesterMatch = (filters.periodo.semestres.includes('H1') && isH1) ||
                           (filters.periodo.semestres.includes('H2') && isH2);
          }
          
          if (filters.periodo.trimestres.length > 0) {
            const quarter = Math.ceil(itemMonth / 3);
            const quarterStr = `Q${quarter}`;
            trimesterMatch = filters.periodo.trimestres.includes(quarterStr);
          }
          
          // Se ambos os filtros estão ativos, trimestre tem prioridade
          if (filters.periodo.trimestres.length > 0) {
            periodoMatch = trimesterMatch;
          } else {
            periodoMatch = semesterMatch;
          }
        }
      }
      
      return areaMatch && timeMatch && statusMatch && periodoMatch;
    });
  }, [items, filters]);

  const getDashboardMetrics = useCallback((): DashboardMetrics => {
    const alocacaoPorArea = ['Engenharia', 'Produto', 'Infraestrutura'].map(area => ({
      area,
      count: filteredItems.filter(item => item.area === area).length,
      progresso: filteredItems
        .filter(item => item.area === area)
        .reduce((acc, item) => acc + item.progresso, 0) / 
        Math.max(1, filteredItems.filter(item => item.area === area).length)
    }));

    const projetosEmRisco = filteredItems.filter(item => {
      const today = new Date();
      const startDate = new Date(item.dataInicio);
      const endDate = new Date(item.dataTermino);
      const totalDuration = endDate.getTime() - startDate.getTime();
      const elapsedTime = today.getTime() - startDate.getTime();
      const expectedProgress = Math.max(0, Math.min(100, (elapsedTime / totalDuration) * 100));
      
      return item.progresso < expectedProgress - 15 && item.status !== 'Concluído';
    });

    const entregasPorPeriodo = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      const mesAno = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      
      const entregas = filteredItems.filter(item => {
        const itemDate = new Date(item.dataTermino);
        return itemDate.getMonth() === date.getMonth() && 
               itemDate.getFullYear() === date.getFullYear();
      }).length;

      return { mes: mesAno, entregas };
    });

    return { alocacaoPorArea, projetosEmRisco, entregasPorPeriodo };
  }, [filteredItems]);

  return (
    <RoadmapContext.Provider value={{
      items,
      milestones,
      alerts,
      filters,
      currentView,
      setCurrentView,
      addItem,
      updateItem,
      deleteItem,
      setFilters,
      filteredItems,
      getDashboardMetrics,
      addMilestone,
      dismissAlert
    }}>
      {children}
    </RoadmapContext.Provider>
  );
}

export function useRoadmap() {
  const context = useContext(RoadmapContext);
  if (context === undefined) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
}