'use client';

import { useState } from 'react';
import GanttChart from '@/components/GanttChart';

interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
}

interface SimulationResult {
  executionLog: { processId: string; startTime: number; endTime: number }[];
  processMetrics: {
    id: string;
    arrivalTime: number;
    burstTime: number;
    completionTime: number;
    waitingTime: number;
    turnaroundTime: number;
  }[];
  averages: {
    waitingTime: number;
    turnaroundTime: number;
  };
}

export default function RoundRobinPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [quantum, setQuantum] = useState<number>(2);
  const [newProcess, setNewProcess] = useState<Process>({ id: 'P1', arrivalTime: 0, burstTime: 4 });
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProcess.id && newProcess.burstTime > 0) {
      setProcesses([...processes, { ...newProcess }]);
      // Prepare next process ID
      const nextNum = processes.length + 2;
      setNewProcess({ id: `P${nextNum}`, arrivalTime: 0, burstTime: 4 });
    }
  };

  const handleRemoveProcess = (id: string) => {
    setProcesses(processes.filter((p) => p.id !== id));
  };

  const handleSimulate = async () => {
    if (processes.length === 0) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3015/algorithms/procesos/round-robin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          processes,
          quantum,
        }),
      });

      const data = await response.json();
      if (data.error || !data.averages) {
        alert(data.error || 'La respuesta del servidor no tiene el formato esperado. Asegúrate de que el backend esté actualizado y compilando correctamente.');
        return;
      }
      setResult(data);
    } catch (error) {
      console.error('Error in simulation:', error);
      alert('Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Round Robin (RR)</h1>
          <p className="text-gray-400">
            Asigna a cada proceso un intervalo de tiempo fijo (Quantum). Si el proceso no termina,
            vuelve al final de la cola.
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center space-x-4">
          <label className="text-white font-semibold">Quantum:</label>
          <input
            type="number"
            min="1"
            value={quantum}
            onChange={(e) => setQuantum(Number(e.target.value) || 1)}
            className="bg-gray-900 text-white w-20 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form and List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Añadir Proceso</h2>
            <form onSubmit={handleAddProcess} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nombre / ID</label>
                <input
                  type="text"
                  required
                  value={newProcess.id}
                  onChange={(e) => setNewProcess({ ...newProcess, id: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Llegada</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProcess.arrivalTime}
                    onChange={(e) =>
                      setNewProcess({ ...newProcess, arrivalTime: Number(e.target.value) })
                    }
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Ráfaga</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProcess.burstTime}
                    onChange={(e) =>
                      setNewProcess({ ...newProcess, burstTime: Number(e.target.value) })
                    }
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                + Añadir
              </button>
            </form>
          </div>

          {processes.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Cola de Procesos</h2>
              <div className="space-y-2 mb-6">
                {processes.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center bg-gray-900 p-3 rounded border border-gray-700"
                  >
                    <div>
                      <span className="font-bold text-blue-400 mr-2">{p.id}</span>
                      <span className="text-xs text-gray-400">
                        Llegada: {p.arrivalTime} | Ráfaga: {p.burstTime}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveProcess(p.id)}
                      className="text-red-400 hover:text-red-300 font-bold px-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSimulate}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors shadow-lg shadow-green-500/30 disabled:opacity-50"
              >
                {loading ? 'Simulando...' : '▶ Ejecutar Simulación'}
              </button>
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2">
          {result ? (
            <div className="space-y-6">
              <GanttChart executionLog={result.executionLog} />

              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-4 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Métricas Finales</h3>
                  <div className="text-sm space-x-4">
                    <span className="text-gray-400">
                      Promedio Espera:{' '}
                      <strong className="text-yellow-400">
                        {result.averages.waitingTime.toFixed(2)}
                      </strong>
                    </span>
                    <span className="text-gray-400">
                      Promedio Retorno:{' '}
                      <strong className="text-green-400">
                        {result.averages.turnaroundTime.toFixed(2)}
                      </strong>
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-gray-800 text-xs uppercase text-gray-400 border-b border-gray-700">
                      <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Llegada</th>
                        <th className="px-6 py-3">Ráfaga</th>
                        <th className="px-6 py-3">Fin</th>
                        <th className="px-6 py-3">Retorno (T)</th>
                        <th className="px-6 py-3">Espera (E)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.processMetrics.map((m, idx) => (
                        <tr
                          key={m.id}
                          className={idx % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-800'}
                        >
                          <td className="px-6 py-4 font-medium text-white">{m.id}</td>
                          <td className="px-6 py-4">{m.arrivalTime}</td>
                          <td className="px-6 py-4">{m.burstTime}</td>
                          <td className="px-6 py-4 text-blue-400 font-bold">{m.completionTime}</td>
                          <td className="px-6 py-4 text-green-400 font-bold">{m.turnaroundTime}</td>
                          <td className="px-6 py-4 text-yellow-400 font-bold">{m.waitingTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] bg-gray-900/50 rounded-xl border border-gray-800 border-dashed flex flex-col items-center justify-center text-gray-500">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p>Agrega procesos y ejecuta la simulación para ver los resultados aquí.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
