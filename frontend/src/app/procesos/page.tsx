import AlgorithmCard from '@/components/AlgorithmCard';

export default function ProcesosPage() {
  const algorithms = [
    {
      title: 'Round Robin',
      description: 'Asigna a cada proceso un intervalo de tiempo (quantum) por turnos.',
      href: '/procesos/round-robin',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">Administración de Procesos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {algorithms.map((algo) => (
          <AlgorithmCard
            key={algo.title}
            title={algo.title}
            description={algo.description}
            href={algo.href}
          />
        ))}
      </div>
    </div>
  );
}
