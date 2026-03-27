// Revisa que el status enviado esté dentro de los estados permitidos.
// Se usa cuando el status es obligatorio, por ejemplo en creates.
const validateStatus = (req, res, next) => {
  const { status } = req.body
  // Esta lista funciona como contrato simple del API.
  const validStatus = [ 'To do', 'In progress', 'Done']

  if (!validStatus.includes(status)) {
    return res.status(400).json({message: `Invalid status value`})
  }

  // Si el status es válido, la request sigue al siguiente middleware/controller.
  next()
}

// Exportamos la función para reutilizarla en el router.
module.exports = validateStatus
