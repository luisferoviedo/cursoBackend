function FilterBar({ filters, selectedFilter, onFilterChange }) {
  return (
    <div className="filters" aria-label="Filtros de tareas">
      {Object.entries(filters).map(([value, label]) => (
        <button
          key={value}
          type="button"
          aria-pressed={selectedFilter === value}
          className={selectedFilter === value ? 'active' : ''}
          onClick={() => onFilterChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default FilterBar
