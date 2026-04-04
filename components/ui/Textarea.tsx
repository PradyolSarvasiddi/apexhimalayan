'use client'

import { cn } from '@/lib/utils'
import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  charCount?: { current: number; max: number }
}

export default function Textarea({
  label,
  error,
  hint,
  charCount,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
          {charCount && (
            <span className={cn(
              'text-xs',
              charCount.current > charCount.max ? 'text-danger' : 'text-text-muted'
            )}>
              {charCount.current}/{charCount.max}
            </span>
          )}
        </div>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'w-full px-4 py-3 rounded-lg bg-bg-card border border-border-default text-text-primary placeholder-text-muted',
          'focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold',
          'transition-all duration-150 text-sm resize-y min-h-[100px] shadow-sm',
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
