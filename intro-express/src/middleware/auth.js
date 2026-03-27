// Este archivo mantiene compatibilidad con la carpeta middleware.
// Reexporta el middleware real que vive dentro del módulo auth.
module.exports = require('../auth/auth.middleware')
