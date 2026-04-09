// projects.routes.js
// Define las URLs del módulo de proyectos.
// Aquí solo se decide qué endpoint existe, qué middleware corre antes y qué controller responde.

const express = require('express')
const authorize = require('../middleware/authorize')
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/project.controller')
const validateProject = require('../middleware/validateProject')
const validateStatus = require('../middleware/validateStatus')
const validateProjectUpdate = require('../middleware/validateProjectUpdate')
const validateOptionalStatus = require('../middleware/validateOptionalStatus')

// 1. Router base
const router = express.Router()

// 2. Endpoints de lectura
/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Lista proyectos
 *     description: Devuelve hasta 10 proyectos y permite filtrar por status y ordenar por id.
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, done]
 *         description: Filtra proyectos por estado.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordena el resultado por id.
 *     responses:
 *       200:
 *         description: Lista de proyectos obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       400:
 *         description: Filtros inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token faltante o inválido.
 *       403:
 *         description: El usuario no tiene permisos suficientes.
 */
router.get('/', authorize('user', 'admin'), getProjects)

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Obtiene un proyecto por id
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proyecto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Id inválido.
 *       401:
 *         description: Token faltante o inválido.
 *       404:
 *         description: Proyecto no encontrado.
 */
router.get('/:id', authorize('user', 'admin'), getProjectById)

// 3. Endpoints de escritura
/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Crea un proyecto
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectCreateRequest'
 *     responses:
 *       201:
 *         description: Proyecto creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: Token faltante o inválido.
 *       403:
 *         description: El usuario no tiene permisos suficientes.
 */
router.post('/', authorize('user', 'admin'), validateProject, validateStatus, createProject)

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Actualiza un proyecto
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *             $ref: '#/components/schemas/ProjectUpdateRequest'
 *     responses:
 *       200:
 *         description: Proyecto actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Datos o id inválidos.
 *       401:
 *         description: Token faltante o inválido.
 *       404:
 *         description: Proyecto no encontrado.
 */
router.put('/:id', authorize('user', 'admin'), validateProjectUpdate, validateOptionalStatus, updateProject)

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Elimina un proyecto
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proyecto eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       401:
 *         description: Token faltante o inválido.
 *       403:
 *         description: Solo admin puede eliminar proyectos.
 *       404:
 *         description: Proyecto no encontrado.
 */
router.delete('/:id', authorize('admin'), deleteProject)

module.exports = router
