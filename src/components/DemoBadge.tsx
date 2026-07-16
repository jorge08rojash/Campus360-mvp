'use client';

import { useState } from 'react';

/** Insignia discreta que aclara que un módulo usa datos de demostración
 * (no persisten en una base real). Evita que el usuario lea la simulación
 * como un bug. Se puede cerrar con un clic. */
export default function DemoBadge({ texto = 'Demo: los cambios de esta sección no se guardan de forma permanente.' }: { texto?: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-[#8a6417] bg-[#D9A441]/12 border border-[#D9A441]/25 rounded-lg px-3 py-2 mb-5">
      <span>ℹ️</span>
      <span className="flex-1">{texto}</span>
      <button onClick={() => setVisible(false)} className="text-[#8a6417]/60 hover:text-[#8a6417]" aria-label="Cerrar aviso">
        ✕
      </button>
    </div>
  );
}
