// Este controller recibe requests del router de tareas.
// Su responsabilidad es:
// 1) leer params/body
// 2) validar ids numéricos
// 3) delegar la lógica real a task.service.js
// 4) transformar el resultado en respuesta HTTP

const taskService = require('../services/task.service')

// Convierte un parámetro de la URL a número y corta la request si no es válido.
// Se usa tanto para projectId como para id de la tarea.
const getValidNumericParam = (value, message, res) => {
  const parsedValue = parseInt(value, 10)

  if (Number.isNaN(parsedValue)) {
    res.status(400).json({
      message
    })

    return null
  }

  return parsedValue
}

// Todos los controllers comparten el mismo criterio para responder errores.
// Si el service lanzó un status conocido lo respetamos; si no, respondemos 500.
const handleControllerError = (error, res) => {
  console.error(error)

  res.status(error.status || 500).json({
    message: error.message || 'Internal server error'
  })
}

// Lista las tareas de un proyecto específico.
// Este archivo le manda projectId y db al service para que el service haga la consulta.
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

// Crea una tarea dentro del proyecto indicado por la URL.
// El body ya viene validado por validateTask antes de llegar aquí.
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
  createTask,
  getTaskById,
  updateTask,
  deleteTask
}
