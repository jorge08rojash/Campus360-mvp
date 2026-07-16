'use client';

import { useCallback, useState } from 'react';

export type ToastItem = { id: string; texto: string; tipo: 'exito' | 'error' | 'info' };

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const mostrarToast = useCallback((texto: string, tipo: ToastItem['tipo'] = 'exito') => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, texto, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return { toasts, mostrarToast };
}

const estilos: Record<ToastItem['tipo'], { bg: string; icon: string }> = {
  exito: { bg: 'bg-[#2B6477]', icon: '✓' },
  error: { bg: 'bg-[#C0392B]', icon: '✕' },
  info: { bg: 'bg-gray-800', icon: 'ⓘ' },
};

export function ToastStack({ toasts }: { toasts: ToastItem[] }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 items-end">
      {toasts.map((t) => {
        const s = estilos[t.tipo];
        return (
          <div
            key={t.id}
            className={`${s.bg} text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 animate-[toast-in_0.2s_ease-out]`}
          >
            <span>{s.icon}</span>
            {t.texto}
          </div>
        );
      })}
    </div>
  );
}
