'use client';

import { useEffect } from 'react';

/** Pone el título de la pestaña del navegador. Los Client Components no pueden
 * exportar `metadata`, así que lo hacemos con un efecto liviano. */
export function usePageTitle(titulo: string) {
  useEffect(() => {
    const anterior = document.title;
    document.title = `${titulo} · Campus360`;
    return () => {
      document.title = anterior;
    };
  }, [titulo]);
}
