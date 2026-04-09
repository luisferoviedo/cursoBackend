const { connectDB } = require('../src/backend/database/db')

async function main() {
  const db = await connectDB()

  try {
    await db.exec('PRAGMA foreign_keys = OFF;')
    await db.exec('BEGIN TRANSACTION;')

    await db.exec(`
      DROP TABLE IF EXISTS tasks;

      CREATE TABLE tasks (
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
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
      );
    `)

    await db.exec('COMMIT;')
    console.log('Tasks table recreated')
  } catch (error) {
    await db.exec('ROLLBACK;')
    console.error('Failed to recreate tasks table', error)
    process.exitCode = 1
  } finally {
    await db.exec('PRAGMA foreign_keys = ON;')
    await db.close()
  }
}

main()
