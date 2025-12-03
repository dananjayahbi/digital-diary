'use client';

import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-4 py-3
            bg-white dark:bg-neutral-100
            border border-neutral-200
            rounded-xl
            text-foreground
            placeholder:text-neutral-400
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-muted
            transition-all duration-200
            resize-none
            min-h-[120px]
            ${error ? 'border-task-red focus:border-task-red focus:ring-accent-muted' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-task-red">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
