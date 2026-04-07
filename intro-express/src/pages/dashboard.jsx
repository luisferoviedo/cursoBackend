import { useState } from 'react'
import { getApiErrorMessage } from '../lib/api'

// Vista autenticada principal.
// Presenta información del usuario, lista de proyectos y el formulario para crear nuevos proyectos.
// El estado global de sesión/proyectos vive en App; aquí solo manejamos la UX local del formulario.
function Dashboard({
  authStatus,
  user,
  projects = [],
  projectsError,
  isLoadingProjects,
  onLogout,
  onCreateProject
}) {
  const safeUser = user ?? {}

  // Estado local del formulario de creación.
  // Vive en Dashboard porque pertenece a la interacción visual de esta pantalla, no al estado global.
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'pending'
  })

  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    // Mantenemos el form controlado con un único handler para inputs, textarea y select.
    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }))

    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    // Validación mínima en cliente para evitar roundtrips innecesarios.
    if (!formData.name.trim()) {
      setFormError('Debes escribir el nombre del proyecto')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError('')

      // Dashboard delega la persistencia a App.
      // App ejecuta el POST real y luego refresca la lista de proyectos.
      await onCreateProject({
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status
      })

      // Si la creación fue exitosa, limpiamos la UI para permitir una nueva inserción.
      setFormData({
        name: '',
        description: '',
        status: 'pending'
      })
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'No se pudo crear el proyecto'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="auth-wrapper auth-wrapper-wide">
        <nav className="dashboard-navbar" aria-label="Navegacion principal del dashboard">
          <div className="dashboard-navbar-brand">
            <p className="dashboard-navbar-label">Workspace</p>
            <strong>Panel de control</strong>
          </div>

          <div className="dashboard-navbar-actions">
            <a href="#resumen-cuenta" className="dashboard-nav-link">
              Resumen
            </a>
            <a href="#proyectos" className="dashboard-nav-link">
              Proyectos
            </a>
            <button type="button" className="btn btn-outline-secondary" onClick={onLogout}>
              Cerrar sesion
            </button>
          </div>
        </nav>

        <div className="app-intro">
          <p className="eyebrow">Dashboard</p>
          <h1 className="hero-title">Bienvenido, {safeUser.name || 'usuario'}</h1>
          <p className="hero-copy">
            Consulta tu informacion de acceso y el estado general de tus proyectos.
          </p>
        </div>

        <div className="glass-card" id="resumen-cuenta">
          <div className="dashboard-header">
            <div>
              <p className="eyebrow mb-2">Sesion activa</p>
              <h2 className="panel-title">Resumen de cuenta</h2>
            </div>
            <span className="session-badge">
              {authStatus === 'authenticated' ? 'Activa' : 'Pendiente'}
            </span>
          </div>

          <dl className="user-data dashboard-card-grid">
            <div className="ui-card ui-card-compact">
              <dt>Email</dt>
              <dd>{safeUser.email || 'No disponible'}</dd>
            </div>
            <div className="ui-card ui-card-compact">
              <dt>Rol</dt>
              <dd>{safeUser.role || 'No disponible'}</dd>
            </div>
            <div className="ui-card ui-card-compact">
              <dt>ID</dt>
              <dd>{safeUser.id || 'No disponible'}</dd>
            </div>
          </dl>

          <section className="ui-card ui-card-section dashboard-form-card">
            <div className="project-panel-header">
              <div>
                <p className="eyebrow mb-2">Nuevo proyecto</p>
                <h3 className="h5 mb-0">Crear proyecto</h3>
              </div>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div>
                <label className="form-label" htmlFor="project-name">
                  Nombre
                </label>
                <input
                  id="project-name"
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="Ej. Portal de clientes"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="form-label" htmlFor="project-description">
                  Descripcion
                </label>
                <textarea
                  id="project-description"
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Describe brevemente el objetivo del proyecto"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="form-label" htmlFor="project-status">
                  Estado
                </label>
                <select
                  id="project-status"
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En progreso</option>
                  <option value="done">Completado</option>
                </select>
              </div>

              {formError && (
                <div className="alert alert-danger mb-0" role="alert">
                  {formError}
                </div>
              )}

              <button type="submit" className="btn btn-accent dashboard-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Crear proyecto'}
              </button>
            </form>
          </section>

          <section className="project-panel ui-card ui-card-section" id="proyectos">
            <div className="project-panel-header">
              <h3 className="h5 mb-0">Proyectos</h3>
              <span className="project-count">{projects.length}</span>
            </div>

            {isLoadingProjects && <p className="project-feedback">Cargando proyectos...</p>}

            {projectsError && (
              <p className="text-danger mb-2">{projectsError}</p>
            )}

            {!isLoadingProjects && !projectsError && projects.length === 0 && (
              <p className="project-feedback">No hay proyectos para mostrar.</p>
            )}

            {!isLoadingProjects && projects.length > 0 && (
              <ul className="project-list">
                {projects.map((project) => (
                  <li key={project.id} className="project-item">
                    <div className="project-item-header">
                      <strong>{project.name}</strong>
                      <span className={`project-status project-status-${project.status}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="project-meta">
                      Proyecto #{project.id}
                      {project.description ? ` - ${project.description}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

        </div>
      </section>
    </main>
  )
}

export default Dashboard
