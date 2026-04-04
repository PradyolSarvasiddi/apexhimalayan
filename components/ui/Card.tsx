import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'glass' | 'outline'
}

const paddingSizes: Record<string, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const variants: Record<string, string> = {
  default: 'bg-bg-card border border-border-default hover:shadow-gold',
  glass: 'glass-premium shadow-2xl shadow-black/40',
  outline: 'bg-transparent border-border-default',
}

export default function Card({
  children,
  className,
  hover = false,
  padding = 'md',
  variant = 'default',
}: CardProps) {
  return (
    <div
      className={cn(
        'transition-all duration-300',
        paddingSizes[padding],
        variants[variant],
        hover && 'hover:-translate-y-1 hover:shadow-lg',
        className
      )}
    >
      {children}
    </div>
  )
}
