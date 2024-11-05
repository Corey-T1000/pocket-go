import React from 'react';
import { CircleDot } from 'lucide-react';

interface HeaderProps {
  onTutorialClick?: () => void;
  onNewGameClick?: () => void;
}

export default function Header({ onTutorialClick, onNewGameClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <CircleDot className="w-8 h-8 text-stone-800" />
        <h1 className="text-2xl font-bold text-stone-800">Mini Go</h1>
      </div>
      <nav className="flex gap-6">
        <button 
          onClick={onTutorialClick}
          className="px-4 py-2 rounded-lg hover:bg-stone-200 transition-colors text-stone-600"
        >
          Tutorial
        </button>
        <button 
          onClick={onNewGameClick}
          className="px-4 py-2 rounded-lg bg-stone-800 text-white hover:bg-stone-700 transition-colors"
        >
          New Game
        </button>
      </nav>
    </header>
  );
}