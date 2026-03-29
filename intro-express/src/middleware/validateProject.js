// Este middleware se ejecuta antes de createProject.
// El router le manda aquí la request antes de pasarla al controller.
// Su trabajo es cortar la request si falta información obligatoria.
const validateProject = (req, res, next) => {
  // En esta versión solo exigimos el nombre como dato mínimo.
  const { name } = req.body

  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ message: 'Project name is required' })
  }

  req.body.name = name.trim()

  // Si todo está bien, la request sigue hacia el controller.
  next()
}

// Exportamos la validación para usarla en el router de projects.
module.exports = validateProject
