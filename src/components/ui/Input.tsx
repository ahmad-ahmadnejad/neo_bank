import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, placeholder, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          ref={ref}
          placeholder=" "
          className={cn(
            'peer flex w-full h-[56px] rounded-xl border border-white/10 bg-surface-raised px-4 pt-5 pb-1 text-sm text-foreground transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        <label
          className={cn(
            'absolute right-4 text-foreground-muted transition-all duration-300 pointer-events-none select-none',
            'top-[8px] text-[11px] font-medium',
            'peer-placeholder-shown:top-[18px] peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal',
            'peer-focus:top-[8px] peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-primary'
          )}
        >
          {placeholder}
        </label>
      </div>
    );
  }
);

Input.displayName = 'Input';
