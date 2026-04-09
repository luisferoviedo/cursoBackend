import { Link, useParams } from 'react-router-dom'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import EmptyState from '@/components/ui/empty-state'
import SectionHeader from '@/components/ui/section-header'
import StatusSummary from '@/components/ui/status-summary'
import Skeleton from '@/components/ui/skeleton'
import TaskCard from '../components/TaskCard'
import TasksLoadingState from '../components/TasksLoadingState'
import TasksFilterBar from '../components/TasksFilterBar'
import useProjectTasksView from '../hooks/useProjectTasksView.jsx'
import {
  getTaskPriorityBadgeVariant,
  getTaskStatusBadgeVariant
} from '../utils/tasks-view.jsx'

const subtlePanelClass = 'rounded-[22px] border border-[#dce7e2] bg-[#fffaf4]/84 p-4 shadow-[0_10px_24px_rgba(133,153,153,0.08)]'
const selectClassName = 'mt-2 flex h-12 w-full rounded-2xl border border-[#dce7e2] bg-[#fffdf9] px-4 py-3 text-sm text-[#3f5f67] shadow-sm transition focus:border-[#4faf9f] focus:outline-none focus:ring-4 focus:ring-[#d9f1eb] disabled:cursor-not-allowed disabled:opacity-60'
const labelClassName = 'block text-sm font-semibold text-slate-700'

// Esta pantalla concentra el trabajo operativo del proyecto.
// Dialog confirma borrados y los toasts dejan el feedback fuera del layout principal.
function ProjectDetail({ onLogout }) {
  const { projectId } = useParams()
  const numericProjectId = Number(projectId)

  const {
    project,
    projectError,
    isLoadingProject,
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    completionRate,
    taskSummaryItems,
    tasks,
    tasksError,
    isLoadingTasks,
    taskFormData,
    taskFormError,
    isSubmittingTask,
    editingTaskId,
    editTaskFormData,
    editTaskError,
    isUpdatingTask,
    taskToDelete,
    isDeletingTask,
    taskQuery,
    taskStatusFilter,
    taskPriorityFilter,
    taskSortBy,
    sortedTasks,
    setTaskToDelete,
    setTaskQuery,
    setTaskStatusFilter,
    setTaskPriorityFilter,
    setTaskSortBy,
    handleTaskChange,
    handleEditTaskChange,
    startTaskEditing,
    cancelTaskEditing,
    handleTaskSubmit,
    handleTaskUpdateSubmit,
    handleTaskDelete
  } = useProjectTasksView(numericProjectId)

  return (
    <main className="min-h-screen px-6 py-8 md:px-8 lg:px-10">
      <section className="mx-auto w-full max-w-6xl">
        <Card
          className="mb-5 flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          aria-label="Navegacion principal del detalle del proyecto"
        >
          <div className="grid gap-0.5">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#4d938a]">Proyecto</p>
            <strong className="text-base font-semibold text-slate-800">
              {project ? project.name : 'Vista del proyecto'}
            </strong>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="secondary" size="sm">
              <Link to="/dashboard">Volver a proyectos</Link>
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={onLogout}>
              Cerrar sesion
            </Button>
          </div>
        </Card>

        <Card className="mb-5 overflow-hidden p-6 sm:p-7" aria-label="Hero del proyecto">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)] xl:items-start">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#4d938a]">Detalle</p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-800 sm:text-5xl">
                {project ? project.name : 'Proyecto'}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Aqui puedes organizar las tareas de este proyecto sin perder el contexto general.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[24px] border border-[#d6ebe4] bg-gradient-to-br from-[#e7f5f2] via-[#fffdf9] to-[#eef4f1] p-5 shadow-[0_16px_35px_rgba(79,175,159,0.12)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4d938a]">En foco</p>
                <strong className="mt-3 block text-2xl font-semibold text-slate-800">
                  {inProgressTasks > 0 ? `${inProgressTasks} tareas en progreso` : 'Todo listo para empezar'}
                </strong>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Crea tareas desde el panel lateral y revisa el avance desde la lista principal.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={subtlePanelClass}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Total</p>
                  <strong className="mt-2 block text-2xl font-semibold text-slate-800">{totalTasks}</strong>
                </div>
                <div className={subtlePanelClass}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Completadas</p>
                  <strong className="mt-2 block text-2xl font-semibold text-slate-800">{completedTasks}</strong>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start">
          <aside className="grid gap-5 xl:sticky xl:top-6">
            <Card className="p-6 sm:p-7">
              <SectionHeader
                eyebrow="Avance"
                title="Progreso de tareas"
                description="Te muestra de forma simple cuanto falta por hacer y cuanto ya va avanzando."
                actions={
                  <div className={subtlePanelClass}>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Progreso total</p>
                    <strong className="mt-2 block text-2xl font-semibold text-slate-800">{completionRate}%</strong>
                  </div>
                }
              />
              <StatusSummary
                title="Distribucion actual"
                description="Sirve para detectar si el proyecto esta bloqueado al inicio o si ya estas cerrando trabajo."
                items={taskSummaryItems}
              />
            </Card>

            <Card className="p-6 sm:p-7">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#4d938a]">Resumen del proyecto</p>
                  <h2 className="text-2xl font-semibold text-slate-800">Informacion general</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Aqui ves la informacion principal del proyecto y trabajas sus tareas en un solo lugar.
                  </p>
                </div>
                {project && <Badge variant={getTaskStatusBadgeVariant(project.status)}>{project.status}</Badge>}
              </div>

              {isLoadingProject && (
                <div className="grid gap-4" aria-live="polite" aria-busy="true">
                  <article className={subtlePanelClass}>
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="mt-3 h-6 w-24" />
                  </article>
                  <article className={subtlePanelClass}>
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="mt-3 h-4 w-full" />
                    <Skeleton className="mt-2 h-4 w-5/6" />
                  </article>
                </div>
              )}

              {projectError && (
                <Alert variant="destructive">
                  <AlertDescription>{projectError}</AlertDescription>
                </Alert>
              )}

              {project && !projectError && (
                <div className="grid gap-4">
                  <article className={subtlePanelClass}>
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">ID</p>
                    <strong className="text-base font-semibold text-slate-800">#{project.id}</strong>
                  </article>
                  <article className={subtlePanelClass}>
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Descripcion</p>
                    <p className="text-sm leading-6 text-slate-600">
                      {project.description || 'Todavia no agregaste una descripcion para este proyecto.'}
                    </p>
                  </article>
                </div>
              )}
            </Card>

            <Card className="p-6 sm:p-7">
              <div className="mb-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#4d938a]">Nueva tarea</p>
                <h2 className="text-2xl font-semibold text-slate-800">Crear tarea</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Agrega una nueva tarea y define desde el inicio su estado y prioridad.
                </p>
              </div>

              <form className="grid gap-5" onSubmit={handleTaskSubmit}>
                <div>
                  <label className={labelClassName} htmlFor="task-title">
                    Titulo
                  </label>
                  <Input
                    id="task-title"
                    name="title"
                    type="text"
                    className="mt-2"
                    placeholder="Ej. Crear endpoint de reportes"
                    value={taskFormData.title}
                    onChange={handleTaskChange}
                    disabled={!project || isSubmittingTask}
                  />
                </div>

                <div>
                  <label className={labelClassName} htmlFor="task-description">
                    Descripcion
                  </label>
                  <Textarea
                    id="task-description"
                    name="description"
                    className="mt-2"
                    rows="3"
                    placeholder="Describe brevemente lo que hay que hacer"
                    value={taskFormData.description}
                    onChange={handleTaskChange}
                    disabled={!project || isSubmittingTask}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                  <div>
                    <label className={labelClassName} htmlFor="task-status">
                      Estado
                    </label>
                    <select
                      id="task-status"
                      name="status"
                      className={selectClassName}
                      value={taskFormData.status}
                      onChange={handleTaskChange}
                      disabled={!project || isSubmittingTask}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="in_progress">En progreso</option>
                      <option value="done">Completado</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="task-priority">
                      Prioridad
                    </label>
                    <select
                      id="task-priority"
                      name="priority"
                      className={selectClassName}
                      value={taskFormData.priority}
                      onChange={handleTaskChange}
                      disabled={!project || isSubmittingTask}
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                </div>

                {taskFormError && (
                  <Alert variant="destructive">
                    <AlertDescription>{taskFormError}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!project || isSubmittingTask}
                >
                  {isSubmittingTask ? 'Creando tarea...' : 'Crear tarea'}
                </Button>
              </form>
            </Card>
          </aside>

          <Card className="p-6 sm:p-7">
            <SectionHeader
              eyebrow="Tareas"
              title="Tareas del proyecto"
              description="Revisa pendientes, actualiza avances y mantén el proyecto al dia desde aqui."
              actions={
                <div className="grid grid-cols-2 gap-3 lg:w-auto">
                <div className={subtlePanelClass}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Visibles</p>
                    <strong className="mt-2 block text-2xl font-semibold text-slate-800">{sortedTasks.length}</strong>
                </div>
                <div className={subtlePanelClass}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Completadas</p>
                    <strong className="mt-2 block text-2xl font-semibold text-slate-800">{completedTasks}</strong>
                </div>
                </div>
              }
            />

            <TasksFilterBar
              labelClassName={labelClassName}
              selectClassName={selectClassName}
              taskQuery={taskQuery}
              taskStatusFilter={taskStatusFilter}
              taskPriorityFilter={taskPriorityFilter}
              taskSortBy={taskSortBy}
              onTaskQueryChange={setTaskQuery}
              onTaskStatusFilterChange={setTaskStatusFilter}
              onTaskPriorityFilterChange={setTaskPriorityFilter}
              onTaskSortByChange={setTaskSortBy}
            />

            {isLoadingTasks && <TasksLoadingState />}

            {tasksError && (
              <Alert variant="destructive">
                <AlertDescription>{tasksError}</AlertDescription>
              </Alert>
            )}

            {!isLoadingTasks && !tasksError && tasks.length === 0 && (
              <EmptyState
                title="Aun no hay tareas en este proyecto"
                description="Crea la primera desde el panel lateral para empezar a darle seguimiento."
              />
            )}

            {!isLoadingTasks && tasks.length > 0 && sortedTasks.length === 0 && (
              <EmptyState
                title="No encontramos tareas con esos filtros"
                description="Prueba con otro termino, otro estado o una prioridad diferente para volver a ver resultados."
              />
            )}

            {!isLoadingTasks && sortedTasks.length > 0 && (
              <ul className="grid gap-4">
                {sortedTasks.map((task) => (
                  <li key={task.id}>
                    <TaskCard
                      task={task}
                      editingTaskId={editingTaskId}
                      taskToDeleteId={taskToDelete?.id}
                      isUpdatingTask={isUpdatingTask}
                      isDeletingTask={isDeletingTask}
                      getStatusBadgeVariant={getTaskStatusBadgeVariant}
                      getPriorityBadgeVariant={getTaskPriorityBadgeVariant}
                      onEdit={startTaskEditing}
                      onRequestDelete={setTaskToDelete}
                    >
                      {editingTaskId === task.id && (
                        <form className="grid gap-5 rounded-[20px] border border-[#dce7e2] bg-[#f7faf8] p-5" onSubmit={handleTaskUpdateSubmit}>
                          <div>
                            <label className={labelClassName} htmlFor={`edit-task-title-${task.id}`}>
                              Titulo
                            </label>
                            <Input
                              id={`edit-task-title-${task.id}`}
                              name="title"
                              type="text"
                              className="mt-2"
                              value={editTaskFormData.title}
                              onChange={handleEditTaskChange}
                              disabled={isUpdatingTask}
                            />
                          </div>

                          <div>
                            <label className={labelClassName} htmlFor={`edit-task-description-${task.id}`}>
                              Descripcion
                            </label>
                            <Textarea
                              id={`edit-task-description-${task.id}`}
                              name="description"
                              className="mt-2"
                              rows="3"
                              value={editTaskFormData.description}
                              onChange={handleEditTaskChange}
                              disabled={isUpdatingTask}
                            />
                          </div>

                          <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                              <label className={labelClassName} htmlFor={`edit-task-status-${task.id}`}>
                                Estado
                              </label>
                              <select
                                id={`edit-task-status-${task.id}`}
                                name="status"
                                className={selectClassName}
                                value={editTaskFormData.status}
                                onChange={handleEditTaskChange}
                                disabled={isUpdatingTask}
                              >
                                <option value="pending">Pendiente</option>
                                <option value="in_progress">En progreso</option>
                                <option value="done">Completado</option>
                              </select>
                            </div>

                            <div>
                              <label className={labelClassName} htmlFor={`edit-task-priority-${task.id}`}>
                                Prioridad
                              </label>
                              <select
                                id={`edit-task-priority-${task.id}`}
                                name="priority"
                                className={selectClassName}
                                value={editTaskFormData.priority}
                                onChange={handleEditTaskChange}
                                disabled={isUpdatingTask}
                              >
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                              </select>
                            </div>
                          </div>

                          {editTaskError && (
                            <Alert variant="destructive">
                              <AlertDescription>{editTaskError}</AlertDescription>
                            </Alert>
                          )}

                          <div className="flex flex-wrap gap-3">
                            <Button type="submit" size="sm" disabled={isUpdatingTask}>
                              {isUpdatingTask ? 'Guardando cambios...' : 'Guardar cambios'}
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={cancelTaskEditing}
                              disabled={isUpdatingTask || isDeletingTask}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </form>
                      )}
                    </TaskCard>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Dialog open={Boolean(taskToDelete)} onOpenChange={(isOpen) => !isOpen && !isDeletingTask && setTaskToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar tarea</DialogTitle>
              <DialogDescription>
                {taskToDelete
                  ? `Se eliminara "${taskToDelete.title}" y esta accion no se puede deshacer.`
                  : 'Esta accion no se puede deshacer.'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setTaskToDelete(null)}
                disabled={isDeletingTask}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleTaskDelete}
                disabled={isDeletingTask}
              >
                {isDeletingTask ? 'Eliminando...' : 'Eliminar tarea'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </main>
  )
}

export default ProjectDetail
