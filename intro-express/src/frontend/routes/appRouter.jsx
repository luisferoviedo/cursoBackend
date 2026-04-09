import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from '../features/auth/screens/LoginScreen.jsx'
import Dashboard from '../features/projects/screens/DashboardScreen.jsx'
import ProjectDetail from '../features/tasks/screens/ProjectDetailScreen.jsx'
import PrivateRoute from './PrivateRoute'

// Router del frontend.
// Solo decide qué pantalla mostrar y qué props necesita cada ruta; no carga datos ni guarda sesión.
function AppRouter({
  authStatus,
  user,
  projects,
  sessionError,
  projectsError,
  isLoadingProjects,
  onLoginSuccess,
  onLogout,
  onCreateProject,
  onDeleteProject
}) {
  // Derivamos esta bandera una sola vez para reutilizar la misma regla
  // en login, dashboard y fallback de rutas desconocidas.
  const isAuthenticated = authStatus === 'authenticated'

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            // Si el usuario ya está autenticado, login deja de tener sentido
            // y lo mandamos directo al dashboard.
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLoginSuccess={onLoginSuccess} sessionError={sessionError} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            // PrivateRoute decide si se puede entrar.
            // Dashboard solo se renderiza cuando el guard ya aprobó la sesión.
            <PrivateRoute authStatus={authStatus}>
              <Dashboard
                authStatus={authStatus}
                user={user}
                projects={projects}
                projectsError={projectsError}
                isLoadingProjects={isLoadingProjects}
                onLogout={onLogout}
                onCreateProject={onCreateProject}
                onDeleteProject={onDeleteProject}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <PrivateRoute authStatus={authStatus}>
              <ProjectDetail onLogout={onLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
