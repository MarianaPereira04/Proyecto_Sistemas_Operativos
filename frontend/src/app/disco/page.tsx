import AlgorithmCard from '@/components/AlgorithmCard';

export default function DiscoPage() {
  const algorithms = [
    {
      title: 'FCFS (First-Come, First-Served)',
      description: 'Atiende las solicitudes en el orden en que llegan a la cola, sin importar la distancia.',
      href: '/disco/fcfs',
    },
    {
      title: 'SSTF (Shortest Seek Time First)',
      description: 'Atiende primero la solicitud que esté más cercana a la posición actual del cabezal.',
      href: '/disco/sstf',
    },
    {
      title: 'SCAN (Algoritmo del Ascensor)',
      description: 'El cabezal se mueve en una dirección hasta el extremo y luego atiende de regreso.',
      href: '/disco/scan',
    },
    {
      title: 'C-SCAN (Circular SCAN)',
      description: 'El cabezal se mueve hacia un extremo y salta al inicio para continuar en la misma dirección.',
      href: '/disco/c-scan',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">Planificación de Disco</h1>
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
