// Flujo general de la app:
// 1) server.js recibe la request
// 2) la manda al router correcto
// 3) el router puede pasar por middlewares
// 4) luego llega al controller
// 5) el controller delega al service
// 6) el service usa la conexión SQLite creada en database/db.js
// 7) la respuesta vuelve al cliente en formato JSON

require('dotenv').config()
// Express será el servidor HTTP principal de la aplicación.
const express = require('express')
// Router dedicado al recurso projects.
const projectRoutes = require('./routes/projects.routes')
// Router dedicado al recurso tasks.
const taskRoutes = require('./routes/tasks.routes')
// Middleware que protege rutas privadas usando JWT.
const verifyAuth = require('./auth/auth.middleware')
// Función que abre la base de datos e inicializa tablas.
const { initDB } = require('./database/db')
// Middleware que imprime en consola cada request entrante.
const logger = require('./middleware/logger')
// Router público para registro y login.
const authRoutes = require('./auth/auth.routes')



// app representa toda la aplicación Express.
const app = express()
// Si no llega un puerto por variables de entorno, usamos 3000.
const PORT = process.env.PORT || 3000

// Permite que Express entienda body en formato JSON.
app.use(express.json())

// Este middleware se ejecuta antes de las rutas para registrar cada request.
app.use(logger)

// Las rutas de auth quedan públicas porque todavía no hay token al registrarse o hacer login.
app.use('/api/auth', authRoutes)


// Ruta informativa general de la API.
// Esta ruta responde directamente desde server.js porque no necesita controller.
app.get('/api', (req, res) => {
  res.json({
    name: 'Project Management System - API',
    version: '2.0.0',
    status: 'running'
  })
})

// Ruta simple para verificar rápido si el servidor está vivo.
// También responde aquí mismo porque es solo una comprobación técnica.
app.get('/status', (req, res) => {
  res.json({
    status: 'running'
  })
})

// Ruta raíz del proyecto.
app.get('/', (req, res) => {
  // Respuesta simple para comprobar que la app está en línea.
  res.send('Bienvenidos a mi aplicacion web!')
})

// Aquí conectamos el módulo de rutas de proyectos bajo el prefijo /api/projects.
// Ejemplo:
// request -> server.js -> projects.routes.js -> middleware -> project.controller.js -> project.service.js -> db
app.use('/api/projects', verifyAuth, projectRoutes)

// El router de tareas recibe projectId desde este prefijo usando mergeParams.
// Ejemplo:
// request -> server.js -> tasks.routes.js -> middleware -> task.controller.js -> task.service.js -> db
app.use('/api/projects/:projectId/tasks', verifyAuth, taskRoutes)

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

// Centralizamos el arranque para asegurar que la base esté lista
// antes de aceptar tráfico HTTP.
// Este archivo le pide a database/db.js que abra la conexión
// y luego comparte esa conexión con controllers/services usando app.locals.db.
async function startServer() {
  try {
    // initDB conecta SQLite y crea tablas si todavía no existen.
    const db = await initDB()
    // app.locals permite compartir la conexión con rutas y controladores.
    app.locals.db = db

    console.log('Database ready')

    // Finalmente levantamos el servidor en el puerto configurado.
    app.listen(PORT, () => {
      console.log(`Servidor running http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Error connection database', err)
    process.exit(1)
  }
}

// Punto de inicio real del servidor.
startServer()
