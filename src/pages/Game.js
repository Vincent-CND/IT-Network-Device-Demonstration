import React, { useState, useEffect, useRef } from 'react';
import HintModal from '../components/HintModal';
import CongratsModal from '../components/CongratsModal';
import logoImg from '../assets/game-logo.png';

// Matrix digital rain background canvas component
function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let lastTime = 0;
    const fps = 25;
    const interval = 1000 / fps;

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

    const draw = (currentTime) => {
      animationFrameId = requestAnimationFrame(draw);

      const deltaTime = currentTime - lastTime;
      if (deltaTime < interval) return;

      lastTime = currentTime - (deltaTime % interval);

      ctx.fillStyle = 'rgba(4, 12, 14, 0.35)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "Fredoka", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        ctx.fillStyle = '#1c5d26'; 
        ctx.shadowBlur = 0;

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

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

export default function Game({ setCurrentPage }) {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState(['', '', '', '']);
  const [currentHintIndex, setCurrentHintIndex] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // References to track question card positions for smooth robot movement
  const cardRefs = useRef([]);

  const questions = [
    "Q1. Find the most important cable.",
    "Q2. Find the Raspberry Pi, also called the \"Endpoint,\" in the first box.",
    "Q3. Find the \"Bridge,\" also called a switch.",
    "Q4. Find the \"Boat,\" also called a router."
  ];

  const hints = [
    "Appearance of devices.",
    "Think about it. It looks like your computer.",
    "Imagine it is relevant to a real bridge, which is visited by many people.",
    "It will be the last device, but it serves as the boat to transport the goods to another world."
  ];

  // Calculate dynamic top offset for the robot companion based on active question card position
  const [robotTop, setRobotTop] = useState(0);

  useEffect(() => {
    if (cardRefs.current[activeStep]) {
      const cardElement = cardRefs.current[activeStep];
      setRobotTop(cardElement.offsetTop);
    }
  }, [activeStep]);

  const handleDone = (index) => {
    if (answers[index].trim() !== '') {
      if (index === activeStep && activeStep < 3) {
        setActiveStep(activeStep + 1);
      } else if (index === 3) {
        setIsCompleted(true);
      }
    }
  };

  const handleSubmit = () => {
    if (isCompleted && answers.every(a => a.trim() !== '')) {
      setShowCongrats(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#040c0e] py-12 px-6 flex flex-col items-center justify-center relative overflow-hidden">
      <MatrixBackground />

      {/* Cyber Quest Header Logo */}
      <div className="flex flex-col items-center justify-center mb-8 relative z-10">
        <div className="w-16 h-16 flex items-center justify-center mb-1">
          <img src={logoImg} alt="Cyber Quest Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(114,192,44,0.4)]" />
        </div>
        <span className="text-white font-black text-sm tracking-widest">CYBER QUEST</span>
      </div>

      {/* Main layout container with relative positioning for smooth robot movement */}
      <div className="w-full max-w-5xl relative z-10 lg:pl-40">
        
        {/* Moving robot companion on the left side */}
        <div 
          className="hidden lg:flex flex-col items-center p-4 bg-[#061215]/95 border-2 border-[#72c02c] rounded-3xl shadow-[0_0_25px_rgba(114,192,44,0.3)] backdrop-blur-md absolute left-0 w-32 transition-all duration-500 ease-in-out z-20"
          style={{ top: `${robotTop}px` }}
        >
          <style>{`
            @keyframes floatAnim {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-6px) rotate(1deg); }
            }
            .animate-float {
              animation: floatAnim 3s ease-in-out infinite;
            }
          `}</style>

          <div className="relative w-20 h-20 bg-[#0b1b20] border-2 border-[#72c02c] rounded-2xl flex flex-col items-center justify-center shadow-inner animate-float mb-2">
            <div className="absolute -top-2 w-3 h-1.5 bg-[#72c02c] rounded-full animate-ping" />
            <div className="flex space-x-2 mb-1.5">
              <div className="w-2.5 h-2.5 bg-[#72c02c] rounded-full shadow-[0_0_6px_#72c02c]" />
              <div className="w-2.5 h-2.5 bg-[#72c02c] rounded-full shadow-[0_0_6px_#72c02c]" />
            </div>
            <span className="text-[#ff5500] font-black text-[10px] tracking-widest">
              BOT-X
            </span>
            <div className="w-8 h-1 bg-[#72c02c] mt-1 rounded-full shadow-[0_0_4px_rgba(114,192,44,0.8)]" />
          </div>

          <div className="text-center">
            <span className="text-[#72c02c] font-black text-xs tracking-widest">Q0{activeStep + 1}</span>
          </div>
        </div>

        {/* Mobile responsive robot position indicator */}
        <div className="lg:hidden flex items-center justify-center mb-6 bg-[#061215]/95 border-2 border-[#72c02c] p-3 rounded-2xl shadow-[0_0_15px_rgba(114,192,44,0.3)]">
          <span className="text-white text-xs font-bold mr-2">🤖 BOT-X is at:</span>
          <span className="text-[#72c02c] font-black text-sm">Question 0{activeStep + 1}</span>
        </div>

        {/* Questions card list */}
        <div className="space-y-4 w-full">
          {questions.map((q, index) => {
            const isUnlocked = index <= activeStep;
            const isCurrentActive = index === activeStep && !isCompleted;

            return (
              <div 
                key={index} 
                ref={(el) => (cardRefs.current[index] = el)}
                className={`bg-[#061215]/95 backdrop-blur-md border-2 transition-all duration-300 p-6 rounded-none ${
                  isCurrentActive
                    ? 'border-[#ff5500] shadow-[0_0_25px_rgba(255,85,0,0.3)] scale-[1.01]' 
                    : isUnlocked 
                      ? 'border-[#72c02c]/60 shadow-[0_0_15px_rgba(114,192,44,0.1)]' 
                      : 'border-emerald-950/40 opacity-20 filter blur-[1px]'
                }`}
              >
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <p className="text-gray-200 text-base md:text-lg leading-relaxed font-sans font-medium">
                    {q}
                  </p>

                  <div className="flex flex-col space-y-3">
                    <input
                      type="text"
                      disabled={!isUnlocked}
                      value={answers[index]}
                      onChange={(e) => {
                        const newAns = [...answers];
                        newAns[index] = e.target.value;
                        setAnswers(newAns);
                      }}
                      placeholder="Enter answer..."
                      className="w-full bg-white text-black px-4 py-2.5 rounded-xl font-medium outline-none text-sm shadow-inner placeholder:text-gray-400"
                    />
                    
                    <div className="flex space-x-3">
                      <button
                        disabled={!isUnlocked}
                        onClick={() => setCurrentHintIndex(index)}
                        className="w-1/3 bg-[#ffb703] hover:bg-[#ffa200] text-white font-black py-2.5 rounded-xl text-sm shadow transition cursor-pointer disabled:opacity-50"
                      >
                        Hint
                      </button>
                      <button
                        disabled={!isUnlocked}
                        onClick={() => handleDone(index)}
                        className="w-2/3 bg-[#ff5500] hover:bg-[#e04b00] text-white font-black py-2.5 rounded-xl text-sm shadow transition cursor-pointer disabled:opacity-50"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Main submit button */}
      <div className="mt-8 relative z-10">
        <button
          onClick={handleSubmit}
          disabled={!isCompleted || !answers.every(a => a.trim() !== '')}
          className={`w-64 py-3.5 rounded-2xl font-black text-base shadow-xl transition ${
            isCompleted && answers.every(a => a.trim() !== '')
              ? 'bg-[#ff5500] hover:bg-[#e04b00] text-white cursor-pointer shadow-[0_0_20px_rgba(255,85,0,0.5)]'
              : 'bg-[#3a3a3a] text-gray-400 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>

      {/* Dynamic hint modal component */}
      {currentHintIndex !== null && (
        <HintModal 
          hintText={hints[currentHintIndex]} 
          onClose={() => setCurrentHintIndex(null)} 
        />
      )}

      {/* Congratulations modal component */}
      {showCongrats && <CongratsModal onClose={() => setShowCongrats(false)} setCurrentPage={setCurrentPage} />}
    </div>
  );
}