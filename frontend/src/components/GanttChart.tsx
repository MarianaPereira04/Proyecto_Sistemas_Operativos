import React from 'react';

interface ExecutionStep {
  processId: string;
  startTime: number;
  endTime: number;
}

interface GanttChartProps {
  executionLog: ExecutionStep[];
}

const colors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
];

const getColorForProcess = (processId: string) => {
  // Simple hash function for color
  let hash = 0;
  for (let i = 0; i < processId.length; i++) {
    hash = processId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const GanttChart: React.FC<GanttChartProps> = ({ executionLog }) => {
  if (!executionLog || executionLog.length === 0) return null;

  const totalTime = executionLog[executionLog.length - 1].endTime;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 text-white">Diagrama de Ejecución (Gantt)</h3>
      <div className="w-full bg-gray-800 rounded-lg p-4 overflow-x-auto shadow-inner border border-gray-700">
        <div className="flex items-center min-w-max relative pb-6">
          {executionLog.map((step, index) => {
            const widthPercentage = ((step.endTime - step.startTime) / totalTime) * 100;
            // Provide a minimum width in pixels for visibility of very fast steps
            const minWidthStr = Math.max(40, widthPercentage * 5) + 'px'; 
            
            return (
              <div
                key={index}
                className={`relative h-12 flex items-center justify-center text-xs font-bold text-white border-r border-gray-900 ${getColorForProcess(
                  step.processId
                )}`}
                style={{ width: minWidthStr }}
                title={`${step.processId}: ${step.startTime} - ${step.endTime}`}
              >
                {step.processId}
                
                {/* Time markers */}
                <span className="absolute -bottom-6 -left-2 text-gray-400 text-xs">
                  {index === 0 ? step.startTime : ''}
                </span>
                <span className="absolute -bottom-6 -right-2 text-gray-400 text-xs">
                  {step.endTime}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
