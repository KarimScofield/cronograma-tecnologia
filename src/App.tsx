import React from 'react';
import { RoadmapProvider } from './context/RoadmapContext';
import { Sidebar } from './components/Sidebar';
import { DatabaseView } from './components/database/DatabaseView';
import { TimelineView } from './components/timeline/TimelineView';
import { DashboardView } from './components/dashboard/DashboardView';
import { IntegrationsView } from './components/integrations/IntegrationsView';
import { useRoadmap } from './context/RoadmapContext';

function AppContent() {
  const { currentView } = useRoadmap();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'database':
        return <DatabaseView />;
      case 'timeline':
        return <TimelineView />;
      case 'dashboard':
        return <DashboardView />;
      case 'integrations':
        return <IntegrationsView />;
      default:
        return <TimelineView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {renderCurrentView()}
      </main>
    </div>
  );
}

function App() {
  return (
    <RoadmapProvider>
      <AppContent />
    </RoadmapProvider>
  );
}

export default App;