// Este archivo no atiende requests HTTP.
// Su única responsabilidad es abrir la base SQLite y preparar las tablas.
// server.js llama a initDB() al arrancar la aplicación.

// Driver nativo de SQLite para Node.js.
const sqlite3 = require('sqlite3')
// Helper que permite usar SQLite con promesas y async/await.
const { open } = require('sqlite')

// Abre una conexión a la base de datos local.
// Luego esa conexión se guarda en app.locals.db para que la usen controllers y services.
async function connectDB() {
  return open({
    // El archivo se crea automáticamente si todavía no existe.
    filename: './database.sqlite',
    driver: sqlite3.Database
  })
}

// Inicializa la base: conecta y garantiza que existan las tablas base.
// Si la tabla ya existe, SQLite no la vuelve a crear gracias a IF NOT EXISTS.
async function initDB() {
  const db = await connectDB()

  await db.exec(`
    -- Activa llaves foráneas para que SQLite respete relaciones entre tablas.
    PRAGMA foreign_keys = ON;

    -- Tabla de usuarios del sistema.
    -- Aquí se guarda la identidad básica y el password ya hasheado.
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      role TEXT NOT NULL DEFAULT 'user'
    );

    -- Tabla principal de proyectos.
    -- Aquí se guarda la entidad "project".
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabla de tareas relacionada con projects mediante project_id.
    -- Aquí se guarda la entidad "task" relacionada a un proyecto padre.
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      project_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      -- Si se elimina un proyecto, sus tareas también se eliminan.
      FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
    );

  `)

  // Devolvemos la conexión lista para reutilizarla en la aplicación.
  return db
}

// Exportamos ambas funciones para poder conectar o inicializar según necesidad.
module.exports = {
  connectDB,
  initDB
}
