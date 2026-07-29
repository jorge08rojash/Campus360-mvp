'use client';

import { useRef, useState } from 'react';

function iniciales(nombre: string) {
  return nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

/** Foto de usuario real (Supabase Storage) con iniciales como placeholder.
 * Si se pasa `onUpload`, un tap abre el selector de archivo/cámara del dispositivo
 * y sube la foto de verdad — reemplaza el "image-slot" del prototipo de diseño. */
export default function AvatarSlot({
  url,
  nombre,
  size = 42,
  onUpload,
  ring,
  className = '',
}: {
  url: string | null | undefined;
  nombre: string;
  size?: number;
  onUpload?: (archivo: File) => Promise<void>;
  ring?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);

  async function manejarArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo || !onUpload) return;
    setSubiendo(true);
    await onUpload(archivo);
    setSubiendo(false);
    e.target.value = '';
  }

  const contenido = (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size, background: 'var(--c360-surface2)' }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={nombre} className="h-full w-full object-cover" />
      ) : (
        <span className="font-semibold" style={{ fontSize: size * 0.36, color: 'var(--c360-text2)' }}>
          {iniciales(nombre) || '?'}
        </span>
      )}
    </div>
  );

  if (!onUpload) {
    if (!ring) return contenido;
    return (
      <div className="rounded-full p-[2.5px]" style={{ background: ring }}>
        {contenido}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="relative shrink-0 rounded-full"
      style={ring ? { background: ring, padding: 2.5 } : undefined}
      aria-label="Cambiar foto"
    >
      {contenido}
      {subiendo && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-[10px] text-white">…</div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={manejarArchivo} />
    </button>
  );
}
