'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Perfil } from '@/lib/supabase';
import { fotoDePerfil } from '@/lib/fotos';
import Avatar from '@/components/Avatar';
import { usePageTitle } from '@/lib/usePageTitle';

type Publico = 'estudiante' | 'administrativo';

const DEMO_PASSWORD = 'campus360';

const copy: Record<Publico, { titulo: string; subtitulo: string; parrafo: string; bullets: string[] }> = {
  estudiante: {
    titulo: 'Bienvenido a Campus360',
    subtitulo: 'Toda tu universidad, en un lugar.',
    parrafo:
      'Tutorías, eventos, TCU, tesis, agenda y recordatorios — todo lo que necesitás para tu vida universitaria, centralizado en un solo lugar.',
    bullets: ['Centralización de la Vida Estudiantil', 'Recordatorios y agenda personalizada', 'Asistente con IA para orientarte'],
  },
  administrativo: {
    titulo: 'Gestioná tu departamento con claridad.',
    subtitulo: 'El panel administrativo de Vida Estudiantil.',
    parrafo:
      'El panel de Campus360 te da control total sobre eventos, avisos, tutorías y métricas. Una plataforma diseñada para la excelencia administrativa.',
    bullets: ['Centralización de la Vida Estudiantil', 'Reportes y métricas en tiempo real', 'Comunicación segmentada omnicanal'],
  },
};

export default function LoginPage() {
  usePageTitle('Iniciar sesión');
  const [publico, setPublico] = useState<Publico>('estudiante');
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [errorLogin, setErrorLogin] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [verDemo, setVerDemo] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function cargarPerfiles() {
      const { data, error } = await supabase.from('perfiles').select('*').order('nombre');
      if (error) setError(error.message);
      else setPerfiles(data || []);
      setCargando(false);
    }
    cargarPerfiles();
  }, []);

  function entrarComo(perfil: Perfil) {
    localStorage.setItem('campus360_usuario', JSON.stringify(perfil));
    router.push('/bienvenida');
  }

  function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorLogin(null);
    setEnviando(true);

    setTimeout(() => {
      const perfil = perfiles.find((p) => p.correo.toLowerCase() === correo.trim().toLowerCase());
      if (!perfil) {
        setErrorLogin('No encontramos ese correo institucional. Probá con uno de los perfiles de prueba.');
        setEnviando(false);
        return;
      }
      if (clave !== DEMO_PASSWORD) {
        setErrorLogin('Contraseña incorrecta. Pista: es la contraseña de prueba de todos los perfiles demo.');
        setEnviando(false);
        return;
      }
      entrarComo(perfil);
    }, 500);
  }

  const c = copy[publico];

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo — marca + propuesta de valor */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 c360-grid-bg text-white px-14 py-12 relative overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-white" />
          </span>
          <span className="font-serif-brand text-xl font-semibold text-white">
            Campus<span className="text-white/70">360</span>
          </span>
        </div>

        <div className="max-w-md">
          <h1 className="font-serif-brand text-4xl leading-tight mb-4">{c.titulo}</h1>
          <p className="text-white/70 mb-6">{c.parrafo}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs font-medium bg-white/10 border border-white/20 px-4 py-2 rounded-full">Para estudiantes</span>
            <span className="text-xs font-medium bg-white/10 border border-white/20 px-4 py-2 rounded-full">Universidades aliadas</span>
            <span className="text-xs font-medium bg-white/10 border border-white/20 px-4 py-2 rounded-full">✨ Asistente con IA</span>
          </div>
          <ul className="space-y-2.5">
            {c.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-sm text-white/80">
                <span className="w-4 h-4 rounded-full bg-white border-2 border-white text-[#2B6477] flex items-center justify-center text-[10px] font-bold shrink-0">
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono-brand mb-2">Universidades aliadas</p>
          <p className="text-xs text-white/50">Universidad Fidélitas · Universidad Latina · ULACIT · UAM · UCIMED</p>
        </div>
      </div>

      {/* Panel derecho — acceso */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-[#E8F0E5]">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between mb-8 text-xs">
            <button
              onClick={() => setPublico(publico === 'estudiante' ? 'administrativo' : 'estudiante')}
              className="text-[#2B6477] font-medium hover:underline"
            >
              {publico === 'estudiante' ? '¿Sos Administrativo? Entrá acá' : '¿Sos Estudiante? Entrá acá'}
            </button>
            <span className="text-gray-400">Ayuda ⓘ</span>
          </div>

          <h2 className="font-serif-brand text-3xl text-[#2B6477] mb-1">Hola de nuevo</h2>
          <p className="text-gray-500 text-sm mb-8">{c.subtitulo}</p>

          {cargando && <p className="text-gray-400 text-sm">Cargando usuarios...</p>}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
              <p className="font-medium">No se pudieron cargar los perfiles</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {!cargando && !error && (
            <form onSubmit={manejarSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Correo institucional</label>
                <input
                  type="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="ejemplo@universidad.edu"
                  className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B6477]/30"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-500">Contraseña</label>
                  <button
                    type="button"
                    onClick={() => setVerDemo(true)}
                    className="text-xs text-[#2B6477] hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B6477]/30"
                />
              </div>

              {errorLogin && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errorLogin}</p>}

              <button
                type="submit"
                disabled={enviando}
                className="w-full flex items-center justify-center gap-2 bg-[#2B6477] text-white font-medium py-3 rounded-lg hover:bg-[#1F5567] transition-colors disabled:opacity-60"
              >
                {enviando ? 'Ingresando...' : <>Iniciar sesión →</>}
              </button>
            </form>
          )}

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-black/10" />
            <span className="text-[10px] text-gray-400 uppercase font-mono-brand">o continuar con</span>
            <div className="flex-1 h-px bg-black/10" />
          </div>

          <button
            disabled
            title="Disponible en la versión institucional con SSO de Microsoft Entra ID"
            className="w-full flex items-center justify-center gap-2 bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
          >
            🪟 Microsoft (SSO)
          </button>

          <button
            type="button"
            onClick={() => setVerDemo((v) => !v)}
            className="w-full text-center text-xs text-[#2B6477] hover:underline mt-5"
          >
            {verDemo ? 'Ocultar credenciales de prueba' : '¿Necesitás una cuenta demo? Ver credenciales de prueba'}
          </button>

          {verDemo && (
            <div className="mt-3 bg-white border border-black/10 rounded-xl p-4 space-y-2">
              <p className="text-[11px] text-gray-400 mb-2">
                Contraseña para todos los perfiles: <span className="font-mono-brand text-gray-600">{DEMO_PASSWORD}</span>
              </p>
              {perfiles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setCorreo(p.correo);
                    setClave(DEMO_PASSWORD);
                  }}
                  className="w-full flex items-center gap-2.5 text-left px-2.5 py-2 rounded-lg hover:bg-[#E8F0E5] transition-colors"
                >
                  <Avatar nombre={p.nombre} fotoUrl={fotoDePerfil(p.correo)} size={28} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{p.nombre}</p>
                    <p className="text-[10px] text-gray-400 truncate">{p.correo}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <p className="text-center text-[10px] text-gray-300 font-mono-brand mt-8">
            © 2026 Campus360 EdTech Systems · Universidad Fidélitas · AN-405
          </p>
        </div>
      </div>
    </div>
  );
}
