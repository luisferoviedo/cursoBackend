// Este archivo define las URLs del módulo de tareas.
// Aquí también se decide qué middleware debe correr antes del controller.
// Este router le manda la información a task.controller.js.

// Router para las rutas de tareas asociadas a proyectos.
const express = require('express')

// mergeParams permite leer projectId definido en el prefijo del router.
const router = express.Router({ mergeParams: true })
// Middleware que valida permisos según el rol del usuario autenticado.
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

// Este router maneja tareas asociadas a un proyecto específico.
// Aquí el projectId viaja en la URL para saber a qué proyecto pertenece cada tarea.
// Luego el controller le pasa ese projectId al service y el service consulta la base.
// Endpoint completo en Bruno: GET /api/projects/:projectId/tasks
// Roles permitidos: user, admin.
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

// Busca una sola tarea dentro del proyecto indicado.
// Endpoint completo en Bruno: GET /api/projects/:projectId/tasks/:id
// Roles permitidos: user, admin.
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

// Crea una tarea y la relaciona con el projectId que viene en la URL.
// Primero valida body y después delega al controller.
// Endpoint completo en Bruno: POST /api/projects/:projectId/tasks
// Roles permitidos: user, admin.
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

// Actualiza una tarea puntual dentro de un proyecto.
// Endpoint completo en Bruno: PUT /api/projects/:projectId/tasks/:id
// Roles permitidos: user, admin.
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

// Endpoint completo en Bruno: DELETE /api/projects/:projectId/tasks/:id
// Roles permitidos: user, admin.
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

// Exportamos el router para conectarlo en el servidor principal.
module.exports = router
