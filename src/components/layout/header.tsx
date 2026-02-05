'use client';

import React from 'react';
import { formatNumber } from '@/lib/utils/format';
import { PlayerResource } from '@/types/player';

interface HeaderProps {
  username: string;
  level: number;
  district: string;
  resources: PlayerResource;
}

export function Header({ username, level, district, resources }: HeaderProps) {
  return (
    <header className="bg-navy-800/95 backdrop-blur-lg border-b border-navy-700 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* User Section */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center font-display text-2xl font-black border-3 border-accent-500 shadow-lg shadow-accent-500/50">
                {username[0].toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-accent-500 to-accent-600 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-navy-900 shadow-lg">
                {level}
              </div>
            </div>
            
            <div className="hidden sm:block">
              <h2 className="font-display text-lg font-bold text-navy-50">
                {username}
              </h2>
              <p className="text-sm text-navy-400 font-semibold">
                {district} • Level {level}
              </p>
            </div>
          </div>

          {/* Resources Panel */}
          <div className="flex gap-3">
            <ResourceCard icon="💰" value={resources.coins} />
            <ResourceCard icon="💎" value={resources.gems} />
            <ResourceCard icon="⚡" value={resources.spins} max={50} />
          </div>
        </div>
      </div>
    </header>
  );
}

function ResourceCard({ 
  icon, 
  value, 
  max 
}: { 
  icon: string; 
  value: number; 
  max?: number;
}) {
  return (
    <div className="flex items-center gap-2 bg-navy-900/60 px-3 py-2 rounded-xl border border-navy-700 hover:border-primary-500 transition-all hover:scale-105 shadow-lg">
      <span className="text-2xl">{icon}</span>
      <div className="flex flex-col">
        <span className="font-display text-sm font-bold text-navy-50">
          {max ? `${value}/${max}` : formatNumber(value)}
        </span>
      </div>
      <button className="text-success-500 hover:text-success-400 transition-colors ml-1">
        <span className="text-lg">+</span>
      </button>
    </div>
  );
}
