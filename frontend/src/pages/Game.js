import React, { useState, useEffect, useRef } from 'react';
import HintModal from '../components/HintModal';
import CongratsModal from '../components/CongratsModal';
import logoImg from '../assets/game-logo.png';

const API_BASE_URL = 'http://localhost:3000';

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

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const characters = '01';
    const fontSize = 16;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -100));

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
  const [unlockedStep, setUnlockedStep] = useState(1);
  const [loadedQuestions, setLoadedQuestions] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [messages, setMessages] = useState({});
  const [fetchingId, setFetchingId] = useState(null);
  const [checkingId, setCheckingId] = useState(null);

  const [currentHintText, setCurrentHintText] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalQuestions = 4;

  const handleStartQuestion = async (id) => {
    if (id > unlockedStep) return;
    if (loadedQuestions[id]) return;

    setFetchingId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/question/${encodeURIComponent(id)}`);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();

      // Handling multiple backend response structures safely
      const qText = data?.question || data?.message || data?.text || data?.data?.question || 'Question content loaded.';
      const hText = data?.hint || data?.data?.hint || 'Think about the components in the box.';

      setLoadedQuestions((prev) => ({
        ...prev,
        [id]: {
          question: qText,
          hint: hText
        }
      }));
    } catch (err) {
      console.error(err);
      // Fallback data if API fails so button click works visually
      const fallbacks = {
        1: "Find the most important cable in the second box",
        2: "Find the raspberry pi aka endpoint in the first box",
        3: "Find the bridge aka called switch",
        4: "Find the boat aka called router"
      };
      setLoadedQuestions((prev) => ({
        ...prev,
        [id]: {
          question: fallbacks[id] || 'Default Question',
          hint: 'Check your backend server endpoint.'
        }
      }));
    } finally {
      setFetchingId(null);
    }
  };

  const handleShowHint = async (id) => {
    const loaded = loadedQuestions[id];
    setCurrentHintText('Loading hint...');

    try {
      const response = await fetch(`${API_BASE_URL}/get/hint/${encodeURIComponent(id)}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentHintText(data?.hint || data?.message || loaded?.hint || 'No hint available.');
      } else {
        setCurrentHintText(loaded?.hint || 'No hint available.');
      }
    } catch (err) {
      setCurrentHintText(loaded?.hint || 'No hint available.');
    }
  };

  const handleDone = async (id) => {
    const answer = userAnswers[id]?.trim();
    if (!answer) {
      setMessages((prev) => ({
        ...prev,
        [id]: { text: 'Hey dude, enter an answer first!', type: 'error' }
      }));
      return;
    }

    setCheckingId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: id, answer: answer }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.success || data.status === 'correct' || data.message === 'Correct')) {
        setMessages((prev) => ({
          ...prev,
          [id]: { text: 'Awesome! Correct Answer! 🎉', type: 'success' }
        }));

        if (id === unlockedStep) {
          const nextStep = id + 1;
          setUnlockedStep(nextStep);
          if (nextStep > totalQuestions) {
            setIsCompleted(true);
          }
        }
      } else {
        const wrongMessages = [
          "Hey dude, try again! ❌",
          "Oops! Wrong answer, try once more!",
          "Not quite right! Keep thinking!"
        ];
        const randomMsg = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
        
        setMessages((prev) => ({
          ...prev,
          [id]: { text: data.message || randomMsg, type: 'error' }
        }));
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => ({
        ...prev,
        [id]: { text: 'Connection error while checking answer.', type: 'error' }
      }));
    } finally {
      setCheckingId(null);
    }
  };

  const handleSubmitAll = () => {
    if (isCompleted || unlockedStep > totalQuestions) {
      setShowCongrats(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#040c0e] py-12 px-6 flex flex-col items-center justify-center relative overflow-hidden">
      <MatrixBackground />

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

      <div className="w-full max-w-4xl space-y-4 relative z-10">
        {[1, 2, 3, 4].map((id) => {
          const isUnlocked = id <= unlockedStep;
          const isLoaded = !!loadedQuestions[id];
          const message = messages[id];

          return (
            <div
              key={id}
              className={`bg-[#061215]/95 backdrop-blur-md border-2 transition-all duration-300 p-6 rounded-none ${
                isUnlocked ? 'border-[#72c02c]/50' : 'border-gray-800 opacity-40'
              }`}
            >
              {!isLoaded ? (
                <div className="flex justify-center items-center py-10">
                  <button
                    disabled={!isUnlocked || fetchingId === id}
                    onClick={() => handleStartQuestion(id)}
                    className={`px-12 py-3.5 rounded-2xl font-black text-base shadow-lg transition cursor-pointer ${
                      isUnlocked
                        ? 'bg-[#ff5500] hover:bg-[#e04b00] text-white shadow-[0_0_15px_rgba(255,85,0,0.4)]'
                        : 'bg-[#2a2a2a] text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {fetchingId === id ? 'Loading...' : `Question ${id}`}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    <p className="text-gray-200 text-base md:text-lg leading-relaxed font-sans font-medium">
                      {loadedQuestions[id]?.question}
                    </p>

                    <div className="flex flex-col space-y-3">
                      <input
                        type="text"
                        value={userAnswers[id] || ''}
                        onChange={(e) =>
                          setUserAnswers({ ...userAnswers, [id]: e.target.value })
                        }
                        placeholder="Enter answer..."
                        className="w-full bg-white text-black px-4 py-2.5 rounded-xl font-medium outline-none text-sm shadow-inner placeholder:text-gray-400"
                      />

                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleShowHint(id)}
                          className="w-1/3 bg-[#ffb703] hover:bg-[#ffa200] text-white font-black py-2.5 rounded-xl text-sm shadow transition cursor-pointer"
                        >
                          Hint
                        </button>

                        <button
                          onClick={() => handleDone(id)}
                          disabled={checkingId === id}
                          className="w-2/3 bg-[#ff5500] hover:bg-[#e04b00] text-white font-black py-2.5 rounded-xl text-sm shadow transition cursor-pointer disabled:opacity-50"
                        >
                          {checkingId === id ? 'Checking...' : 'Done'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {message && (
                    <div
                      className={`text-center py-2 px-4 rounded-xl text-sm font-bold ${
                        message.type === 'success'
                          ? 'bg-green-900/50 text-[#72c02c] border border-[#72c02c]'
                          : 'bg-red-900/50 text-red-400 border border-red-500'
                      }`}
                    >
                      {message.text}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 relative z-10">
        <button
          onClick={handleSubmitAll}
          disabled={unlockedStep <= totalQuestions && !isCompleted}
          className={`w-64 py-3.5 rounded-2xl font-black text-base shadow-xl transition ${
            isCompleted || unlockedStep > totalQuestions
              ? 'bg-[#ff5500] hover:bg-[#e04b00] text-white cursor-pointer shadow-[0_0_20px_rgba(255,85,0,0.5)]'
              : 'bg-[#2a2a2a] text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>

      {currentHintText !== null && (
        <HintModal
          hintText={currentHintText}
          onClose={() => setCurrentHintText(null)}
        />
      )}

      {showCongrats && (
        <CongratsModal
          onClose={() => setShowCongrats(false)}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}