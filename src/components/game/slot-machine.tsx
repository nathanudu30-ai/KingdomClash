'use client';

import React, { useState, useEffect } from 'react';
import { SlotSymbol, SlotResult, SLOT_SYMBOLS } from '@/types/slot';
import { generateSpinResult } from '@/lib/game-logic/slot-engine';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/format';

interface SlotMachineProps {
  onSpin: (result: SlotResult) => void;
  spins: number;
  betMultiplier?: 1 | 2 | 5;
  disabled?: boolean;
}

export function SlotMachine({ 
  onSpin, 
  spins, 
  betMultiplier = 1,
  disabled = false 
}: SlotMachineProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSymbols, setCurrentSymbols] = useState<[SlotSymbol, SlotSymbol, SlotSymbol]>([
    '💰', '⚔️', '🛡️'
  ]);
  const [winningReels, setWinningReels] = useState<boolean[]>([false, false, false]);

  const spinCost = betMultiplier === 1 ? 1 : betMultiplier === 2 ? 3 : 10;

  const handleSpin = async () => {
    if (isSpinning || spins < spinCost || disabled) return;

    setIsSpinning(true);
    setWinningReels([false, false, false]);

    // Animer les rouleaux pendant 2 secondes
    const spinInterval = setInterval(() => {
      setCurrentSymbols([
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
      ]);
    }, 100);

    // Arrêter progressivement les rouleaux
    setTimeout(() => clearInterval(spinInterval), 1000);

    // Générer le résultat final
    const result = generateSpinResult(betMultiplier);
    
    setTimeout(() => {
      setCurrentSymbols(result.symbols);
      setIsSpinning(false);
      
      // Marquer les rouleaux gagnants
      if (result.isWin) {
        const uniqueSymbols = new Set(result.symbols);
        if (uniqueSymbols.size === 1) {
          setWinningReels([true, true, true]);
        } else if (uniqueSymbols.size === 2) {
          const winning = result.symbols.map((symbol, idx) => 
            result.symbols.filter(s => s === symbol).length > 1
          );
          setWinningReels(winning);
        }
      }
      
      onSpin(result);
    }, 2000);
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary-500/20 to-transparent opacity-50 animate-pulse-glow" />
      
      <CardContent className="relative z-10 p-8">
        {/* Bet Selector */}
        <div className="flex gap-3 mb-6">
          <BetOption multiplier={1} cost={1} active={betMultiplier === 1} />
          <BetOption multiplier={2} cost={3} bonus="+20%" active={betMultiplier === 2} />
          <BetOption multiplier={5} cost={10} bonus="Best Value" active={betMultiplier === 5} />
        </div>

        {/* Reels */}
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-8 mb-6 border-2 border-navy-700 shadow-inner">
          <div className="flex justify-center gap-6">
            {currentSymbols.map((symbol, index) => (
              <Reel 
                key={index} 
                symbol={symbol} 
                isSpinning={isSpinning} 
                isWinning={winningReels[index]}
              />
            ))}
          </div>
        </div>

        {/* Spin Button */}
        <Button
          onClick={handleSpin}
          disabled={isSpinning || spins < spinCost || disabled}
          variant="primary"
          size="lg"
          className="w-full text-2xl py-6"
        >
          {isSpinning ? 'SPINNING...' : `SPIN (${spinCost} 🎰)`}
        </Button>

        {/* Spins Counter */}
        <div className="text-center mt-4">
          <span className="text-navy-400 text-sm font-semibold">
            Available Spins: <span className="text-primary-400 font-bold">{spins}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant Reel individuel
function Reel({ 
  symbol, 
  isSpinning, 
  isWinning 
}: { 
  symbol: SlotSymbol; 
  isSpinning: boolean; 
  isWinning: boolean;
}) {
  return (
    <div
      className={cn(
        'w-32 h-32 bg-gradient-to-br from-navy-900 to-navy-800 rounded-xl',
        'flex items-center justify-center text-6xl',
        'border-3 shadow-xl transition-all duration-300',
        isSpinning && 'animate-spin-reel blur-sm',
        isWinning ? 'border-success-500 shadow-success-500/50 scale-105' : 'border-navy-700',
        !isSpinning && 'hover:scale-105'
      )}
    >
      <div className={cn(isSpinning && 'animate-bounce')}>
        {symbol}
      </div>
    </div>
  );
}

// Composant Bet Option
function BetOption({ 
  multiplier, 
  cost, 
  bonus, 
  active 
}: { 
  multiplier: number; 
  cost: number; 
  bonus?: string; 
  active: boolean;
}) {
  return (
    <div
      className={cn(
        'flex-1 p-4 rounded-xl border-2 text-center cursor-pointer transition-all',
        'hover:scale-105 relative',
        active 
          ? 'bg-gradient-to-br from-primary-500 to-primary-600 border-primary-400 shadow-lg shadow-primary-500/50' 
          : 'bg-navy-800/60 border-navy-700 hover:border-primary-500'
      )}
    >
      {bonus && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-br from-accent-500 to-accent-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
          {bonus}
        </div>
      )}
      <div className={cn(
        'font-display text-2xl font-black',
        active ? 'text-white' : 'text-navy-300'
      )}>
        ×{multiplier}
      </div>
      <div className={cn(
        'text-sm font-semibold',
        active ? 'text-primary-100' : 'text-navy-500'
      )}>
        {cost} Spin{cost > 1 ? 's' : ''}
      </div>
    </div>
  );
}
