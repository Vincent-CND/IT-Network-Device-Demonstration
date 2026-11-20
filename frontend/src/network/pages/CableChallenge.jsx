import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCableHint, validateCable } from '../api.js'
import MessageDialog from '../../components/MessageDialog.jsx'

const WIRES = [
  { id: 'wo', label: 'White / Orange', color: '#f58a1f', striped: true },
  { id: 'o', label: 'Orange', color: '#f58a1f' },
  { id: 'wg', label: 'White / Green', color: '#1f9d3a', striped: true },
  { id: 'g', label: 'Green', color: '#1f9d3a' },
  { id: 'wb', label: 'White / Blue', color: '#1f6fe0', striped: true },
  { id: 'b', label: 'Blue', color: '#1f6fe0' },
  { id: 'wbr', label: 'White / Brown', color: '#996137', striped: true },
  { id: 'br', label: 'Brown', color: '#996137' },
]
const wireById = id => WIRES.find(wire => wire.id === id)
function Swatch({ wire, slot = false }) {
  return <span aria-hidden="true" className={`${slot ? 'slot-wire' : 'wire-swatch'} ${wire ? `wire-color ${wire.striped ? 'striped' : ''}` : ''}`} style={{ '--wire': wire?.color }} />
}

export default function CableChallenge() {
  const [slots, setSlots] = useState(Array(8).fill(null))
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState('Select a wire, then select a slot. Select a filled slot to return its wire.')
  const [checking, setChecking] = useState(false)
  const [message, setMessage] = useState(null)
  const pending = useRef(false)
  const hintRequest = useRef(0)

  function place(index, wireId = selected) {
    if (pending.current || (wireId && !wireById(wireId))) return
    setSlots(previous => {
      const next = [...previous]
      if (wireId) {
        const source = next.indexOf(wireId)
        if (source !== -1) next[source] = next[index]
      }
      next[index] = wireId
      return next
    })
    setSelected(null)
    setStatus(wireId ? `${wireById(wireId).label} placed in slot ${index + 1}.` : `Slot ${index + 1} cleared.`)
  }
  async function validate() {
    if (pending.current) return
    if (slots.some(wire => !wire)) { setStatus('Place all eight wires into the connector first.'); return }
    pending.current = true
    setChecking(true)
    try {
      const result = await validateCable({ order: slots })
      setMessage(result.success
        ? { title: 'You connected it!', text: 'All eight wires are in the correct order. You’ve completed the cable challenge.', to: '/feedback', action: 'Continue to feedback' }
        : { title: 'Try another order', text: result.message || 'The wire order is not correct yet. Use a hint and try again.' })
    } catch (error) { setMessage({ title: 'Unable to check cable', text: error.message }) }
    finally { pending.current = false; setChecking(false) }
  }
  async function hint(id) {
    const request = ++hintRequest.current
    setMessage({ title: `Cable hint ${id}`, text: 'Loading hint…' })
    try {
      const text = await getCableHint(id)
      if (request === hintRequest.current) setMessage({ title: `Cable hint ${id}`, text: text || 'No hint is available.' })
    } catch { if (request === hintRequest.current) setMessage({ title: `Cable hint ${id}`, text: 'Could not load the hint. Close this message and try again.' }) }
  }
  return <section className="wrap page" aria-labelledby="cable-title">
    <Link className="back" to="/network/1/build">← Network builder</Link>
    <div className="page-heading"><div><p className="eyebrow warm">Secret challenge unlocked</p><h1 id="cable-title">Make the connection.</h1><p className="intro">Arrange the eight wires in the connector, then check the order.</p></div></div>
    <div className="game-grid"><div className="panel cable-board" aria-busy={checking}>
      <div className="board-header"><h2>LAN cable challenge</h2><span>{slots.filter(Boolean).length} of 8 wires placed</span></div>
      <div className="connector" aria-label="Connector slots">{slots.map((id, i) => <button key={i} className="slot" disabled={checking} aria-label={`Slot ${i + 1}: ${wireById(id)?.label || 'empty'}`} onClick={() => place(i)} draggable={Boolean(id) && !checking} onDragStart={event => event.dataTransfer.setData('text/plain', id)} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const wire = event.dataTransfer.getData('text/plain'); if (wire) place(i, wire) }}><span className="slot-pin" /><Swatch wire={wireById(id)} slot /><span>{i + 1}</span></button>)}</div>
      <div className="wire-area"><h3>Choose a wire</h3><div className="wire-tray">{WIRES.map(wire => <button key={wire.id} disabled={slots.includes(wire.id) || checking} aria-pressed={selected === wire.id} draggable={!slots.includes(wire.id) && !checking} onDragStart={event => event.dataTransfer.setData('text/plain', wire.id)} onClick={() => { setSelected(selected === wire.id ? null : wire.id); setStatus(`Select a slot for ${wire.label}.`) }}><Swatch wire={wire} />{wire.label}</button>)}</div></div>
      <div className="board-footer"><p className="status" role="status">{status}</p><div className="actions"><button className="button secondary" disabled={checking} onClick={() => { setSlots(Array(8).fill(null)); setSelected(null); setStatus('Connector cleared. Choose a wire to start again.') }}>Reset</button><button className="button primary" disabled={checking} onClick={validate}>{checking ? 'Checking…' : 'Check cable'}</button></div></div>
    </div><aside className="panel cable-hints"><h2>Need a clue?</h2><p>Work through the hints one at a time.</p><div className="hint-list">{[1, 2, 3, 4].map(id => <button className="button secondary" key={id} disabled={checking} onClick={() => hint(id)}>Hint {id}</button>)}</div></aside></div>
    <MessageDialog message={message} onClose={() => { hintRequest.current++; setMessage(null) }} />
  </section>
}
