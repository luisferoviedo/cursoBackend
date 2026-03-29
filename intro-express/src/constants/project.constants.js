// Contrato simple del módulo de proyectos.
const { SHARED_STATUSES } = require('./status.constants')
const { TASK_SORT_DIRECTIONS, TASK_LIST_LIMIT } = require('./task.constants')

const PROJECT_STATUSES = SHARED_STATUSES

module.exports = {
  PROJECT_STATUSES,
  PROJECT_SORT_DIRECTIONS: TASK_SORT_DIRECTIONS,
  PROJECT_LIST_LIMIT: TASK_LIST_LIMIT
}
