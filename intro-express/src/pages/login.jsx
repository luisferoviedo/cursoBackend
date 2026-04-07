import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, getApiErrorMessage } from '../lib/api'

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
  }

  async function handleSubmit(event) {
    // Resolvemos el submit por JS para manejar loading, errores y navegación sin recargar la SPA.
    event.preventDefault()

    if (!formData.email.trim() || !formData.password.trim()) {
      setFormError('Debes completar email y password')
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

      // App persiste la sesion y luego navegamos al dashboard.
      await onLoginSuccess(data)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'No fue posible iniciar sesion'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="auth-wrapper">
        <div className="app-intro">
          <p className="eyebrow">Acceso</p>
          <h1 className="hero-title">Inicia sesion</h1>
          <p className="hero-copy">
            Accede a tu espacio de trabajo para consultar tu informacion y tus proyectos.
          </p>
        </div>

        <div className="glass-card">
          <p className="eyebrow mb-2">Cuenta</p>
          <h2 className="panel-title">Inicia sesion</h2>
          <p className="panel-copy">
            Ingresa con tu correo y tu password para entrar al panel.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div>
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control form-control-lg"
                placeholder="tuemail@correo.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control form-control-lg"
                placeholder="Minimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            {(formError || sessionError) && (
              <div className="alert alert-danger mb-0" role="alert">
                {formError || sessionError}
              </div>
            )}

            <button type="submit" className="btn btn-accent btn-lg w-100" disabled={isSubmitting}>
              {isSubmitting ? 'Validando credenciales...' : 'Entrar al sistema'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Login
