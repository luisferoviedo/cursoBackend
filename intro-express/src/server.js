// Punto de entrada real del backend.
// Este archivo arma la aplicación Express, monta rutas y comparte la conexión SQLite.
// No contiene reglas de negocio de auth, projects o tasks: solo orquestación HTTP.

require('dotenv').config()
// Express será el servidor HTTP principal de la aplicación.
const express = require('express')
// Router dedicado al recurso projects.
const projectRoutes = require('./routes/projects.routes')
// Router dedicado al recurso tasks.
const taskRoutes = require('./routes/tasks.routes')
// Router de prueba para listar tareas con filtros globales.
const taskListRoutes = require('./routes/tasks-list.routes')
// Middleware que protege rutas privadas usando JWT.
const verifyAuth = require('./auth/auth.middleware')
// Función que abre la base de datos e inicializa tablas.
const { initDB } = require('./database/db')
const swaggerSpec = require('./docs/swagger')
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

// Registra rutas públicas que no requieren token.
// Aquí viven auth y endpoints informativos que el cliente puede consumir sin sesión.
function registerPublicRoutes() {
  // Las rutas de auth quedan públicas porque todavía no hay token al registrarse o hacer login.
  app.use('/api/auth', authRoutes)

  // Publica el spec OpenAPI como JSON para clientes o herramientas externas.
  app.get('/api-docs.json', (req, res) => {
    res.json(swaggerSpec)
  })

  // Publica una UI liviana sin depender de middleware externo en runtime.
  app.get('/api-docs', (req, res) => {
    res.type('html').send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Project Management System API Docs</title>
          <link
            rel="stylesheet"
            href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
          />
          <style>
            body {
              margin: 0;
              background: #f5f7fb;
            }
          </style>
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
          <script>
            window.ui = SwaggerUIBundle({
              url: '/api-docs.json',
              dom_id: '#swagger-ui'
            })
          </script>
        </body>
      </html>
    `)
  })

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
}

// Registra rutas protegidas por JWT.
// verifyAuth autentica primero; luego cada router decide permisos finos con authorize(...roles).
function registerProtectedRoutes() {
  // Aquí conectamos el módulo de rutas de proyectos bajo el prefijo /api/projects.
  // Ejemplo:
  // request -> server.js -> projects.routes.js -> middleware -> project.controller.js -> project.service.js -> db
  app.use('/api/projects', verifyAuth, projectRoutes)

  // Ruta global de tareas para pruebas de filtros con query params.
  app.use('/api/tasks', verifyAuth, taskListRoutes)

  // El router de tareas recibe projectId desde este prefijo usando mergeParams.
  // Ejemplo:
  // request -> server.js -> tasks.routes.js -> middleware -> task.controller.js -> task.service.js -> db
  app.use('/api/projects/:projectId/tasks', verifyAuth, taskRoutes)
}

// Este handler debe ir al final para capturar solo requests no resueltas por rutas anteriores.
function registerNotFoundHandler() {
  app.use((req, res) => {
    res.status(404).json({
      message: 'Route not found'
    })
  })
}

// Middleware global de errores no controlados.
// Si algo no fue manejado por controllers/services, aquí devolvemos una respuesta consistente.
function registerGlobalErrorHandler() {
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
}

registerPublicRoutes()
registerProtectedRoutes()
registerNotFoundHandler()
registerGlobalErrorHandler()

// El servidor solo empieza a escuchar cuando la base ya está lista.
// app.locals.db actúa como punto compartido de acceso para controllers y services.
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
