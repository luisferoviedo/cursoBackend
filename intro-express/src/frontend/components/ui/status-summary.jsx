function StatusSummary({ title, description, items }) {
  return (
    <div className="rounded-[24px] border border-[#dce7e2] bg-[#fffdf9]/82 p-5 shadow-[0_10px_24px_rgba(133,153,153,0.08)]">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{title}</p>
        {description ? <p className="mt-2 text-sm leading-6 text-[#5f737a]">{description}</p> : null}
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${item.dotClassName}`} />
                <span className="text-sm font-medium text-[#4c646b]">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-[#24333a]">
                {item.value} · {item.percentage}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#edf3f0]">
              <div
                className={`h-full rounded-full transition-[width] duration-300 ${item.barClassName}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatusSummary
