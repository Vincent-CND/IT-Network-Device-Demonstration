import React from 'react';

export default function HintModal({ hintText, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fadeIn">
      <div className="bg-[#061215] border-2 border-[#ffb703] rounded-3xl p-8 max-w-md w-full shadow-[0_0_30px_rgba(255,183,3,0.3)] text-center relative">
        
        {/* Close Icon / Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-black/40 flex items-center justify-center transition cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-3xl mb-3">💡</div>
        <h3 className="text-2xl font-black text-[#ffb703] tracking-wide mb-4">
          MISSION HINT
        </h3>

        {/* Dynamic Hint Text */}
        <p className="text-gray-200 text-sm md:text-base leading-relaxed font-medium mb-6 bg-black/30 p-4 rounded-2xl border border-gray-800">
          {hintText || "No hint available for this step."}
        </p>

        {/* Got It Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#ffb703] hover:bg-[#ffa200] text-black font-black text-sm rounded-xl shadow-lg transition cursor-pointer active:scale-95"
        >
          GOT IT!
        </button>

      </div>
    </div>
  );
}