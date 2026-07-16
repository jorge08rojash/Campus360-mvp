'use client';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-2xl mb-6">⚠️</div>
      <h1 className="font-serif-brand text-2xl text-[#2B6477] mb-2">Algo no salió bien</h1>
      <p className="text-gray-500 text-sm max-w-sm mb-8">
        Tuvimos un problema al cargar esta pantalla. Podés intentar de nuevo — si sigue pasando, avisale a soporte.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-[#2B6477] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#1F5567] transition-colors"
        >
          Reintentar
        </button>
        <a
          href="/inicio"
          className="border border-gray-200 text-gray-600 text-sm font-medium px-6 py-2.5 rounded-lg hover:border-[#2B6477] hover:text-[#2B6477] transition-colors"
        >
          Ir a Inicio
        </a>
      </div>
    </main>
  );
}
