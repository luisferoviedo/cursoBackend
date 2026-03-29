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

// Busca un proyecto puntual usando el id de la URL.
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

// Antes de crear, pasa por middlewares para validar el body.
// Si todo está bien, recién ahí llama al controller.
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

// Actualiza un proyecto existente usando su id.
// Primero valida que haya campos para actualizar y luego valida status si fue enviado.
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

// Eliminar queda reservado para admin como ejemplo de autorización por endpoint.
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

// Exportamos el router para montarlo en src/server.js.
module.exports = router
