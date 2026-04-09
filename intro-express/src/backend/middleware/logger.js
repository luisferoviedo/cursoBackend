// Este middleware se ejecuta antes de entrar a las rutas.
// No modifica datos: solo imprime en consola qué request llegó.
const logger = (req, res, next) => {
  // req.method indica el verbo HTTP y req.url la ruta solicitada.
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`)

  // next() permite que la request continúe al siguiente paso.
  next()
}

// Se exporta como middleware reutilizable.
module.exports = logger
