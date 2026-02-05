import React from 'react';
import { cn } from '@/lib/utils/format';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl border border-navy-700 shadow-xl backdrop-blur-sm',
        glow && 'shadow-primary-500/30',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('p-6 border-b border-navy-700', className)}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('font-display text-2xl font-bold text-navy-50', className)}>
      {children}
    </h3>
  );
}
