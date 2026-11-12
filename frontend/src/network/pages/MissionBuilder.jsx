import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { getBuilderHint, validateBuilder } from "../api";
import "./MissionBuilder.css";

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

const ICONS = {
  router: (
    <svg viewBox="0 0 40 40" {...stroke}>
      <path d="M13 12a10 10 0 0 1 14 0M16 15.5a5.5 5.5 0 0 1 8 0" />
      <circle cx="20" cy="18.5" r="0.8" fill="currentColor" />
      <rect x="5" y="22" width="30" height="10" rx="2" />
      <path d="M10 27h2M15 27h2M20 27h2" />
    </svg>
  ),
  switch: (
    <svg viewBox="0 0 40 40" {...stroke}>
      <rect x="3" y="14" width="34" height="12" rx="2" />
      <path d="M8 19h3v4H8zM14 19h3v4h-3zM20 19h3v4h-3zM26 19h3v4h-3z" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 40 40" {...stroke}>
      <path d="M12 29a6 6 0 0 1-.8-11.9A8 8 0 0 1 26.5 15 7 7 0 0 1 28 29z" />
    </svg>
  ),
  pc: (
    <svg viewBox="0 0 40 40" {...stroke}>
      <rect x="6" y="6" width="22" height="16" rx="1.5" />
      <path d="M17 22v4M12 26h10" />
      <rect x="22" y="26" width="14" height="7" rx="1" />
    </svg>
  ),
  cable: (
    <svg viewBox="0 0 40 40" {...stroke}>
      <ellipse cx="20" cy="22" rx="14" ry="10" />
      <ellipse cx="20" cy="22" rx="8" ry="5" />
      <path d="M20 12V6M17 6h6" />
    </svg>
  ),
};

const DEVICES = [
  { type: "router", label: "Router" },
  { type: "switch", label: "Switch" },
  { type: "cloud", label: "Internet" },
  { type: "pc", label: "PC" },
];

export default function MissionBuilder() {
  const navigate = useNavigate();
  const { id: missionId } = useParams();
  const canvasRef = useRef(null);
  const idRef = useRef(1);

  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [cableMode, setCableMode] = useState(false);
  const [linkFrom, setLinkFrom] = useState(null);
  const [modal, setModal] = useState(null);
  const [checking, setChecking] = useState(false);

  const toFraction = (clientX, clientY) => {
    const r = canvasRef.current.getBoundingClientRect();
    const clamp = (v) => Math.min(0.94, Math.max(0.06, v));
    return {
      x: clamp((clientX - r.left) / r.width),
      y: clamp((clientY - r.top) / r.height),
    };
  };

  const onPaletteDragStart = (e, type) => {
    e.dataTransfer.setData("text/plain", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const onDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/plain");
    if (!ICONS[type] || type === "cable") return;
    const { x, y } = toFraction(e.clientX, e.clientY);
    const id = idRef.current++;
    setNodes((n) => [...n, { id, type, x, y }]);
    setSelected(id);
  };

  const onNodePointerDown = (e, id) => {
    if (cableMode) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragId(id);
    setSelected(id);
  };

  const onNodePointerMove = (e, id) => {
    if (dragId !== id) return;
    const { x, y } = toFraction(e.clientX, e.clientY);
    setNodes((n) => n.map((nd) => (nd.id === id ? { ...nd, x, y } : nd)));
  };

  const onNodePointerUp = () => setDragId(null);

  const onNodeClick = (id) => {
    if (!cableMode) return;
    if (linkFrom === null) {
      setLinkFrom(id);
    } else if (linkFrom !== id) {
      const exists = links.some(
        (l) => (l.a === linkFrom && l.b === id) || (l.a === id && l.b === linkFrom)
      );
      if (!exists) setLinks((l) => [...l, { a: linkFrom, b: id }]);
      setLinkFrom(null);
    }
  };

  const toggleCable = () => {
    setCableMode((m) => !m);
    setLinkFrom(null);
  };

  const removeNode = (id) => {
    setNodes((n) => n.filter((nd) => nd.id !== id));
    setLinks((l) => l.filter((x) => x.a !== id && x.b !== id));
    setSelected(null);
    if (linkFrom === id) setLinkFrom(null);
  };

  const removeLink = (i) => setLinks((l) => l.filter((_, idx) => idx !== i));

  const byId = (id) => nodes.find((n) => n.id === id);

  const handleValidate = async () => {
    setChecking(true);
    try {
      const { success, message } = await validateBuilder({
        missionId,
        nodes: nodes.map(({ id: nodeId, type, x, y }) => ({ id: nodeId, type, x, y })),
        links: links.map((l) => ({ from: l.a, to: l.b })),
      });
      if (success) {
        navigate(`/network/${missionId}/challenge`);
      } else {
        setModal({
          title: "TRY AGAIN",
          text: message || "The network is not correct yet. Use the hint if you need help.",
        });
      }
    } catch {
      setModal({ title: "ERROR", text: "Could not reach the server. Please try again." });
    } finally {
      setChecking(false);
    }
  };

  const openHint = async () => {
    setModal({ title: "HINT", text: "Loading..." });
    try {
      const text = await getBuilderHint(missionId);
      setModal({ title: "HINT", text: text || "No hint available." });
    } catch {
      setModal({ title: "HINT", text: "Could not load the hint." });
    }
  };

  return (
    <div className="mb-page">
      <Header />

      <main className="mb-main">
        <aside className="mb-palette" aria-label="Devices">
          {DEVICES.map((d) => (
            <div
              key={d.type}
              className="mb-tool"
              draggable
              title={d.label}
              onDragStart={(e) => onPaletteDragStart(e, d.type)}
            >
              {ICONS[d.type]}
            </div>
          ))}
          <button
            className={`mb-tool mb-tool--btn ${cableMode ? "is-on" : ""}`}
            title="Cable"
            aria-pressed={cableMode}
            onClick={toggleCable}
          >
            {ICONS.cable}
          </button>
        </aside>

        <section
          ref={canvasRef}
          className={`mb-canvas ${cableMode ? "is-cable" : ""}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          {nodes.length === 0 && (
            <p className="mb-empty">Drag devices here to build your network</p>
          )}

          <svg className="mb-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
            {links.map((l, i) => {
              const a = byId(l.a);
              const b = byId(l.b);
              if (!a || !b) return null;
              return (
                <line
                  key={i}
                  x1={a.x * 100} y1={a.y * 100}
                  x2={b.x * 100} y2={b.y * 100}
                  onDoubleClick={() => removeLink(i)}
                />
              );
            })}
          </svg>

          {nodes.map((n) => (
            <div
              key={n.id}
              className={
                "mb-node" +
                (selected === n.id ? " is-selected" : "") +
                (linkFrom === n.id ? " is-linking" : "")
              }
              style={{ left: `${n.x * 100}%`, top: `${n.y * 100}%` }}
              onPointerDown={(e) => onNodePointerDown(e, n.id)}
              onPointerMove={(e) => onNodePointerMove(e, n.id)}
              onPointerUp={onNodePointerUp}
              onClick={() => onNodeClick(n.id)}
            >
              {ICONS[n.type]}
              {selected === n.id && !cableMode && (
                <button
                  className="mb-node__x"
                  aria-label="Remove"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); removeNode(n.id); }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </section>

        <aside className="mb-side">
          <button className="mb-hint" onClick={openHint} aria-label="Show hint">
            <svg viewBox="0 0 100 100" className="mb-hint__bulb">
              <g stroke="#ffc20e" strokeWidth="4" strokeLinecap="round">
                <line className="mb-ray r1" x1="50" y1="10" x2="50" y2="21" />
                <line className="mb-ray r2" x1="25" y1="21" x2="32" y2="28" />
                <line className="mb-ray r3" x1="75" y1="21" x2="68" y2="28" />
                <line className="mb-ray r4" x1="8" y1="47" x2="19" y2="47" />
                <line className="mb-ray r5" x1="92" y1="47" x2="81" y2="47" />
              </g>
              <circle cx="50" cy="47" r="18" fill="#ffc20e" />
              <path d="M40 57h20v9a4 4 0 0 1-4 4H44a4 4 0 0 1-4-4z" fill="#ffc20e" />
              <rect x="38" y="73" width="24" height="4.5" rx="2.2" fill="#d6d6d6" />
              <rect x="42" y="79" width="16" height="4.5" rx="2.2" fill="#bdbdbd" />
            </svg>
            <span className="mb-hint__label">HINT</span>
          </button>

          <button className="mb-validate" onClick={handleValidate} disabled={checking}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8V4z" /></svg>
            Validate
          </button>
        </aside>
      </main>

      {modal && (
        <div className="mb-overlay" onClick={() => setModal(null)}>
          <div
            className="mb-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-modal__title">{modal.title}</h2>
            <p className="mb-modal__text">{modal.text}</p>
            <button className="mb-modal__close" onClick={() => setModal(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
