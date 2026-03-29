// Contrato compartido del módulo de tareas.
// Centralizar estas listas evita inconsistencias entre middlewares y services.
const { SHARED_STATUSES } = require('./status.constants')

const TASK_STATUSES = SHARED_STATUSES

const TASK_PRIORITIES = ['low', 'medium', 'high']

const TASK_SORT_DIRECTIONS = ['asc', 'desc']

const TASK_LIST_LIMIT = 10

module.exports = {
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_SORT_DIRECTIONS,
  TASK_LIST_LIMIT
}
