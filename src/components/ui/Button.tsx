'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-primary text-white hover:bg-primary-dark focus:ring-primary active:scale-98',
      secondary:
        'bg-neutral-100 text-foreground hover:bg-neutral-200 border border-neutral-200 focus:ring-neutral-300 active:scale-98',
      ghost:
        'bg-transparent text-foreground hover:bg-neutral-100 focus:ring-neutral-200 active:scale-98',
      danger:
        'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 active:scale-98',
      outline:
        'bg-transparent text-foreground border border-neutral-300 hover:bg-neutral-50 focus:ring-neutral-200 active:scale-98',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const iconSizes = {
      sm: 14,
      md: 16,
      lg: 18,
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon size={iconSizes[size]} />}
            {children}
            {Icon && iconPosition === 'right' && <Icon size={iconSizes[size]} />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
