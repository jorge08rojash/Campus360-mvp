/** Portada de un item de catálogo (evento, oportunidad, beneficio...).
 * La mayoría de estos catálogos (src/data/*.ts) no traen fotos reales, así que
 * por defecto usamos un degradado + inicial de la categoría — honesto sobre lo
 * que hay. Cuando el item sí tiene `imagenUrl` (extraída del prototipo de
 * diseño en design-handoff/, ver src/lib/catalogo.ts), mostramos la foto real. */
export default function CoverPhoto({
  tag,
  colorFg,
  imagenUrl,
  height = 140,
  radius = 18,
  className = '',
}: {
  tag: string;
  colorFg: string;
  imagenUrl?: string;
  height?: number;
  radius?: number;
  className?: string;
}) {
  if (imagenUrl) {
    return (
      <div
        className={`w-full overflow-hidden ${className}`}
        style={{ height, borderRadius: radius, border: '1px solid var(--c360-border)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imagenUrl} alt={tag} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`flex w-full items-center justify-center ${className}`}
      style={{
        height,
        borderRadius: radius,
        background: `linear-gradient(135deg, var(--c360-surface2), var(--c360-surface))`,
        border: '1px solid var(--c360-border)',
      }}
    >
      <span className="font-semibold" style={{ color: colorFg, fontSize: Math.max(20, height * 0.22), opacity: 0.85 }}>
        {tag}
      </span>
    </div>
  );
}
