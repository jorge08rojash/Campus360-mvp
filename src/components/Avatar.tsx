'use client';

import { useState } from 'react';
import Image from 'next/image';

function iniciales(nombre: string) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join('')
    .toUpperCase();
}

export default function Avatar({
  nombre,
  fotoUrl,
  size = 36,
  bg = '#2B6477',
  textClass = 'text-white',
  className = '',
}: {
  nombre: string;
  fotoUrl?: string | null;
  size?: number;
  bg?: string;
  textClass?: string;
  className?: string;
}) {
  const [error, setError] = useState(false);

  if (fotoUrl && !error) {
    return (
      <Image
        src={fotoUrl}
        alt={nombre}
        width={size}
        height={size}
        onError={() => setError(true)}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, background: bg, fontSize: size * 0.4 }}
      className={`rounded-full flex items-center justify-center font-semibold shrink-0 ${textClass} ${className}`}
    >
      {iniciales(nombre)}
    </div>
  );
}
