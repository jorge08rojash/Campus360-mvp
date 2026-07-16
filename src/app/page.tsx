'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Cada vez que se abre el link base, arrancamos de cero:
    // se limpia cualquier sesión guardada para que siempre pida usuario.
    localStorage.removeItem('campus360_usuario');
    localStorage.removeItem('campus360_bienvenida_vista');
    router.replace('/login');
  }, [router]);

  return null;
}
