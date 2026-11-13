import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import robot from "../assets/robot.png";
import { getMission } from "../api";
import "./MissionSelect.css";

export default function MissionSelect() {
  const navigate = useNavigate();
  const { id: missionId } = useParams();
  const [steps, setSteps] = useState([]);
  const [opened, setOpened] = useState([]);

  useEffect(() => {
    let active = true;
    setOpened([]);
    getMission(missionId)
      .then((list) => active && setSteps(list))
      .catch(() => active && setSteps(Array(4).fill("Could not load this mission.")));
    return () => { active = false; };
  }, [missionId]);

  const toggle = (n) =>
    setOpened((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));

  return (
    <div className="ms-page">
      <Header />

      <main className="ms-main">
        <nav className="ms-levels" aria-label="Mission steps">
          {[1, 2, 3, 4].map((n) => {
            const isOpen = opened.includes(n);
            return (
              <div className="ms-row" key={n}>
                <button
                  className={`ms-level ${isOpen ? "is-active" : ""}`}
                  onClick={() => toggle(n)}
                  aria-expanded={isOpen}
                >
                  {n}
                </button>
                <div className={`ms-step ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
                  {steps[n - 1] ?? ""}
                </div>
              </div>
            );
          })}
        </nav>

        <aside className="ms-side">
          <div className="ms-bubble">
            Don't worry too much, we got your back with hint.
          </div>

          <div className="ms-robot">
            <img src={robot} alt="Helper robot" />
            <div className="ms-robot__shadow" />
          </div>

          <button className="ms-start" onClick={() => navigate(`/network/${missionId}/build`)}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4l14 8-14 8V4z" />
            </svg>
            Start Mission
          </button>
        </aside>
      </main>
    </div>
  );
}
