// Helpers compartidos para controllers HTTP.
// La idea es evitar repetir exactamente el mismo manejo de errores y parseo numérico.

// Responde un error HTTP con un criterio uniforme.
// Si el error ya trae status, lo respetamos; si no, usamos 500.
const handleControllerError = (error, res) => {
  console.error(error)

  const status = error.status || 500

  res.status(status).json({
    message: status >= 500
      ? 'Internal server error'
      : (error.message || 'Request failed')
  })
}

// Convierte un valor a número y responde 400 si no es válido.
// Devuelve null cuando la request ya fue cortada para que el controller haga return.
const getValidNumericParam = (value, message, res) => {
  const normalizedValue = String(value).trim()

  if (!/^\d+$/.test(normalizedValue)) {
    res.status(400).json({
      message
    })

    return null
  }

  const parsedValue = Number(normalizedValue)

  if (!Number.isSafeInteger(parsedValue) || parsedValue <= 0) {
    res.status(400).json({
      message
    })

    return null
  }

  return parsedValue
}

module.exports = {
  handleControllerError,
  getValidNumericParam
}
