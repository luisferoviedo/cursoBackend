// Este middleware protege rutas privadas usando JWT.
// Se ejecuta antes de controllers como projects o tasks.
const jwt = require('jsonwebtoken')

// Lee el header Authorization y valida que tenga formato Bearer.
// Si el token es válido, guarda el payload en req.user y deja continuar la request.
const verifyAuth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      message: 'Token required'
    })
  }

  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'Invalid authorization format'
    })
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      message: 'JWT secret is not configured'
    })
  }

  try {
    // jwt.verify confirma que el token fue firmado con nuestra secret key
    // y que no esté vencido o alterado.
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decodedToken

    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token'
    })
  }
}

// Exportamos el middleware para reutilizarlo en server.js.
module.exports = verifyAuth
