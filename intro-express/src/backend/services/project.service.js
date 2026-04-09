// Esta capa contiene la lógica de negocio del módulo de proyectos.
// No conoce Express ni responde res.json().
// Recibe la conexión db desde el controller y trabaja directamente con SQLite.
const {
  PROJECT_STATUSES,
  PROJECT_SORT_DIRECTIONS,
  PROJECT_LIST_LIMIT
} = require('../constants/project.constants')
const { normalizeStatus } = require('../constants/status.constants')

// Crea errores de servicio con status HTTP para desacoplar el controller
// de la lógica de negocio y de los mensajes repetidos.
const createServiceError = (status, message) => {
  const error = new Error(message)
  error.status = status

  return error
}

// Busca un proyecto por id y lanza 404 si no existe.
// Otras funciones del service reutilizan esta función para no repetir la búsqueda.
const getProjectOrThrow = async (db, projectId) => {
  const project = await db.get(
    'SELECT * FROM projects WHERE id = ?',
    [projectId]
  )

  if (!project) {
    throw createServiceError(404, 'Project not found')
  }

  return project
}

// Lista todos los proyectos ordenados por id para mantener respuestas estables.
// El controller llama esta función cuando llega GET /api/projects.
const getProjects = async (db, filters = {}) => {
  const { status, sort } = filters
  let query = 'SELECT * FROM projects WHERE 1 = 1'
  const params = []
  let sortDirection = 'ASC'

  if (status !== undefined) {
    const normalizedStatus = normalizeStatus(status)

    if (!PROJECT_STATUSES.includes(normalizedStatus)) {
      throw createServiceError(400, 'Invalid project status value')
    }

    query += ' AND status = ?'
    params.push(normalizedStatus)
  }

  if (sort !== undefined) {
    const normalizedSort = String(sort).toLowerCase()

    if (!PROJECT_SORT_DIRECTIONS.includes(normalizedSort)) {
      throw createServiceError(400, 'Invalid sort value. Use asc or desc')
    }

    sortDirection = normalizedSort.toUpperCase()
  }

  query += ` ORDER BY id ${sortDirection} LIMIT ${PROJECT_LIST_LIMIT}`

  return db.all(query, params)
}

// Devuelve un proyecto puntual.
// Aquí simplemente reutilizamos getProjectOrThrow para centralizar la validación.
const getProjectById = async (db, projectId) => {
  return getProjectOrThrow(db, projectId)
}

// Inserta un proyecto nuevo y devuelve el registro creado.
// La información creada vuelve al controller, y el controller la envía al cliente.
const createProject = async (db, projectData) => {
  const { name, description, status: rawStatus } = projectData
  const status = normalizeStatus(rawStatus)

  const result = await db.run(
    'INSERT INTO projects (name, description, status) VALUES (?, ?, ?)',
    [name, description ?? null, status]
  )

  return {
    id: result.lastID,
    name,
    description: description ?? null,
    status
  }
}

// Actualiza solo los campos enviados y conserva el resto.
// Este patrón evita sobrescribir con undefined cuando el update es parcial.
const updateProject = async (db, projectId, projectData) => {
  const currentProject = await getProjectOrThrow(db, projectId)

  const updatedProject = {
    name: projectData.name ?? currentProject.name,
    description: projectData.description ?? currentProject.description,
    status: projectData.status === undefined
      ? currentProject.status
      : normalizeStatus(projectData.status)
  }

  await db.run(
    `
      UPDATE projects
      SET name = ?, description = ?, status = ?
      WHERE id = ?
    `,
    [
      updatedProject.name,
      updatedProject.description,
      updatedProject.status,
      projectId
    ]
  )

  return {
    ...currentProject,
    ...updatedProject
  }
}

// Elimina un proyecto y devuelve el registro previo para confirmar el resultado.
// Además, por la foreign key con ON DELETE CASCADE, también borra sus tareas relacionadas.
const deleteProject = async (db, projectId) => {
  const project = await getProjectOrThrow(db, projectId)

  await db.run(
    'DELETE FROM projects WHERE id = ?',
    [projectId]
  )

  return project
}

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
}
