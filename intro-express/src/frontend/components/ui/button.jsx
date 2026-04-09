import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils.jsx'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-[#d9f1eb]',
  {
    variants: {
      variant: {
        default: 'bg-[#4faf9f] px-5 py-3 text-white shadow-[0_12px_24px_rgba(79,175,159,0.2)] hover:bg-[#3e988a]',
        secondary: 'border border-[#dce7e2] bg-[#fffaf4] px-4 py-2 font-medium text-[#3f5f67] hover:border-[#b9d9d2] hover:bg-[#eef4f1]',
        outline: 'border border-[#dce7e2] bg-transparent px-4 py-2 font-medium text-[#4c646b] hover:border-[#c7d7d1] hover:bg-[#fffaf4]',
        destructive: 'border border-[#ecc8c8] bg-[#fff1ef] px-4 py-2 font-medium text-[#b45f5f] hover:border-[#e0b1b1] hover:bg-[#fde7e3]',
        ghost: 'px-4 py-2 font-medium text-[#4c646b] hover:bg-[#fffaf4]'
      },
      size: {
        default: '',
        sm: 'rounded-full px-4 py-2 text-sm',
        lg: 'px-6 py-3.5 text-sm'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})

Button.displayName = 'Button'

export { Button, buttonVariants }
