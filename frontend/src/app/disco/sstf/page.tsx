'use client';

import { useState } from 'react';
import DiskSchedulingForm from '@/components/DiskSchedulingForm';
import DiskChart from '@/components/DiskChart';
import DiskStepsTable from '@/components/DiskStepsTable';

interface DiskStep {
  from: number;
  to: number;
  distance: number;
}
interface SimResult {
  steps: DiskStep[];
  totalMovement: number;
  order: number[];
  initialHead: number;
}

export default function SstfDiskPage() {
  const [result, setResult] = useState<SimResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (requests: number[], head: number) => {
    setLoading(true); setResult(null);
    try {
      const res = await fetch('http://localhost:3015/algorithms/disco/sstf', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests, head }),
      });
      const data = await res.json();
      if (data.error) { alert(data.error); return; }
      setResult(data);
    } catch { alert('Error conectando al backend.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">SSTF Disco — Shortest Seek Time First</h1>
        <p className="text-gray-400">
          Atiende la solicitud que esté más cercana a la posición actual del cabezal, minimizando el tiempo de búsqueda en cada paso.
        </p>
      </div>
      
      <DiskSchedulingForm onSubmit={handleSubmit} loading={loading} />

      {result && (
        <div className="space-y-6">
          <div className="bg-blue-900/30 border border-blue-800 rounded-xl p-6 text-center">
            <p className="text-blue-400 text-sm font-medium uppercase tracking-wide">Movimiento Total del Cabezal</p>
            <p className="text-5xl font-bold text-blue-300 mt-2">{result.totalMovement} cilindros</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
              <div className="p-4 bg-gray-900 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Gráfico de Recorrido</h3>
              </div>
              <div className="flex-1 p-4">
                <DiskChart steps={result.steps} />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
              <div className="p-4 bg-gray-900 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Tabla de Movimientos</h3>
                <p className="text-xs text-gray-500 mt-1">En cada paso se eligió el cilindro más cercano al actual.</p>
              </div>
              <div className="flex-1 overflow-auto max-h-[500px]">
                <DiskStepsTable steps={result.steps} />
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="h-64 bg-gray-900/50 rounded-xl border border-dashed border-gray-700 flex items-center justify-center text-gray-500">
          Configura la simulación de disco y presiona Ejecutar para ver los resultados.
        </div>
      )}
    </div>
  );
}
