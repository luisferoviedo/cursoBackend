// Valida el body mínimo para crear una tarea.
// El router de tareas usa este middleware antes de llamar a createTask.
// En esta versión exigimos título y status porque ambos son NOT NULL en la tabla.
const validateTask = (req, res, next) => {
  const { title, status } = req.body

  if (!title) {
    return res.status(400).json({
      message: 'Task title is required'
    })
  }

  if (!status) {
    return res.status(400).json({
      message: 'Task status is required'
    })
  }

  next()
}

module.exports = validateTask
