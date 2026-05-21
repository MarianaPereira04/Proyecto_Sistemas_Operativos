'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    label: 'Administración de Procesos',
    href: '/procesos',
    children: [{ label: 'Round Robin', href: '/procesos/round-robin' }],
  },
  {
    label: 'Reemplazo de Páginas',
    href: '/memoria',
    children: [
      { label: 'FIFO', href: '/memoria/fifo' },
      { label: 'LRU', href: '/memoria/lru' },
      { label: 'Óptimo', href: '/memoria/optimo' },
      { label: 'Clock', href: '/memoria/clock' },
      { label: 'LFU', href: '/memoria/lfu' },
    ],
  },
  {
    label: 'Planificación de Disco',
    href: '/disco',
    children: [
      { label: 'FCFS', href: '/disco/fcfs' },
      { label: 'SSTF', href: '/disco/sstf' },
      { label: 'SCAN', href: '/disco/scan' },
      { label: 'C-SCAN', href: '/disco/c-scan' },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-5 border-r border-gray-800 flex flex-col shrink-0">
      <div className="mb-8">
        <Link href="/">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            OS Simulator
          </h1>
          <p className="text-xs text-gray-500 mt-1">Algoritmos de SO</p>
        </Link>
      </div>

      <nav className="space-y-2 flex-1 overflow-y-auto">
        {navItems.map((section) => {
          const isSectionActive = pathname.startsWith(section.href);
          return (
            <div key={section.href}>
              <Link
                href={section.href}
                className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isSectionActive
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {section.label}
              </Link>
              {isSectionActive && (
                <div className="mt-1 ml-3 space-y-1 border-l border-gray-700 pl-3">
                  {section.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-2 py-1.5 rounded text-xs transition-colors ${
                        pathname === child.href
                          ? 'text-white font-semibold bg-gray-800'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
