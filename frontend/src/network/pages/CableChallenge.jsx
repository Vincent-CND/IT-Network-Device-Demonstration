import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { getCableHint, validateCable } from "../api";
import "./CableChallenge.css";

const WIRES = [
  { id: "wo",  color: "#f58a1f", striped: true  },
  { id: "o",   color: "#f58a1f", striped: false },
  { id: "wg",  color: "#1f9d3a", striped: true  },
  { id: "g",   color: "#1f9d3a", striped: false },
  { id: "wb",  color: "#1f6fe0", striped: true  },
  { id: "b",   color: "#1f6fe0", striped: false },
  { id: "wbr", color: "#7a4a1d", striped: true  },
  { id: "br",  color: "#7a4a1d", striped: false },
];

const wireById = (id) => WIRES.find((w) => w.id === id);

function Wire({ wire, onDragStart, onDragEnd }) {
  return (
    <div
      className={`cc-wire ${wire.striped ? "is-striped" : ""}`}
      style={{ "--c": wire.color }}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    />
  );
}

export default function CableChallenge() {
  const navigate = useNavigate();
  const { id: missionId } = useParams();
  const dragRef = useRef(null);
  const redirectRef = useRef(null);
  const [slots, setSlots] = useState(Array(8).fill(null));
  const [modal, setModal] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => () => clearTimeout(redirectRef.current), []);

  const startDrag = (e, wireId, from) => {
    dragRef.current = { wireId, from };
    e.dataTransfer.setData("text/plain", wireId);
    e.dataTransfer.effectAllowed = "move";
  };
  const endDrag = () => { dragRef.current = null; };

  const dropOnSlot = (e, i) => {
    e.preventDefault();
    const d = dragRef.current;
    if (!d) return;
    setSlots((prev) => {
      const next = [...prev];
      const occupant = next[i];
      if (d.from !== "tray") next[d.from] = occupant;
      next[i] = d.wireId;
      return next;
    });
    dragRef.current = null;
  };

  const dropOnTray = (e) => {
    e.preventDefault();
    const d = dragRef.current;
    if (!d || d.from === "tray") return;
    setSlots((prev) => prev.map((s, idx) => (idx === d.from ? null : s)));
    dragRef.current = null;
  };

  const allow = (e) => e.preventDefault();

  const reset = () => setSlots(Array(8).fill(null));

  const validate = async () => {
    if (slots.some((x) => x === null)) {
      setModal({ title: "NOT YET", text: "Place all 8 wires into the connector first.", cls: "" });
      return;
    }
    setChecking(true);
    try {
      const { success, message } = await validateCable({ missionId, order: slots });
      if (success) {
        redirectRef.current = setTimeout(() => navigate("/feedback"), 2500);
      }
      setModal(
        success
          ? { title: "YOU WON!", text: message || "Great job! You arranged all 8 wires in the correct order.", cls: "is-win" }
          : { title: "TRY AGAIN", text: message || "The wire order is not correct yet. Use a hint if you need help.", cls: "" }
      );
    } catch {
      setModal({ title: "ERROR", text: "Could not reach the server. Please try again.", cls: "" });
    } finally {
      setChecking(false);
    }
  };

  const openHint = async (n) => {
    const title = `HINT ${n}`;
    setModal({ title, text: "Loading...", cls: "" });
    try {
      const text = await getCableHint(n);
      setModal({ title, text: text || "No hint available.", cls: "" });
    } catch {
      setModal({ title, text: "Could not load the hint.", cls: "" });
    }
  };

  const closeModal = () => {
    const won = modal?.cls === "is-win";
    clearTimeout(redirectRef.current);
    setModal(null);
    if (won) navigate("/feedback");
  };

  return (
    <div className="cc-page">
      <Header />

      <main className="cc-main">
        <aside className="cc-info">
          <svg className="cc-trophy" viewBox="0 0 64 56" aria-hidden="true">
            <defs>
              <clipPath id="cc-trophy-clip">
                <path d="M16 4h32v14c0 9-7 15-16 15s-16-6-16-15z" />
                <rect x="28" y="33" width="8" height="10" />
                <rect x="20" y="43" width="24" height="7" rx="1.5" />
              </clipPath>
            </defs>
            <g fill="none" stroke="#ffc20e" strokeWidth="3.5" strokeLinecap="round">
              <path d="M16 8H6c0 8 4 14 11 16" />
              <path d="M48 8h10c0 8-4 14-11 16" />
            </g>
            <g fill="#ffc20e">
              <path d="M16 4h32v14c0 9-7 15-16 15s-16-6-16-15z" />
              <rect x="28" y="33" width="8" height="10" />
              <rect x="20" y="43" width="24" height="7" rx="1.5" />
            </g>
            <g clipPath="url(#cc-trophy-clip)">
              <rect className="cc-shine" x="0" y="0" width="9" height="60" fill="#fff" opacity="0.75" />
            </g>
          </svg>
          <h2 className="cc-info__title">Secret Challenge Unlocked!</h2>
          <hr className="cc-info__line" />
          <p className="cc-info__text">Arrange the 8 wires in the correct order!</p>
        </aside>

        <section className="cc-card">
          <h3 className="cc-card__title">LAN Cable Challenge</h3>

          <div className="cc-card__body">
            <div className="cc-conn">
              <div className="cc-plug">
                <div className="cc-slots">
                  {slots.map((wireId, i) => (
                    <div
                      key={i}
                      className="cc-slot"
                      onDragOver={allow}
                      onDrop={(e) => dropOnSlot(e, i)}
                    >
                      <span className="cc-pin" />
                      {wireId && (
                        <Wire
                          wire={wireById(wireId)}
                          onDragStart={(e) => startDrag(e, wireId, i)}
                          onDragEnd={endDrag}
                        />
                      )}
                      <span className="cc-slot__num">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="cc-clip" />
              <div className="cc-cable" />
            </div>

            <div className="cc-divider" />

            <div className="cc-tray" onDragOver={allow} onDrop={dropOnTray}>
              {WIRES.map((w) => {
                const placed = slots.includes(w.id);
                return (
                  <div className="cc-cell" key={w.id}>
                    {!placed && (
                      <Wire
                        wire={w}
                        onDragStart={(e) => startDrag(e, w.id, "tray")}
                        onDragEnd={endDrag}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button className="cc-reset" onClick={reset} aria-label="Reset wires" title="Reset">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v5h5" />
            </svg>
          </button>

          <button className="cc-validate" onClick={validate} disabled={checking}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8V4z" /></svg>
            Validate
          </button>
        </section>

        <aside className="cc-hints">
          {[1, 2, 3, 4].map((n) => (
            <button key={n} className="cc-hint-btn" onClick={() => openHint(n)} aria-label={`Hint ${n}`}>
              {n}
            </button>
          ))}
          <span className="cc-hints__label">HINTS</span>
        </aside>
      </main>

      {modal && (
        <div className="cc-overlay" onClick={closeModal}>
          <div
            className={`cc-modal ${modal.cls}`}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="cc-modal__title">{modal.title}</h2>
            <p className="cc-modal__text">{modal.text}</p>
            <button className="cc-modal__close" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
