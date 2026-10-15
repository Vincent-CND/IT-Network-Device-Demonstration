import React from 'react';
import logoImg from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 px-10 py-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between">
      <div className="mb-4 md:mb-0">
        <img 
          src={logoImg} 
          alt="Cyber Quest Logo" 
          className="h-9 object-contain"
        />
      </div>
      <div className="flex space-x-8 text-sm font-bold text-gray-600">
        <a href="#email" className="hover:text-black">Email</a>
        <a href="#location" className="hover:text-black">Location</a>
        <a href="#phone" className="hover:text-black">Phone</a>
        <a href="#facebook" className="hover:text-black">Facebook</a>
      </div>
    </footer>
  );
}