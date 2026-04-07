import axios from 'axios'

// Contrato compartido de sesión del frontend.
// App, interceptores y páginas usan la misma key para persistir y restaurar autenticación.
export const AUTH_STORAGE_KEY = 'auth_token'

export const api = axios.create({
  baseURL: '/api'
})

let unauthorizedHandler = null

// Los interceptores se ejecutan fuera de React.
// Este callback permite avisarle a App que debe limpiar la sesión cuando el backend responde 401.
function getStoredToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY)
}

function clearStoredSession() {
  setAuthToken(null)

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

export function setAuthToken(token) {
  // Mantenemos el header por defecto para compatibilidad,
  // aunque el request interceptor también lo agrega dinámicamente desde localStorage.
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete api.defaults.headers.common.Authorization
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

export function getApiErrorMessage(error, fallbackMessage) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallbackMessage
  }

  return fallbackMessage
}

// Request interceptor:
// antes de cada request protegida, lee el token actual y arma Authorization automáticamente.
api.interceptors.request.use((config) => {
  const token = getStoredToken()

  if (!config.headers) {
    config.headers = {}
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    delete config.headers.Authorization
  }

  return config
})

// Response interceptor:
// centraliza el manejo de 401 para no repetir logout manual en cada pantalla.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.status
    const requestUrl = error.config?.url ?? ''
    const isAuthRequest =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/me')

    // Excluimos endpoints de auth para no convertir un login fallido en logout redundante.
    if (statusCode === 401 && !isAuthRequest) {
      clearStoredSession()

      if (unauthorizedHandler) {
        unauthorizedHandler(error)
      } else if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.replace('/login')
      }
    }

    return Promise.reject(error)
  }
)
