import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function useMatrixRain(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, drops = [], raf = 0, last = 0;

    const rand = (a, b) => a + Math.random() * (b - a);
    const bit = () => (Math.random() < 0.5 ? "0" : "1");

    const makeDrop = (x, spread) => {
      const size = rand(h * 0.07, h * 0.15);
      const len = Math.floor(rand(4, 11));
      return {
        x,
        size,
        len,
        speed: rand(h * 0.25, h * 0.8),
        y: rand(-h * spread, h),
        alpha: rand(0.35, 0.95),
        chars: Array.from({ length: len }, bit),
      };
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const spacing = h * 0.34;
      const count = Math.ceil(w / spacing);
      drops = Array.from({ length: count }, (_, i) =>
        makeDrop(i * spacing + rand(0, spacing * 0.6), 1)
      );
      draw(0);
    };

    const draw = (dt) => {
      ctx.clearRect(0, 0, w, h);
      for (const d of drops) {
        d.y += d.speed * dt;
        if (d.y - d.len * d.size * 1.2 > h) Object.assign(d, makeDrop(d.x, 0.6), { y: -d.size });
        if (Math.random() < 0.02) d.chars[Math.floor(Math.random() * d.len)] = bit();

        ctx.font = `${d.size}px "Courier New", monospace`;
        ctx.textAlign = "center";
        for (let k = 0; k < d.len; k++) {
          const cy = d.y - k * d.size * 1.2;
          if (cy < -d.size || cy > h + d.size) continue;
          const fade = 1 - k / d.len;
          if (k === 0) {
            ctx.shadowColor = "#3bd520";
            ctx.shadowBlur = d.size * 1.2;
            ctx.fillStyle = `rgba(150, 255, 110, ${d.alpha})`;
          } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(59, 213, 32, ${fade * d.alpha * 0.8})`;
          }
          ctx.fillText(d.chars[k], d.x, cy);
        }
      }
      ctx.shadowBlur = 0;
    };

    const loop = (t) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (!reduce) raf = requestAnimationFrame((t) => { last = t; loop(t); });

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef]);
}

export default function Header() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  useMatrixRain(canvasRef);

  return (
    <header className="hdr">
      <canvas ref={canvasRef} className="hdr__rain" aria-hidden="true" />
      <div className="hdr__left">
        <button className="hdr__btn" aria-label="Home" onClick={() => navigate("/")}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3L12 3z" />
          </svg>
        </button>
        <button className="hdr__btn" aria-label="Help">
          <span className="hdr__q">?</span>
        </button>
      </div>

      <div className="hdr__logo">
        <svg className="hdr__logo-icon" viewBox="0 0 40 40">
          <g stroke="#3bd520" strokeWidth="3" fill="#3bd520" strokeLinecap="round">
            <line x1="8" y1="20" x2="22" y2="9" />
            <line x1="8" y1="20" x2="22" y2="31" />
            <line x1="8" y1="20" x2="33" y2="20" />
            <circle cx="8" cy="20" r="4.5" />
            <circle cx="22" cy="9" r="4" />
            <circle cx="22" cy="31" r="4" />
            <circle cx="33" cy="20" r="3.5" />
          </g>
        </svg>
        <h1 className="hdr__title">
          NETWORK <span>BUILDER</span>
        </h1>
      </div>
    </header>
  );
}
