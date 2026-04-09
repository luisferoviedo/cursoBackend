// auth.routes.js
// Define el mapa HTTP del módulo de autenticación.
// Aquí solo se declara qué endpoint existe, qué middleware usa y qué controller lo atiende.

const express = require('express')

const verifyAuth = require('./auth.middleware')
const { register, login, getCurrentUser } = require('./auth.controller')

// 1. Router base
const router = express.Router()

// 2. Endpoints publicos
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

// 3. Endpoints protegidos
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

module.exports = router
