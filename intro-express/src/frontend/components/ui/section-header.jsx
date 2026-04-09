function SectionHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#4d938a]">{eyebrow}</p>
        )}
        <h2 className="text-3xl font-semibold text-[#24333a]">{title}</h2>
        {description && (
          <p className="mt-2 text-sm leading-6 text-[#5f737a]">{description}</p>
        )}
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  )
}

export default SectionHeader
