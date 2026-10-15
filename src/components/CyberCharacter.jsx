import React from 'react';

export default function CyberCharacter() {
  return (
    <div className="relative flex items-center justify-center p-4">
      {/* Custom CSS for floating and glowing animation */}
      <style>{`
        @keyframes floatAnim {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
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

      {/* Background Glow Effect */}
      <div className="absolute w-32 h-32 bg-[#72c02c]/30 rounded-full blur-2xl pointer-events-none animate-glow" />
      
      {/* Animated Cyber Mascot Box */}
      <div className="relative z-10 w-28 h-28 md:w-36 md:h-36 bg-[#0b1b20] border-2 border-[#72c02c] rounded-3xl flex flex-col items-center justify-center shadow-[0_0_25px_rgba(114,192,44,0.4)] animate-float">
        
        {/* Robot Eyes / Visor */}
        <div className="flex space-x-2 mb-2">
          <div className="w-3 h-3 bg-[#72c02c] rounded-full animate-ping" />
          <div className="w-3 h-3 bg-[#72c02c] rounded-full animate-ping" />
        </div>

        {/* Cyber Icon or Text */}
        <span className="text-[#ff5500] font-black text-xs md:text-sm tracking-widest drop-shadow">
          BOT-X
        </span>
        <div className="w-12 h-1 bg-[#72c02c] mt-1 rounded-full shadow-[0_0_8px_rgba(114,192,44,0.8)]" />
      </div>
    </div>
  );
}