const express = require('express')

const router = express.Router()

const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/project.controller')

const validateProject = require("../middleware/validateProject")

const validateStatus = require('../middleware/validateStatus')

// Cuando llega una request a /api/projects, este router decide qué controller ejecutar.

// Lista todos los proyectos.
router.get('/', getProjects)

// Busca un proyecto puntual usando el id de la URL.
router.get('/:id', getProjectById)

// Antes de crear, pasa por validateProject para revisar el body.
router.post('/', validateProject, validateStatus, createProject)

// Actualiza un proyecto existente usando su id.
router.put('/:id', updateProject)

// Elimina un proyecto existente usando su id.
router.delete('/:id', deleteProject)

module.exports = router
