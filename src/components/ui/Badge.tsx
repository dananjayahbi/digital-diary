'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  color?: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  color,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-neutral-200 text-neutral-600',
    success: 'bg-task-green/20 text-task-green',
    warning: 'bg-task-orange/20 text-task-orange',
    danger: 'bg-task-red/20 text-task-red',
    info: 'bg-task-blue/20 text-task-blue',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  const customStyle = color
    ? {
        backgroundColor: `${color}20`,
        color: color,
      }
    : undefined;

  return (
    <span
      className={`${baseStyles} ${!color ? variants[variant] : ''} ${sizes[size]} ${className}`}
      style={customStyle}
    >
      {children}
    </span>
  );
};

export default Badge;
