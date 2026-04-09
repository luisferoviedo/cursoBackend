import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils.jsx'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold capitalize transition',
  {
    variants: {
      variant: {
        default: 'border-[#dce7e2] bg-[#f7faf8] text-[#4c646b]',
        success: 'border-[#cfe7d8] bg-[#eef8f1] text-[#4f8c67]',
        info: 'border-[#d6e5f4] bg-[#eff6fb] text-[#5d87b8]',
        warning: 'border-[#ecd7b3] bg-[#fbf4e6] text-[#b88949]',
        destructive: 'border-[#ecc8c8] bg-[#fff1ef] text-[#b45f5f]',
        violet: 'border-[#ddd5ef] bg-[#f6f1fb] text-[#7c6ba8]'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
