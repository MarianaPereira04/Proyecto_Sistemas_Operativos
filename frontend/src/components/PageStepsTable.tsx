import React from 'react';

interface PageStep {
  page: number;
  frames: (number | null)[];
  fault: boolean;
  replaced: number | null;
  extra?: Record<string, unknown>;
}

interface PageStepsTableProps {
  steps: PageStep[];
  frames: number;
  showExtra?: (step: PageStep) => React.ReactNode;
}

const PAGE_COLORS: Record<number, string> = {};
const COLOR_POOL = [
  'bg-blue-600',   'bg-purple-600', 'bg-green-600',
  'bg-yellow-600', 'bg-pink-600',   'bg-indigo-600',
  'bg-teal-600',   'bg-orange-600', 'bg-red-600',
  'bg-cyan-600',
];
let colorCounter = 0;

function getPageColor(page: number): string {
  if (PAGE_COLORS[page] === undefined) {
    PAGE_COLORS[page] = COLOR_POOL[colorCounter % COLOR_POOL.length];
    colorCounter++;
  }
  return PAGE_COLORS[page];
}

const PageStepsTable: React.FC<PageStepsTableProps> = ({ steps, frames, showExtra }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-900 text-xs uppercase text-gray-400">
            <th className="px-3 py-3 text-left border border-gray-700">Paso</th>
            <th className="px-3 py-3 text-left border border-gray-700">Página</th>
            {Array.from({ length: frames }).map((_, i) => (
              <th key={i} className="px-3 py-3 text-center border border-gray-700">
                Marco {i + 1}
              </th>
            ))}
            <th className="px-3 py-3 text-center border border-gray-700">Resultado</th>
            {showExtra && <th className="px-3 py-3 text-left border border-gray-700">Detalle</th>}
          </tr>
        </thead>
        <tbody>
          {steps.map((step, idx) => (
            <tr
              key={idx}
              className={`border-b border-gray-800 transition-colors ${
                step.fault ? 'bg-red-900/10' : 'bg-green-900/10'
              }`}
            >
              <td className="px-3 py-2 text-gray-400 border border-gray-800">{idx + 1}</td>
              <td className="px-3 py-2 border border-gray-800">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-white text-xs font-bold ${getPageColor(step.page)}`}
                >
                  {step.page}
                </span>
              </td>
              {Array.from({ length: frames }).map((_, i) => (
                <td key={i} className="px-3 py-2 text-center border border-gray-800">
                  {step.frames[i] !== null && step.frames[i] !== undefined ? (
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-white text-xs font-bold ${getPageColor(
                        step.frames[i] as number
                      )} ${
                        step.fault && step.frames[i] === step.page ? 'ring-2 ring-white' : ''
                      }`}
                    >
                      {step.frames[i]}
                    </span>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
              ))}
              <td className="px-3 py-2 text-center border border-gray-800">
                {step.fault ? (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                    FALLO
                  </span>
                ) : (
                  <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                    HIT
                  </span>
                )}
              </td>
              {showExtra && (
                <td className="px-3 py-2 text-xs text-gray-400 border border-gray-800">
                  {showExtra(step)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PageStepsTable;
