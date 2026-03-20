let tasks = [
  {
    id: 1,
    title: 'Create API',
    project_id: 1,
    status: 'todo'
  },
  {
    id: 2,
    title: 'Design database',
    project_id: 1,
    status: 'in progress'
  }
]

// Filtra solo las tareas cuyo project_id coincide con el projectId de la URL.
const getTasksByProject = (req, res) => {
  const projectId = parseInt(req.params.projectId)

  const projectTasks = tasks.filter((task) => task.project_id === projectId)

  res.json(projectTasks)
}

// Crea una tarea nueva y la amarra al proyecto indicado en la ruta.
const createTask = (req, res) => {
  const projectId = parseInt(req.params.projectId)

  const { title, status } = req.body

  const newTask = {
    // Igual que en projects, aquí el id se simula en memoria.
    id: tasks.length + 1,
    title,
    status,
    project_id: projectId
  }

  tasks.push(newTask)

  res.status(201).json(newTask)
}

// Aquí se usan dos filtros al tiempo:
// 1) id de la tarea
// 2) proyecto al que pertenece
const getTaskById = (req, res) => {
  const projectId = parseInt(req.params.projectId)
  const id = parseInt(req.params.id)

  const task = tasks.find((item) => item.id === id && item.project_id === projectId)

  if (!task) {
    return res.status(404).json({
      message: 'Task not found'
    })
  }

  res.json(task)
}

// Actualiza solo lo que llegue en el body, sin borrar lo anterior.
const updateTask = (req, res) => {
  const projectId = parseInt(req.params.projectId)
  const id = parseInt(req.params.id)

  const task = tasks.find((item) => item.id === id && item.project_id === projectId)

  if (!task) {
    return res.status(404).json({
      message: 'Task not found'
    })
  }

  const { title, status } = req.body

  task.title = title || task.title
  task.status = status || task.status

  res.json(task)
}

// Igual que en proyectos, primero busco el índice para luego eliminar.
const deleteTask = (req, res) => {
  const projectId = parseInt(req.params.projectId)
  const id = parseInt(req.params.id)

  const index = tasks.findIndex((item) => item.id === id && item.project_id === projectId)

  if (index === -1) {
    return res.status(404).json({
      message: 'Task not found'
    })
  }

  const deletedTask = tasks.splice(index, 1)

  res.json({
    message: 'Task deleted',
    task: deletedTask[0]
  })
}

module.exports = {
  getTasksByProject,
  createTask,
  getTaskById,
  updateTask,
  deleteTask
}
