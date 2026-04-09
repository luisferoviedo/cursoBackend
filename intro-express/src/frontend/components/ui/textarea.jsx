import * as React from 'react'
import { cn } from '@/lib/utils.jsx'

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[96px] w-full rounded-2xl border border-[#dce7e2] bg-[#fffdf9] px-4 py-3 text-sm text-[#3f5f67] shadow-sm transition placeholder:text-slate-400 focus-visible:border-[#4faf9f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d9f1eb] disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Textarea.displayName = 'Textarea'

export { Textarea }
