import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Mission from './pages/Mission';
import Game from './pages/Game';
import Feedback from './pages/Feedback';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Scroll window smoothly to the top whenever the active page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-[#071317] text-white flex flex-col justify-between font-sans selection:bg-green-500 selection:text-black">
      <div>
        <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />
        <main>
          {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
          {currentPage === 'mission' && <Mission setCurrentPage={setCurrentPage} />}
          {currentPage === 'game' && <Game setCurrentPage={setCurrentPage} />}
          {currentPage === 'feedback' && <Feedback setCurrentPage={setCurrentPage} />}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;