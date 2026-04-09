import { Input } from '@/components/ui/input'

function TasksFilterBar({
  labelClassName,
  selectClassName,
  taskQuery,
  taskStatusFilter,
  taskPriorityFilter,
  taskSortBy,
  onTaskQueryChange,
  onTaskStatusFilterChange,
  onTaskPriorityFilterChange,
  onTaskSortByChange
}) {
  return (
    <>
      <div className="mb-5 grid gap-4 rounded-[24px] border border-[#dce7e2] bg-[#fffaf4]/84 p-4">
        <div>
          <label className={labelClassName} htmlFor="task-search">
            Buscar tarea
          </label>
          <Input
            id="task-search"
            type="text"
            className="mt-2"
            placeholder="Busca por titulo o descripcion"
            value={taskQuery}
            onChange={(event) => onTaskQueryChange(event.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[180px_180px_220px] xl:justify-start">
          <div>
            <label className={labelClassName} htmlFor="task-filter-status">
              Estado
            </label>
            <select
              id="task-filter-status"
              className={selectClassName}
              value={taskStatusFilter}
              onChange={(event) => onTaskStatusFilterChange(event.target.value)}
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="in_progress">En progreso</option>
              <option value="done">Completadas</option>
            </select>
          </div>

          <div>
            <label className={labelClassName} htmlFor="task-filter-priority">
              Prioridad
            </label>
            <select
              id="task-filter-priority"
              className={selectClassName}
              value={taskPriorityFilter}
              onChange={(event) => onTaskPriorityFilterChange(event.target.value)}
            >
              <option value="all">Todas</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div>
            <label className={labelClassName} htmlFor="task-sort-by">
              Ordenar por
            </label>
            <select
              id="task-sort-by"
              className={selectClassName}
              value={taskSortBy}
              onChange={(event) => onTaskSortByChange(event.target.value)}
            >
              <option value="priority">Prioridad y foco</option>
              <option value="status">Estado</option>
              <option value="recent">Mas recientes</option>
              <option value="title">Titulo A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <p className="mb-5 text-sm leading-6 text-slate-500">
        {taskSortBy === 'priority'
          ? 'Mostramos primero las tareas de alta prioridad y, dentro de ellas, las que siguen activas para que encuentres antes lo urgente.'
          : taskSortBy === 'status'
            ? 'Agrupamos las tareas segun su estado actual para revisar mas rapido que sigue pendiente, que avanza y que ya cerraste.'
            : taskSortBy === 'recent'
              ? 'Mostramos primero las tareas mas recientes para seguir de cerca los ultimos cambios.'
              : 'Ordenamos alfabeticamente para facilitar una busqueda mas visual dentro de la lista.'}
      </p>
    </>
  )
}

export default TasksFilterBar
