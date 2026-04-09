// task.controller.js
// Traduce requests HTTP del módulo tasks hacia la capa de servicio.
// Lee params/body, valida ids y deja la lógica de negocio dentro de task.service.js.

const taskService = require('../services/task.service')
const {
  handleControllerError,
  getValidNumericParam
} = require('../utils/controller.helpers')

// 1. Endpoints de lectura
const getTasksByProject = async (req, res) => {
  const projectId = getValidNumericParam(
    req.params.projectId,
    'Project id must be a valid number',
    res
  )

  if (projectId === null) {
    return
  }

  try {
    const tasks = await taskService.getTasksByProject(
      req.app.locals.db,
      projectId
    )

    res.json(tasks)
  } catch (error) {
    handleControllerError(error, res)
  }
}

const listTasks = async (req, res) => {
  try {
    const tasks = await taskService.listTasks(
      req.app.locals.db,
      {
        status: req.query.status,
        priority: req.query.priority,
        sort: req.query.sort
      }
    )

    res.json(tasks)
  } catch (error) {
    handleControllerError(error, res)
  }
}

// 2. Endpoints de escritura
const createTask = async (req, res) => {
  const projectId = getValidNumericParam(
    req.params.projectId,
    'Project id must be a valid number',
    res
  )

  if (projectId === null) {
    return
  }

  try {
    const task = await taskService.createTask(
      req.app.locals.db,
      projectId,
      req.body
    )

    res.status(201).json(task)
  } catch (error) {
    handleControllerError(error, res)
  }
}

// Devuelve una tarea puntual amarrada a su proyecto.
// Esto evita buscar una tarea "suelta" sin contexto de proyecto.
const getTaskById = async (req, res) => {
  const projectId = getValidNumericParam(
    req.params.projectId,
    'Project id must be a valid number',
    res
  )
  const taskId = getValidNumericParam(
    req.params.id,
    'Task id must be a valid number',
    res
  )

  if (projectId === null || taskId === null) {
    return
  }

  try {
    const task = await taskService.getTaskById(
      req.app.locals.db,
      projectId,
      taskId
    )

    res.json(task)
  } catch (error) {
    handleControllerError(error, res)
  }
}

// Actualiza una tarea existente sin duplicar la lógica de negocio en el controller.
// El service decide qué campos mantener y cuáles cambiar.
const updateTask = async (req, res) => {
  const projectId = getValidNumericParam(
    req.params.projectId,
    'Project id must be a valid number',
    res
  )
  const taskId = getValidNumericParam(
    req.params.id,
    'Task id must be a valid number',
    res
  )

  if (projectId === null || taskId === null) {
    return
  }

  try {
    const task = await taskService.updateTask(
      req.app.locals.db,
      projectId,
      taskId,
      req.body
    )

    res.json(task)
  } catch (error) {
    handleControllerError(error, res)
  }
}

// Elimina una tarea y devuelve el registro borrado para facilitar QA.
// Igual que en projects, esto ayuda a inspeccionar mejor el resultado.
const deleteTask = async (req, res) => {
  const projectId = getValidNumericParam(
    req.params.projectId,
    'Project id must be a valid number',
    res
  )
  const taskId = getValidNumericParam(
    req.params.id,
    'Task id must be a valid number',
    res
  )

  if (projectId === null || taskId === null) {
    return
  }

  try {
    const task = await taskService.deleteTask(
      req.app.locals.db,
      projectId,
      taskId
    )

    res.json({
      message: 'Task deleted',
      task
    })
  } catch (error) {
    handleControllerError(error, res)
  }
}

module.exports = {
  getTasksByProject,
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
}
