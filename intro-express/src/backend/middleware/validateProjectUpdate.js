// Valida updates parciales de projects.
// Se usa en PUT /api/projects/:id antes de llegar al controller.
// Exige al menos un campo permitido y valida formato si ese campo fue enviado.
const validateProjectUpdate = (req, res, next) => {
  const { name, description, status } = req.body

  const hasAllowedField =
    name !== undefined ||
    description !== undefined ||
    status !== undefined

  if (!hasAllowedField) {
    return res.status(400).json({
      message: 'At least one project field is required to update'
    })
  }

  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    return res.status(400).json({
      message: 'Project name cannot be empty'
    })
  }

  if (typeof name === 'string') {
    req.body.name = name.trim()
  }

  next()
}

module.exports = validateProjectUpdate
