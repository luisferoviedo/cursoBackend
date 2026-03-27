// Esta capa contiene la lógica de negocio del módulo de proyectos.
// No conoce Express ni responde res.json().
// Recibe la conexión db desde el controller y trabaja directamente con SQLite.

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
const getProjects = async (db) => {
  return db.all(
    'SELECT * FROM projects ORDER BY id'
  )
}

// Devuelve un proyecto puntual.
// Aquí simplemente reutilizamos getProjectOrThrow para centralizar la validación.
const getProjectById = async (db, projectId) => {
  return getProjectOrThrow(db, projectId)
}

// Inserta un proyecto nuevo y devuelve el registro creado.
// La información creada vuelve al controller, y el controller la envía al cliente.
const createProject = async (db, projectData) => {
  const { name, description, status } = projectData

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
    status: projectData.status ?? currentProject.status
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
