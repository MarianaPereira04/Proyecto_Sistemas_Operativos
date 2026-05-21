'use client';

import React, { useState } from 'react';

interface PageReplacementFormProps {
  onSubmit: (pages: number[], frames: number) => void;
  loading: boolean;
}

const PageReplacementForm: React.FC<PageReplacementFormProps> = ({ onSubmit, loading }) => {
  const [pagesInput, setPagesInput] = useState('1,2,3,4,1,2,5,1,2,3,4,5');
  const [frames, setFrames] = useState(3);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const parts = pagesInput.split(',').map((s) => parseInt(s.trim(), 10));
    if (parts.some(isNaN) || parts.length === 0) {
      setError('La cadena de referencias debe contener solo números separados por comas.');
      return;
    }
    if (frames < 1 || frames > 10) {
      setError('El número de marcos debe estar entre 1 y 10.');
      return;
    }
    onSubmit(parts, frames);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">Configuración</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Cadena de Referencias de Páginas
            <span className="text-gray-600 ml-2">(separadas por comas)</span>
          </label>
          <input
            type="text"
            value={pagesInput}
            onChange={(e) => setPagesInput(e.target.value)}
            placeholder="Ej: 1,2,3,4,1,2,5"
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400 whitespace-nowrap">Número de Marcos:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={frames}
              onChange={(e) => setFrames(Number(e.target.value))}
              className="w-20 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded transition-colors shadow-lg shadow-green-500/20"
          >
            {loading ? 'Simulando...' : '▶ Ejecutar Simulación'}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default PageReplacementForm;
