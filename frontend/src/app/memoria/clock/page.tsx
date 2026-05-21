'use client';

import { useState } from 'react';
import PageReplacementForm from '@/components/PageReplacementForm';
import PageStepsTable from '@/components/PageStepsTable';

interface PageStep {
  page: number;
  frames: (number | null)[];
  fault: boolean;
  replaced: number | null;
  extra?: { refBits: number[]; pointer: number };
}
interface SimResult {
  steps: PageStep[];
  totalFaults: number;
  totalHits: number;
  totalAccesses: number;
}

export default function ClockPage() {
  const [result, setResult] = useState<SimResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [frameCount, setFrameCount] = useState(3);

  const handleSubmit = async (pages: number[], frames: number) => {
    setLoading(true); setResult(null); setFrameCount(frames);
    try {
      const res = await fetch('http://localhost:3015/algorithms/memoria/clock', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages, frames }),
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
        <h1 className="text-3xl font-bold text-white mb-2">Clock (Segunda Oportunidad)</h1>
        <p className="text-gray-400">
          Usa un bit de referencia para dar una "segunda oportunidad" a las páginas usadas recientemente. El puntero avanza de forma circular.
        </p>
      </div>
      <PageReplacementForm onSubmit={handleSubmit} loading={loading} />
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 text-center">
              <p className="text-red-400 text-sm font-medium">Fallos de Página</p>
              <p className="text-4xl font-bold text-red-300 mt-1">{result.totalFaults}</p>
            </div>
            <div className="bg-green-900/30 border border-green-800 rounded-xl p-4 text-center">
              <p className="text-green-400 text-sm font-medium">Hits</p>
              <p className="text-4xl font-bold text-green-300 mt-1">{result.totalHits}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm font-medium">Tasa de Fallos</p>
              <p className="text-4xl font-bold text-white mt-1">
                {((result.totalFaults / result.totalAccesses) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-900 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Ejecución Paso a Paso</h3>
              <p className="text-xs text-gray-500 mt-1">El detalle muestra los bits de referencia [Marco1, Marco2, ...] y la posición donde se detuvo el puntero.</p>
            </div>
            <PageStepsTable
              steps={result.steps}
              frames={frameCount}
              showExtra={(step) => (
                <div className="flex flex-col gap-1 text-xs">
                  {step.extra && (
                    <>
                      <span className="text-gray-400">Bits: <strong className="text-white">[{step.extra.refBits.join(', ')}]</strong></span>
                      <span className="text-blue-400">Puntero en marco: {step.extra.pointer + 1}</span>
                    </>
                  )}
                  {step.replaced !== null && (
                    <span className="text-red-400 mt-1">Reemplazó: {step.replaced}</span>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      )}
      {!result && !loading && (
        <div className="h-64 bg-gray-900/50 rounded-xl border border-dashed border-gray-700 flex items-center justify-center text-gray-500">
          Configura la simulación y presiona Ejecutar para ver los resultados.
        </div>
      )}
    </div>
  );
}
