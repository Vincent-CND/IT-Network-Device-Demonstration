import { useMemo } from 'react'
import Modal from './Modal.jsx'

const COLORS = ['#4ecb8f', '#2f80ed', '#ff6a13', '#ffb01f', '#e5322d', '#b4e33d']

// Purely decorative falling pieces, generated once per mount.
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        size: 4 + Math.random() * 6,
        color: COLORS[i % COLORS.length],
        round: Math.random() > 0.5,
      })),
    [],
  )

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 animate-confetti"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * (p.round ? 1 : 2),
            background: p.color,
            borderRadius: p.round ? '9999px' : '2px',
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function CongratsModal({ open, onClose, onContinue, message }) {
  return (
    <Modal open={open} onClose={onClose} label="Congratulations">
      <Confetti />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-500 text-gray-600 hover:bg-gray-100"
      >
        ✕
      </button>
      <div className="relative text-center">
        <h2 className="mb-4 mt-2 text-4xl font-bold text-[#4ecb8f]">Congratulations!</h2>
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-ink">{message}</p>
        <button
          type="button"
          onClick={onContinue}
          className="mt-6 rounded-xl bg-brand px-6 py-2.5 font-semibold text-white transition hover:brightness-110"
        >
         Go to next level
        </button>
      </div>
    </Modal>
  )
}
