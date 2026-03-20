const express = require('express')

const router = express.Router()

const {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/task.controller')

// Este router maneja tareas asociadas a un proyecto específico.
// Aquí el projectId viaja en la URL para saber a qué proyecto pertenece cada tarea.
router.get('/api/projects/:projectId/tasks', getTasksByProject)

// Busca una sola tarea dentro del proyecto indicado.
router.get('/api/projects/:projectId/tasks/:id', getTaskById)

// Crea una tarea y la relaciona con el projectId que viene en la URL.
router.post('/api/projects/:projectId/tasks', createTask)

// Actualiza una tarea puntual dentro de un proyecto.
router.put('/api/projects/:projectId/tasks/:id', updateTask)

// Elimina una tarea puntual dentro de un proyecto.
router.delete('/api/projects/:projectId/tasks/:id', deleteTask)

module.exports = router
