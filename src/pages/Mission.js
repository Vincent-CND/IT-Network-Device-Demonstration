import React, { useState, useEffect, useRef } from 'react';
import boxAImg from '../assets/boxA.png';
import boxBImg from '../assets/boxB.png';

// Import custom click sound effect file
import clickSoundFile from '../assets/click-box.mp3';

export default function Mission({ setCurrentPage }) {
  const [expandedSteps, setExpandedSteps] = useState([]);
  const [shakingId, setShakingId] = useState(null);

  // API Data States
  const [missionData, setMissionData] = useState({ boxes: [], steps: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize audio reference for box click effects
  const audioRef = useRef(new Audio(clickSoundFile));

  // -------------------------------------------------------------
  // API Call: Fetch Mission Data (Boxes and Steps) from Backend
  // -------------------------------------------------------------
  useEffect(() => {
    const fetchMissionData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mission/data');
        if (!response.ok) {
          throw new Error('Failed to fetch mission data');
        }
        const result = await response.json();
        if (result.success) {
          setMissionData(result.data);
        }
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError("Failed to load mission data from backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchMissionData();
  }, []);

  const playCustomSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.log('Audio error:', err));
    }
  };

  const triggerShake = (id) => {
    setShakingId(id);
    setTimeout(() => {
      setShakingId(null);
    }, 400); // 400ms shake duration
  };

  // Step button click handler to expand or collapse details
  const handleStepClick = (id) => {
    setExpandedSteps((prev) =>
      prev.includes(id)
        ? prev.filter((stepId) => stepId !== id)
        : [...prev, id]
    );
  };

  // Box image click handler with sound and shake animation enabled
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#071317] flex items-center justify-center text-red-500 font-bold text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Custom shake animation keyframes stylesheet */}
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
              {missionData.boxes[0]?.title || 'BOX A'}
            </h3>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              {missionData.boxes[0]?.description}
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
              {missionData.boxes[1]?.title || 'BOX B'}
            </h3>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              {missionData.boxes[1]?.description}
            </p>
          </div>

        </div>
      </div>

      {/* Step buttons section */}
      <div className="bg-white py-20 px-6 text-center">
        <div className="flex flex-col items-center space-y-6 max-w-3xl mx-auto mb-12">
          {missionData.steps.map((step) => {
            const isExpanded = expandedSteps.includes(step.id);

            // Predefined gradient colors mapped dynamically for steps
            const colorClasses = [
              'bg-gradient-to-br from-[#164e20] to-[#257933] border-[#388e45] hover:shadow-[0_0_20px_rgba(37,121,51,0.6)]',
              'bg-gradient-to-br from-[#1b5e25] to-[#2e8b3f] border-[#43a047] hover:shadow-[0_0_20px_rgba(46,139,63,0.6)]',
              'bg-gradient-to-br from-[#20692B] to-[#34a847] border-[#4caf50] hover:shadow-[0_0_20px_rgba(52,168,71,0.6)]',
              'bg-gradient-to-br from-[#185522] to-[#267333] border-[#388e45] hover:shadow-[0_0_20px_rgba(38,142,51,0.6)]',
              'bg-gradient-to-br from-[#124219] to-[#1e5c27] border-[#2e7d32] hover:shadow-[0_0_20px_rgba(30,125,39,0.6)]'
            ];

            const assignedColor = colorClasses[(step.id - 1) % colorClasses.length];

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

        {/* Navigation button to the game page */}
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