import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, getApiErrorMessage } from '../../../lib/api'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// Pantalla pública de acceso.
// Controla solo la UX del formulario; la persistencia de sesión vive en App.
function Login({ onLoginSuccess, sessionError }) {
  const navigate = useNavigate()

  // Formulario controlado: el estado local refleja exactamente lo que el usuario ve en pantalla.
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    // Un único handler mantiene consistencia y reduce repetición entre email y password.
    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }))

    setFormError('')
  }

  async function handleSubmit(event) {
    // Resolvemos el submit por JS para manejar loading, errores y navegación sin recargar la SPA.
    event.preventDefault()

    if (!formData.email.trim() || !formData.password.trim()) {
      setFormError('Completa tu correo y tu contraseña')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError('')

      // La API devuelve token + usuario. App se encarga de persistir la sesión y cargar datos protegidos.
      const { data } = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      })

      // Login no guarda sesión por su cuenta.
      // Entrega el resultado a App para que App actualice el estado global y cargue proyectos.
      await onLoginSuccess(data)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'No pudimos iniciar tu sesion'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-md">
        <div className="mb-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#4d938a]">Bienvenido</p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-800 sm:text-5xl">Inicia sesion</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Entra a tu cuenta para revisar tus proyectos y continuar con tu trabajo.
          </p>
          <ul className="mt-6 grid gap-3" aria-label="Beneficios del acceso">
            {[
              'Acceso rapido a tus proyectos',
              'Seguimiento claro de avances y pendientes',
              'Un solo lugar para organizar tu trabajo'
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#4faf9f] shadow-[0_0_0_5px_rgba(217,241,235,0.9)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <Card>
          <CardHeader className="p-6 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4d938a]">Tu cuenta</p>
            <CardTitle className="text-3xl">Inicia sesion</CardTitle>
            <CardDescription className="mt-1 text-sm leading-7 sm:text-base">
              Ingresa con tu correo y tu contraseña para continuar.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-5 p-6 pt-0 sm:p-7 sm:pt-0">
            <form className="grid gap-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700" htmlFor="email">
                Correo
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                className="mt-2"
                placeholder="tucorreo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700" htmlFor="password">
                Contraseña
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                className="mt-2"
                placeholder="Minimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <p className="-mt-1 text-sm leading-6 text-slate-500">
              Si ya habias iniciado sesion, intentaremos recuperar tu acceso automaticamente.
            </p>

            {(formError || sessionError) && (
              <Alert variant="destructive">
                <AlertDescription>{formError || sessionError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
            </form>

            <p className="text-sm leading-6 text-slate-500">
              Usa tus datos de acceso para entrar y continuar con tus proyectos.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

export default Login
