import React from 'react';
import { Stone } from '../types';

interface BoardProps {
  size: number;
  board: Stone[][];
  onCellClick: (row: number, col: number) => void;
  highlightCells?: [number, number][];
}

export default function Board({ size, board, onCellClick, highlightCells = [] }: BoardProps) {
  const isHighlighted = (row: number, col: number) => {
    return highlightCells.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="bg-[#E6BA7A] p-4 rounded-lg shadow-xl">
      <div className="grid gap-px" style={{ 
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` 
      }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                relative w-12 h-12 flex items-center justify-center
                ${isHighlighted(rowIndex, colIndex) ? 'cursor-pointer' : ''}
              `}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {/* Grid lines */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-stone-800" />
              </div>
              <div className="absolute inset-0 flex justify-center">
                <div className="h-full w-px bg-stone-800" />
              </div>

              {/* Highlight */}
              {isHighlighted(rowIndex, colIndex) && (
                <div className="absolute w-6 h-6 rounded-full bg-yellow-300 animate-pulse opacity-50" />
              )}

              {/* Stone */}
              {cell && (
                <div className={`
                  w-10 h-10 rounded-full shadow-lg transform transition-transform
                  ${cell === 'black' ? 'bg-stone-900' : 'bg-stone-100'}
                `} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}