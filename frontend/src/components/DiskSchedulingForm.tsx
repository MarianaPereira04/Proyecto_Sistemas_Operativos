import React, { useState } from 'react';

interface DiskSchedulingFormProps {
  onSubmit: (requests: number[], head: number, direction?: 'up' | 'down') => void;
  loading: boolean;
  needsDirection?: boolean;
}

const DiskSchedulingForm: React.FC<DiskSchedulingFormProps> = ({ onSubmit, loading, needsDirection = false }) => {
  const [requestsInput, setRequestsInput] = useState('98,183,37,122,14,124,65,67');
  const [head, setHead] = useState(53);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const parts = requestsInput.split(',').map((s) => parseInt(s.trim(), 10));
    if (parts.some(isNaN) || parts.length === 0) {
      setError('La cola de solicitudes debe contener solo números separados por comas.');
      return;
    }
    if (isNaN(head) || head < 0) {
      setError('La posición del cabezal debe ser un número válido mayor o igual a 0.');
      return;
    }
    onSubmit(parts, head, needsDirection ? direction : undefined);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">Configuración</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Cola de Solicitudes (Cilindros)
            <span className="text-gray-600 ml-2">(separadas por comas)</span>
          </label>
          <input
            type="text"
            value={requestsInput}
            onChange={(e) => setRequestsInput(e.target.value)}
            placeholder="Ej: 98,183,37,122,14,124,65,67"
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400 whitespace-nowrap">Posición Inicial del Cabezal:</label>
            <input
              type="number"
              min="0"
              value={head}
              onChange={(e) => setHead(Number(e.target.value))}
              className="w-24 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {needsDirection && (
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-400 whitespace-nowrap">Dirección:</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as 'up' | 'down')}
                className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="up">Hacia cilindros mayores (Arriba)</option>
                <option value="down">Hacia cilindros menores (Abajo)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex-1 min-w-[200px] bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded transition-colors shadow-lg shadow-green-500/20"
          >
            {loading ? 'Simulando...' : '▶ Ejecutar Simulación'}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default DiskSchedulingForm;
