/** Portada de un item de catálogo (evento, oportunidad, beneficio...).
 * Estos catálogos (src/data/*.ts) no traen fotos reales todavía, así que en vez
 * de inventar URLs de imágenes usamos un degradado + inicial de la categoría —
 * honesto sobre lo que hay, y fácil de reemplazar el día que suban fotos reales. */
export default function CoverPhoto({
  tag,
  colorFg,
  height = 140,
  radius = 18,
  className = '',
}: {
  tag: string;
  colorFg: string;
  height?: number;
  radius?: number;
  className?: string;
}) {
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
