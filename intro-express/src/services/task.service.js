// Esta capa concentra la lógica de negocio de tareas.
// El controller le pasa db + params/body, y el service se encarga de:
// 1) validar relaciones de negocio
// 2) hacer queries SQL
// 3) devolver datos listos al controller

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

// Devuelve una tarea puntual dentro del proyecto.
const getTaskById = async (db, projectId, taskId) => {
  await getProjectOrThrow(db, projectId)

  return getTaskOrThrow(db, projectId, taskId)
}

// Crea una tarea nueva amarrada al proyecto padre.
// El projectId viene desde la URL, no desde el body.
const createTask = async (db, projectId, taskData) => {
  await getProjectOrThrow(db, projectId)

  const { title, status } = taskData

  const result = await db.run(
    'INSERT INTO tasks (title, status, project_id) VALUES (?, ?, ?)',
    [title, status, projectId]
  )

  return {
    id: result.lastID,
    title,
    status,
    project_id: projectId
  }
}

// Actualiza solo los campos que llegan; lo demás se conserva.
// Igual que en projects, aquí hacemos merge entre datos actuales y nuevos.
const updateTask = async (db, projectId, taskId, taskData) => {
  await getProjectOrThrow(db, projectId)

  const currentTask = await getTaskOrThrow(db, projectId, taskId)

  const updatedTask = {
    title: taskData.title ?? currentTask.title,
    status: taskData.status ?? currentTask.status
  }

  await db.run(
    `
      UPDATE tasks
      SET title = ?, status = ?
      WHERE id = ? AND project_id = ?
    `,
    [updatedTask.title, updatedTask.status, taskId, projectId]
  )

  return {
    ...currentTask,
    ...updatedTask
  }
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
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
}
