import { Card } from '@/components/ui/card'
import Skeleton from '@/components/ui/skeleton'

function ProjectsLoadingState() {
  return (
    <div aria-live="polite" aria-busy="true">
      <div className="mb-5 grid gap-4 rounded-[24px] border border-[#dce7e2] bg-[#fffaf4]/84 p-4 md:grid-cols-[minmax(0,1fr)_220px_220px]">
        <div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-2 h-12 w-full rounded-2xl" />
        </div>
        <div>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-12 w-full rounded-2xl" />
        </div>
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-12 w-full rounded-2xl" />
        </div>
      </div>

      <Skeleton className="mb-5 h-5 w-full max-w-3xl" />

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="rounded-[24px] border-[#dce7e2] bg-[#fffdf9]/84 p-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-3 h-6 w-3/4 max-w-56" />
                </div>
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>

              <div className="rounded-[20px] border border-[#eef2ef] bg-[#f7faf8] px-4 py-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
              </div>

              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-9 w-28 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProjectsLoadingState
