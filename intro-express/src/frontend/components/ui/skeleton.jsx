import { cn } from '@/lib/utils.jsx'

function Skeleton({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse rounded-2xl bg-gradient-to-r from-[#edf3f0] via-[#e4eeea] to-[#edf3f0]',
        className
      )}
    />
  )
}

export default Skeleton
