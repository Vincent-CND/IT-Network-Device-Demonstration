import React, { useState } from 'react';

export default function Feedback({ setCurrentPage }) {
  const [rating, setRating] = useState(null);
  const [message, setMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, rating }),
      });

      const result = await response.json();

      if (result.success) {
        // Display the success notification banner
        setShowNotification(true);

        // Clear form fields after submission
        setMessage('');
        setRating(null);

        // Redirect to the home page after a short delay
        setTimeout(() => {
          setShowNotification(false);
          if (setCurrentPage) {
            setCurrentPage('home');
          }
        }, 1500);
      } else {
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      console.error("API Submit Error:", err);
      alert('Error connecting to backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-6 flex items-center justify-center relative overflow-hidden">
      
      {/* Success notification toast banner */}
      <div 
        className={`fixed top-8 z-50 transition-all duration-500 transform ${
          showNotification ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-[#0a181c] border-2 border-[#72c02c] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h4 className="font-black text-sm text-[#72c02c]">SUCCESS!</h4>
            <p className="text-xs text-gray-300">Feedback submitted! Redirecting to Home...</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0a181c] border-2 border-[#72c02c] rounded-none p-10 max-w-lg w-full shadow-2xl">
        <h2 className="text-2xl font-black text-center text-white mb-8 tracking-wide">
          Rate & Feedback
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-white mb-1.5">Message:</label>
            <textarea 
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full bg-white text-black px-4 py-2.5 rounded-xl outline-none font-medium text-sm shadow-inner resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-2">Rate Us:</label>
            <div className="flex space-x-2">
              {[
                { emoji: '✖', bg: 'bg-red-500' },
                { emoji: '🙁', bg: 'bg-orange-400' },
                { emoji: '😐', bg: 'bg-yellow-400' },
                { emoji: '🙂', bg: 'bg-emerald-400' },
                { emoji: '😄', bg: 'bg-emerald-500' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRating(idx)}
                  className={`w-9 h-9 rounded-full ${item.bg} text-white font-bold flex items-center justify-center text-base cursor-pointer transition transform ${
                    rating === idx ? 'scale-125 ring-2 ring-white' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#ff5500] hover:bg-[#e04b00] text-white font-black text-base rounded-2xl shadow-xl transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}