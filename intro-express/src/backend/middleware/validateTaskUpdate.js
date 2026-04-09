// Valida updates parciales de tareas.
// Sirve para evitar updates vacíos en PUT /tasks/:id.
// Exige al menos un campo permitido y valida el contrato ampliado de tasks.
const {
  TASK_PRIORITIES
} = require('../constants/task.constants')
const { isSupportedStatus } = require('../constants/status.constants')

const isValidDateString = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`)

  return !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === value
}

const validateTaskUpdate = (req, res, next) => {
  const { title, description, status, priority, user_id, due_date } = req.body

  const hasAllowedField =
    title !== undefined ||
    description !== undefined ||
    status !== undefined ||
    priority !== undefined ||
    user_id !== undefined ||
    due_date !== undefined

  if (!hasAllowedField) {
    return res.status(400).json({
      message: 'At least one task field is required to update'
    })
  }

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({
      message: 'Task title cannot be empty'
    })
  }

  if (typeof title === 'string') {
    req.body.title = title.trim()
  }

  if (status !== undefined && !isSupportedStatus(status)) {
    return res.status(400).json({
      message: 'Invalid task status value'
    })
  }

  if (priority !== undefined && !TASK_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      message: 'Invalid task priority value'
    })
  }

  if (
    user_id !== undefined &&
    user_id !== null &&
    (!Number.isInteger(user_id) || user_id <= 0)
  ) {
    return res.status(400).json({
      message: 'user_id must be a positive integer'
    })
  }

  if (
    due_date !== undefined &&
    due_date !== null &&
    !isValidDateString(due_date)
  ) {
    return res.status(400).json({
      message: 'due_date must use YYYY-MM-DD format'
    })
  }

  next()
}

module.exports = validateTaskUpdate
