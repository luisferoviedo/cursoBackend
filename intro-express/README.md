# Project Management System

Proyecto full-stack para practicar:

- backend con `Express` y `SQLite`;
- arquitectura por capas;
- autenticación con `JWT`;
- autorización por roles;
- frontend con `React` y `Vite`;
- consumo de API con cliente autenticado e interceptores.

## Problema que resuelve

Este proyecto sirve como base para aprender a construir una aplicación con backend y frontend conectados:

- servidor HTTP con `Express`;
- persistencia real con `SQLite`;
- separación `routes -> controllers -> services -> database`;
- autenticación modular con carpeta `auth`;
- protección transversal de la API usando middlewares;
- cliente React con login, dashboard y creación de proyectos.

## Stack actual

- Node.js
- Express
- SQLite
- bcrypt
- jsonwebtoken
- dotenv
- Nodemon
- React
- Vite
- Axios
- React Router

## Arquitectura

Flujo principal de la aplicación:

```text
request HTTP
-> server.js
-> middleware global / verifyAuth
-> router
-> controller
-> service
-> database
-> response
```

Flujo principal del frontend autenticado:

```text
login
-> App guarda token
-> api interceptor agrega Authorization
-> App valida /auth/me
-> App carga /projects
-> Dashboard renderiza datos y crea proyectos
```

Separación actual:

- `src/server.js`: arranque, middlewares globales y montaje de rutas
- `src/routes/`: definición de endpoints
- `src/controllers/`: capa HTTP
- `src/services/`: lógica de negocio
- `src/auth/`: módulo de autenticación
- `src/middleware/`: middlewares reutilizables
- `src/database/`: conexión e inicialización de SQLite
- `src/lib/api.jsx`: cliente HTTP del frontend con interceptores
- `src/App.jsx`: orquestación de sesión y datos protegidos
- `src/pages/`: pantallas del frontend
- `src/routes/appRouter.jsx`: ruteo del frontend

## Instalación

```bash
npm install
```

## Ejecución

Backend en desarrollo:

```bash
npm run dev
```

Frontend en desarrollo:

```bash
npm run dev:front
```

Build de frontend:

```bash
npm run build:front
```

## Variables de entorno

Crea un archivo `.env` en la raíz:

```env
PORT=3000
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
```

Servidor backend disponible en:

```text
http://localhost:3000
```

## Base de datos

La base se genera automáticamente en `database.sqlite`.

Tablas actuales:

- `users`
- `projects`
- `tasks`

Campos relevantes en `users`:

- `id`
- `name`
- `email`
- `password_hash`
- `created_at`
- `role`

Archivos derivados de SQLite como `database.sqlite-wal` y `database.sqlite-shm` no se versionan.

## Módulo Auth

La autenticación está separada en:

```text
src/auth/
├── auth.routes.js
├── auth.controller.js
├── auth.service.js
└── auth.middleware.js
```

Responsabilidades:

- `auth.routes.js`: endpoints de auth
- `auth.controller.js`: capa HTTP de auth
- `auth.service.js`: registro, login y búsqueda del usuario actual
- `auth.middleware.js`: validación de JWT

Además existe:

- `src/middleware/authorize.js`: autorización por roles

## Frontend actual

El frontend vive en `src/` y hoy implementa:

- `login.jsx`: formulario controlado de acceso;
- `dashboard.jsx`: vista autenticada con navbar, resumen de cuenta, lista de proyectos y formulario de creación;
- `App.jsx`: restauración de sesión, carga de proyectos y coordinación de callbacks;
- `api.jsx`: instancia de `axios` con interceptores para token y `401`.

Contrato actual del frontend:

- el token se persiste en `localStorage` bajo `auth_token`;
- cada request protegida agrega `Authorization: Bearer ...` automáticamente;
- un `401` en rutas protegidas limpia la sesión y devuelve al login.

## Autenticación y autorización

### Autenticación

Se usa `JWT` para autenticar usuarios.

- `register`: crea usuario con contraseña hasheada por `bcrypt`
- `login`: valida credenciales y devuelve token
- `me`: devuelve el usuario autenticado usando el token

### Autorización

La API usa dos middlewares:

- `verifyAuth`: valida el token
- `authorize(...roles)`: valida si el rol del usuario puede acceder

Reglas actuales:

- `GET`, `POST`, `PUT` de `projects` y `tasks`: `user` o `admin`
- `DELETE` de `projects` y `tasks`: solo `admin`

## Endpoints disponibles

### Públicos

#### `GET /`

Devuelve un mensaje de bienvenida.

#### `GET /api`

Devuelve información general de la API.

#### `GET /status`

Devuelve el estado del servidor.

#### `POST /api/auth/register`

Crea un usuario nuevo.

Body JSON:

```json
{
  "name": "Luis Fer",
  "email": "luis@example.com",
  "password": "123456"
}
```

Respuesta esperada:

```json
{
  "id": 1,
  "name": "Luis Fer",
  "email": "luis@example.com",
  "role": "user",
  "created_at": "2026-03-27 00:00:00"
}
```

#### `POST /api/auth/login`

Valida credenciales y devuelve token.

Body JSON:

```json
{
  "email": "luis@example.com",
  "password": "123456"
}
```

Respuesta esperada:

```json
{
  "token": "jwt",
  "user": {
    "id": 1,
    "name": "Luis Fer",
    "email": "luis@example.com",
    "role": "user"
  }
}
```

### Protegidos

Todos estos endpoints requieren:

```text
Authorization: Bearer TU_TOKEN
```

#### `GET /api/auth/me`

Devuelve el usuario autenticado.

#### `GET /api/projects`

Lista proyectos.

#### `GET /api/projects/:id`

Obtiene un proyecto por id.

#### `POST /api/projects`

Crea un proyecto.

Body JSON:

```json
{
  "name": "Graphic Design",
  "description": "Landing page y branding",
  "status": "pending"
}
```

#### `PUT /api/projects/:id`

Actualiza un proyecto.

Body JSON:

```json
{
  "name": "Graphic Design",
  "status": "in_progress"
}
```

#### `DELETE /api/projects/:id`

Elimina un proyecto.

## Flujo de estudio recomendado

Si quieres entender el proyecto por capas, léelo en este orden:

1. `src/server.js`
2. `src/database/db.js`
3. `src/auth/auth.routes.js`
4. `src/auth/auth.controller.js`
5. `src/auth/auth.service.js`
6. `src/auth/auth.middleware.js`
7. `src/routes/projects.routes.js`
8. `src/controllers/project.controller.js`
9. `src/services/project.service.js`
10. `src/routes/tasks.routes.js`
11. `src/controllers/task.controller.js`
12. `src/services/task.service.js`
13. `src/lib/api.jsx`
14. `src/App.jsx`
15. `src/routes/appRouter.jsx`
16. `src/pages/login.jsx`
17. `src/pages/dashboard.jsx`

## Qué comentar y qué no

Conviene comentar:

- responsabilidad del archivo;
- flujo entre capas;
- contratos de entrada y salida;
- decisiones no obvias;
- validaciones de negocio y seguridad.

No conviene comentar:

- sintaxis evidente;
- nombres de variables obvios;
- exports triviales;
- líneas que el código ya explica por sí solo.

Requiere rol `admin`.

#### `GET /api/projects/:projectId/tasks`

Lista tareas de un proyecto.

#### `GET /api/projects/:projectId/tasks/:id`

Obtiene una tarea puntual.

#### `POST /api/projects/:projectId/tasks`

Crea una tarea dentro de un proyecto.

Body JSON:

```json
{
  "title": "Definir estructura visual",
  "status": "pending"
}
```

#### `PUT /api/projects/:projectId/tasks/:id`

Actualiza una tarea.

#### `DELETE /api/projects/:projectId/tasks/:id`

Elimina una tarea.

Requiere rol `user` o `admin`.

## Estructura del proyecto

```text
intro-express/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── server.js
├── database.sqlite
└── src/
    ├── auth/
    │   ├── auth.controller.js
    │   ├── auth.middleware.js
    │   ├── auth.routes.js
    │   └── auth.service.js
    ├── controllers/
    │   ├── project.controller.js
    │   └── task.controller.js
    ├── database/
    │   └── db.js
    ├── middleware/
    │   ├── auth.js
    │   ├── authorize.js
    │   ├── logger.js
    │   ├── validateOptionalStatus.js
    │   ├── validateProject.js
    │   ├── validateProjectUpdate.js
    │   ├── validateStatus.js
    │   ├── validateTask.js
    │   └── validateTaskUpdate.js
    ├── routes/
    │   ├── projects.routes.js
    │   └── tasks.routes.js
    ├── services/
    │   ├── project.service.js
    │   └── task.service.js
    └── server.js
```

## Flujo de trabajo con Bruno

Orden recomendado para probar:

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. copiar el `token`
4. `GET /api/auth/me`
5. `GET /api/projects`
6. `POST /api/projects`
7. `GET /api/projects/:projectId/tasks`

Header para endpoints protegidos:

```text
Authorization: Bearer TU_TOKEN
```

## Verificación manual

Checklist reproducible:

1. Ejecutar `npm run dev`.
2. Confirmar en terminal `Database ready`.
3. Confirmar en terminal `Servidor running http://localhost:3000`.
4. Registrar un usuario con `POST /api/auth/register`.
5. Hacer login con `POST /api/auth/login`.
6. Copiar el token y probar `GET /api/auth/me`.
7. Confirmar que `GET /api/projects` sin token responde `401`.
8. Confirmar que `GET /api/projects` con token responde `200`.
9. Confirmar que `DELETE /api/projects/:id` con rol `user` responde `403`.
10. Confirmar que los responses nunca devuelven `password_hash`.

## Ideas de prueba

- Prueba unitaria:
  validar que `getValidNumericParam` rechace ids malformados como `1abc`.
- Prueba de integración:
  registrar usuario, hacer login y consumir `/api/projects` con el token recibido.
- QA manual:
  probar con Bruno el flujo `register -> login -> me -> projects`.

## Estado actual

Hoy el proyecto ya resuelve:

- CRUD de proyectos y tareas
- autenticación con JWT
- autorización por roles
- ruta `GET /api/auth/me`
- protección transversal de módulos privados

Pendiente recomendado para una versión más fuerte:

- asociar `projects` al usuario autenticado con `user_id`
- filtrar datos por ownership
- diferenciar mejor permisos de `admin` y `user`
