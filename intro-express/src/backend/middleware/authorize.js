// authorize.js
// Middleware de autorización por rol.
// Debe ejecutarse después de verifyAuth porque depende de req.user ya autenticado.

const authorize = (...allowedRoles) => {
  // allowedRoles define qué roles pueden usar la ruta actual.
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

module.exports = authorize
