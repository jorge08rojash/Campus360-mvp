'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Perfil } from './supabase';

export function useUsuarioActual() {
  const [usuario, setUsuario] = useState<Perfil | null>(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let activo = true;

    async function cargarPerfil(userId: string) {
      const { data } = await supabase.from('perfiles').select('*').eq('id', userId).single();
      if (activo) {
        setUsuario(data);
        setCargando(false);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!activo) return;
      if (!session) {
        router.push('/login');
        setCargando(false);
        return;
      }
      cargarPerfil(session.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_evento, session) => {
      if (!session) {
        setUsuario(null);
        router.push('/login');
        return;
      }
      cargarPerfil(session.user.id);
    });

    return () => {
      activo = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  function cerrarSesion() {
    supabase.auth.signOut();
    router.push('/login');
  }

  return { usuario, cargando, cerrarSesion };
}
