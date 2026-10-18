
import React, { useState, useEffect, useRef } from 'react';
import boxAImg from '../assets/boxA.png';
import boxBImg from '../assets/boxB.png';
import clickSoundFile from '../assets/click-box.mp3';

const API_BASE_URL = 'http://localhost:3000';

// Fetch a step by ID
async function getStep(id) {
  const response = await fetch(
    `${API_BASE_URL}/step/${encodeURIComponent(id)}`
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export default function Mission({ setCurrentPage }) {
  const [expandedSteps, setExpandedSteps] = useState([]);
  const [shakingId, setShakingId] = useState(null);

  // API Data States
  const [stepsData, setStepsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Audio reference
  const audioRef = useRef(null);

  // Default fallback steps
  const defaultSteps = [
    {
      id: 1,
      title: 'Step 1',
      description: 'Your world will have been taken from the enemy.'
    },
    {
      id: 2,
      title: 'Step 2',
      description: 'Mission is to create a way to save your world.'
    },
    {
      id: 3,
      title: 'Step 3',
      description: "You're gonna have 5 different questions and hint to solve it."
    },
    {
      id: 4,
      title: 'Step 4',
      description: 'You also have two boxes with different components inside.'
    },
    {
      id: 5,
      title: 'Step 5',
      description: 'If you can solve successfully all, and find the way to cope with final on, you win the game and get a prize.'
    }
  ];

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(clickSoundFile);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Fetch each step separately using getStep()
  useEffect(() => {
    let cancelled = false;

    async function fetchAllSteps() {
      setLoading(true);
      setError(null);

      let step1 = defaultSteps[0];
      let step2 = defaultSteps[1];
      let step3 = defaultSteps[2];
      let step4 = defaultSteps[3];
      let step5 = defaultSteps[4];

      // Request /step/1
      try {
        const data = await getStep(1);
        console.log('Step 1:', data.message);

        if (
          typeof data.message === 'string' &&
          data.message.trim() !== '' &&
          data.message !== 'There are no more steps'
        ) {
          step1 = {
            id: 1,
            title: 'Step 1',
            description: data.message
          };
        }
      } catch (error) {
        console.error('Error fetching step 1:', error);
      }

      // Request /step/2
      try {
        const data = await getStep(2);
        console.log('Step 2:', data.message);

        if (
          typeof data.message === 'string' &&
          data.message.trim() !== '' &&
          data.message !== 'There are no more steps'
        ) {
          step2 = {
            id: 2,
            title: 'Step 2',
            description: data.message
          };
        }
      } catch (error) {
        console.error('Error fetching step 2:', error);
      }

      // Request /step/3
      try {
        const data = await getStep(3);
        console.log('Step 3:', data.message);

        if (
          typeof data.message === 'string' &&
          data.message.trim() !== '' &&
          data.message !== 'There are no more steps'
        ) {
          step3 = {
            id: 3,
            title: 'Step 3',
            description: data.message
          };
        }
      } catch (error) {
        console.error('Error fetching step 3:', error);
      }

      // Request /step/4
      try {
        const data = await getStep(4);
        console.log('Step 4:', data.message);

        if (
          typeof data.message === 'string' &&
          data.message.trim() !== '' &&
          data.message !== 'There are no more steps'
        ) {
          step4 = {
            id: 4,
            title: 'Step 4',
            description: data.message
          };
        }
      } catch (error) {
        console.error('Error fetching step 4:', error);
      }

      // Request /step/5
      try {
        const data = await getStep(5);
        console.log('Step 5:', data.message);

        if (
          typeof data.message === 'string' &&
          data.message.trim() !== '' &&
          data.message !== 'There are no more steps'
        ) {
          step5 = {
            id: 5,
            title: 'Step 5',
            description: data.message
          };
        }
      } catch (error) {
        console.error('Error fetching step 5:', error);
      }

      if (!cancelled) {
        setStepsData([
          step1,
          step2,
          step3,
          step4,
          step5
        ]);

        setLoading(false);
      }
    }

    fetchAllSteps();

    return () => {
      cancelled = true;
    };
  }, []);

  const playCustomSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;

      audioRef.current
        .play()
        .catch((err) => console.log('Audio error:', err));
    }
  };

  const triggerShake = (id) => {
    setShakingId(id);

    setTimeout(() => {
      setShakingId(null);
    }, 400);
  };

  const handleStepClick = (id) => {
    setExpandedSteps((prev) =>
      prev.includes(id)
        ? prev.filter((stepId) => stepId !== id)
        : [...prev, id]
    );
  };

  const handleBoxImageClick = (boxId) => {
    playCustomSound();
    triggerShake(boxId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071317] flex items-center justify-center text-white font-black text-xl">
        Loading Mission Data...
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Custom shake animation */}
      <style>{`
        @keyframes customShake {
          0% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-6px, 0) rotate(-3deg); }
          40% { transform: translate(6px, 0) rotate(3deg); }
          60% { transform: translate(-4px, 0) rotate(-2deg); }
          80% { transform: translate(4px, 0) rotate(2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-shake {
          animation: customShake 0.4s ease-in-out;
        }
      `}</style>

      <div className="bg-[#071317] py-20 px-6 border-b border-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 text-center">

          {/* Box A Column */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => handleBoxImageClick('boxA')}
              className={`w-full max-w-md h-72 flex items-center justify-center mb-6 overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 ${
                shakingId === 'boxA' ? 'animate-shake' : ''
              }`}
            >
              <img
                src={boxAImg}
                alt="Box A"
                className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] hover:brightness-110"
              />
            </div>

            <h3 className="text-3xl font-black tracking-wider text-white mb-2">
              BOX A
            </h3>

            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Contains the first set of network components and endpoint devices.
            </p>
          </div>

          {/* Box B Column */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => handleBoxImageClick('boxB')}
              className={`w-full max-w-md h-72 flex items-center justify-center mb-6 overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 ${
                shakingId === 'boxB' ? 'animate-shake' : ''
              }`}
            >
              <img
                src={boxBImg}
                alt="Box B"
                className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] hover:brightness-110"
              />
            </div>

            <h3 className="text-3xl font-black tracking-wider text-white mb-2">
              BOX B
            </h3>

            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Contains essential cables and connection equipment.
            </p>
          </div>

        </div>
      </div>

      {/* Step buttons section */}
      <div className="bg-white py-20 px-6 text-center">
        <div className="flex flex-col items-center space-y-6 max-w-3xl mx-auto mb-12">
          {stepsData.map((step) => {
            const isExpanded = expandedSteps.includes(step.id);

            const colorClasses = [
              'bg-gradient-to-br from-[#164e20] to-[#257933] border-[#388e45] hover:shadow-[0_0_20px_rgba(37,121,51,0.6)]',
              'bg-gradient-to-br from-[#1b5e25] to-[#2e8b3f] border-[#43a047] hover:shadow-[0_0_20px_rgba(46,139,63,0.6)]',
              'bg-gradient-to-br from-[#20692B] to-[#34a847] border-[#4caf50] hover:shadow-[0_0_20px_rgba(52,168,71,0.6)]',
              'bg-gradient-to-br from-[#185522] to-[#267333] border-[#388e45] hover:shadow-[0_0_20px_rgba(38,142,51,0.6)]',
              'bg-gradient-to-br from-[#124219] to-[#1e5c27] border-[#2e7d32] hover:shadow-[0_0_20px_rgba(30,125,39,0.6)]'
            ];

            const assignedColor =
              colorClasses[(step.id - 1) % colorClasses.length];

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center justify-center text-white shadow-xl border-2 ${
                  assignedColor
                } ${
                  isExpanded
                    ? 'w-full max-w-2xl rounded-[50px] py-6 px-8 scale-100 shadow-2xl'
                    : 'w-28 h-28 rounded-full hover:scale-110 active:scale-95'
                }`}
              >
                <span className="font-extrabold text-lg tracking-wider drop-shadow-md">
                  {step.title}
                </span>

                {isExpanded && (
                  <p className="text-gray-100 text-xs md:text-sm mt-2 font-medium leading-relaxed max-w-md animate-fadeIn">
                    {step.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation button */}
        <button
          onClick={() => {
            setCurrentPage('game');
          }}
          className="w-64 py-4 bg-[#ff5500] hover:bg-[#e04b00] text-white font-black text-lg rounded-2xl shadow-xl transition cursor-pointer active:scale-95"
        >
          Go to game
        </button>
      </div>
    </div>
  );
}
