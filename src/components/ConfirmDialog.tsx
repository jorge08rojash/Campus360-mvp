'use client';

import { useState, useCallback } from 'react';

type ConfirmState = {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar: string;
  onConfirmar: (() => void) | null;
};

const inicial: ConfirmState = {
  abierto: false,
  titulo: '',
  mensaje: '',
  textoConfirmar: 'Confirmar',
  onConfirmar: null,
};

export function useConfirm() {
  const [estado, setEstado] = useState<ConfirmState>(inicial);

  const pedirConfirmacion = useCallback(
    (opts: { titulo: string; mensaje: string; textoConfirmar?: string; onConfirmar: () => void }) => {
      setEstado({
        abierto: true,
        titulo: opts.titulo,
        mensaje: opts.mensaje,
        textoConfirmar: opts.textoConfirmar || 'Confirmar',
        onConfirmar: opts.onConfirmar,
      });
    },
    []
  );

  const cerrar = useCallback(() => setEstado(inicial), []);

  return { estado, pedirConfirmacion, cerrar };
}

export function ConfirmDialog({ estado, cerrar }: { estado: ConfirmState; cerrar: () => void }) {
  if (!estado.abierto) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4" onClick={cerrar}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-semibold text-gray-800 mb-1.5">{estado.titulo}</h3>
        <p className="text-sm text-gray-500 mb-5">{estado.mensaje}</p>
        <div className="flex gap-2">
          <button
            onClick={cerrar}
            className="flex-1 text-sm font-medium border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              estado.onConfirmar?.();
              cerrar();
            }}
            className="flex-1 text-sm font-medium bg-[#B5566B] text-white py-2 rounded-lg hover:bg-[#9E4A5C] transition-colors"
          >
            {estado.textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
