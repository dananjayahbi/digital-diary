'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon: Icon, iconPosition = 'left', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <Icon size={18} />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-4 py-3 
              ${Icon && iconPosition === 'left' ? 'pl-10' : ''} 
              ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
              bg-white dark:bg-neutral-100
              border border-neutral-200 
              rounded-xl
              text-foreground
              placeholder:text-neutral-400
              focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-muted
              transition-colors duration-150
              ${error ? 'border-task-red focus:border-task-red focus:ring-accent-muted' : ''}
              ${className}
            `}
            {...props}
          />
          {Icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <Icon size={18} />
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-task-red">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
