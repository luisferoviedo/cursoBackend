import { Card } from '@/components/ui/card'
import Skeleton from '@/components/ui/skeleton'

function TasksLoadingState() {
  return (
    <div aria-live="polite" aria-busy="true">
      <div className="mb-5 grid gap-4 rounded-[24px] border border-[#dce7e2] bg-[#fffaf4]/84 p-4">
        <div>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-12 w-full rounded-2xl" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[180px_180px_220px] xl:justify-start">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-2 h-12 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="mb-5 h-5 w-full max-w-4xl" />

      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="rounded-[24px] border-[#dce7e2] bg-[#fffdf9]/84 p-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-3 h-6 w-3/4 max-w-64" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
              </div>

              <div className="rounded-[20px] border border-[#eef2ef] bg-[#f7faf8] px-4 py-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-4/5" />
                <Skeleton className="mt-3 h-4 w-32" />
              </div>

              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-9 w-20 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default TasksLoadingState
