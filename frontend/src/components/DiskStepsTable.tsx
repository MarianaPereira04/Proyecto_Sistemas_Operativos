import React from 'react';

interface DiskStep {
  from: number;
  to: number;
  distance: number;
}

interface DiskStepsTableProps {
  steps: DiskStep[];
}

const DiskStepsTable: React.FC<DiskStepsTableProps> = ({ steps }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse text-left">
        <thead>
          <tr className="bg-gray-900 text-xs uppercase text-gray-400 border-b border-gray-700">
            <th className="px-4 py-3">Paso</th>
            <th className="px-4 py-3">Cilindro Inicial (Desde)</th>
            <th className="px-4 py-3">Cilindro Destino (Hasta)</th>
            <th className="px-4 py-3 text-right">Distancia Recorrida</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-800 bg-gray-800 hover:bg-gray-750 transition-colors"
            >
              <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
              <td className="px-4 py-3 text-white">{step.from}</td>
              <td className="px-4 py-3 text-blue-400 font-bold">{step.to}</td>
              <td className="px-4 py-3 text-right text-yellow-400 font-bold">
                {step.distance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DiskStepsTable;
