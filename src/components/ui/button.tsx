import React from 'react';
import { cn } from '@/lib/utils/format';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-display font-black uppercase tracking-wider rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const variants = {
    primary: 'bg-gradient-to-br from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 shadow-lg shadow-accent-500/50 hover:shadow-xl hover:-translate-y-1',
    secondary: 'bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/50 hover:shadow-xl hover:-translate-y-1',
    ghost: 'bg-navy-700/60 text-navy-100 border-2 border-navy-600 hover:bg-navy-600 hover:border-primary-500',
    danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/50',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-xl',
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
