import { useEffect, useState } from 'react'
import Login from './pages/login'
import { api, getApiErrorMessage, setAuthToken } from './lib/api'

// Aqui se guarda el JWT para reutilizar la sesion si el usuario recarga la pagina.
const AUTH_STORAGE_KEY = 'auth_token'

function App() {
  const [authStatus, setAuthStatus] = useState('checking')
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [sessionError, setSessionError] = useState('')
  const [projectsError, setProjectsError] = useState('')
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)

  useEffect(() => {
    // Al abrir la app, primero miramos si ya habia un token guardado.
    const storedToken = localStorage.getItem(AUTH_STORAGE_KEY)

    if (!storedToken) {
      setAuthStatus('guest')
      return
    }

    loadCurrentUser(storedToken)
  }, [])

  async function loadCurrentUser(token) {
    try {
      setSessionError('')
      setAuthToken(token)

      // Si el token sigue siendo valido, el backend responde con el usuario actual.
      const { data } = await api.get('/auth/me')

      setUser(data)
      setAuthStatus('authenticated')
      await loadProjects()
    } catch (error) {
      setAuthToken(null)
      localStorage.removeItem(AUTH_STORAGE_KEY)
      setUser(null)
      setAuthStatus('guest')
      setSessionError(getApiErrorMessage(error, 'No se pudo validar la sesion actual'))
    }
  }

  function handleLoginSuccess(authResult) {
    // Login.jsx entrega { token, user } cuando /api/auth/login responde correctamente.
    localStorage.setItem(AUTH_STORAGE_KEY, authResult.token)
    setAuthToken(authResult.token)
    setUser(authResult.user)
    setSessionError('')
    setAuthStatus('authenticated')
    loadProjects()
  }

  // Aca es como se carga informacion protegida por autenticacion.
  async function loadProjects() {
    try {
      setIsLoadingProjects(true)
      setProjectsError('')

      const { data } = await api.get('/projects')

      setProjects(data)
    } catch (error) {
      setProjects([])
      setProjectsError(getApiErrorMessage(error, 'No se pudieron cargar los proyectos'))
    } finally {
      setIsLoadingProjects(false)
    }
  }

  function handleLogout() {
    // Cerrar sesion aqui significa borrar el token y volver al formulario.
    setAuthToken(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
    setSessionError('')
    setAuthStatus('guest')
  }

  return (
    <main className="app-shell">
      <section className={`auth-wrapper ${user ? 'auth-wrapper-wide' : ''}`}>
        <div className="app-intro">
          <p className="eyebrow">Practica de login</p>
          <h1 className="hero-title">Inicio de sesion</h1>
          <p className="hero-copy">
            Interfaz simple conectada al backend Express para autenticar usuarios
            con <code>/api/auth/login</code>.
          </p>
        </div>

        {authStatus === 'checking' ? (
          <div className="glass-card text-center">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3 mb-0">Validando sesion guardada...</p>
          </div>
        ) : user ? (
          // Si ya hay usuario, mostramos la vista autenticada en vez del login.
          <div className="glass-card">
            <p className="eyebrow mb-2">Sesion iniciada</p>
            <h2 className="panel-title">Bienvenido, {user.name}</h2>
            <p className="panel-copy">
              El login fue exitoso. El token se guardo y el frontend valido al
              usuario consultando <code>/api/auth/me</code>.
            </p>

            <dl className="user-data">
              <div>
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt>Rol</dt>
                <dd>{user.role}</dd>
              </div>
              <div>
                <dt>ID</dt>
                <dd>{user.id}</dd>
              </div>
            </dl>

            <section className="project-panel">
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

            <button type="button" className="btn btn-outline-secondary w-100" onClick={handleLogout}>
              Cerrar sesion
            </button>
          </div>
        ) : (
          // Si no hay sesion valida, App delega al componente Login la captura del formulario.
          <Login onLoginSuccess={handleLoginSuccess} sessionError={sessionError} />
        )}
      </section>
    </main>
  )
}

export default App
