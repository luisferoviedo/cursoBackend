// Este archivo define las URLs del módulo de proyectos.
// Su trabajo es recibir la request y decidir:
// 1) qué middlewares corren primero
// 2) qué controller debe ejecutarse después
// No contiene lógica de negocio ni queries SQL.

// Router aislado para todas las rutas del recurso projects.
const express = require('express')

// Router permite agrupar endpoints relacionados en un solo módulo.
const router = express.Router()
// Middleware que valida permisos según el rol del usuario autenticado.
const authorize = require('../middleware/authorize')

const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/project.controller')

// Middleware que valida que el body tenga el nombre del proyecto.
const validateProject = require("../middleware/validateProject")

// Middleware que valida si el status enviado pertenece a la lista permitida.
const validateStatus = require('../middleware/validateStatus')
const validateProjectUpdate = require('../middleware/validateProjectUpdate')
const validateOptionalStatus = require('../middleware/validateOptionalStatus')

// Cuando llega una request a /api/projects, este router decide qué controller ejecutar.
// Este router le manda la información a project.controller.js.

// Lista todos los proyectos.
// Flujo: route -> controller -> service -> db
router.get('/', authorize('user', 'admin'), getProjects)

// Busca un proyecto puntual usando el id de la URL.
router.get('/:id', authorize('user', 'admin'), getProjectById)

// Antes de crear, pasa por middlewares para validar el body.
// Si todo está bien, recién ahí llama al controller.
router.post('/', authorize('user', 'admin'), validateProject, validateStatus, createProject)

// Actualiza un proyecto existente usando su id.
// Primero valida que haya campos para actualizar y luego valida status si fue enviado.
router.put('/:id', authorize('user', 'admin'), validateProjectUpdate, validateOptionalStatus, updateProject)

// Eliminar queda reservado para admin como ejemplo de autorización por endpoint.
router.delete('/:id', authorize('admin'), deleteProject)

// Exportamos el router para montarlo en src/server.js.
module.exports = router
