// Esta capa concentra la lógica de negocio de tareas.
// El controller le pasa db + params/body, y el service se encarga de:
// 1) validar relaciones de negocio
// 2) hacer queries SQL
// 3) devolver datos listos al controller

const {
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_SORT_DIRECTIONS,
  TASK_LIST_LIMIT
} = require('../constants/task.constants')
const { normalizeStatus } = require('../constants/status.constants')

// Crea errores con status HTTP para que el controller pueda responder
// sin meter reglas de negocio ni mensajes duplicados.
const createServiceError = (status, message) => {
  const error = new Error(message)
  error.status = status

  return error
}

// Confirma que el proyecto padre exista antes de operar sobre sus tareas.
// Esta función evita crear, listar o actualizar tareas de proyectos inexistentes.
const getProjectOrThrow = async (db, projectId) => {
  const project = await db.get(
    'SELECT id FROM projects WHERE id = ?',
    [projectId]
  )

  if (!project) {
    throw createServiceError(404, 'Project not found')
  }

  return project
}

// Si la tarea se asigna a un usuario, confirmamos que exista antes de guardar la relación.
const ensureUserExists = async (db, userId) => {
  if (userId === undefined || userId === null) {
    return
  }

  const user = await db.get(
    'SELECT id FROM users WHERE id = ?',
    [userId]
  )

  if (!user) {
    throw createServiceError(400, 'Assigned user does not exist')
  }
}

// Busca una tarea dentro del proyecto indicado.
// Si no existe, lanzamos un 404 para mantener un contrato consistente.
const getTaskOrThrow = async (db, projectId, taskId) => {
  const task = await db.get(
    'SELECT * FROM tasks WHERE id = ? AND project_id = ?',
    [taskId, projectId]
  )

  if (!task) {
    throw createServiceError(404, 'Task not found')
  }

  return task
}

// Lista las tareas del proyecto ordenadas por id.
// Primero valida que el proyecto exista y luego trae solo sus tareas.
const getTasksByProject = async (db, projectId) => {
  await getProjectOrThrow(db, projectId)

  return db.all(
    'SELECT * FROM tasks WHERE project_id = ? ORDER BY id',
    [projectId]
  )
}

// Lista tareas globalmente para pruebas, con filtros opcionales seguros.
// Se construye SQL dinámico usando placeholders para evitar SQL injection.
const listTasks = async (db, filters = {}) => {
  const { status, priority, sort } = filters
  let query = 'SELECT * FROM tasks WHERE 1 = 1'
  const params = []
  let sortDirection = 'ASC'

  if (status !== undefined) {
    const normalizedStatus = normalizeStatus(status)

    if (!TASK_STATUSES.includes(normalizedStatus)) {
      throw createServiceError(400, 'Invalid task status value')
    }

    query += ' AND status = ?'
    params.push(normalizedStatus)
  }

  if (priority !== undefined) {
    if (!TASK_PRIORITIES.includes(priority)) {
      throw createServiceError(400, 'Invalid task priority value')
    }

    query += ' AND priority = ?'
    params.push(priority)
  }

  if (sort !== undefined) {
    const normalizedSort = String(sort).toLowerCase()

    if (!TASK_SORT_DIRECTIONS.includes(normalizedSort)) {
      throw createServiceError(400, 'Invalid sort value. Use asc or desc')
    }

    sortDirection = normalizedSort.toUpperCase()
  }

  query += ` ORDER BY id ${sortDirection} LIMIT ${TASK_LIST_LIMIT}`

  return db.all(query, params)
}

// Devuelve una tarea puntual dentro del proyecto.
const getTaskById = async (db, projectId, taskId) => {
  await getProjectOrThrow(db, projectId)

  return getTaskOrThrow(db, projectId, taskId)
}

// Crea una tarea nueva amarrada al proyecto padre.
// El projectId viene desde la URL, no desde el body.
const createTask = async (db, projectId, taskData) => {
  await getProjectOrThrow(db, projectId)

  const {
    title,
    description,
    status: rawStatus = 'pending',
    priority = 'medium',
    user_id = null,
    due_date = null
  } = taskData
  const status = normalizeStatus(rawStatus)

  await ensureUserExists(db, user_id)

  if (!TASK_STATUSES.includes(status)) {
    throw createServiceError(400, 'Invalid task status value')
  }

  if (!TASK_PRIORITIES.includes(priority)) {
    throw createServiceError(400, 'Invalid task priority value')
  }

  const result = await db.run(
    `
      INSERT INTO tasks (
        title,
        description,
        status,
        priority,
        project_id,
        user_id,
        due_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      title,
      description ?? null,
      status,
      priority,
      projectId,
      user_id,
      due_date ?? null
    ]
  )

  return db.get(
    'SELECT * FROM tasks WHERE id = ? AND project_id = ?',
    [result.lastID, projectId]
  )
}

// Actualiza solo los campos que llegan; lo demás se conserva.
// Igual que en projects, aquí hacemos merge entre datos actuales y nuevos.
const updateTask = async (db, projectId, taskId, taskData) => {
  await getProjectOrThrow(db, projectId)

  const currentTask = await getTaskOrThrow(db, projectId, taskId)

  const updatedTask = {
    title: taskData.title ?? currentTask.title,
    description: taskData.description ?? currentTask.description,
    status: taskData.status === undefined
      ? currentTask.status
      : normalizeStatus(taskData.status),
    priority: taskData.priority ?? currentTask.priority ?? 'medium',
    user_id: taskData.user_id === undefined ? currentTask.user_id : taskData.user_id,
    due_date: taskData.due_date === undefined ? currentTask.due_date : taskData.due_date
  }

  await ensureUserExists(db, updatedTask.user_id)

  if (!TASK_STATUSES.includes(updatedTask.status)) {
    throw createServiceError(400, 'Invalid task status value')
  }

  if (!TASK_PRIORITIES.includes(updatedTask.priority)) {
    throw createServiceError(400, 'Invalid task priority value')
  }

  await db.run(
    `
      UPDATE tasks
      SET title = ?,
          description = ?,
          status = ?,
          priority = ?,
          user_id = ?,
          due_date = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND project_id = ?
    `,
    [
      updatedTask.title,
      updatedTask.description,
      updatedTask.status,
      updatedTask.priority,
      updatedTask.user_id,
      updatedTask.due_date,
      taskId,
      projectId
    ]
  )

  return db.get(
    'SELECT * FROM tasks WHERE id = ? AND project_id = ?',
    [taskId, projectId]
  )
}

// Elimina una tarea y devuelve el registro borrado para confirmar el resultado.
const deleteTask = async (db, projectId, taskId) => {
  await getProjectOrThrow(db, projectId)

  const task = await getTaskOrThrow(db, projectId, taskId)

  await db.run(
    'DELETE FROM tasks WHERE id = ? AND project_id = ?',
    [taskId, projectId]
  )

  return task
}

module.exports = {
  listTasks,
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
}
