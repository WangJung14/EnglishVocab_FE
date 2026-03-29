'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: string;
  rightElement?: React.ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, icon, rightElement, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-blue-100">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 text-base pointer-events-none select-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={[
              'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300/60',
              'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent',
              'hover:bg-white/15 transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              icon ? 'pl-10' : '',
              rightElement ? 'pr-12' : '',
              error ? 'border-red-400 focus:ring-red-400' : '',
              className,
            ].join(' ')}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-red-400 text-xs flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

// Password input with show/hide toggle
export function PasswordField({
  label,
  error,
  ...props
}: Omit<InputFieldProps, 'type' | 'rightElement'>) {
  const [show, setShow] = useState(false);

  return (
    <InputField
      label={label}
      error={error}
      icon="🔒"
      type={show ? 'text' : 'password'}
      rightElement={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="text-blue-300 hover:text-white transition-colors text-sm select-none"
          tabIndex={-1}
        >
          {show ? '🙈' : '👁️'}
        </button>
      }
      {...props}
    />
  );
}
