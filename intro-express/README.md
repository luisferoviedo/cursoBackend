# Project Management System - API

API de práctica construida con `Express` para trabajar la secuencia base de clase:

- lectura de datos con `GET`;
- creación con `POST`;
- actualización con `PUT`;
- eliminación con `DELETE`;
- separación básica por `routes` y `controllers`.

## Problema que resuelve

Este proyecto sirve como base para aprender a:

- levantar un servidor HTTP con Express;
- recibir JSON con `express.json()`;
- simular una base de datos en memoria;
- construir un CRUD REST sobre `projects`;
- organizar una versión 2 con responsabilidades separadas.

## Stack actual

- Node.js
- Express
- Nodemon

## Instalación

```bash
npm install
```

## Scripts disponibles

```bash
npm run dev
```

Inicia el servidor con `nodemon` usando `src/server.js`.

```bash
npm start
```

Inicia el servidor con Node.js sin recarga automática.

## Cómo correr el proyecto

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Servidor disponible en:

```text
http://localhost:3000
```

## Endpoints disponibles

### `GET /`

Devuelve un mensaje de bienvenida.

### `GET /api`

Devuelve información general de la API.

### `GET /status`

Devuelve el estado actual del servidor.

### `GET /api/projects`

Lista todos los proyectos simulados en memoria.

### `GET /api/projects/:id`

Obtiene un proyecto por id.

### `POST /api/projects`

Crea un proyecto nuevo.

Body JSON de ejemplo:

```json
{
  "name": "Graphic Design",
  "status": "planning"
}
```

### `PUT /api/projects/:id`

Actualiza `name`, `status` o ambos campos de un proyecto.

Body JSON de ejemplo:

```json
{
  "name": "Graphic Design",
  "status": "in progress"
}
```

### `DELETE /api/projects/:id`

Elimina un proyecto por id.

## Estructura actual

```text
intro-express/
├── package.json
├── package-lock.json
├── README.md
├── server.js
└── src/
    ├── controllers/
    │   └── project.controller.js
    ├── routes/
    │   └── projects.routes.js
    └── server.js
```

## Flujo de trabajo con Bruno

1. Crear una colección o carpeta para el proyecto.
2. Probar `GET http://localhost:3000/api/projects`.
3. Crear un `POST http://localhost:3000/api/projects` con body JSON.
4. Probar `PUT http://localhost:3000/api/projects/:id` cambiando el id en parámetros.
5. Probar `DELETE http://localhost:3000/api/projects/:id`.

## Verificación manual

Checklist reproducible:

1. Ejecutar `npm run dev`.
2. Confirmar en terminal el mensaje `Servidor running http://localhost:3000`.
3. Probar `GET /api/projects` y validar que responde un arreglo.
4. Probar `POST /api/projects` con `name` y `status`.
5. Probar `PUT /api/projects/1` actualizando al menos un campo.
6. Probar `DELETE /api/projects/1`.
7. Confirmar `404` al consultar un proyecto eliminado.
8. Confirmar `400` cuando el id no es numérico o faltan campos obligatorios.

## Ideas de prueba

- Prueba unitaria:
  validar que `createProject` responda `400` cuando falta `name` o `status`.
- Prueba de integración:
  crear un proyecto, actualizarlo y luego eliminarlo sobre `/api/projects`.
- QA manual:
  seguir el checklist anterior en Bruno o Postman.

## Middleware

Funciones o fragmentos de codigo que se ejecutan en medio del proceso de comunicacion.

Request => Middleware
