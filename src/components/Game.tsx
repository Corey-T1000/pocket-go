import React, { useState, useCallback, useEffect } from 'react';
import { Stone } from '../types';
import { GoAI } from '../lib/ai';
import Board from './Board';
import { checkWinner, isValidMove, calculateTerritory } from '../lib/gameLogic';
import PlayerInfo from './PlayerInfo';

interface GameProps {
  size?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function Game({ 
  size = 7, 
  difficulty = 'medium' 
}: GameProps) {
  const [board, setBoard] = useState<Stone[][]>(
    Array(size).fill(null).map(() => Array(size).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Stone>('black');
  const [winner, setWinner] = useState<Stone | 'draw' | null>(null);
  const [message, setMessage] = useState<string>('Black\'s turn');
  const [capturedStones, setCapturedStones] = useState({ black: 0, white: 0 });
  const [territory, setTerritory] = useState({ black: 0, white: 0 });
  const ai = new GoAI(size, difficulty);

  useEffect(() => {
    const { black, white } = calculateTerritory(board);
    setTerritory({ black, white });
  }, [board]);

  const handleMove = useCallback((row: number, col: number) => {
    if (winner || !isValidMove(board, row, col)) {
      return;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = currentPlayer;
    
    // Check for captures
    const captures = checkCaptures(newBoard, row, col);
    if (currentPlayer === 'black') {
      setCapturedStones(prev => ({ ...prev, black: prev.black + captures }));
    } else {
      setCapturedStones(prev => ({ ...prev, white: prev.white + captures }));
    }

    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setMessage(gameWinner === 'draw' ? 'Game Draw!' : `${gameWinner.charAt(0).toUpperCase() + gameWinner.slice(1)} wins!`);
      return;
    }

    // Switch to AI's turn
    setCurrentPlayer('white');
    setMessage('White\'s turn');

    // AI move
    setTimeout(() => {
      const aiMove = ai.findBestMove(newBoard);
      if (aiMove) {
        const [aiRow, aiCol] = aiMove;
        const aiBoard = newBoard.map(row => [...row]);
        aiBoard[aiRow][aiCol] = 'white';
        
        // Check for AI captures
        const aiCaptures = checkCaptures(aiBoard, aiRow, aiCol);
        setCapturedStones(prev => ({ ...prev, white: prev.white + aiCaptures }));
        
        setBoard(aiBoard);

        const finalWinner = checkWinner(aiBoard);
        if (finalWinner) {
          setWinner(finalWinner);
          setMessage(finalWinner === 'draw' ? 'Game Draw!' : `${finalWinner.charAt(0).toUpperCase() + finalWinner.slice(1)} wins!`);
        } else {
          setCurrentPlayer('black');
          setMessage('Black\'s turn');
        }
      } else {
        setWinner('draw');
        setMessage('Game Draw - No valid moves!');
      }
    }, 500);
  }, [board, currentPlayer, winner, ai]);

  const checkCaptures = (board: Stone[][], row: number, col: number): number => {
    let captures = 0;
    const opponent: Stone = board[row][col] === 'black' ? 'white' : 'black';
    const adjacent = [
      [row - 1, col], [row + 1, col],
      [row, col - 1], [row, col + 1]
    ];

    for (const [r, c] of adjacent) {
      if (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === opponent) {
        const group = getConnectedGroup(board, r, c);
        if (!hasLiberties(board, group)) {
          captures += group.size;
          // Remove captured stones
          for (const pos of group) {
            const [gr, gc] = pos.split(',').map(Number);
            board[gr][gc] = null;
          }
        }
      }
    }

    return captures;
  };

  const getConnectedGroup = (board: Stone[][], row: number, col: number): Set<string> => {
    const color = board[row][col];
    const group = new Set<string>();
    const stack: [number, number][] = [[row, col]];

    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      const key = `${r},${c}`;
      if (group.has(key)) continue;
      
      group.add(key);
      const adjacent = [
        [r - 1, c], [r + 1, c],
        [r, c - 1], [r, c + 1]
      ];

      for (const [nr, nc] of adjacent) {
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && 
            board[nr][nc] === color && !group.has(`${nr},${nc}`)) {
          stack.push([nr, nc]);
        }
      }
    }

    return group;
  };

  const hasLiberties = (board: Stone[][], group: Set<string>): boolean => {
    for (const pos of group) {
      const [row, col] = pos.split(',').map(Number);
      const adjacent = [
        [row - 1, col], [row + 1, col],
        [row, col - 1], [row, col + 1]
      ];

      for (const [r, c] of adjacent) {
        if (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === null) {
          return true;
        }
      }
    }
    return false;
  };

  const resetGame = () => {
    setBoard(Array(size).fill(null).map(() => Array(size).fill(null)));
    setCurrentPlayer('black');
    setWinner(null);
    setMessage('Black\'s turn');
    setCapturedStones({ black: 0, white: 0 });
    setTerritory({ black: 0, white: 0 });
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-8 items-start">
        <PlayerInfo
          color="black"
          isActive={currentPlayer === 'black'}
          capturedStones={capturedStones.black}
          territory={territory.black}
          isHuman={true}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="text-xl font-bold text-stone-800">{message}</div>
          <Board 
            size={size}
            board={board} 
            onCellClick={handleMove}
          />
          {winner && (
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors"
            >
              Play Again
            </button>
          )}
        </div>

        <PlayerInfo
          color="white"
          isActive={currentPlayer === 'white'}
          capturedStones={capturedStones.white}
          territory={territory.white}
          isHuman={false}
        />
      </div>
    </div>
  );
}