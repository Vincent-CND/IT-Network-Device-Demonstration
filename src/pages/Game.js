
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

    const drops = Array.from(
      { length: columns },
      () => Math.floor(Math.random() * -100)
    );

    const draw = (currentTime) => {
      animationFrameId = requestAnimationFrame(draw);

      const deltaTime = currentTime - lastTime;
      if (deltaTime < interval) return;

      lastTime = currentTime - (deltaTime % interval);

      ctx.fillStyle = 'rgba(4, 12, 14, 0.35)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "Fredoka", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(
          Math.floor(Math.random() * characters.length)
        );

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
  const [answers, setAnswers] = useState([]);
  const [currentHintText, setCurrentHintText] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // API Data States
  const [stepsData, setStepsData] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // References to track question card positions
  const cardRefs = useRef([]);

  // Dynamic top offset for robot companion
  const [robotTop, setRobotTop] = useState(0);

  // -------------------------------------------------------------
  // API Calls: Fetch Steps and Questions
  // No loop used for API requests
  // -------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    const fetchGameData = async () => {
      try {
        setLoading(true);
        setError(null);

        // GET /step/1
        const stepResponse1 = await fetch('http://localhost:3000/step/1');
        if (!stepResponse1.ok) {
          throw new Error(`Step 1 API error: ${stepResponse1.status}`);
        }
        const stepResult1 = await stepResponse1.json();

        // GET /step/2
        const stepResponse2 = await fetch('http://localhost:3000/step/2');
        if (!stepResponse2.ok) {
          throw new Error(`Step 2 API error: ${stepResponse2.status}`);
        }
        const stepResult2 = await stepResponse2.json();

        // GET /step/3
        const stepResponse3 = await fetch('http://localhost:3000/step/3');
        if (!stepResponse3.ok) {
          throw new Error(`Step 3 API error: ${stepResponse3.status}`);
        }
        const stepResult3 = await stepResponse3.json();

        // GET /step/4
        const stepResponse4 = await fetch('http://localhost:3000/step/4');
        if (!stepResponse4.ok) {
          throw new Error(`Step 4 API error: ${stepResponse4.status}`);
        }
        const stepResult4 = await stepResponse4.json();

        // GET /step/5
        const stepResponse5 = await fetch('http://localhost:3000/step/5');
        if (!stepResponse5.ok) {
          throw new Error(`Step 5 API error: ${stepResponse5.status}`);
        }
        const stepResult5 = await stepResponse5.json();

        // GET /question/1
        const questionResponse1 = await fetch(
          'http://localhost:3000/question/1'
        );
        if (!questionResponse1.ok) {
          throw new Error(`Question 1 API error: ${questionResponse1.status}`);
        }
        const questionResult1 = await questionResponse1.json();

        // GET /question/2
        const questionResponse2 = await fetch(
          'http://localhost:3000/question/2'
        );
        if (!questionResponse2.ok) {
          throw new Error(`Question 2 API error: ${questionResponse2.status}`);
        }
        const questionResult2 = await questionResponse2.json();

        // GET /question/3
        const questionResponse3 = await fetch(
          'http://localhost:3000/question/3'
        );
        if (!questionResponse3.ok) {
          throw new Error(`Question 3 API error: ${questionResponse3.status}`);
        }
        const questionResult3 = await questionResponse3.json();

        // GET /question/4
        const questionResponse4 = await fetch(
          'http://localhost:3000/question/4'
        );
        if (!questionResponse4.ok) {
          throw new Error(`Question 4 API error: ${questionResponse4.status}`);
        }
        const questionResult4 = await questionResponse4.json();

        if (cancelled) return;

        setStepsData([
          stepResult1.message,
          stepResult2.message,
          stepResult3.message,
          stepResult4.message,
          stepResult5.message,
        ]);

        const question1 = questionResult1.data || questionResult1;
        const question2 = questionResult2.data || questionResult2;
        const question3 = questionResult3.data || questionResult3;
        const question4 = questionResult4.data || questionResult4;

        const fetchedQuestions = [
          question1,
          question2,
          question3,
          question4,
        ];

        setQuestionsData(fetchedQuestions);
        setAnswers(['', '', '', '']);
      } catch (err) {
        console.error('API Fetch Error:', err);

        if (!cancelled) {
          setError('Failed to load questions from backend server.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchGameData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Calculate dynamic top offset for robot companion
  useEffect(() => {
    if (cardRefs.current[activeStep]) {
      const cardElement = cardRefs.current[activeStep];
      setRobotTop(cardElement.offsetTop);
    }
  }, [activeStep, questionsData]);

  // -------------------------------------------------------------
  // API Calls: Fetch Hints
  // -------------------------------------------------------------
  const handleHint = async (index, item) => {
    try {
      let hintResult;

      if (index === 0) {
        // GET /get/hint/1
        const response = await fetch('http://localhost:3000/get/hint/1');
        if (!response.ok) throw new Error(`Hint API error: ${response.status}`);
        hintResult = await response.json();
      } else if (index === 1) {
        // GET /get/hint/2
        const response = await fetch('http://localhost:3000/get/hint/2');
        if (!response.ok) throw new Error(`Hint API error: ${response.status}`);
        hintResult = await response.json();
      } else if (index === 2) {
        // GET /get/hint/3
        const response = await fetch('http://localhost:3000/get/hint/3');
        if (!response.ok) throw new Error(`Hint API error: ${response.status}`);
        hintResult = await response.json();
      } else if (index === 3) {
        // GET /get/hint/4
        const response = await fetch('http://localhost:3000/get/hint/4');
        if (!response.ok) throw new Error(`Hint API error: ${response.status}`);
        hintResult = await response.json();
      }

      const hintText =
        hintResult?.data?.hint ??
        hintResult?.data?.message ??
        hintResult?.hint ??
        hintResult?.message ??
        item.hint ??
        'No hint available.';

      setCurrentHintText(hintText);
    } catch (err) {
      console.error('API Hint Error:', err);

      // Use the hint already included in the question response, if available.
      if (item.hint) {
        setCurrentHintText(item.hint);
      } else {
        setError('Failed to load hint from backend server.');
      }
    }
  };

  const handleDone = (index) => {
    if (answers[index] && answers[index].trim() !== '') {
      if (index === activeStep && activeStep < questionsData.length - 1) {
        setActiveStep(activeStep + 1);
      } else if (index === questionsData.length - 1) {
        setIsCompleted(true);
      }
    }
  };

  // -------------------------------------------------------------
  // API Call: Submit Answers to Backend
  // POST /answer
  // -------------------------------------------------------------
  const handleSubmit = async () => {
    if (isCompleted && answers.every((answer) => answer.trim() !== '')) {
      try {
        const response = await fetch('http://localhost:3000/answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success || result.message) {
          setShowCongrats(true);
        } else {
          alert('Submission failed. Please try again.');
        }
      } catch (err) {
        console.error('API Submit Error:', err);
        alert('Error connecting to backend server.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040c0e] flex items-center justify-center text-white font-black text-xl">
        Loading Cyber Quest Data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#040c0e] flex items-center justify-center text-red-500 font-bold text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040c0e] py-12 px-6 flex flex-col items-center justify-center relative overflow-hidden">
      <MatrixBackground />

      {/* Cyber Quest Header Logo */}
      <div className="flex flex-col items-center justify-center mb-8 relative z-10">
        <div className="w-16 h-16 flex items-center justify-center mb-1">
          <img
            src={logoImg}
            alt="Cyber Quest Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(114,192,44,0.4)]"
          />
        </div>
        <span className="text-white font-black text-sm tracking-widest">
          CYBER QUEST
        </span>
      </div>

      {/* Main layout container */}
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
            <span className="text-[#72c02c] font-black text-xs tracking-widest">
              Q0{activeStep + 1}
            </span>
          </div>
        </div>

        {/* Mobile responsive robot position indicator */}
        <div className="lg:hidden flex items-center justify-center mb-6 bg-[#061215]/95 border-2 border-[#72c02c] p-3 rounded-2xl shadow-[0_0_15px_rgba(114,192,44,0.3)]">
          <span className="text-white text-xs font-bold mr-2">
            🤖 BOT-X is at:
          </span>
          <span className="text-[#72c02c] font-black text-sm">
            Question 0{activeStep + 1}
          </span>
        </div>

        {/* Questions card list */}
        <div className="space-y-4 w-full">
          {questionsData.map((item, index) => {
            const isUnlocked = index <= activeStep;
            const isCurrentActive = index === activeStep && !isCompleted;

            return (
              <div
                key={item.id || index}
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
                    {item.question}
                  </p>

                  <div className="flex flex-col space-y-3">
                    <input
                      type="text"
                      disabled={!isUnlocked}
                      value={answers[index] || ''}
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
                        onClick={() => handleHint(index, item)}
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
          disabled={
            !isCompleted || !answers.every((answer) => answer.trim() !== '')
          }
          className={`w-64 py-3.5 rounded-2xl font-black text-base shadow-xl transition ${
            isCompleted && answers.every((answer) => answer.trim() !== '')
              ? 'bg-[#ff5500] hover:bg-[#e04b00] text-white cursor-pointer shadow-[0_0_20px_rgba(255,85,0,0.5)]'
              : 'bg-[#3a3a3a] text-gray-400 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>

      {/* Dynamic hint modal component */}
      {currentHintText !== null && (
        <HintModal
          hintText={currentHintText}
          onClose={() => setCurrentHintText(null)}
        />
      )}

      {/* Congratulations modal component */}
      {showCongrats && (
        <CongratsModal
          onClose={() => setShowCongrats(false)}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
