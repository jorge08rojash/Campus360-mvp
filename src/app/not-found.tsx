import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative w-24 h-24 flex items-center justify-center mb-8">
        <span className="absolute inset-0 rounded-full border-[3px] border-[#2B6477]/20" />
        <span className="absolute inset-[14px] rounded-full border-2 border-[#2B6477]/30" />
        <span className="text-2xl font-serif-brand text-[#2B6477]">404</span>
      </div>
      <h1 className="font-serif-brand text-2xl text-[#2B6477] mb-2">No encontramos esta página</h1>
      <p className="text-gray-500 text-sm max-w-sm mb-8">
        El enlace puede estar roto o la página pudo haberse movido. Revisá la dirección o volvé a tu inicio.
      </p>
      <Link
        href="/inicio"
        className="bg-[#2B6477] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#1F5567] transition-colors"
      >
        Volver a Inicio
      </Link>
    </main>
  );
}
