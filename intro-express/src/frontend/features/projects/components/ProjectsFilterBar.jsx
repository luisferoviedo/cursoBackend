import { Input } from '@/components/ui/input'

function ProjectsFilterBar({
  labelClassName,
  selectClassName,
  projectQuery,
  projectStatusFilter,
  projectSortBy,
  onProjectQueryChange,
  onProjectStatusFilterChange,
  onProjectSortByChange
}) {
  return (
    <>
      <div className="mb-5 grid gap-4 rounded-[24px] border border-[#dce7e2] bg-[#fffaf4]/84 p-4 md:grid-cols-[minmax(0,1fr)_220px_220px]">
        <div>
          <label className={labelClassName} htmlFor="project-search">
            Buscar proyecto
          </label>
          <Input
            id="project-search"
            type="text"
            className="mt-2"
            placeholder="Busca por nombre o descripcion"
            value={projectQuery}
            onChange={(event) => onProjectQueryChange(event.target.value)}
          />
        </div>

        <div>
          <label className={labelClassName} htmlFor="project-filter-status">
            Filtrar por estado
          </label>
          <select
            id="project-filter-status"
            className={selectClassName}
            value={projectStatusFilter}
            onChange={(event) => onProjectStatusFilterChange(event.target.value)}
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="in_progress">En progreso</option>
            <option value="done">Completados</option>
          </select>
        </div>

        <div>
          <label className={labelClassName} htmlFor="project-sort-by">
            Ordenar por
          </label>
          <select
            id="project-sort-by"
            className={selectClassName}
            value={projectSortBy}
            onChange={(event) => onProjectSortByChange(event.target.value)}
          >
            <option value="attention">Requieren atencion primero</option>
            <option value="recent">Mas recientes</option>
            <option value="name_asc">Nombre A-Z</option>
          </select>
        </div>
      </div>

      <p className="mb-5 text-sm leading-6 text-slate-500">
        {projectSortBy === 'attention'
          ? 'Mostramos primero los proyectos en marcha y luego los pendientes para que ubiques rapido lo que requiere seguimiento.'
          : projectSortBy === 'recent'
            ? 'Mostramos primero los proyectos creados o actualizados mas recientemente.'
            : 'Mostramos los proyectos en orden alfabetico para facilitar la busqueda visual.'}
      </p>
    </>
  )
}

export default ProjectsFilterBar
