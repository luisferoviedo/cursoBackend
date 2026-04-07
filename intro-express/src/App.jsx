import { useEffect, useState } from 'react'
import {
  api,
  AUTH_STORAGE_KEY,
  getApiErrorMessage,
  setAuthToken,
  setUnauthorizedHandler
} from './lib/api'
import AppRouter from './routes/appRouter'

// Componente orquestador del frontend autenticado.
// Aquí vive el estado fuente de sesión y de proyectos; las páginas reciben datos y callbacks por props.
function App() {
  const [authStatus, setAuthStatus] = useState('checking')
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [sessionError, setSessionError] = useState('')
  const [projectsError, setProjectsError] = useState('')
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)

  useEffect(() => {
    // Al recargar la SPA, intentamos restaurar la sesión antes de decidir si el usuario es guest.
    const storedToken = localStorage.getItem(AUTH_STORAGE_KEY)

    if (!storedToken) {
      setAuthStatus('guest')
      return
    }

    loadCurrentUser(storedToken)
  }, [])

  useEffect(() => {
    // Conectamos React con el interceptor global del cliente HTTP.
    // Si el backend invalida la sesión, App vuelve a estado guest de forma centralizada.
    setUnauthorizedHandler(() => {
      clearClientSession('Tu sesion expiro. Inicia sesion de nuevo')
    })

    return () => {
      setUnauthorizedHandler(null)
    }
  }, [])

  function clearClientSession(sessionMessage = '') {
    // Esta función concentra toda la limpieza de sesión para no duplicar reseteos.
    setAuthToken(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
    setProjects([])
    setProjectsError('')
    setSessionError(sessionMessage)
    setAuthStatus('guest')
  }

  async function loadCurrentUser(token) {
    try {
      setSessionError('')
      setAuthToken(token)

      // La sesión solo se considera válida si el backend resuelve /auth/me correctamente.
      const { data } = await api.get('/auth/me')

      setUser(data)
      setAuthStatus('authenticated')
      await loadProjects()
    } catch (error) {
      clearClientSession(getApiErrorMessage(error, 'No se pudo validar la sesion actual'))
    }
  }

  async function handleLoginSuccess(authResult) {
    // Login entrega token + usuario. Desde aquí dejamos lista la sesión y cargamos recursos protegidos.
    localStorage.setItem(AUTH_STORAGE_KEY, authResult.token)
    setAuthToken(authResult.token)
    setUser(authResult.user)
    setSessionError('')
    setAuthStatus('authenticated')
    await loadProjects()
  }

  // Projects es estado compartido de la app autenticada.
  // Mantener la carga aquí evita que cada página tenga que reimplementar el mismo fetch.
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
  // Dashboard maneja la UX del formulario, pero App ejecuta la persistencia real y refresca la lista.
  async function handleCreateProject(projectData) {
    const { data } = await api.post('/projects', projectData)
    await loadProjects()
    return data
  }

  function handleLogout() {
    // Al cerrar sesion limpiamos token y estado local para volver al acceso inicial.
    clearClientSession()
  }

  return (
    <AppRouter
      authStatus={authStatus}
      user={user}
      projects={projects}
      sessionError={sessionError}
      projectsError={projectsError}
      isLoadingProjects={isLoadingProjects}
      onLoginSuccess={handleLoginSuccess}
      onLogout={handleLogout}
      onCreateProject={handleCreateProject}
    />
  )
}

export default App
