'use client';

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        // Updated Primary - Gold with dark text
        default: "bg-accent-gold text-[#0D0F0E] font-semibold uppercase tracking-[0.08em] rounded-[2px] hover:bg-accent-gold-light shadow-gold",
        primary: "bg-accent-gold text-[#0D0F0E] font-semibold uppercase tracking-[0.08em] rounded-[2px] hover:bg-accent-gold-light shadow-gold",
        
        // Updated Outline - Gold border/text
        outline: "border-[1.5px] border-accent-gold text-accent-gold bg-transparent font-medium hover:bg-accent-gold hover:text-[#0D0F0E] rounded-[2px]",
        
        // Others
        destructive: "bg-danger text-white hover:bg-danger/90 rounded-md",
        secondary: "bg-bg-elevated text-text-primary hover:bg-bg-elevated/80 rounded-md",
        ghost: "hover:bg-bg-elevated hover:text-accent-gold rounded-md",
        link: "text-accent-gold underline-offset-4 hover:underline",
        danger: "bg-transparent text-danger/80 border border-danger/30 hover:bg-danger hover:text-white hover:border-danger rounded-md",
      },
      size: {
        default: "h-auto px-8 py-3.5", // 14px 32px equivalent (3.5 * 4 = 14)
        sm: "h-9 px-3 text-xs",
        md: "h-10 px-6 py-2.5",
        lg: "h-12 px-10 py-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Support the legacy default export or named export
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        {children}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
export default Button
