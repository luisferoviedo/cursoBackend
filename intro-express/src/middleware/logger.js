// Este middleware imprime en consola qué ruta se llamó y en qué momento.
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`)

  // next() permite que la request continúe al siguiente paso.
  next()
}

module.exports = logger
