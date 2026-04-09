// auth.controller.js
// Traduce HTTP hacia la capa de servicio del módulo auth.
// Lee req/res, delega la lógica real al service y devuelve la respuesta al cliente.

const authService = require('./auth.service')
const { handleControllerError } = require('../utils/controller.helpers')

// 1. Endpoints publicos
const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.app.locals.db, req.body)

    res.status(201).json(user)
  } catch (error) {
    handleControllerError(error, res)
  }
}

const login = async (req, res) => {
  try {
    const authResult = await authService.loginUser(req.app.locals.db, req.body)

    res.json(authResult)
  } catch (error) {
    handleControllerError(error, res)
  }
}

// 2. Endpoints protegidos
const getCurrentUser = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.app.locals.db, req.user.sub)

    res.json(user)
  } catch (error) {
    handleControllerError(error, res)
  }
}

module.exports = {
  register,
  login,
  getCurrentUser
}
