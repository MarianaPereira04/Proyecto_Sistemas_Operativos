import Link from 'next/link';

interface AlgorithmCardProps {
  title: string;
  description: string;
  href: string;
}

const AlgorithmCard = ({ title, description, href }: AlgorithmCardProps) => {
  return (
    <Link href={href} className="block group">
      <div className="p-6 h-full bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20">
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm">
          {description}
        </p>
        <div className="mt-4 flex items-center text-sm font-medium text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
          Simular <span className="ml-1">→</span>
        </div>
      </div>
    </Link>
  );
};

export default AlgorithmCard;
