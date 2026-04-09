function EmptyState({ title, description }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#dce7e2] bg-[#fffaf4]/82 px-5 py-5">
      <strong className="block text-sm font-semibold text-[#24333a]">{title}</strong>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[#5f737a]">{description}</p>
    </div>
  )
}

export default EmptyState
