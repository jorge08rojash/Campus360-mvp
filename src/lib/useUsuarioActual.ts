'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Perfil } from './supabase';

export function useUsuarioActual() {
  const [usuario, setUsuario] = useState<Perfil | null>(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const guardado = localStorage.getItem('campus360_usuario');
    if (!guardado) {
      router.push('/login');
      return;
    }
    setUsuario(JSON.parse(guardado));
    setCargando(false);
  }, [router]);

  function cerrarSesion() {
    localStorage.removeItem('campus360_usuario');
    router.push('/login');
  }

  return { usuario, cargando, cerrarSesion };
}
