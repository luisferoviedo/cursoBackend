# Project Management System

Proyecto full-stack para practicar una arquitectura clara entre backend y frontend:

- backend con `Express` y `SQLite`
- autenticación con `JWT`
- autorización por roles
- frontend con `React`, `Vite`, `Tailwind` y `shadcn/ui`
- organización por dominios (`auth`, `projects`, `tasks`)

## Qué resuelve

Este proyecto permite:

- iniciar sesión con JWT
- cargar proyectos protegidos
- crear, editar y eliminar proyectos
- entrar al detalle de un proyecto
- crear, editar y eliminar tareas dentro de ese proyecto

## Stack actual

- Node.js
- Express
- SQLite
- bcrypt
- jsonwebtoken
- React
- Vite
- Axios
- React Router
- Tailwind CSS
- shadcn/ui

## Estructura actual

La estructura operativa real ya quedó separada en dos áreas:

- `src/backend/`: backend real del proyecto
- `src/frontend/`: frontend real del proyecto

### Backend

- `src/backend/server.js`: arranque del servidor y montaje de rutas
- `src/backend/auth/`: login, register, `me` y middleware JWT
- `src/backend/routes/`: definición de endpoints
- `src/backend/controllers/`: capa HTTP
- `src/backend/services/`: lógica de negocio
- `src/backend/middleware/`: autorización, validaciones y logger
- `src/backend/database/db.js`: conexión e inicialización de SQLite

### Frontend

- `src/frontend/main.jsx`: punto de entrada de React
- `src/frontend/App.jsx`: estado global de sesión y proyectos
- `src/frontend/routes/`: router y guard privado
- `src/frontend/lib/api.jsx`: cliente Axios con interceptores
- `src/frontend/components/ui/`: componentes base compartidos
- `src/frontend/features/auth/screens/LoginScreen.jsx`: pantalla de login
- `src/frontend/features/projects/screens/DashboardScreen.jsx`: dashboard
- `src/frontend/features/tasks/screens/ProjectDetailScreen.jsx`: detalle del proyecto y tareas

## Flujo principal

### Backend

```text
request HTTP
-> src/backend/server.js
-> middleware global / verifyAuth
-> route
-> controller
-> service
-> database
-> response
```

### Frontend

```text
login
-> App guarda token
-> api interceptor agrega Authorization
-> App valida /auth/me
-> App carga /projects
-> Dashboard renderiza proyectos
-> ProjectDetail gestiona tareas
```

## Instalación

```bash
npm install
```

## Ejecución

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev:front
```

Build de frontend:

```bash
npm run build:front
```

Chequeo actual del proyecto:

```bash
npm test
```

## Variables de entorno

Crea un archivo `.env` en la raíz:

```env
PORT=3000
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
```

## URLs locales

- frontend: `http://localhost:5173`
- login: `http://localhost:5173/login`
- dashboard: `http://localhost:5173/dashboard`
- detalle de proyecto: `http://localhost:5173/projects/:projectId`
- backend: `http://localhost:3000`
- status: `http://localhost:3000/status`

## Base de datos

La base principal vive en:

```text
database.sqlite
```

Tablas actuales:

- `users`
- `projects`
- `tasks`

Archivos derivados como `database.sqlite-wal` y `database.sqlite-shm` no se versionan.

## Autenticación y autorización

### Autenticación

Se usa `JWT` para:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Autorización

La API combina dos capas:

- `verifyAuth`: valida el token
- `authorize(...roles)`: valida el rol del usuario autenticado

Reglas actuales:

- `GET`, `POST`, `PUT` de `projects` y `tasks`: `user` o `admin`
- `DELETE` de `projects`: solo `admin`
- `DELETE` de `tasks`: `user` o `admin`

## Endpoints principales

### Públicos

- `GET /`
- `GET /api`
- `GET /status`
- `POST /api/auth/register`
- `POST /api/auth/login`

### Protegidos

Todos requieren:

```text
Authorization: Bearer TU_TOKEN
```

#### Proyectos

- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

#### Tareas

- `GET /api/projects/:projectId/tasks`
- `GET /api/projects/:projectId/tasks/:id`
- `POST /api/projects/:projectId/tasks`
- `PUT /api/projects/:projectId/tasks/:id`
- `DELETE /api/projects/:projectId/tasks/:id`

## Flujo de estudio recomendado

Si quieres leer el proyecto por flujo:

1. `src/backend/server.js`
2. `src/backend/database/db.js`
3. `src/backend/auth/auth.routes.js`
4. `src/backend/auth/auth.controller.js`
5. `src/backend/auth/auth.service.js`
6. `src/backend/auth/auth.middleware.js`
7. `src/backend/routes/projects.routes.js`
8. `src/backend/controllers/project.controller.js`
9. `src/backend/services/project.service.js`
10. `src/backend/routes/tasks.routes.js`
11. `src/backend/controllers/task.controller.js`
12. `src/backend/services/task.service.js`
13. `src/frontend/lib/api.jsx`
14. `src/frontend/App.jsx`
15. `src/frontend/routes/appRouter.jsx`
16. `src/frontend/features/auth/screens/LoginScreen.jsx`
17. `src/frontend/features/projects/screens/DashboardScreen.jsx`
18. `src/frontend/features/tasks/screens/ProjectDetailScreen.jsx`

## Scripts útiles

- `npm run dev`: backend en desarrollo
- `npm run dev:front`: frontend en desarrollo
- `npm run build:front`: build de producción del frontend
- `npm test`: chequeo sintáctico actual
- `npm run recreate:tasks`: recrea la tabla `tasks`
- `npm run seed:professor`: inserta datos demo

## Verificación manual

Checklist reproducible:

1. correr `npm run dev`
2. correr `npm run dev:front`
3. entrar a `/login`
4. iniciar sesión
5. confirmar carga de proyectos en dashboard
6. entrar a un proyecto
7. confirmar listado de tareas
8. crear, editar y eliminar una tarea
9. validar permisos de borrado de proyecto según rol

## Estado actual

Hoy el proyecto ya resuelve:

- login con JWT
- restauración de sesión en frontend
- CRUD de proyectos
- CRUD de tareas dentro de proyectos
- separación real `src/backend` / `src/frontend`
- organización frontend por `features`

Pendiente recomendado para una versión más fuerte:

- asociar proyectos al usuario autenticado
- filtrar por ownership
- agregar pruebas frontend reales para `.jsx`
- cerrar la consolidación final del árbol git tras la migración
