'use client'

import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export default function Input({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-3 rounded-lg bg-bg-card border border-border-default text-text-primary placeholder-text-muted',
          'focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold',
          'transition-all duration-150 text-sm shadow-sm',
          error && 'border-danger focus:border-danger focus:ring-danger',
          className
        )}
        {...props}
      />
      {hint && !error && (
        <span className="text-xs text-text-muted">{hint}</span>
      )}
      {error && (
        <span className="text-xs text-danger">{error}</span>
      )}
    </div>
  )
}
