import React, { useState } from 'react';
import logoImg from '../assets/logo.png';

export default function Navbar({ setCurrentPage, currentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation menu items list
  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'mission', label: 'MISSION' },
    { id: 'game', label: 'GAME' },
  ];

  const handleNavClick = (id) => {
    setCurrentPage(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b-2 border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand logo image container with slightly reduced size */}
        <div 
          onClick={() => setCurrentPage('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="h-10 md:h-12 flex items-center justify-center transform group-hover:scale-105 transition duration-300">
            <img 
              src={logoImg} 
              alt="Cyber Quest Logo" 
              className="h-full w-auto object-contain filter drop-shadow-[0_0_8px_rgba(32,105,43,0.4)]" 
            />
          </div>
        </div>

        {/* Desktop navigation menu items on the right side */}
        <nav className="hidden md:flex items-center space-x-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-5 py-2.5 rounded-xl font-black text-xs tracking-wider transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#20692B] text-white shadow-[0_0_15px_rgba(32,105,43,0.4)] scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile menu toggle button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="px-4 py-2 bg-[#20692B] text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center space-x-1"
          >
            <span>{mobileMenuOpen ? 'CLOSE ✕' : 'MENU ☰'}</span>
          </button>
        </div>

      </div>

      {/* Mobile dropdown navigation menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-md border-b-2 border-gray-200 shadow-lg px-6 py-4 flex flex-col space-y-3 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full py-3 rounded-xl font-black text-xs tracking-wider transition-all duration-300 text-center cursor-pointer ${
                  isActive
                    ? 'bg-[#20692B] text-white shadow-[0_0_15px_rgba(32,105,43,0.4)]'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}