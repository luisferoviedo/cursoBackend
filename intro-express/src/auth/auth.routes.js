// Este archivo define las rutas públicas del módulo de autenticación.
// Aquí se decide qué endpoint llama a register y cuál llama a login.
const express = require('express')
const verifyAuth = require('./auth.middleware')
const { register, login, getCurrentUser } = require('./auth.controller')

// Router aislado para auth.
const router = express.Router()

// Crea un usuario nuevo.
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado correctamente.
 *       409:
 *         description: El email ya está registrado.
 */
router.post('/register', register)

// Valida credenciales y devuelve un token JWT.
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso.
 *       401:
 *         description: Credenciales inválidas.
 */
router.post('/login', login)

// Devuelve el usuario autenticado actual a partir del token enviado.
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Devuelve el usuario autenticado
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado obtenido correctamente.
 *       401:
 *         description: Token faltante o inválido.
 */
router.get('/me', verifyAuth, getCurrentUser)

// Exportamos el router para montarlo bajo /api/auth en server.js.
module.exports = router
