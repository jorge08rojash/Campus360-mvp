import { umbralesNivel, nivelActual, type Nivel } from '@/data/beneficios';

export function nivelInfo(puntos: number): { actual: Nivel; pct: number; restante: string } {
  const actual = nivelActual(puntos);
  if (actual === 'Oro') return { actual, pct: 100, restante: 'Nivel máximo alcanzado 🏆' };
  if (actual === 'Plata') {
    const pct = Math.min(100, Math.round(((puntos - umbralesNivel.Plata) / (umbralesNivel.Oro - umbralesNivel.Plata)) * 100));
    return { actual, pct, restante: `${umbralesNivel.Oro - puntos} pts para Oro` };
  }
  const pct = Math.min(100, Math.round((puntos / umbralesNivel.Plata) * 100));
  return { actual, pct, restante: `${umbralesNivel.Plata - puntos} pts para Plata` };
}
