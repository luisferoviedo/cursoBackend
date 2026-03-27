// Este middleware valida permisos según el rol del usuario autenticado.
// Debe ejecutarse después de verifyAuth, porque depende de req.user.
const authorize = (...allowedRoles) => {
  // allowedRoles define qué roles pueden usar la ruta protegida.
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized'
      })
    }

    // Si el rol del token no está entre los permitidos, bloqueamos con 403.
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }

    next()
  }
}

// Exportamos la fábrica de middlewares para reutilizarla en server.js o routers.
module.exports = authorize
