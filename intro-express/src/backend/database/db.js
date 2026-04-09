// Capa de infraestructura de datos.
// Este archivo no conoce Express ni rutas: solo prepara SQLite para que el resto del sistema la use.

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

// SQLite no trae migraciones automáticas.
// Este helper permite evolucionar el esquema sin romper bases creadas en versiones previas.
async function ensureColumnExists(db, tableName, columnName, definition) {
  const columns = await db.all(`PRAGMA table_info(${tableName})`)
  const columnExists = columns.some((column) => column.name === columnName)

  if (columnExists) {
    return
  }

  await db.exec(
    `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`
  )
}

// Unifica valores de estado legacy para que la base persista un solo contrato canónico.
// Así routes, services y frontend trabajan con pending / in_progress / done.
async function normalizeStoredStatuses(db) {
  await db.exec(`
    UPDATE projects
    SET status = CASE status
      WHEN 'To do' THEN 'pending'
      WHEN 'In progress' THEN 'in_progress'
      WHEN 'Done' THEN 'done'
      ELSE status
    END;

    UPDATE tasks
    SET status = CASE status
      WHEN 'To do' THEN 'pending'
      WHEN 'In progress' THEN 'in_progress'
      WHEN 'Done' THEN 'done'
      ELSE status
    END;
  `)
}

// Inicializa la base y deja el esquema listo para correr la aplicación actual.
// IF NOT EXISTS evita recrear tablas, y los helpers posteriores resuelven compatibilidad.
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
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'medium',
      project_id INTEGER NOT NULL,
      user_id INTEGER,
      due_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      -- Si se elimina un proyecto, sus tareas también se eliminan.
      FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
      -- Si un usuario se elimina, la tarea conserva su existencia pero queda sin asignación.
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
    );

  `)

  // Compatibilidad con bases ya creadas antes de ampliar el contrato de tasks.
  await ensureColumnExists(db, 'tasks', 'description', 'TEXT')
  await ensureColumnExists(db, 'tasks', 'priority', "TEXT NOT NULL DEFAULT 'medium'")
  await ensureColumnExists(db, 'tasks', 'user_id', 'INTEGER')
  await ensureColumnExists(db, 'tasks', 'due_date', 'DATE')
  await ensureColumnExists(db, 'tasks', 'updated_at', 'DATETIME')
  await normalizeStoredStatuses(db)

  // Devolvemos la conexión lista para reutilizarla en la aplicación.
  return db
}

// Exportamos ambas funciones para poder conectar o inicializar según necesidad.
module.exports = {
  connectDB,
  initDB
}
