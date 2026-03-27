// Este archivo define las rutas públicas del módulo de autenticación.
// Aquí se decide qué endpoint llama a register y cuál llama a login.
const express = require('express')
const verifyAuth = require('./auth.middleware')
const { register, login, getCurrentUser } = require('./auth.controller')

// Router aislado para auth.
const router = express.Router()

// Crea un usuario nuevo.
router.post('/register', register)
// Valida credenciales y devuelve un token JWT.
router.post('/login', login)
// Devuelve el usuario autenticado actual a partir del token enviado.
router.get('/me', verifyAuth, getCurrentUser)

// Exportamos el router para montarlo bajo /api/auth en server.js.
module.exports = router
