import Modal from './Modal.jsx'

// hint = { loading: boolean, text: string }
export default function HintModal({ open, hint, onClose }) {
  return (
    <Modal open={open} onClose={onClose} label="Hint">
      <h2 className="mb-2 text-lg font-semibold text-red-600">Hint:</h2>
      <p className="min-h-16 text-sm leading-relaxed text-ink">
        {hint?.loading ? 'Loading hint…' : hint?.text}
      </p>
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl bg-brand px-6 py-2 font-semibold text-white transition hover:brightness-110"
        >
          Close
        </button>
      </div>
    </Modal>
  )
}
