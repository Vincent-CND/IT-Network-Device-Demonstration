import React from 'react';

export default function MissionDetailModal({ step, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#2d2d2d] p-6 rounded-2xl max-w-xl w-full border border-purple-500/30 shadow-2xl relative">
        <div className="text-purple-400 text-xs font-mono mb-2 flex items-center space-x-1">
          <span>❖</span>
          <span>Frame 31</span>
        </div>

        <div className="bg-[#071317] border border-[#132c33] rounded-[40px] p-8 text-center flex flex-col items-center shadow-inner">
          <div className="mb-6">
            <h2 className="text-xl font-black text-white tracking-widest uppercase mb-2">
              {step.title}
            </h2>
            <p className="text-gray-300 text-xs max-w-md mx-auto leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-24 h-24 rounded-full bg-[#071317] border-2 border-emerald-900 flex items-center justify-center text-white font-black text-lg shadow-2xl cursor-pointer hover:border-[#72c02c] transition"
          >
            {step.title}
          </button>
        </div>
      </div>
    </div>
  );
}