'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface CardInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  id: string;
}

const CardInput = forwardRef<HTMLInputElement, CardInputProps>(
  ({ label, error, helperText, id, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-sm font-bold text-slate-900">
          {label}
        </label>
        {helperText && (
          <p id={`${id}-helper`} className="-mt-1 text-xs text-slate-500">
            {helperText}
          </p>
        )}

        <input
          ref={ref}
          id={id}
          aria-describedby={
            [error ? `${id}-error` : '', helperText ? `${id}-helper` : ''].filter(Boolean).join(' ') ||
            undefined
          }
          aria-invalid={!!error}
          className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/25 ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''} ${className}`}
          {...props}
        />

        {error && (
          <p id={`${id}-error`} role="alert" className="text-xs text-rose-500 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

CardInput.displayName = 'CardInput';

export default CardInput;
