import { Navigate } from 'react-router-dom'

// Guard de rutas privadas.
// checking evita redirecciones prematuras mientras App decide si el token guardado sigue siendo válido.
function PrivateRoute({ authStatus, children }) {
  if (authStatus === 'checking') {
    return (
      <main className="app-shell">
        <section className="auth-wrapper">
          <div className="glass-card">
            <p className="project-feedback mb-0">Validando sesion...</p>
          </div>
        </section>
      </main>
    )
  }

  return authStatus === 'authenticated' ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
