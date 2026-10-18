import React from 'react';

export default function CongratsModal({ onClose, setCurrentPage }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-fadeIn">
      <div className="bg-[#0b1b20] border-2 border-[#72c02c] rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(114,192,44,0.4)] text-center relative overflow-hidden">
        
        {/* Background ambient glow effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#72c02c]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#ff5500]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Success icon badge */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#72c02c]/20 to-[#72c02c]/40 border-2 border-[#72c02c] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(114,192,44,0.5)] transform hover:scale-110 transition duration-300">
          <span className="text-4xl animate-bounce">🏆</span>
        </div>

        {/* Modal heading and description */}
        <h3 className="text-3xl font-black text-white tracking-wider mb-2 drop-shadow-md">
          MISSION <span className="text-[#72c02c]">ACCOMPLISHED!</span>
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed font-medium mb-8">
          You did it! 🏆 You solved all the challenges, found the right path, and saved your world!
        </p>

        {/* Action button container */}
        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              if (setCurrentPage) setCurrentPage('feedback');
            }}
            className="w-full py-4 bg-[#ff5500] hover:bg-[#e04b00] text-white font-black text-base rounded-2xl shadow-[0_0_20px_rgba(255,85,0,0.4)] transition transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            GIVE A FEEDBACK
          </button>
        </div>

      </div>
    </div>
  );
}