import { getApiErrorMessage } from '../../../lib/api'
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
import { toast } from 'sonner'
import EmptyState from '@/components/ui/empty-state'
import MetricCard from '@/components/ui/metric-card'
import SectionHeader from '@/components/ui/section-header'
import StatusSummary from '@/components/ui/status-summary'
import ProjectCard from '../components/ProjectCard'
import ProjectsFilterBar from '../components/ProjectsFilterBar'
import ProjectsLoadingState from '../components/ProjectsLoadingState'
import useDashboardProjectsView from '../hooks/useDashboardProjectsView.jsx'
import {
  getProjectStatusBadgeVariant,
} from '../utils/projects-view.jsx'

const surfaceClass = 'rounded-[28px] border border-[#dce7e2] bg-[#fffdf9]/88 shadow-[0_18px_40px_rgba(133,153,153,0.14)] backdrop-blur-xl'
const sectionCardClass = 'rounded-[24px] border border-[#dce7e2] bg-[#fffdf9]/84 p-5 shadow-[0_10px_24px_rgba(133,153,153,0.1)]'
const compactCardClass = 'rounded-[22px] border border-[#dce7e2] bg-[#fffdf9]/84 p-5 shadow-[0_10px_24px_rgba(133,153,153,0.1)]'
const subtlePanelClass = 'rounded-[22px] border border-[#dce7e2] bg-[#fffaf4]/84 p-4 shadow-[0_10px_24px_rgba(133,153,153,0.08)]'
const selectClassName = 'mt-2 flex h-12 w-full rounded-2xl border border-[#dce7e2] bg-[#fffdf9] px-4 py-3 text-sm text-[#3f5f67] shadow-sm transition focus:border-[#4faf9f] focus:outline-none focus:ring-4 focus:ring-[#d9f1eb] disabled:cursor-not-allowed disabled:opacity-60'
const labelClassName = 'block text-sm font-semibold text-slate-700'

// Dashboard resume el estado general y deja el trabajo operativo para el detalle.
// La jerarquia visual separa contexto, accion principal y listado de proyectos.
function Dashboard({
  authStatus,
  user,
  projects = [],
  projectsError,
  isLoadingProjects,
  onLogout,
  onCreateProject,
  onDeleteProject
}) {
  const safeUser = user ?? {}

  const {
    totalProjects,
    pendingProjects,
    activeProjects,
    completedProjects,
    completionRate,
    projectSummaryItems,
    formData,
    formError,
    isSubmitting,
    projectToDelete,
    isDeletingProject,
    projectQuery,
    projectStatusFilter,
    projectSortBy,
    sortedProjects,
    setProjectToDelete,
    setProjectQuery,
    setProjectStatusFilter,
    setProjectSortBy,
    handleChange,
    handleProjectDelete,
    handleSubmit
  } = useDashboardProjectsView({
    projects,
    onCreateProject,
    onDeleteProject
  })

  return (
    <main className="min-h-screen px-6 py-8 md:px-8 lg:px-10">
      <section className="mx-auto w-full max-w-6xl">
        <Card
          className={`mb-5 flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between`}
          aria-label="Navegacion principal del dashboard"
        >
          <div className="grid gap-0.5">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#4d938a]">Inicio</p>
            <strong className="text-base font-semibold text-slate-800">Tus proyectos</strong>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              variant="secondary"
              size="sm"
            >
              <a
              href="#crear-proyecto"
              >
              Crear
              </a>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="sm"
            >
              <a
              href="#proyectos"
              >
              Proyectos
              </a>
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={onLogout}>
              Cerrar sesion
            </Button>
          </div>
        </Card>

        <Card className="mb-5 overflow-hidden p-6 sm:p-7" aria-label="Hero del dashboard">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.9fr)] lg:items-start">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#4d938a]">Dashboard</p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-800 sm:text-5xl">
                Bienvenido, {safeUser.name || 'usuario'}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Revisa el estado general de tus proyectos y entra a cada uno para continuar con sus tareas.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <a href="#crear-proyecto">Crear proyecto</a>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <a href="#proyectos">Ver proyectos</a>
                </Button>
              </div>
            </div>

            <aside className="grid gap-4">
              <div className="rounded-[24px] border border-[#d6ebe4] bg-gradient-to-br from-[#e7f5f2] via-[#fffdf9] to-[#f6e7d8] p-5 shadow-[0_16px_35px_rgba(79,175,159,0.12)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4d938a]">En foco hoy</p>
                <strong className="mt-3 block text-2xl font-semibold text-slate-800">
                  {activeProjects > 0 ? `${activeProjects} proyectos activos` : 'Todo listo para empezar'}
                </strong>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Empieza por lo que esta en marcha y entra al detalle de cada proyecto cuando necesites avanzar tareas.
                </p>
              </div>

              <div className={`${subtlePanelClass} grid gap-3`}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Pasos sugeridos</p>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">1</span>
                  <p className="text-sm leading-6 text-slate-600">Crea un proyecto nuevo o revisa los que ya tienes.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">2</span>
                  <p className="text-sm leading-6 text-slate-600">Entra a su vista para organizar tareas, prioridades y avances.</p>
                </div>
              </div>
            </aside>
          </div>
        </Card>

        <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumen rapido del dashboard">
          <MetricCard
            eyebrow="Proyectos totales"
            value={totalProjects}
            description="Todos los proyectos que tienes disponibles en este momento."
          />
          <MetricCard
            eyebrow="Pendientes"
            value={pendingProjects}
            description="Proyectos listos para arrancar."
          />
          <MetricCard
            eyebrow="En progreso"
            value={activeProjects}
            description="Proyectos que siguen en marcha."
          />
          <MetricCard
            eyebrow="Completados"
            value={completedProjects}
            description="Proyectos que ya terminaste."
          />
        </section>

        <section className="mb-5 grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_360px]">
          <Card className="p-6 sm:p-7">
            <SectionHeader
              eyebrow="Estado general"
              title="Avance de proyectos"
              description="Una lectura rapida para saber cuanto esta pendiente, cuanto esta en marcha y cuanto ya cerraste."
              actions={
                <div className={subtlePanelClass}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Progreso total</p>
                  <strong className="mt-2 block text-2xl font-semibold text-slate-800">{completionRate}%</strong>
                </div>
              }
            />
            <StatusSummary
              title="Distribucion por estado"
              description="Te ayuda a detectar si el trabajo se esta acumulando al inicio o si ya estas cerrando frentes."
              items={projectSummaryItems}
            />
          </Card>

          <Card className="p-6 sm:p-7">
            <SectionHeader
              eyebrow="Lectura rapida"
              title="Como usar este panel"
              description="Primero revisa el avance general. Despues filtra proyectos y entra solo a los que necesiten atencion."
            />
            <div className="grid gap-3">
              <div className={subtlePanelClass}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Paso 1</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Crea o ubica el proyecto que quieres trabajar.</p>
              </div>
              <div className={subtlePanelClass}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Paso 2</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Usa los filtros para encontrarlo mas rapido cuando la lista crezca.</p>
              </div>
              <div className={subtlePanelClass}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Paso 3</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Entra al detalle y trabaja las tareas en un contexto mas enfocado.</p>
              </div>
            </div>
          </Card>
        </section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_360px] xl:items-start">
          <Card className="p-6 sm:p-7" id="crear-proyecto">
            <div className="mb-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#4d938a]">Nuevo proyecto</p>
              <h2 className="text-3xl font-semibold text-slate-800">Crear proyecto</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Crea un proyecto nuevo para organizar mejor el trabajo y entrar luego a su vista detallada.
              </p>
            </div>

            <div className={sectionCardClass}>
              <form className="grid gap-5" onSubmit={handleSubmit}>
                <div>
                  <label className={labelClassName} htmlFor="project-name">
                    Nombre
                  </label>
                  <Input
                    id="project-name"
                    name="name"
                    type="text"
                    className="mt-2"
                    placeholder="Ej. Portal de clientes"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={labelClassName} htmlFor="project-description">
                    Descripcion
                  </label>
                  <Textarea
                    id="project-description"
                    name="description"
                    className="mt-2"
                    rows="3"
                    placeholder="Describe brevemente de que trata"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={labelClassName} htmlFor="project-status">
                    Estado
                  </label>
                  <select
                    id="project-status"
                    name="status"
                    className={selectClassName}
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="in_progress">En progreso</option>
                    <option value="done">Completado</option>
                  </select>
                </div>

                {formError && (
                  <Alert variant="destructive">
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full sm:w-fit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creando proyecto...' : 'Crear proyecto'}
                </Button>
              </form>
            </div>
          </Card>

          <Card className="h-fit p-6 sm:p-7" id="resumen-cuenta">
            <div className="mb-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#4d938a]">Tu cuenta</p>
              <div className="flex flex-col gap-3">
                <h2 className="text-3xl font-semibold text-slate-800">Resumen de cuenta</h2>
                <Badge variant={authStatus === 'authenticated' ? 'success' : 'warning'} className="min-h-9 w-fit px-4 text-sm font-semibold normal-case">
                  {authStatus === 'authenticated' ? 'Activa' : 'Por revisar'}
                </Badge>
              </div>
            </div>

            <dl className="grid gap-4">
              <div className={subtlePanelClass}>
                <dt className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Email</dt>
                <dd className="m-0 text-base font-semibold text-slate-800">{safeUser.email || 'No disponible'}</dd>
              </div>
              <div className={subtlePanelClass}>
                <dt className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Rol</dt>
                <dd className="m-0 text-base font-semibold text-slate-800">{safeUser.role || 'No disponible'}</dd>
              </div>
              <div className={subtlePanelClass}>
                <dt className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">ID</dt>
                <dd className="m-0 text-base font-semibold text-slate-800">{safeUser.id || 'No disponible'}</dd>
              </div>
            </dl>

            <div className="mt-5 rounded-[22px] border border-[#ecd7b3] bg-[#fbf4e6]/90 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b88949]">Tip</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Aqui ves el panorama general. Las tareas se gestionan dentro de cada proyecto para trabajar con mas foco.
              </p>
            </div>
          </Card>
        </div>

        <Card className="mt-5 p-6 sm:p-7" id="proyectos">
          <SectionHeader
            eyebrow="Listado"
            title="Proyectos"
            description="Desde aqui puedes revisar tus proyectos y abrir cada uno para trabajar sus tareas."
            actions={
              <div className="grid grid-cols-2 gap-3 lg:w-auto">
                <div className={subtlePanelClass}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Visibles</p>
                  <strong className="mt-2 block text-2xl font-semibold text-slate-800">{sortedProjects.length}</strong>
                </div>
                <div className={subtlePanelClass}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Completados</p>
                  <strong className="mt-2 block text-2xl font-semibold text-slate-800">{completedProjects}</strong>
                </div>
              </div>
            }
          />

          <ProjectsFilterBar
            labelClassName={labelClassName}
            selectClassName={selectClassName}
            projectQuery={projectQuery}
            projectStatusFilter={projectStatusFilter}
            projectSortBy={projectSortBy}
            onProjectQueryChange={setProjectQuery}
            onProjectStatusFilterChange={setProjectStatusFilter}
            onProjectSortByChange={setProjectSortBy}
          />

          {isLoadingProjects && <ProjectsLoadingState />}

          {projectsError && (
            <Alert variant="destructive">
              <AlertDescription>{projectsError}</AlertDescription>
            </Alert>
          )}

          {!isLoadingProjects && !projectsError && projects.length === 0 && (
            <EmptyState
              title="Aun no tienes proyectos creados"
              description="Crea el primero desde el formulario superior para empezar a organizar tu trabajo."
            />
          )}

          {!isLoadingProjects && projects.length > 0 && sortedProjects.length === 0 && (
            <EmptyState
              title="No encontramos proyectos con esos filtros"
              description="Prueba con otro nombre o vuelve a mostrar todos los estados para recuperar resultados."
            />
          )}

          {!isLoadingProjects && sortedProjects.length > 0 && (
            <ul className="grid gap-4 lg:grid-cols-2">
              {sortedProjects.map((project) => (
                <li key={project.id}>
                  <ProjectCard
                    project={project}
                    getStatusBadgeVariant={getProjectStatusBadgeVariant}
                    onDelete={setProjectToDelete}
                  />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Dialog open={Boolean(projectToDelete)} onOpenChange={(isOpen) => !isOpen && !isDeletingProject && setProjectToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar proyecto</DialogTitle>
              <DialogDescription>
                {projectToDelete
                  ? `Se eliminara "${projectToDelete.name}" y esta accion no se puede deshacer.`
                  : 'Esta accion no se puede deshacer.'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setProjectToDelete(null)}
                disabled={isDeletingProject}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleProjectDelete}
                disabled={isDeletingProject}
              >
                {isDeletingProject ? 'Eliminando...' : 'Eliminar proyecto'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </main>
  )
}

export default Dashboard
