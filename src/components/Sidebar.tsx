import React from 'react';
import { Database, Calendar, BarChart3, Bell, Settings } from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';

export function Sidebar() {
  const { currentView, setCurrentView, alerts } = useRoadmap();
  
  const navigation = [
    { id: 'database', name: 'Base de Dados', icon: Database },
    { id: 'timeline', name: 'Cronograma', icon: Calendar },
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'integrations', name: 'Integrações', icon: Settings },
  ];

  const unreadAlerts = alerts.length;

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">RoadMap Pro</h1>
            <p className="text-sm text-gray-500">Gestão de Cronogramas</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`
                  w-full flex items-center px-3 py-2 mb-2 text-left rounded-lg transition-colors
                  ${isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </div>

        {unreadAlerts > 0 && (
          <div className="px-3 mt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-700">
                  {unreadAlerts} alertas pendentes
                </span>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Última sincronização JIRA:</p>
          <p className="font-medium">Hoje às 08:30</p>
        </div>
      </div>
    </div>
  );
}