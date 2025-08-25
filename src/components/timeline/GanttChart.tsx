import React from 'react';
import { RoadmapItem, Milestone } from '../../types';
import { format, differenceInDays, startOfDay, addDays } from 'date-fns';

interface GanttChartProps {
  items: RoadmapItem[];
  milestones: Milestone[];
  startDate: Date;
  endDate: Date;
}

const AREA_COLORS = {
  'Engenharia': {
    primary: 'bg-purple-600',
    light: 'bg-purple-200',
    text: 'text-purple-600',
    border: 'border-purple-600'
  },
  'Produto': {
    primary: 'bg-green-600',
    light: 'bg-green-200',
    text: 'text-green-600',
    border: 'border-green-600'
  },
  'Infraestrutura': {
    primary: 'bg-orange-600',
    light: 'bg-orange-200',
    text: 'text-orange-600',
    border: 'border-orange-600'
  }
};

export const GanttChart: React.FC<GanttChartProps> = ({ items, milestones, startDate, endDate }) => {
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const today = startOfDay(new Date());
  const todayPosition = differenceInDays(today, startDate);

  // Group items by area
  const groupedItems = items.reduce((acc, item) => {
    const area = item.area || 'Outros';
    if (!acc[area]) {
      acc[area] = [];
    }
    acc[area].push(item);
    return acc;
  }, {} as Record<string, RoadmapItem[]>);

  // Fixed order for areas
  const areaOrder = ['Engenharia', 'Produto', 'Infraestrutura'];
  const orderedAreas = areaOrder.filter(area => groupedItems[area]);

  const getItemPosition = (item: RoadmapItem) => {
    const itemStart = startOfDay(new Date(item.dataInicio));
    const itemEnd = startOfDay(new Date(item.dataTermino));
    const startPos = Math.max(0, differenceInDays(itemStart, startDate));
    const duration = differenceInDays(itemEnd, itemStart) + 1;
    const width = Math.max(3, duration); // Minimum 3 days width
    
    return {
      left: (startPos / totalDays) * 100,
      width: (width / totalDays) * 100,
      actualDuration: duration
    };
  };

  const getMilestonePosition = (milestone: Milestone) => {
    const milestoneDate = startOfDay(new Date(milestone.data));
    const position = differenceInDays(milestoneDate, startDate);
    return (position / totalDays) * 100;
  };

  const getAreaColor = (area: string) => {
    return AREA_COLORS[area as keyof typeof AREA_COLORS] || {
      primary: 'bg-gray-600',
      light: 'bg-gray-200',
      text: 'text-gray-600',
      border: 'border-gray-600'
    };
  };

  const getProgressTextColor = (progress: number) => {
    return progress > 50 ? 'text-white' : 'text-gray-800';
  };

  // Group milestones by position to handle overlapping
  const groupedMilestones = milestones.reduce((acc, milestone) => {
    const position = Math.round(getMilestonePosition(milestone));
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(milestone);
    return acc;
  }, {} as Record<number, Milestone[]>);

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Timeline Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="relative h-16">
          {/* Month headers */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: totalDays }, (_, i) => {
              const currentDate = addDays(startDate, i);
              const isFirstOfMonth = currentDate.getDate() === 1;
              const isFirstDay = i === 0;
              
              if (isFirstOfMonth || isFirstDay) {
                return (
                  <div
                    key={i}
                    className="flex-shrink-0 border-l border-gray-300 pl-2"
                    style={{ width: `${100 / totalDays}%` }}
                  >
                    <div className="text-sm font-semibold text-gray-700">
                      {format(currentDate, 'MMM yyyy')}
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="flex-shrink-0"
                  style={{ width: `${100 / totalDays}%` }}
                />
              );
            })}
          </div>
          
          {/* Week indicators */}
          <div className="absolute inset-0 top-8 flex">
            {Array.from({ length: Math.ceil(totalDays / 7) }, (_, i) => {
              const weekStart = addDays(startDate, i * 7);
              return (
                <div
                  key={i}
                  className="flex-shrink-0 border-l border-gray-200 pl-1"
                  style={{ width: `${(7 / totalDays) * 100}%` }}
                >
                  <div className="text-xs text-gray-500">
                    Sem {i + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gantt Content */}
      <div className="relative">
        {/* Today line */}
        {todayPosition >= 0 && todayPosition <= totalDays && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 opacity-80"
            style={{ left: `${(todayPosition / totalDays) * 100}%` }}
          >
            <div className="absolute -top-6 -left-8 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Hoje
            </div>
          </div>
        )}

        {/* Grid background */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: totalDays }, (_, i) => (
            <div
              key={i}
              className="flex-shrink-0 border-r border-gray-100"
              style={{ width: `${100 / totalDays}%` }}
            />
          ))}
        </div>

        {/* Swimlanes */}
        {orderedAreas.map((area, areaIndex) => {
          const areaItems = groupedItems[area];
          const areaColor = getAreaColor(area);
          const isEven = areaIndex % 2 === 0;
          
          return (
            <div
              key={area}
              className={`relative border-b border-gray-200 ${isEven ? 'bg-gray-25' : 'bg-white'}`}
              style={{ minHeight: `${Math.max(80, areaItems.length * 50 + 40)}px` }}
            >
              {/* Area header */}
              <div className="absolute left-0 top-0 w-48 h-full bg-white border-r border-gray-200 flex items-center px-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-1 h-8 ${areaColor.primary} rounded-full`} />
                  <div>
                    <div className="font-bold text-gray-800 text-sm tracking-wide uppercase">
                      {area}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="bg-gray-100 px-2 py-1 rounded-full">
                        {areaItems.length} projeto{areaItems.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div className="ml-48 relative" style={{ minHeight: '80px' }}>
                {areaItems.map((item, itemIndex) => {
                  const position = getItemPosition(item);
                  const areaColor = getAreaColor(item.area);
                  const progressTextColor = getProgressTextColor(item.progress);
                  
                  return (
                    <div
                      key={item.id}
                      className="absolute group"
                      style={{
                        top: `${20 + itemIndex * 50}px`,
                        left: `${position.left}%`,
                        width: `${position.width}%`,
                        height: '40px'
                      }}
                    >
                      {/* Task bar */}
                      <div className="relative h-full rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
                        {/* Progress background */}
                        <div className={`absolute inset-0 ${areaColor.light}`} />
                        
                        {/* Progress fill */}
                        <div
                          className={`absolute inset-y-0 left-0 ${areaColor.primary} transition-all duration-700 ease-out`}
                          style={{ width: `${item.progress}%` }}
                        />
                        
                        {/* Task content */}
                        <div className="absolute inset-0 flex items-center px-3">
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <div className={`w-2 h-2 rounded-full ${areaColor.primary} flex-shrink-0`} />
                            <span className={`text-sm font-medium truncate ${progressTextColor}`}>
                              {item.nome}
                            </span>
                            <span className={`text-xs ${progressTextColor} opacity-75 flex-shrink-0`}>
                              ({item.time})
                            </span>
                          </div>
                          <span className={`text-sm font-semibold ${progressTextColor} ml-2 flex-shrink-0`}>
                            {item.progresso}%
                          </span>
                        </div>
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${areaColor.primary}`} />
                            <span className="font-semibold">{item.nome}</span>
                          </div>
                          <div className="text-gray-300 space-y-1">
                            <div>Início: {format(new Date(item.dataInicio), 'dd/MM/yyyy')}</div>
                            <div>Fim: {format(new Date(item.dataTermino), 'dd/MM/yyyy')}</div>
                            <div>Progresso: {item.progresso}%</div>
                            <div>Time: {item.time}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Milestones */}
        {Object.entries(groupedMilestones).map(([position, milestonesAtPosition]) => {
          const positionPercent = parseFloat(position);
          
          return (
            <div
              key={position}
              className="absolute top-0 bottom-0 z-10"
              style={{ left: `${(positionPercent / totalDays) * 100}%` }}
            >
              {milestonesAtPosition.length === 1 ? (
                <div className="relative group">
                  <div className="w-4 h-4 bg-blue-600 transform rotate-45 border-2 border-white shadow-lg" />
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {milestonesAtPosition[0].nome}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="w-4 h-4 bg-blue-600 transform rotate-45 border-2 border-white shadow-lg" />
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {milestonesAtPosition.length}
                  </div>
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {milestonesAtPosition.map(m => m.nome).join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};