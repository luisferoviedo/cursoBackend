// Este middleware se ejecuta antes de createProject.
// Su trabajo es cortar la request si falta información obligatoria.
const validateProject = (req, res, next) => {
  const { name } = req.body

  if (!name) {
    return res.status(400).json({ message: 'Project name is required' })
  }

  // Si todo está bien, la request sigue hacia el controller.
  next()
}

module.exports = validateProject
