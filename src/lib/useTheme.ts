'use client';

import { useCallback, useEffect, useState } from 'react';

export type Tema = 'dark' | 'light';

const CLAVE = 'campus360_tema';

export function useTheme() {
  const [tema, setTemaState] = useState<Tema>('dark');

  useEffect(() => {
    const guardado = localStorage.getItem(CLAVE) as Tema | null;
    if (guardado === 'dark' || guardado === 'light') setTemaState(guardado);
  }, []);

  const setTema = useCallback((valor: Tema) => {
    setTemaState(valor);
    localStorage.setItem(CLAVE, valor);
  }, []);

  return { tema, setTema };
}
