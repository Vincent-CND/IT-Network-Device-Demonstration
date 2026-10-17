
import React, { useState, useEffect, useRef } from 'react';
import HintModal from '../components/HintModal';
import CongratsModal from '../components/CongratsModal';
import logoImg from '../assets/game-logo.png';

const API_URL = 'http://localhost:3000';

// Matrix digital rain background — original UI
function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let lastTime = 0;

    const fps = 25;
    const interval = 1000 / fps;
    const fontSize = 16;
    const characters = '01';

    let drops = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const columns = Math.floor(canvas.width / fontSize);

      drops = Array.from(
        { length: columns },
        () => Math.floor(Math.random() * -100)
      );
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = (currentTime) => {
      animationFrameId = requestAnimationFrame(draw);

      const deltaTime = currentTime - lastTime;
      if (deltaTime < interval) return;

      lastTime = currentTime - (deltaTime % interval);

      ctx.fillStyle = 'rgba(4, 12, 14, 0.35)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "Fredoka", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const character = characters.charAt(
          Math.floor(Math.random() * characters.length)
        );

        ctx.fillStyle = '#1c5d26';
        ctx.shadowBlur = 0;

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(character, x, y);

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

// Fallback questions if the API cannot provide a question
const defaultQuestions = [
  {
    id: 1,
    question: 'Find the most important cable in the second box',
    hint: 'Look at the appearance of the devices.',
  },
  {
    id: 2,
    question: 'Find the Raspberry Pi, also known as the endpoint, in the first box',
    hint: 'Think about your computer. The device looks similar.',
  },
  {
    id: 3,
    question: 'Find the bridge, also known as the switch',
    hint: 'Think about a real bridge that many people use.',
  },
  {
    id: 4,
    question: 'Find the boat, also known as the router',
    hint: 'It is the last device and transports data to another network.',
  },
  {
    id: 5,
    question: 'Complete the final challenge to save your world',
    hint: 'Review the network devices and how they connect.',
  },
];

// Support common backend response formats
function normalizeQuestion(result, index) {
  const data = result?.data ?? result;

  const question =
    typeof data === 'string'
      ? data
      : data?.question ?? data?.message;

  return {
    ...defaultQuestions[index],
    ...(typeof data === 'object' && data !== null ? data : {}),
    id: data?.id ?? index + 1,
    question: question || defaultQuestions[index].question,
    hint: data?.hint ?? data?.data?.hint ?? defaultQuestions[index].hint,
  };
}

function normalizeHint(result) {
  const data = result?.data ?? result;

  if (typeof data === 'string') return data;

  return (
    data?.hint ??
    data?.message ??
    'No hint available.'
  );
}

export default function Game({ setCurrentPage }) {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState(['', '', '', '', '']);
  const [currentHintText, setCurrentHintText] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const cardRefs = useRef([]);
  const [robotTop, setRobotTop] = useState(0);

  // Load all five questions.
  // Each API request is explicit; no loop for API calls.
  useEffect(() => {
    let cancelled = false;

    async function fetchQuestions() {
      setLoading(true);
      setError(null);

      try {
        let question1 = defaultQuestions[0];
        let question2 = defaultQuestions[1];
        let question3 = defaultQuestions[2];
        let question4 = defaultQuestions[3];
        let question5 = defaultQuestions[4];

        try {
          const response = await fetch(`${API_URL}/question/1`);
          if (response.ok) {
            question1 = normalizeQuestion(await response.json(), 0);
          } else {
            console.warn('Question 1 API error:', response.status);
          }
        } catch (err) {
          console.warn('Question 1 unavailable:', err);
        }

        try {
          const response = await fetch(`${API_URL}/question/2`);
          if (response.ok) {
            question2 = normalizeQuestion(await response.json(), 1);
          } else {
            console.warn('Question 2 API error:', response.status);
          }
        } catch (err) {
          console.warn('Question 2 unavailable:', err);
        }

        try {
          const response = await fetch(`${API_URL}/question/3`);
          if (response.ok) {
            question3 = normalizeQuestion(await response.json(), 2);
          } else {
            console.warn('Question 3 API error:', response.status);
          }
        } catch (err) {
          console.warn('Question 3 unavailable:', err);
        }

        try {
          const response = await fetch(`${API_URL}/question/4`);
          if (response.ok) {
            question4 = normalizeQuestion(await response.json(), 3);
          } else {
            console.warn('Question 4 API error:', response.status);
          }
        } catch (err) {
          console.warn('Question 4 unavailable:', err);
        }

        try {
          const response = await fetch(`${API_URL}/question/5`);
          if (response.ok) {
            question5 = normalizeQuestion(await response.json(), 4);
          } else {
            console.warn('Question 5 API error:', response.status);
          }
        } catch (err) {
          console.warn('Question 5 unavailable:', err);
        }

        if (cancelled) return;

        setQuestionsData([
          question1,
          question2,
          question3,
          question4,
          question5,
        ]);

        setAnswers(['', '', '', '', '']);
      } catch (err) {
        console.error('Question loading error:', err);

        if (!cancelled) {
          setError('Could not load game data.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchQuestions();

    return () => {
      cancelled = true;
    };
  }, []);

  // Keep BOT-X aligned with the active question card
  useEffect(() => {
    const updateRobotPosition = () => {
      const card = cardRefs.current[activeStep];

      if (card) {
        setRobotTop(card.offsetTop);
      }
    };

    updateRobotPosition();
    window.addEventListener('resize', updateRobotPosition);

    return () => {
      window.removeEventListener('resize', updateRobotPosition);
    };
  }, [activeStep, questionsData]);

  // Fetch the hint from the backend
  async function handleHint(index, item) {
    setError(null);

    try {
      let hintResult;

      if (index === 0) {
        const response = await fetch(`${API_URL}/get/hint/1`);
        if (!response.ok) throw new Error(`Hint 1 API error: ${response.status}`);
        hintResult = await response.json();
      } else if (index === 1) {
        const response = await fetch(`${API_URL}/get/hint/2`);
        if (!response.ok) throw new Error(`Hint 2 API error: ${response.status}`);
        hintResult = await response.json();
      } else if (index === 2) {
        const response = await fetch(`${API_URL}/get/hint/3`);
        if (!response.ok) throw new Error(`Hint 3 API error: ${response.status}`);
        hintResult = await response.json();
      } else if (index === 3) {
        const response = await fetch(`${API_URL}/get/hint/4`);
        if (!response.ok) throw new Error(`Hint 4 API error: ${response.status}`);
        hintResult = await response.json();
      } else if (index === 4) {
        const response = await fetch(`${API_URL}/get/hint/5`);
        if (!response.ok) throw new Error(`Hint 5 API error: ${response.status}`);
        hintResult = await response.json();
      }

      setCurrentHintText(
        hintResult ? normalizeHint(hintResult) : item.hint
      );
    } catch (err) {
      console.error('Hint API error:', err);

      // If the hint API is unavailable, use the fallback hint.
      setCurrentHintText(
        item?.hint || 'Hint is currently unavailable.'
      );
    }
  }

  // Original Done button behaviour
  function handleDone(index) {
    if (!answers[index]?.trim()) {
      setError('Please enter an answer before pressing Done.');
      return;
    }

    setError(null);

    if (index === activeStep && activeStep < questionsData.length - 1) {
      setActiveStep((previous) => previous + 1);
    } else if (index === questionsData.length - 1) {
      setIsCompleted(true);
    }
  }

  // Submit all answers using the original backend contract
  async function handleSubmit() {
    const allAnswersFilled =
      answers.length === 5 &&
      answers.every((answer) => answer.trim() !== '');

    if (!isCompleted || !allAnswersFilled || submitting) return;

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`${API_URL}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      let result = {};

      try {
        result = await response.json();
      } catch {
        // The server may return an empty response body.
      }

      if (!response.ok) {
        throw new Error(
          result?.message || `Answer API error: ${response.status}`
        );
      }

      if (result.success === true || result.message) {
        setShowCongrats(true);
      } else {
        setError('Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Answer submission error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Error connecting to backend server.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040c0e] flex items-center justify-center text-white font-black text-xl">
        Loading Cyber Quest Data...
      </div>
    );
  }

  if (error && questionsData.length === 0) {
    return (
      <div className="min-h-screen bg-[#040c0e] flex flex-col items-center justify-center gap-4 px-6 text-center text-red-400 font-bold text-lg">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-[#ff5500] px-5 py-3 text-white text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040c0e] py-12 px-6 flex flex-col items-center justify-center relative overflow-hidden">
      <MatrixBackground />

      {/* Original Cyber Quest Header Logo */}
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

      {/* Original main layout */}
      <div className="w-full max-w-5xl relative z-10 lg:pl-40">

        {/* Original moving BOT-X companion */}
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

        {/* Original mobile robot indicator */}
        <div className="lg:hidden flex items-center justify-center mb-6 bg-[#061215]/95 border-2 border-[#72c02c] p-3 rounded-2xl shadow-[0_0_15px_rgba(114,192,44,0.3)]">
          <span className="text-white text-xs font-bold mr-2">
            🤖 BOT-X is at:
          </span>
          <span className="text-[#72c02c] font-black text-sm">
            Question 0{activeStep + 1}
          </span>
        </div>

        {/* Original question cards */}
        <div className="space-y-4 w-full">
          {questionsData.map((item, index) => {
            const isUnlocked = index <= activeStep;
            const isCurrentActive =
              index === activeStep && !isCompleted;

            return (
              <div
                key={item.id || index}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
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
                      disabled={!isUnlocked || submitting}
                      value={answers[index] || ''}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[index] = e.target.value;
                        setAnswers(newAnswers);
                        setError(null);
                      }}
                      placeholder="Enter answer..."
                      className="w-full bg-white text-black px-4 py-2.5 rounded-xl font-medium outline-none text-sm shadow-inner placeholder:text-gray-400 disabled:opacity-60"
                    />

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        disabled={!isUnlocked || submitting}
                        onClick={() => handleHint(index, item)}
                        className="w-1/3 bg-[#ffb703] hover:bg-[#ffa200] text-white font-black py-2.5 rounded-xl text-sm shadow transition cursor-pointer disabled:opacity-50"
                      >
                        Hint
                      </button>

                      <button
                        type="button"
                        disabled={!isUnlocked || submitting}
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

      {/* Original Submit button */}
      <div className="mt-8 relative z-10">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            !isCompleted ||
            !answers.every((answer) => answer.trim() !== '') ||
            submitting
          }
          className={`w-64 py-3.5 rounded-2xl font-black text-base shadow-xl transition ${
            isCompleted &&
            answers.every((answer) => answer.trim() !== '') &&
            !submitting
              ? 'bg-[#ff5500] hover:bg-[#e04b00] text-white cursor-pointer shadow-[0_0_20px_rgba(255,85,0,0.5)]'
              : 'bg-[#3a3a3a] text-gray-400 cursor-not-allowed'
          }`}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>

        {error && (
          <p role="alert" className="mt-3 max-w-md text-center text-sm text-red-400">
            {error}
          </p>
        )}
      </div>

      {/* Original HintModal */}
      {currentHintText !== null && (
        <HintModal
          hintText={currentHintText}
          onClose={() => setCurrentHintText(null)}
        />
      )}

      {/* Original CongratsModal */}
      {showCongrats && (
        <CongratsModal
          onClose={() => setShowCongrats(false)}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
