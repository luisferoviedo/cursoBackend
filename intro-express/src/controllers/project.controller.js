let projects = [
    {
        id: 1,
        name: "Website design",
        status: "active",
        description: "Diseño de un sitio web responsivo"
    },
    {
        id: 2,
        name: "Mobile App",
        status: "planning",
        description: "Creación de una app de contactos con Flutter"
    }
]

// Devuelve todo el arreglo en memoria.
const getProjects = (req, res) => {
    res.json(projects)
}

// Toma el id desde la URL, lo convierte a número y busca coincidencia.
const getProjectById = (req, res) => {
    const id = parseInt(req.params.id)

    const project = projects.find(project => project.id === id)

    if(!project) {

        return res.status(404).json({ message: "Project not found" })
    }

    res.json(project)
}

// Crea un objeto nuevo usando los datos del body y lo agrega al arreglo.
const createProject = (req, res) => {
    const { name, status, description } = req.body

    const newProject = {
        // Como no hay base de datos, el id se simula con el tamaño actual del arreglo.
        id: projects.length + 1,
        name,
        status,
        description
    }

    projects.push(newProject)

    res.status(201).json(newProject)
}

// Busca primero el proyecto y luego actualiza solo los campos que llegan en el body.
const updateProject = (req, res) => {
    const id = parseInt(req.params.id)
    const project = projects.find(project => project.id === id)

    if(!project) {
        return res.status(404).json({ message: "Project not found" })
    }

    const { name, status, description } = req.body

    // Si un campo no llega, se conserva el valor anterior.
    project.name = name || project.name
    project.status = status || project.status
    project.description = description || project.description

    res.json(project)
}

// Busca la posición exacta dentro del arreglo para poder eliminar con splice.
const deleteProject = (req, res) => {
    const id = parseInt(req.params.id)
    const index = projects.findIndex(project => project.id === id)

    if (index === -1) {
        return res.status(404).json({ message: "Project not found" })
    }

    const deleted = projects.splice(index, 1)

    // deleted es un arreglo; por eso devolvemos deleted[0].
    res.json({
        message: "Project deleted",
        project: deleted[0]
    })
}


module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
}
