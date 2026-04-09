// server.js
// Punto de entrada real del backend.
// Este archivo no resuelve reglas de negocio: arma Express, conecta middlewares,
// monta routers y arranca el servidor cuando la base ya está lista.

// 1. Configuracion e imports
require('dotenv').config()

const express = require('express')

const authRoutes = require('./auth/auth.routes')
const verifyAuth = require('./auth/auth.middleware')
const { initDB } = require('./database/db')
const swaggerSpec = require('./docs/swagger')
const logger = require('./middleware/logger')
const projectRoutes = require('./routes/projects.routes')
const taskRoutes = require('./routes/tasks.routes')
const taskListRoutes = require('./routes/tasks-list.routes')

// 2. Instancia base de la aplicacion
const app = express()
const PORT = process.env.PORT || 3000

// 3. Middlewares globales
function registerCoreMiddleware() {
  // Logger corre primero para registrar toda request entrante,
  // incluso si luego falla el parseo del body.
  app.use(logger)

  // Habilita req.body en formato JSON para routes y controllers.
  app.use(express.json())
}

// 4. Rutas publicas
function registerPublicRoutes() {
  // Auth debe ser publica porque login y registro ocurren antes de tener token.
  app.use('/api/auth', authRoutes)

  // Publica el spec OpenAPI como JSON.
  app.get('/api-docs.json', (req, res) => {
    res.json(swaggerSpec)
  })

  // Publica una UI simple de Swagger sin depender de middleware externo en runtime.
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

  // Endpoints informativos que no necesitan controller porque no tienen lógica de negocio.
  app.get('/api', (req, res) => {
    res.json({
      name: 'Project Management System - API',
      version: '2.0.0',
      status: 'running'
    })
  })

  app.get('/status', (req, res) => {
    res.json({
      status: 'running'
    })
  })

  app.get('/', (req, res) => {
    res.send('Bienvenidos a mi aplicacion web!')
  })
}

// 5. Rutas protegidas
function registerProtectedRoutes() {
  // verifyAuth autentica primero.
  // Luego cada router aplica permisos finos o validaciones específicas.
  app.use('/api/projects', verifyAuth, projectRoutes)

  // Lista global de tareas pensada para filtros o consultas transversales.
  app.use('/api/tasks', verifyAuth, taskListRoutes)

  // mergeParams dentro de tasks.routes permite leer projectId desde este prefijo.
  app.use('/api/projects/:projectId/tasks', verifyAuth, taskRoutes)
}

// 6. Handlers globales
function registerNotFoundHandler() {
  // Debe ir después de las rutas para capturar solo paths no resueltos.
  app.use((req, res) => {
    res.status(404).json({
      message: 'Route not found'
    })
  })
}

function registerGlobalErrorHandler() {
  // Último middleware del pipeline.
  // Centraliza errores no controlados para responder siempre con un formato consistente.
  app.use((err, req, res, next) => {
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

// 7. Ensamblaje de la aplicacion
function configureApp() {
  registerCoreMiddleware()
  registerPublicRoutes()
  registerProtectedRoutes()
  registerNotFoundHandler()
  registerGlobalErrorHandler()
}

// 8. Bootstrap del servidor
async function startServer() {
  try {
    // app.locals.db comparte la conexión SQLite con el resto del backend.
    const db = await initDB()
    app.locals.db = db

    console.log('Database ready')

    app.listen(PORT, () => {
      console.log(`Servidor running http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Error connection database', err)
    process.exit(1)
  }
}

configureApp()
startServer()
