import { useEffect, useRef } from 'react'

export default function Modal({ open, onClose, children, label }) {
  const ref = useRef(null)
  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])
  return <dialog ref={ref} aria-label={label} onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => {
      if (event.target !== event.currentTarget) return
      const rect = event.currentTarget.getBoundingClientRect()
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose()
    }}>
    <button className="dialog-close" type="button" onClick={onClose} aria-label="Close dialog">×</button>
    {children}
  </dialog>
}
