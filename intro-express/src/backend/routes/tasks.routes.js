// tasks.routes.js
// Define las URLs del módulo de tareas asociado a proyectos.
// Aquí solo se declara el endpoint, los middlewares previos y el controller correspondiente.

const express = require('express')
const authorize = require('../middleware/authorize')
const {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/task.controller')
const validateTask = require('../middleware/validateTask')
const validateTaskUpdate = require('../middleware/validateTaskUpdate')

// 1. Router base
// mergeParams permite leer projectId desde /api/projects/:projectId/tasks.
const router = express.Router({ mergeParams: true })

// 2. Endpoints de lectura
/**
 * @swagger
 * /api/projects/{projectId}/tasks:
 *   get:
 *     summary: Lista tareas de un proyecto
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tareas del proyecto.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       400:
 *         description: Id inválido.
 *       401:
 *         description: Token faltante o inválido.
 *       404:
 *         description: Proyecto no encontrado.
 */
router.get('/', authorize('user', 'admin'), getTasksByProject)

/**
 * @swagger
 * /api/projects/{projectId}/tasks/{id}:
 *   get:
 *     summary: Obtiene una tarea por id dentro de un proyecto
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Id inválido.
 *       401:
 *         description: Token faltante o inválido.
 *       404:
 *         description: Proyecto o tarea no encontrados.
 */
router.get('/:id', authorize('user', 'admin'), getTaskById)

// 3. Endpoints de escritura
/**
 * @swagger
 * /api/projects/{projectId}/tasks:
 *   post:
 *     summary: Crea una tarea dentro de un proyecto
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCreateRequest'
 *     responses:
 *       201:
 *         description: Tarea creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: Token faltante o inválido.
 *       404:
 *         description: Proyecto no encontrado.
 */
router.post('/', authorize('user', 'admin'), validateTask, createTask)

/**
 * @swagger
 * /api/projects/{projectId}/tasks/{id}:
 *   put:
 *     summary: Actualiza una tarea
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdateRequest'
 *     responses:
 *       200:
 *         description: Tarea actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Datos o id inválidos.
 *       401:
 *         description: Token faltante o inválido.
 *       404:
 *         description: Proyecto o tarea no encontrados.
 */
router.put('/:id', authorize('user', 'admin'), validateTaskUpdate, updateTask)

/**
 * @swagger
 * /api/projects/{projectId}/tasks/{id}:
 *   delete:
 *     summary: Elimina una tarea
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea eliminada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Id inválido.
 *       401:
 *         description: Token faltante o inválido.
 *       404:
 *         description: Proyecto o tarea no encontrados.
 */
router.delete('/:id', authorize('user', 'admin'), deleteTask)

module.exports = router
