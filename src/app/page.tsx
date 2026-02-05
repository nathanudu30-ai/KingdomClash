'use client';

import React, { useState } from 'react';
import { SlotMachine } from '@/components/game/slot-machine';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SlotResult } from '@/types/slot';

export default function HomePage() {
  // État temporaire en dur pour le prototype
  const [resources, setResources] = useState({
    coins: 1250000,
    gems: 150,
    spins: 42,
    shields: 3,
  });

  const [betMultiplier] = useState<1 | 2 | 5>(1);

  const handleSpin = (result: SlotResult) => {
    console.log('Spin result:', result);
    
    // Mettre à jour les ressources
    if (result.isWin) {
      setResources(prev => ({
        ...prev,
        coins: prev.coins + result.coinsWon,
      }));
      
      // Célébration visuelle
      if (result.winType === 'jackpot') {
        console.log('🎉 JACKPOT!');
      } else if (result.winType === 'big') {
        console.log('✨ BIG WIN!');
      } else if (result.winType === 'small') {
        console.log('💫 WIN!');
      }
    }
    
    // Déduire le coût du spin
    const spinCost = betMultiplier === 1 ? 1 : betMultiplier === 2 ? 3 : 10;
    setResources(prev => ({
      ...prev,
      spins: Math.max(0, prev.spins - spinCost),
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <Header
        username="Nathan"
        level={12}
        district="Downtown District"
        resources={resources}
      />

      {/* Main Content */}
      <main className="flex-1 relative z-10 pb-24 pt-8">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* District Banner */}
          <div className="text-center space-y-4">
            <h1 className="font-display text-5xl sm:text-6xl font-black gradient-text animate-shimmer bg-[length:200%_auto]">
              DOWNTOWN DISTRICT
            </h1>
            <ProgressBar
              value={15}
              max={20}
              label="Building Progress"
              variant="success"
              className="max-w-xl mx-auto"
            />
          </div>

          {/* Slot Machine */}
          <div className="max-w-2xl mx-auto">
            <SlotMachine
              onSpin={handleSpin}
              spins={resources.spins}
              betMultiplier={betMultiplier}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <StatCard icon="🏆" label="Rank" value="#1,234" />
            <StatCard icon="⚔️" label="Attacks" value="156" />
            <StatCard icon="🎴" label="Cards" value="42/81" />
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-4 text-center hover:scale-105 transition-transform">
      <div className="text-3xl mb-1">{icon}</div>
      <div className="text-xs text-navy-400 font-semibold mb-1">{label}</div>
      <div className="font-display text-lg font-bold text-navy-50">{value}</div>
    </div>
  );
}
