import React, { useEffect, useRef } from 'react';
import homeBg from '../assets/home-bg.png';
import purposeImg from '../assets/purpose.png';
import targetImg from '../assets/target.png';

// Import team member profile images
import member1Img from '../assets/member1.png';
import member2Img from '../assets/member2.png';
import member3Img from '../assets/member3.png';

// Inline pure CSS animated cyber character mascot component
function CyberCharacter() {
  return (
    <div className="relative flex items-center justify-center p-2 mb-4">
      <style>{`
        @keyframes floatAnim {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .animate-float {
          animation: floatAnim 3s ease-in-out infinite;
        }
        .animate-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Background ambient glow effect */}
      <div className="absolute w-28 h-28 bg-[#72c02c]/30 rounded-full blur-xl pointer-events-none animate-glow" />
      
      {/* Animated cyber mascot box container */}
      <div className="relative z-10 w-24 h-24 bg-[#0b1b20]/90 border-2 border-[#72c02c] rounded-2xl flex flex-col items-center justify-center shadow-[0_0_20px_rgba(114,192,44,0.4)] animate-float">
        <div className="flex space-x-2 mb-1.5">
          <div className="w-2.5 h-2.5 bg-[#72c02c] rounded-full animate-ping" />
          <div className="w-2.5 h-2.5 bg-[#72c02c] rounded-full animate-ping" />
        </div>
        <span className="text-[#ff5500] font-black text-xs tracking-widest drop-shadow">
          BOT-X
        </span>
        <div className="w-10 h-1 bg-[#72c02c] mt-1 rounded-full shadow-[0_0_6px_rgba(114,192,44,0.8)]" />
      </div>
    </div>
  );
}

// Matrix digital rain background canvas component for home hero
function HomeMatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let lastTime = 0;
    const fps = 20;
    const interval = 1000 / fps;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const characters = '01CYBER';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));

    const draw = (currentTime) => {
      animationFrameId = requestAnimationFrame(draw);

      const deltaTime = currentTime - lastTime;
      if (deltaTime < interval) return;
      lastTime = currentTime - (deltaTime % interval);

      ctx.fillStyle = 'rgba(4, 12, 14, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "Fredoka", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        ctx.fillStyle = 'rgba(114, 192, 44, 0.25)';
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
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

export default function Home({ setCurrentPage }) {
  // Team members data array
  const teamMembers = [
    { id: 1, name: 'Agent Alpha', role: 'Lead Developer', image: member1Img },
    { id: 2, name: 'Agent Beta', role: 'Security Analyst', image: member2Img },
    { id: 3, name: 'Agent Gamma', role: 'UI/UX Designer', image: member3Img },
  ];

  return (
    <div className="w-full bg-[#040c0e] text-white">
      {/* Hero section with full screen background image and cyber animation */}
      <div 
        className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center px-6 py-16 overflow-hidden"
        style={{ backgroundImage: `url(${homeBg})` }}
      >
        {/* Subtle cyber matrix animation layer */}
        <HomeMatrixBackground />

        {/* Deep dark gradient overlay for high contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#040c0e] pointer-events-none z-0" />

        {/* Animated cyber character mascot integration */}
        <div className="relative z-10">
          <CyberCharacter />
        </div>

        <div className="relative z-10 text-center mb-16 transform hover:scale-105 transition duration-500">
          <h1 className="text-5xl md:text-7xl font-black tracking-wider text-white mb-3 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
            WELCOME
          </h1>
          <h2 className="text-4xl md:text-6xl font-black tracking-wider text-[#72c02c] drop-shadow-[0_0_25px_rgba(114,192,44,0.6)]">
            TO CYBER QUEST!
          </h2>
          <p className="text-gray-300 text-sm md:text-base mt-4 max-w-lg mx-auto font-medium">
            Enter the mainframe, decode threats, and master your digital defense protocols.
          </p>
        </div>

        {/* Purpose and Target cards with gamified glow */}
        <div className="relative z-10 max-w-4xl w-full grid md:grid-cols-2 gap-8">
          <div className="bg-[#0b1b20]/90 backdrop-blur-md border-2 border-[#72c02c]/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(114,192,44,0.15)] hover:border-[#72c02c] hover:shadow-[0_0_35px_rgba(114,192,44,0.4)] transition-all duration-300 group">
            <div className="w-24 h-24 mb-6 flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition duration-300">
              <img src={purposeImg} alt="Purpose" className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(114,192,44,0.5)]" />
            </div>
            <h3 className="text-2xl font-black text-[#ff6600] tracking-wider mb-3">PURPOSE</h3>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs font-medium">
              Sharing knowledge about IT network installation through hands-on experience, rather than just teaching the theory.
            </p>
          </div>

          <div className="bg-[#0b1b20]/90 backdrop-blur-md border-2 border-[#72c02c]/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(114,192,44,0.15)] hover:border-[#72c02c] hover:shadow-[0_0_35px_rgba(114,192,44,0.4)] transition-all duration-300 group">
            <div className="w-24 h-24 mb-6 flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition duration-300">
              <img src={targetImg} alt="Target" className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(114,192,44,0.5)]" />
            </div>
            <h3 className="text-2xl font-black text-[#ff6600] tracking-wider mb-3">TARGET</h3>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs font-medium">
              A device to demonstrate IT network installation for 14-15 year old kids in TAITAJA-2027 exhibition in Helsinki Exhibition Center.
            </p>
          </div>
        </div>

        {/* Quick start mission navigation button */}
        <div className="relative z-10 mt-16">
          <button
            onClick={() => setCurrentPage('mission')}
            className="px-10 py-4 bg-[#ff5500] hover:bg-[#e04b00] text-white font-black text-lg rounded-2xl shadow-[0_0_20px_rgba(255,85,0,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            START MISSION
          </button>
        </div>
      </div>

      {/* Meet the team section with clean light theme aesthetics */}
      <div className="bg-white py-24 px-6 text-center text-black border-t border-gray-200 relative">
        <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-widest text-black">
          MEET THE <span className="text-[#20692B]">TEAM</span>
        </h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto mb-16 font-medium">
          The elite developers and security operatives behind Cyber Quest.
        </p>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              className="bg-gray-50 border-2 border-gray-200 rounded-3xl p-6 flex flex-col items-center group hover:border-[#20692B] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="w-full aspect-[4/5] bg-[#071317] border-2 border-[#20692B] mb-6 overflow-hidden rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition duration-500">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-extrabold text-xl text-gray-900 tracking-wide">{member.name}</h4>
              <p className="text-[#ff6600] font-bold text-xs mt-1 uppercase tracking-wider">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}