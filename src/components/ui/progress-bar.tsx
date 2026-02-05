import React from 'react';
import { cn } from '@/lib/utils/format';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
  variant?: 'primary' | 'success' | 'warning';
}

export function ProgressBar({
  value,
  max,
  label,
  showPercentage = true,
  className,
  variant = 'primary',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const variants = {
    primary: 'from-primary-500 to-primary-400',
    success: 'from-success-500 to-success-400',
    warning: 'from-accent-500 to-accent-400',
  };
  
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-navy-300">{label}</span>
          {showPercentage && (
            <span className="text-sm font-bold text-navy-200">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="h-9 bg-navy-800/60 rounded-full overflow-hidden border-2 border-navy-700 shadow-inner">
        <div
          className={cn(
            'h-full bg-gradient-to-r transition-all duration-500 ease-out flex items-center justify-center',
            'shadow-lg animate-shimmer bg-[length:200%_auto]',
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        >
          {percentage > 15 && (
            <span className="text-sm font-bold text-white drop-shadow-lg">
              {value}/{max}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
