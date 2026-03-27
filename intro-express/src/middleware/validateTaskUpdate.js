// Valida updates parciales de tareas.
// Sirve para evitar updates vacíos en PUT /tasks/:id.
// Exige al menos un campo permitido y evita strings vacíos en el título.
const validateTaskUpdate = (req, res, next) => {
  const { title, status } = req.body

  const hasAllowedField = title !== undefined || status !== undefined

  if (!hasAllowedField) {
    return res.status(400).json({
      message: 'At least one task field is required to update'
    })
  }

  if (title !== undefined && !title) {
    return res.status(400).json({
      message: 'Task title cannot be empty'
    })
  }

  next()
}

module.exports = validateTaskUpdate
