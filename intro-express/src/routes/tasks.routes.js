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
const validateOptionalStatus = require('../middleware/validateOptionalStatus')

// Este router maneja tareas asociadas a un proyecto específico.
// Aquí el projectId viaja en la URL para saber a qué proyecto pertenece cada tarea.
// Luego el controller le pasa ese projectId al service y el service consulta la base.
// Endpoint completo en Bruno: GET /api/projects/:projectId/tasks
// Roles permitidos: user, admin.
router.get('/', authorize('user', 'admin'), getTasksByProject)

// Busca una sola tarea dentro del proyecto indicado.
// Endpoint completo en Bruno: GET /api/projects/:projectId/tasks/:id
// Roles permitidos: user, admin.
router.get('/:id', authorize('user', 'admin'), getTaskById)

// Crea una tarea y la relaciona con el projectId que viene en la URL.
// Primero valida body y después delega al controller.
// Endpoint completo en Bruno: POST /api/projects/:projectId/tasks
// Roles permitidos: user, admin.
router.post('/', authorize('user', 'admin'), validateTask, createTask)

// Actualiza una tarea puntual dentro de un proyecto.
// Endpoint completo en Bruno: PUT /api/projects/:projectId/tasks/:id
// Roles permitidos: user, admin.
router.put('/:id', authorize('user', 'admin'), validateTaskUpdate, validateOptionalStatus, updateTask)

// Endpoint completo en Bruno: DELETE /api/projects/:projectId/tasks/:id
// Roles permitidos: user.
router.delete('/:id', authorize('user'), deleteTask)

// Exportamos el router para conectarlo en el servidor principal.
module.exports = router
