import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function TaskCard({
  task,
  editingTaskId,
  taskToDeleteId,
  isUpdatingTask,
  isDeletingTask,
  getStatusBadgeVariant,
  getPriorityBadgeVariant,
  onEdit,
  onRequestDelete,
  children
}) {
  return (
    <Card
      className={`rounded-[24px] border-[#dce7e2] bg-[#fffdf9]/84 p-5 transition hover:-translate-y-0.5 hover:bg-[#fffdf9] ${
        task.priority === 'high'
          ? 'hover:border-[#e9b96e] ring-1 ring-[#f6e7d8]'
          : 'hover:border-[#c5d9ea]'
      }`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Tarea #{task.id}</p>
            <strong className="mt-2 block text-lg font-semibold text-slate-800">{task.title}</strong>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={getStatusBadgeVariant(task.status)}>{task.status}</Badge>
            <Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#eef2ef] bg-[#f7faf8] px-4 py-3">
          <p className="text-sm leading-6 text-slate-600">
            {task.description || 'Esta tarea todavia no tiene una descripcion adicional.'}
          </p>
          {task.due_date && (
            <p className="mt-2 text-sm font-medium text-slate-500">Entrega: {task.due_date}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onEdit(task)}
            disabled={isUpdatingTask || isDeletingTask}
          >
            {editingTaskId === task.id ? 'Editando...' : 'Editar'}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onRequestDelete(task)}
            disabled={isUpdatingTask || isDeletingTask}
          >
            {taskToDeleteId === task.id && isDeletingTask ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>

        {children}
      </div>
    </Card>
  )
}

export default TaskCard
