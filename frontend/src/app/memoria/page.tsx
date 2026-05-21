import AlgorithmCard from '@/components/AlgorithmCard';

export default function MemoriaPage() {
  const algorithms = [
    {
      title: 'FIFO',
      description: 'Reemplaza la página que lleva más tiempo en memoria.',
      href: '/memoria/fifo',
    },
    {
      title: 'LRU (Least Recently Used)',
      description: 'Reemplaza la página que no ha sido usada por más tiempo.',
      href: '/memoria/lru',
    },
    {
      title: 'Óptimo',
      description: 'Reemplaza la página que no será usada por el mayor periodo de tiempo futuro.',
      href: '/memoria/optimo',
    },
    {
      title: 'Clock (Reloj)',
      description: 'Usa un bit de referencia para decidir qué página reemplazar de forma circular.',
      href: '/memoria/clock',
    },
    {
      title: 'LFU (Least Frequently Used)',
      description: 'Reemplaza la página que ha sido usada con menor frecuencia.',
      href: '/memoria/lfu',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">Reemplazo de Páginas</h1>
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
