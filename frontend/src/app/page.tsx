export default function Home() {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Bienvenido al Simulador de SO
      </h1>
      <p className="text-lg text-gray-300 mb-8 leading-relaxed">
        Esta plataforma te permite simular y visualizar el comportamiento de diferentes algoritmos
        utilizados en los Sistemas Operativos. Selecciona una categoría en el menú lateral para comenzar.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-3 text-blue-400">Procesos</h2>
          <p className="text-gray-400 text-sm">
            Simula cómo el SO asigna la CPU a los diferentes procesos.
          </p>
        </div>
        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-3 text-purple-400">Memoria</h2>
          <p className="text-gray-400 text-sm">
            Visualiza los algoritmos de reemplazo de páginas en memoria.
          </p>
        </div>
        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-3 text-green-400">Disco</h2>
          <p className="text-gray-400 text-sm">
            Analiza las estrategias de planificación de brazos de disco.
          </p>
        </div>
      </div>
    </div>
  );
}
