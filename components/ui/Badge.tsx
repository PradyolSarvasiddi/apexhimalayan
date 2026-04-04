import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'orange' | 'green' | 'yellow' | 'red' | 'blue' | 'gold'
  size?: 'sm' | 'md'
  className?: string
}

const badgeVariants: Record<string, string> = {
  default: 'bg-bg-elevated text-text-secondary border border-border-default',
  orange: 'bg-accent-orange/10 text-accent-orange border border-accent-orange/20 uppercase tracking-widest text-[9px] font-black',
  gold: 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20 uppercase tracking-widest text-[9px] font-black',
  green: 'bg-success/10 text-success border border-success/20 uppercase tracking-widest text-[9px] font-black',
  yellow: 'bg-warning/10 text-warning border border-warning/20 uppercase tracking-widest text-[9px] font-black',
  red: 'bg-danger/10 text-danger border border-danger/20 uppercase tracking-widest text-[9px] font-black',
  blue: 'bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-widest text-[9px] font-black',
}

export default function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
