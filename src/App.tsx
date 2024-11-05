import React, { useState } from 'react';
import { GithubIcon, HelpCircle, Settings } from 'lucide-react';
import Game from './components/Game';
import Header from './components/Header';
import { GameMode } from './types';

function App() {
  const [mode, setMode] = useState<GameMode>('tutorial');

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-stone-200">
      <div className="container mx-auto px-4 py-8">
        <Header 
          onTutorialClick={() => setMode('tutorial')}
          onNewGameClick={() => setMode('play')}
        />
        <main className="mt-8">
          <Game key={mode} />
        </main>
        
        <footer className="mt-8 text-center text-sm text-stone-500">
          <p>Mini Go - A Strategic Board Game Experience</p>
          <div className="mt-2 flex justify-center gap-4">
            <a href="#" className="hover:text-stone-800 transition-colors">
              <GithubIcon className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-stone-800 transition-colors">
              <HelpCircle className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-stone-800 transition-colors">
              <Settings className="w-5 h-5" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;