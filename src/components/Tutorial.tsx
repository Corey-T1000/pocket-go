import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { TutorialStep } from '../types';
import Board from './Board';

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to Mini Go!",
    description: "Mini Go is a simplified version of the ancient game of Go. The goal is to control more territory than your opponent by placing stones on the board.",
    boardState: Array(7).fill(null).map(() => Array(7).fill(null)),
    autoProgress: true,
    nextStepDelay: 3000
  },
  {
    title: "The Board",
    description: "The game is played on the intersections of the grid lines. This is a 7x7 board, perfect for quick, strategic games.",
    boardState: Array(7).fill(null).map(() => Array(7).fill(null)),
    highlightCells: [[0, 0], [0, 6], [6, 0], [6, 6]],
    autoProgress: true,
    nextStepDelay: 4000
  },
  {
    title: "Your First Move",
    description: "Black always plays first. Click the highlighted intersection to place your first stone. Try placing it in the center!",
    boardState: Array(7).fill(null).map(() => Array(7).fill(null)),
    highlightCells: [[3, 3]],
    requiredMove: [3, 3]
  },
  {
    title: "Taking Turns",
    description: "Players alternate turns. White responds to Black's move, often playing nearby to contest territory.",
    boardState: [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, 'black', null, null, null],
      [null, null, null, 'white', null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null]
    ],
    highlightCells: [[2, 3], [3, 2], [3, 4], [4, 3]],
    autoProgress: true,
    nextStepDelay: 5000
  },
  {
    title: "Liberties",
    description: "Each stone needs empty adjacent intersections (called 'liberties') to survive. The highlighted stone has 4 liberties.",
    boardState: [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, 'black', null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null]
    ],
    highlightCells: [[1, 3], [2, 2], [2, 4], [3, 3]],
    autoProgress: true,
    nextStepDelay: 5000
  },
  {
    title: "Capturing Stones",
    description: "When a stone or group has no liberties left (completely surrounded), it's captured and removed from the board.",
    boardState: [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, 'black', null, null, null],
      [null, null, 'black', 'white', 'black', null, null],
      [null, null, null, 'black', null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null]
    ],
    highlightCells: [[3, 3]],
    autoProgress: true,
    nextStepDelay: 5000
  },
  {
    title: "Connecting Stones",
    description: "Connected stones work together. They share liberties and must all be surrounded to be captured.",
    boardState: [
      [null, null, null, null, null, null, null],
      [null, null, null, 'black', null, null, null],
      [null, null, null, 'black', null, null, null],
      [null, null, 'white', 'black', 'white', null, null],
      [null, null, null, 'white', null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null]
    ],
    highlightCells: [[1, 3], [2, 3], [3, 3]],
    autoProgress: true,
    nextStepDelay: 5000
  },
  {
    title: "Territory",
    description: "Empty intersections surrounded by your stones become your territory. The game ends when both players pass, and the player with more territory wins!",
    boardState: [
      [null, null, 'black', 'black', 'black', null, null],
      [null, 'black', null, null, null, 'black', null],
      ['black', null, null, null, null, null, 'black'],
      ['black', null, null, null, null, null, 'black'],
      ['black', null, null, null, null, null, 'black'],
      [null, 'black', null, null, null, 'black', null],
      [null, null, 'black', 'black', 'black', null, null]
    ],
    highlightCells: [[2, 2], [2, 3], [2, 4], [3, 2], [3, 3], [3, 4], [4, 2], [4, 3], [4, 4]],
    autoProgress: true,
    nextStepDelay: 6000
  },
  {
    title: "Ready to Play!",
    description: "You've learned the basics of Mini Go! Remember: capture stones by surrounding them, connect your stones for strength, and control territory to win. Good luck!",
    boardState: [
      [null, 'black', 'white', 'black', 'white', 'black', null],
      ['black', 'white', null, 'white', null, 'white', 'black'],
      ['white', null, 'black', 'white', 'black', null, 'white'],
      ['black', 'white', 'white', null, 'black', 'white', 'black'],
      ['white', null, 'black', 'white', 'black', null, 'white'],
      ['black', 'white', null, 'black', null, 'white', 'black'],
      [null, 'black', 'white', 'black', 'white', 'black', null]
    ]
  }
];

interface TutorialProps {
  onExit: () => void;
}

export default function Tutorial({ onExit }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const step = tutorialSteps[currentStep];

  useEffect(() => {
    if (step.autoProgress && step.nextStepDelay) {
      const timer = setTimeout(() => {
        if (currentStep < tutorialSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
        }
      }, step.nextStepDelay);
      return () => clearTimeout(timer);
    }
  }, [currentStep, step]);

  const handleCellClick = (row: number, col: number) => {
    if (step.requiredMove) {
      const [reqRow, reqCol] = step.requiredMove;
      if (row === reqRow && col === reqCol) {
        setCurrentStep(prev => prev + 1);
        setShowHint(false);
      } else {
        setShowHint(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-2">{step.title}</h2>
            <p className="text-stone-600">{step.description}</p>
          </div>
          <span className="text-sm text-stone-400">
            {currentStep + 1} / {tutorialSteps.length}
          </span>
        </div>
        
        {showHint && step.requiredMove && (
          <div className="mt-2 flex items-center gap-2 text-amber-600 text-sm">
            <Info className="w-4 h-4" />
            <span>Try clicking the highlighted intersection!</span>
          </div>
        )}
      </div>

      <div className="relative">
        <Board
          size={7}
          board={step.boardState}
          onCellClick={handleCellClick}
          highlightCells={step.highlightCells}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setCurrentStep(prev => Math.max(0, prev - 1));
            setShowHint(false);
          }}
          disabled={currentStep === 0}
          className="p-2 rounded-full hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {currentStep < tutorialSteps.length - 1 ? (
          <button
            onClick={() => {
              setCurrentStep(prev => prev + 1);
              setShowHint(false);
            }}
            className="p-2 rounded-full hover:bg-stone-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={onExit}
            className="px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700"
          >
            Start Playing
          </button>
        )}
      </div>
    </div>
  );
}