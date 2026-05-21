import React from 'react';

interface DiskStep {
  from: number;
  to: number;
  distance: number;
}

interface DiskChartProps {
  steps: DiskStep[];
  maxCylinder?: number;
}

const DiskChart: React.FC<DiskChartProps> = ({ steps, maxCylinder = 199 }) => {
  if (!steps || steps.length === 0) return null;

  // Find actual max cylinder used if greater than maxCylinder
  const actualMax = Math.max(maxCylinder, ...steps.map(s => Math.max(s.from, s.to)));
  
  // Height per step
  const stepHeight = 40;
  const padding = 20;
  const chartHeight = steps.length * stepHeight + padding * 2;
  const width = 100; // SVG uses 100% width

  const getX = (cylinder: number) => `${(cylinder / actualMax) * 100}%`;
  const getY = (index: number) => padding + index * stepHeight;

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 overflow-x-auto">
      <div className="min-w-[600px] relative">
        {/* X Axis Labels */}
        <div className="flex justify-between text-xs text-gray-500 mb-2 px-2">
          <span>0</span>
          <span>{Math.floor(actualMax / 2)}</span>
          <span>{actualMax}</span>
        </div>

        {/* Chart SVG */}
        <svg width="100%" height={chartHeight} className="bg-gray-900 rounded border border-gray-800">
          {/* Grid lines */}
          <line x1="0%" y1="0" x2="0%" y2="100%" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="100%" y1="0" x2="100%" y2="100%" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" />

          {/* Paths and points */}
          {steps.map((step, i) => {
            const startX = getX(step.from);
            const startY = getY(i);
            const endX = getX(step.to);
            const endY = getY(i + 1);

            return (
              <g key={i}>
                {/* Line */}
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#3b82f6" // blue-500
                  strokeWidth="2"
                  className="transition-all duration-500"
                />
                
                {/* Point Start */}
                {i === 0 && (
                  <>
                    <circle cx={startX} cy={startY} r="5" fill="#ef4444" />
                    <text x={`calc(${startX} + 8px)`} y={startY + 4} fill="#9ca3af" fontSize="10">
                      {step.from} (Inicio)
                    </text>
                  </>
                )}

                {/* Point End */}
                <circle cx={endX} cy={endY} r="4" fill="#3b82f6" />
                <text x={`calc(${endX} + 8px)`} y={endY + 4} fill="#e5e7eb" fontSize="10">
                  {step.to}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default DiskChart;
