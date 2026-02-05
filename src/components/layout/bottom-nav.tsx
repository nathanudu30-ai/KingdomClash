'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils/format';

const navItems = [
  { icon: '🎰', label: 'Spin', href: '/' },
  { icon: '🏗️', label: 'Build', href: '/build' },
  { icon: '⚔️', label: 'Attack', href: '/attack' },
  { icon: '🎴', label: 'Cards', href: '/cards' },
  { icon: '👥', label: 'Guild', href: '/guild' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-navy-800/95 backdrop-blur-lg border-t border-navy-700 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center py-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all',
                  'hover:bg-navy-700/50 relative',
                  isActive && 'text-primary-400'
                )}
              >
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
                )}
                <span className={cn(
                  'text-3xl transition-transform',
                  isActive && 'scale-110 drop-shadow-lg'
                )}>
                  {item.icon}
                </span>
                <span className={cn(
                  'text-xs font-bold uppercase tracking-wide',
                  isActive ? 'text-primary-400' : 'text-navy-400'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
