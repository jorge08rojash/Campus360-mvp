const COLORES = ['#F4C93F', '#FF6B5B', '#3DDBB0', '#8FA8FF', '#C88FFF'];
const PARTICULAS = Array.from({ length: 18 }).map((_, i) => ({
  left: (i * 23 + 5) % 96,
  color: COLORES[i % COLORES.length],
  delay: ((i % 6) * 0.06).toFixed(2),
  duration: (1.1 + (i % 5) * 0.15).toFixed(2),
  rotate: (i * 47) % 360,
}));

export default function Confetti({ activo }: { activo: boolean }) {
  if (!activo) return null;
  return (
    <>
      {PARTICULAS.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: `${p.left}%`,
            width: 8,
            height: 8,
            background: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animationName: 'c360-confetti-fall',
            animationDuration: `${p.duration}s`,
            animationTimingFunction: 'ease-in',
            animationFillMode: 'forwards',
            animationDelay: `${p.delay}s`,
            zIndex: 200,
            borderRadius: 2,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
}
