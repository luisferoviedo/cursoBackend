const express = require('express')
const projectRoutes = require('./routes/projects.routes')
const taskRoutes = require('./routes/tasks.routes')

const app = express()
const PORT = process.env.PORT || 3000

// Permite que Express entienda body en formato JSON.
app.use(express.json())

// Ruta informativa general de la API.
app.get('/api', (req, res) => {
  res.json({
    name: 'Project Management System - API',
    version: '2.0.0',
    status: 'running'
  })
})

// Ruta simple para verificar rápido si el servidor está vivo.
app.get('/status', (req, res) => {
  res.json({
    status: 'running'
  })
})

// Ruta raíz del proyecto.
app.get('/', (req, res) => {
  res.send('Bienvenidos a mi aplicacion web!')
})

// Aquí conectamos el módulo de rutas de proyectos bajo el prefijo /api/projects.
// Ejemplo: GET /api/projects termina llegando al router de projects.
app.use('/api/projects', projectRoutes)

// Estas rutas ya traen la URL completa definida dentro del archivo tasks.routes.js.
app.use(taskRoutes)

// Si ninguna ruta anterior respondió, caemos aquí con 404.
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  })
})

// Middleware global de errores.
// Express llega aquí cuando algún middleware o ruta lanza un error.
app.use((err, req, res, next) => {
  // Caso común: el cliente envía un JSON mal escrito.
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      message: 'Invalid JSON format'
    })
  }

  console.error(err)

  res.status(500).json({
    message: 'Internal server error'
  })
})

// Finalmente levantamos el servidor en el puerto configurado.
app.listen(PORT, () => {
  console.log(`Servidor running http://localhost:${PORT}`)
})
