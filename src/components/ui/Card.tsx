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
  const baseStyles = 'rounded-2xl transition-all';

  const variants = {
    default: 'bg-white border border-neutral-200 shadow-sm',
    glass: 'glass',
    'glass-dark': 'bg-white border border-neutral-100 shadow-md',
    elevated: 'bg-white shadow-lg',
    gradient: 'bg-primary-muted border border-primary/10',
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

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
