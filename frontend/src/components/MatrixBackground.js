import React, { useEffect, useRef } from 'react';

export default function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const characters = '01';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);

    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -100));

    const draw = () => {
      ctx.fillStyle = 'rgba(7, 19, 23, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "Fredoka", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        const isLeadingChar = Math.random() > 0.85;
        if (isLeadingChar) {
          ctx.fillStyle = '#b3f046';
          ctx.shadowColor = '#b3f046';
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = '#20692B';
          ctx.shadowColor = '#20692B';
          ctx.shadowBlur = 4;
        }

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}