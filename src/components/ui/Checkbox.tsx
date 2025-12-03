'use client';

import React, { useId } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  color?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, color, id, checked, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || (label?.toLowerCase().replace(/\s+/g, '-')) || generatedId;
    const borderColor = color || 'var(--neutral-300)';
    const bgColor = color || 'var(--primary)';

    return (
      <label
        htmlFor={checkboxId}
        className={`inline-flex items-center gap-2 cursor-pointer select-none ${className}`}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            className="sr-only peer"
            {...props}
          />
          <div
            className="w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center
                       peer-checked:border-transparent peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2"
            style={{
              borderColor: checked ? bgColor : borderColor,
              backgroundColor: checked ? bgColor : 'transparent',
            }}
          >
            {checked && <Check size={14} className="text-white" strokeWidth={3} />}
          </div>
        </div>
        {label && (
          <span
            className={`text-sm transition-all duration-200 ${
              checked ? 'text-neutral-400 line-through' : 'text-foreground'
            }`}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
