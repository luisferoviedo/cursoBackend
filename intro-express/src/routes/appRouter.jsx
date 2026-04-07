import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/login'
import Dashboard from '../pages/dashboard'
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
  onCreateProject
}) {
  const isAuthenticated = authStatus === 'authenticated'

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
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
            <PrivateRoute authStatus={authStatus}>
              <Dashboard
                authStatus={authStatus}
                user={user}
                projects={projects}
                projectsError={projectsError}
                isLoadingProjects={isLoadingProjects}
                onLogout={onLogout}
                onCreateProject={onCreateProject}
              />
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
