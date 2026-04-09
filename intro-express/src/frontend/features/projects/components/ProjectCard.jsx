import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function ProjectCard({ project, getStatusBadgeVariant, onDelete }) {
  return (
    <Card className="rounded-[24px] border-[#dce7e2] bg-[#fffdf9]/84 p-5 transition hover:-translate-y-0.5 hover:border-[#b9d9d2] hover:bg-[#fffdf9]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Proyecto #{project.id}</p>
            <strong className="mt-2 block text-lg font-semibold text-slate-800">{project.name}</strong>
          </div>
          <Badge variant={getStatusBadgeVariant(project.status)}>
            {project.status}
          </Badge>
        </div>

        <div className="rounded-[20px] border border-[#eef2ef] bg-[#f7faf8] px-4 py-3">
          <p className="text-sm leading-6 text-slate-600">
            {project.description || 'Todavia no agregaste una descripcion para este proyecto.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild size="sm">
            <Link to={`/projects/${project.id}`}>Ver proyecto</Link>
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onDelete(project)}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ProjectCard
