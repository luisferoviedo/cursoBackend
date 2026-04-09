import { Navigate } from 'react-router-dom'
import Skeleton from '@/components/ui/skeleton'

// Guard de rutas privadas.
// checking evita redirecciones prematuras mientras App decide si el token guardado sigue siendo válido.
function PrivateRoute({ authStatus, children }) {
  if (authStatus === 'checking') {
    // Mientras App valida /auth/me no debemos decidir todavía si entra o no.
    // Si redirigiéramos aquí, causaríamos rebotes falsos al login.
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-10">
        <section className="w-full max-w-md">
          <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 text-center shadow-[0_20px_45px_rgba(148,163,184,0.2)] backdrop-blur-xl">
            <p className="text-sm font-medium text-slate-600">Preparando tu espacio...</p>
            <div className="mt-4 grid gap-3">
              <Skeleton className="mx-auto h-3 w-40" />
              <Skeleton className="mx-auto h-10 w-full rounded-2xl" />
            </div>
          </div>
        </section>
      </main>
    )
  }

  // Cuando checking termina, el guard ya puede tomar una decisión definitiva.
  return authStatus === 'authenticated' ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
