// Reutiliza el mismo contrato de estados, pero solo valida cuando el campo
// realmente viene en el body. Sirve para updates parciales.
// Así un PUT puede mandar solo "name" o solo "title" sin obligar a reenviar status.
const { isSupportedStatus } = require('../constants/status.constants')

const validateOptionalStatus = (req, res, next) => {
  const { status } = req.body

  if (status === undefined) {
    return next()
  }

  if (!isSupportedStatus(status)) {
    return res.status(400).json({
      message: 'Invalid status value'
    })
  }

  next()
}

module.exports = validateOptionalStatus
