'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Perfil } from '@/lib/supabase';
import { usePageTitle } from '@/lib/usePageTitle';

const DEMO_PASSWORD = 'campus360';

export default function LoginPage() {
  usePageTitle('Iniciar sesión');
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [correo, setCorreo] = useState('andres.rojas@ufidelitas.ac.cr');
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
    router.push('/inicio');
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
    }, 400);
  }

  return (
    <div className="flex h-dvh flex-col justify-center gap-4 bg-[#152238] p-8 box-border font-['Plus_Jakarta_Sans',sans-serif] text-[#F6F1E8]">
      <div className="mb-2">
        <div className="font-['Space_Grotesk',sans-serif] text-[22px] font-bold">Iniciar sesión</div>
        <div className="mt-1 text-[12.5px] text-[#F6F1E8]/60">Universidad Fidélitas · Costa Rica</div>
      </div>

      {cargando && <p className="text-sm text-[#F6F1E8]/50">Cargando usuarios...</p>}
      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          <p className="font-medium">No se pudieron cargar los perfiles</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {!cargando && !error && (
        <form onSubmit={manejarSubmit} className="flex flex-col gap-4">
          <div>
            <div className="mb-1.5 text-xs font-semibold text-[#F6F1E8]/60">Correo institucional</div>
            <input
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="ejemplo@ufidelitas.ac.cr"
              className="w-full rounded-2xl border border-white/10 bg-[#1D2E4A] px-3.5 py-3 text-sm text-[#F6F1E8] outline-none box-border"
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-xs font-semibold text-[#F6F1E8]/60">Contraseña</span>
              <span className="text-[11.5px] font-semibold text-[#F4C93F]">¿Olvidaste tu contraseña?</span>
            </div>
            <input
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-2xl border border-white/10 bg-[#1D2E4A] px-3.5 py-3 text-sm text-[#F6F1E8] outline-none box-border"
            />
          </div>

          {errorLogin && <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-300">{errorLogin}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="mt-1.5 w-full rounded-full bg-[#F4C93F] py-[15px] text-[14.5px] font-bold text-[#152238] disabled:opacity-60"
          >
            {enviando ? 'Ingresando...' : 'Iniciar sesión →'}
          </button>
        </form>
      )}

      <div className="my-2 flex items-center gap-2.5">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] font-bold tracking-[0.06em] text-[#F6F1E8]/40">O CONTINUAR CON</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <button
        type="button"
        disabled
        title="Disponible en la versión institucional con SSO de Microsoft Entra ID"
        className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#1D2E4A] py-3.5 text-[13.5px] font-semibold text-[#F6F1E8]/40"
      >
        <svg width="15" height="15" viewBox="0 0 23 23">
          <rect x="1" y="1" width="10" height="10" fill="#F35325" />
          <rect x="12" y="1" width="10" height="10" fill="#81BC06" />
          <rect x="1" y="12" width="10" height="10" fill="#05A6F0" />
          <rect x="12" y="12" width="10" height="10" fill="#FFBA08" />
        </svg>
        Microsoft (SSO)
      </button>

      <button type="button" onClick={() => setVerDemo((v) => !v)} className="mt-2.5 w-full text-center text-[11.5px] font-semibold text-[#F4C93F]">
        {verDemo ? 'Ocultar credenciales de prueba' : '¿Necesitás una cuenta demo? Ver credenciales de prueba'}
      </button>

      {verDemo && (
        <div className="mt-1 space-y-1.5 rounded-2xl border border-white/10 bg-[#1D2E4A] p-4">
          <p className="mb-1.5 text-[11px] text-[#F6F1E8]/50">
            Contraseña para todos los perfiles: <span className="font-mono text-[#F6F1E8]/80">{DEMO_PASSWORD}</span>
          </p>
          {perfiles.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setCorreo(p.correo);
                setClave(DEMO_PASSWORD);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-white/5"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#28405F] text-[10px] font-semibold text-[#F6F1E8]">
                {p.nombre.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-[#F6F1E8]">{p.nombre}</p>
                <p className="truncate text-[10px] text-[#F6F1E8]/40">{p.correo}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
