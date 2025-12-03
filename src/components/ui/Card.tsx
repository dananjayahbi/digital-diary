'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'glass-dark' | 'elevated' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  glow = false,
  onClick,
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300';

  const variants = {
    default: 'bg-neutral-800/50 border border-neutral-700/50',
    glass: 'glass',
    'glass-dark': 'glass-dark',
    elevated: 'bg-neutral-800/80 shadow-2xl shadow-black/20',
    gradient: 'border-gradient bg-neutral-900/60',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-5',
    lg: 'p-6 md:p-8',
  };

  const hoverStyles = hover
    ? 'cursor-pointer card-hover'
    : '';

  const glowStyles = glow ? 'animate-glow' : '';

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${glowStyles} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
