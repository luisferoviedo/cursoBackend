// tasks-list.routes.js
// Router dedicado al listado global de tareas para filtros y pruebas de consulta transversal.

const express = require('express')
const authorize = require('../middleware/authorize')
const { listTasks } = require('../controllers/task.controller')

// 1. Router base
const router = express.Router()

// 2. Endpoint de lectura global
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Lista tareas globalmente
 *     description: Devuelve hasta 10 tareas y permite filtrar por status, priority y sort.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, done]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       400:
 *         description: Filtros inválidos.
 *       401:
 *         description: Token faltante o inválido.
 */
router.get('/', authorize('user', 'admin'), listTasks)

module.exports = router
