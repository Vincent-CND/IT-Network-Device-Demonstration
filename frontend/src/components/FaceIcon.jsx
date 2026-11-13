const FACES = {
  1: { color: '#ef5350', mouth: 'M8 16.5 Q12 11.5 16 16.5' },
  2: { color: '#f28b3c', mouth: 'M8 16 Q12 13.2 16 16' },
  3: { color: '#f5c518', mouth: 'M8 15 L16 15' },
  4: { color: '#9ccc3c', mouth: 'M8 14 Q12 17.2 16 14' },
  5: { color: '#4cc34f', mouth: 'M7.5 13.5 Q12 19.5 16.5 13.5' },
}

export default function FaceIcon({ level, selected, onClick }) {
  const { color, mouth } = FACES[level]
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Rate ${level} out of 5`}
      aria-pressed={selected}
      className={`rounded-full transition ${
        selected ? 'scale-125 ring-2 ring-white' : 'opacity-80 hover:scale-110 hover:opacity-100'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7">
        <circle cx="12" cy="12" r="11" fill={color} />
        <circle cx="8.5" cy="9.5" r="1.2" fill="#1b1b1b" />
        <circle cx="15.5" cy="9.5" r="1.2" fill="#1b1b1b" />
        <path d={mouth} fill="none" stroke="#1b1b1b" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  )
}
