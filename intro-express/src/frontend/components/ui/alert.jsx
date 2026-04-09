import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils.jsx'

const alertVariants = cva(
  'relative w-full rounded-2xl border px-4 py-3 text-sm',
  {
    variants: {
      variant: {
        default: 'border-[#dce7e2] bg-[#fffdf9] text-[#4c646b]',
        destructive: 'border-[#ecc8c8] bg-[#fff1ef] text-[#b45f5f]',
        success: 'border-[#cfe7d8] bg-[#eef8f1] text-[#4f8c67]'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn('mb-1 font-semibold leading-none tracking-tight', className)} {...props} />
))

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm [&_p]:leading-6', className)} {...props} />
))

Alert.displayName = 'Alert'
AlertTitle.displayName = 'AlertTitle'
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
