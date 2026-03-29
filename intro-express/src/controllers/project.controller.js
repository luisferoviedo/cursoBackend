// Este controller es la capa intermedia entre routes y services.
// Recibe req/res desde projects.routes.js.
// Toma datos de params o body, llama a project.service.js
// y finalmente arma la respuesta HTTP para el cliente.

const projectService = require('../services/project.service')
const {
  handleControllerError,
  getValidNumericParam
} = require('../utils/controller.helpers')

// Devuelve todos los proyectos guardados en la base.
// Este controller no consulta SQLite directamente: le pide la información al service.
const getProjects = async (req, res) => {
  try {
    const projects = await projectService.getProjects(
      req.app.locals.db,
      {
        status: req.query.status,
        sort: req.query.sort
      }
    )

    res.json(projects)
  } catch (error) {
    handleControllerError(error, res)
  }
}

// Devuelve un proyecto puntual por id.
// Flujo interno: route -> controller -> service -> db -> service -> controller -> response
const getProjectById = async (req, res) => {
  const id = getValidNumericParam(
    req.params.id,
    'Project id must be a valid number',
    res
  )

  if (id === null) {
    return
  }

  try {
    const project = await projectService.getProjectById(req.app.locals.db, id)

    res.json(project)
  } catch (error) {
    handleControllerError(error, res)
  }
}

// Inserta un proyecto nuevo usando la capa de servicio.
// req.body llega desde Express y el controller se lo pasa casi intacto al service.
const createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.app.locals.db, req.body)

    res.status(201).json(project)
  } catch (error) {
    handleControllerError(error, res)
  }
}

// Actualiza un proyecto existente sin dejar reglas de negocio dentro del controller.
// El controller solo coordina; la lógica de "qué se conserva" vive en el service.
const updateProject = async (req, res) => {
  const id = getValidNumericParam(
    req.params.id,
    'Project id must be a valid number',
    res
  )

  if (id === null) {
    return
  }

  try {
    const project = await projectService.updateProject(
      req.app.locals.db,
      id,
      req.body
    )

    res.json(project)
  } catch (error) {
    handleControllerError(error, res)
  }
}

// Elimina un proyecto y devuelve el registro previo para facilitar QA.
// Esto ayuda a confirmar exactamente qué registro salió de la base.
const deleteProject = async (req, res) => {
  const id = getValidNumericParam(
    req.params.id,
    'Project id must be a valid number',
    res
  )

  if (id === null) {
    return
  }

  try {
    const project = await projectService.deleteProject(req.app.locals.db, id)

    res.json({
      message: 'Project deleted',
      project
    })
  } catch (error) {
    handleControllerError(error, res)
  }
}

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
}
