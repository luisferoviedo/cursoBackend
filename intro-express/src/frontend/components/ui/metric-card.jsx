import { Card } from '@/components/ui/card'

function MetricCard({ eyebrow, value, description }) {
  return (
    <Card className="rounded-[22px] border border-[#dce7e2] bg-[#fffdf9]/86 p-5 shadow-[0_10px_24px_rgba(133,153,153,0.1)]">
      <span className="mb-4 inline-flex text-xs font-bold uppercase tracking-[0.18em] text-[#4d938a]">
        {eyebrow}
      </span>
      <strong className="block text-4xl font-semibold leading-none text-[#24333a]">{value}</strong>
      <p className="mt-3 text-sm leading-6 text-[#5f737a]">{description}</p>
    </Card>
  )
}

export default MetricCard
