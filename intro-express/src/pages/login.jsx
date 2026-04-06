import { useState } from 'react'
import { api, getApiErrorMessage } from '../lib/api'

function Login({ onLoginSuccess, sessionError }) {
  // Este estado concentra lo que el usuario escribe en el formulario.
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    // Con una sola funcion actualizamos email o password segun el input que cambio.
    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }))
  }

  async function handleSubmit(event) {
    // Evita que el navegador recargue la pagina al enviar el formulario.
    event.preventDefault()

    if (!formData.email.trim() || !formData.password.trim()) {
      setFormError('Debes completar email y password')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError('')

      // Aqui ocurre la conexion real con el backend Express.
      const { data } = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      })

      // Si el login sale bien, avisamos a App para que guarde token y usuario.
      onLoginSuccess(data)
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'No fue posible iniciar sesion'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="glass-card">
      <p className="eyebrow mb-2">Acceso seguro</p>
      <h2 className="panel-title">Inicia sesion</h2>
      <p className="panel-copy">
        Usa el endpoint real del backend para obtener tu token JWT y validar la
        sesion del usuario.
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
  )
}

export default Login
