import React from 'react';
import { Stone } from '../types';
import { User, Cpu } from 'lucide-react';

interface PlayerInfoProps {
  color: Stone;
  isActive: boolean;
  capturedStones: number;
  territory: number;
  isHuman: boolean;
}

export default function PlayerInfo({ 
  color, 
  isActive, 
  capturedStones, 
  territory,
  isHuman 
}: PlayerInfoProps) {
  const totalScore = capturedStones + territory;

  return (
    <div className={`
      p-4 rounded-lg w-48
      ${isActive ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-800'}
      transition-colors duration-300
    `}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`
          w-4 h-4 rounded-full
          ${color === 'black' ? 'bg-stone-900' : 'bg-stone-100 border border-stone-300'}
        `} />
        <span className="font-medium">
          {color === 'black' ? 'Black' : 'White'}
        </span>
        {isHuman ? (
          <User className="w-4 h-4 ml-auto" />
        ) : (
          <Cpu className="w-4 h-4 ml-auto" />
        )}
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Captured:</span>
          <span>{capturedStones}</span>
        </div>
        <div className="flex justify-between">
          <span>Territory:</span>
          <span>{territory}</span>
        </div>
        <div className="flex justify-between font-medium pt-2 border-t">
          <span>Total Score:</span>
          <span>{totalScore}</span>
        </div>
      </div>
    </div>
  );
}