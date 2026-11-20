import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBuilderHint, validateBuilder } from '../api.js'
import MessageDialog from '../../components/MessageDialog.jsx'

const DEVICES = [{ type: 'cloud', label: 'Internet', icon: 'internet' }, { type: 'router', label: 'Router', icon: 'router' }, { type: 'switch', label: 'Switch', icon: 'switch' }, { type: 'pc', label: 'PC', icon: 'pc' }]
const device = type => DEVICES.find(item => item.type === type)

export default function MissionBuilder() {
  const canvas = useRef(null)
  const nextId = useRef(1)
  const drag = useRef(null)
  const pending = useRef(false)
  const hintRequest = useRef(0)
  const [nodes, setNodes] = useState([])
  const [links, setLinks] = useState([])
  const [selected, setSelected] = useState(null)
  const [cableMode, setCableMode] = useState(false)
  const [linkFrom, setLinkFrom] = useState(null)
  const [checking, setChecking] = useState(false)
  const [status, setStatus] = useState('Choose a device to add it to the canvas.')
  const [message, setMessage] = useState(null)

  function position(event) {
    const rect = canvas.current.getBoundingClientRect()
    return { x: Math.min(.86, Math.max(.14, (event.clientX - rect.left) / rect.width)), y: Math.min(.9, Math.max(.1, (event.clientY - rect.top) / rect.height)) }
  }
  function add(type, point) {
    if (pending.current || !device(type)) return
    const id = nextId.current++
    setNodes(items => [...items, { id, type, ...(point || { x: .17 + (items.length % 3) * .33, y: .14 + (Math.floor(items.length / 3) % 4) * .23 }) }])
    setSelected(id)
    setStatus(`${device(type).label} added. Move it by dragging or using the arrow keys.`)
  }
  function connect(id) {
    if (pending.current) return
    setSelected(id)
    if (!cableMode) return
    if (linkFrom === null) {
      setLinkFrom(id)
      setStatus('Choose a second device to connect.')
    } else {
      if (linkFrom !== id) {
        const exists = links.some(link => (link.from === linkFrom && link.to === id) || (link.to === linkFrom && link.from === id))
        if (!exists) setLinks(items => [...items, { from: linkFrom, to: id }])
        setStatus(exists ? 'These devices are already connected.' : 'Connection added. Choose two more devices to connect.')
      }
      setLinkFrom(null)
    }
  }
  function removeSelected() {
    setNodes(items => items.filter(node => node.id !== selected))
    setLinks(items => items.filter(link => link.from !== selected && link.to !== selected))
    setSelected(null)
    setLinkFrom(null)
    setStatus('Device and its connections removed.')
  }
  function reset() {
    setNodes([]); setLinks([]); setSelected(null); setLinkFrom(null); setCableMode(false)
    setStatus('Canvas cleared. Choose a device to begin again.')
  }
  async function validate() {
    if (pending.current) return
    pending.current = true
    setChecking(true)
    try {
      const result = await validateBuilder({ nodes, links })
      setMessage(result.success
        ? { title: 'Network complete!', text: 'Your network passed the challenge. Next, arrange the wires in a LAN cable.', to: '/network/1/challenge', action: 'Start cable challenge' }
        : { title: 'Keep building', text: result.message || 'Check your connections and try again.' })
    } catch (error) { setMessage({ title: 'Unable to check network', text: error.message }) }
    finally { pending.current = false; setChecking(false) }
  }
  async function hint() {
    const request = ++hintRequest.current
    setMessage({ title: 'Builder hint', text: 'Loading hint…' })
    try {
      const text = await getBuilderHint(1)
      if (request === hintRequest.current) setMessage({ title: 'Builder hint', text: text || 'No hint is available.' })
    } catch { if (request === hintRequest.current) setMessage({ title: 'Builder hint', text: 'Could not load the hint. Close this message and try again.' }) }
  }
  const label = id => { const node = nodes.find(item => item.id === id); return node ? `${device(node.type).label} ${id}` : '' }

  return <section className="wrap page" aria-labelledby="builder-title">
    <Link className="back" to="/network/1">← Network briefing</Link>
    <div className="page-heading"><div><p className="eyebrow warm">Network Builder</p><h1 id="builder-title">Build your network.</h1><p className="intro">Add devices, then use the cable tool to connect them. Follow the mission briefing and hint to build the full network.</p></div><button className="button secondary" onClick={hint} disabled={checking}>Show hint</button></div>
    <div className="workspace">
      <aside className="panel palette" aria-labelledby="devices-title"><h2 id="devices-title">Devices</h2><div className="devices">{DEVICES.map(item => <button key={item.type} type="button" disabled={checking} draggable={!checking} onDragStart={event => event.dataTransfer.setData('text/plain', item.type)} onClick={() => add(item.type)}><span className={`device-icon ${item.icon}`} aria-hidden="true" />{item.label}</button>)}</div>
        <button className="button secondary" disabled={checking} aria-pressed={cableMode} onClick={() => { setCableMode(value => !value); setLinkFrom(null); setStatus(cableMode ? 'Select or move a device.' : 'Select two devices to connect them.') }}>Cable tool</button>
        <button className="button secondary" disabled={selected === null || checking} onClick={removeSelected}>Remove selected</button>
      </aside>
      <div className="panel board" aria-busy={checking}><div className="board-header"><h2>Network canvas</h2><span>{nodes.length} devices · {links.length} connections</span></div>
        <div className="canvas builder-canvas" ref={canvas} aria-label="Network canvas" onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); add(event.dataTransfer.getData('text/plain'), position(event)) }}>
          {!nodes.length && <p className="canvas-empty">Choose or drag a device to start building.</p>}
          <svg className="network-lines" width="100%" height="100%" aria-hidden="true">{links.map(link => {
            const from = nodes.find(node => node.id === link.from), to = nodes.find(node => node.id === link.to)
            return <line key={`${link.from}-${link.to}`} x1={`${from.x * 100}%`} y1={`${from.y * 100}%`} x2={`${to.x * 100}%`} y2={`${to.y * 100}%`} stroke="var(--lime)" strokeWidth="3" />
          })}</svg>
          {nodes.map(node => <button key={node.id} className="node" disabled={checking} aria-label={label(node.id)} aria-pressed={selected === node.id || linkFrom === node.id} style={{ left: `${node.x * 100}%`, top: `${node.y * 100}%` }}
            onClick={() => connect(node.id)}
            onPointerDown={event => { if (cableMode || checking) return; event.currentTarget.setPointerCapture(event.pointerId); drag.current = node.id; setSelected(node.id) }}
            onPointerMove={event => { if (drag.current !== node.id || checking) return; const point = position(event); setNodes(items => items.map(item => item.id === node.id ? { ...item, ...point } : item)) }}
            onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }}
            onKeyDown={event => {
              const direction = { ArrowLeft: [-.03, 0], ArrowRight: [.03, 0], ArrowUp: [0, -.03], ArrowDown: [0, .03] }[event.key]
              if (!direction || cableMode || checking) return
              event.preventDefault()
              setNodes(items => items.map(item => item.id === node.id ? { ...item, x: Math.max(.14, Math.min(.86, item.x + direction[0])), y: Math.max(.1, Math.min(.9, item.y + direction[1])) } : item))
            }}><span className={`device-icon ${device(node.type).icon}`} aria-hidden="true" />{label(node.id)}</button>)}
        </div>
        <div className="board-footer"><p className="status" role="status">{status}</p><div className="actions"><button className="button secondary" onClick={reset} disabled={checking}>Reset</button><button className="button primary" onClick={validate} disabled={checking}>{checking ? 'Checking…' : 'Validate network'}</button></div></div>
        {links.length > 0 && <details className="connection-list"><summary>Manage connections</summary><ul>{links.map(link => <li key={`${link.from}-${link.to}`}><span>{label(link.from)} — {label(link.to)}</span><button className="button secondary" disabled={checking} aria-label={`Remove connection ${label(link.from)} to ${label(link.to)}`} onClick={() => setLinks(items => items.filter(item => item !== link))}>Remove</button></li>)}</ul></details>}
      </div>
    </div>
    <MessageDialog message={message} onClose={() => { hintRequest.current++; setMessage(null) }} />
  </section>
}
