// Este controller conecta la capa HTTP con auth.service.js.
// Recibe req/res desde auth.routes.js y delega la lógica real al service.
const authService = require('./auth.service')
const { handleControllerError } = require('../utils/controller.helpers')

// Crea un usuario nuevo a partir del body enviado por el cliente.
// El controller no hashea contraseñas ni consulta SQLite directo.
const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.app.locals.db, req.body)

    res.status(201).json(user)
  } catch (error) {
    handleControllerError(error, res)
  }
}

// Devuelve el usuario autenticado asociado al token enviado en Authorization.
const getCurrentUser = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.app.locals.db, req.user.sub)

    res.json(user)
  } catch (error) {
    handleControllerError(error, res)
  }
}

// Valida credenciales y devuelve token + usuario.
// La generación del JWT ocurre en auth.service.js, no aquí.
const login = async (req, res) => {
  try {
    const authResult = await authService.loginUser(req.app.locals.db, req.body)

    res.json(authResult)
  } catch (error) {
    handleControllerError(error, res)
  }
}

// Exportamos los handlers para que auth.routes.js pueda usarlos.
module.exports = {
  getCurrentUser,
  register,
  login
}
