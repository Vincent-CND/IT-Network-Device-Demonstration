import { useMemo } from 'react'

// Decorative "digital rain" for the Game screen. Pure CSS animation, no canvas.
export default function MatrixBackground() {
  const columns = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: (i / 22) * 100 + Math.random() * 3,
        text: Array.from({ length: 28 }, () => (Math.random() > 0.5 ? '1' : '0')).join('\n'),
        duration: 14 + Math.random() * 14,
        opacity: 0.12 + Math.random() * 0.25,
      })),
    [],
  )

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#0a4a22_0%,#052b14_45%,#021409_100%)]" />
      {columns.map((c) => (
        <pre
          key={c.id}
          className="absolute top-0 m-0 whitespace-pre text-xs leading-5 text-[#3dff7a]"
          style={{
            left: `${c.left}%`,
            opacity: c.opacity,
            animation: `matrix-fall ${c.duration}s linear infinite alternate`,
          }}
        >
          {c.text}
        </pre>
      ))}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a5a28]/40 to-transparent" />
    </div>
  )
}
