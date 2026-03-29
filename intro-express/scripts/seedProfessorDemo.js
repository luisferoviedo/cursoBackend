const bcrypt = require('bcrypt')
const { initDB } = require('../src/database/db')

const demoUsers = [
  {
    id: 1,
    name: 'Luis Fer',
    email: 'luis@example.com',
    password: 'Demo1234',
    role: 'user'
  },
  {
    id: 2,
    name: 'DBCode Demo',
    email: 'dbcode.demo@example.com',
    password: 'Demo1234',
    role: 'user'
  },
  {
    id: 3,
    name: 'Ana Proyecto',
    email: 'ana.proyecto@example.com',
    password: 'Demo1234',
    role: 'admin'
  }
]

const demoProjects = [
  [1, 'API Backend', 'Proyecto para practicar estructura backend', 'in_progress'],
  [3, 'Frontend Dashboard', 'Tablero visual para reportes', 'pending'],
  [4, 'Data Layer', 'Consultas y optimizacion SQL', 'in_progress'],
  [6, 'DevOps Pipeline', 'Automatizacion de despliegues', 'pending'],
  [7, 'Security Module', 'Roles, permisos y auditoria', 'in_progress'],
  [8, 'Analytics', 'Seguimiento de eventos y reportes', 'pending'],
  [10, 'Notifications', 'Emails, colas y reintentos', 'done']
]

const demoTasks = [
  ['Task 1', 'Setup backend structure', 'pending', 'high', 1, 1, '2026-04-01'],
  ['Task 2', 'Create API endpoints', 'in_progress', 'medium', 1, 2, '2026-04-03'],
  ['Task 3', 'Implement auth', 'pending', 'high', 1, 1, '2026-04-05'],
  ['Task 4', 'Write tests', 'pending', 'low', 1, 3, '2026-04-07'],
  ['Task 5', 'Design UI mockups', 'done', 'medium', 3, 2, '2026-03-20'],
  ['Task 6', 'Setup frontend project', 'in_progress', 'high', 3, 1, '2026-04-02'],
  ['Task 7', 'Integrate API', 'pending', 'high', 3, 3, '2026-04-06'],
  ['Task 8', 'Fix UI bugs', 'pending', 'low', 3, 2, '2026-04-08'],
  ['Task 9', 'Database modeling', 'done', 'high', 4, 1, '2026-03-18'],
  ['Task 10', 'Optimize queries', 'in_progress', 'medium', 4, 2, '2026-04-04'],
  ['Task 11', 'Add indexes', 'pending', 'low', 4, 3, '2026-04-06'],
  ['Task 12', 'Backup strategy', 'pending', 'medium', 4, 1, '2026-04-09'],
  ['Task 13', 'Setup CI/CD', 'pending', 'high', 6, 2, '2026-04-03'],
  ['Task 14', 'Dockerize app', 'in_progress', 'high', 6, 1, '2026-04-05'],
  ['Task 15', 'Deploy staging', 'pending', 'medium', 6, 3, '2026-04-07'],
  ['Task 16', 'Monitoring setup', 'pending', 'low', 6, 2, '2026-04-10'],
  ['Task 17', 'User roles design', 'done', 'medium', 7, 1, '2026-03-22'],
  ['Task 18', 'Permissions logic', 'in_progress', 'high', 7, 2, '2026-04-04'],
  ['Task 19', 'Security audit', 'pending', 'high', 7, 3, '2026-04-08'],
  ['Task 20', 'Fix vulnerabilities', 'pending', 'high', 7, 1, '2026-04-10'],
  ['Task 21', 'Analytics setup', 'pending', 'medium', 8, 2, '2026-04-03'],
  ['Task 22', 'Event tracking', 'in_progress', 'medium', 8, 3, '2026-04-06'],
  ['Task 23', 'Dashboard UI', 'pending', 'low', 8, 1, '2026-04-09'],
  ['Task 24', 'Reports export', 'pending', 'medium', 8, 2, '2026-04-11'],
  ['Task 25', 'Email service setup', 'done', 'medium', 10, 1, '2026-03-25'],
  ['Task 26', 'Notification system', 'in_progress', 'high', 10, 2, '2026-04-05'],
  ['Task 27', 'Queue processing', 'pending', 'high', 10, 3, '2026-04-07'],
  ['Task 28', 'Retry logic', 'pending', 'medium', 10, 1, '2026-04-09'],
  ['Task 29', 'Logging system', 'pending', 'low', 10, 2, '2026-04-11'],
  ['Task 30', 'Error handling improvements', 'pending', 'medium', 10, 3, '2026-04-12']
]

async function seedUsers(db) {
  for (const user of demoUsers) {
    const existingUser = await db.get(
      'SELECT id FROM users WHERE id = ? OR email = ?',
      [user.id, user.email]
    )

    if (existingUser) {
      continue
    }

    const passwordHash = await bcrypt.hash(user.password, 10)

    await db.run(
      `
        INSERT INTO users (id, name, email, password_hash, role)
        VALUES (?, ?, ?, ?, ?)
      `,
      [user.id, user.name, user.email, passwordHash, user.role]
    )
  }
}

async function seedProjects(db) {
  for (const [id, name, description, status] of demoProjects) {
    await db.run(
      `
        INSERT OR IGNORE INTO projects (id, name, description, status)
        VALUES (?, ?, ?, ?)
      `,
      [id, name, description, status]
    )
  }
}

async function seedTasks(db) {
  for (const task of demoTasks) {
    const [title, description, status, priority, projectId, userId, dueDate] = task
    const existingTask = await db.get(
      'SELECT id FROM tasks WHERE title = ? AND project_id = ?',
      [title, projectId]
    )

    if (existingTask) {
      continue
    }

    await db.run(
      `
        INSERT INTO tasks (
          title,
          description,
          status,
          priority,
          project_id,
          user_id,
          due_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [title, description, status, priority, projectId, userId, dueDate]
    )
  }
}

async function main() {
  const db = await initDB()

  try {
    await db.exec('BEGIN TRANSACTION')
    await seedUsers(db)
    await seedProjects(db)
    await seedTasks(db)
    await db.exec('COMMIT')

    console.log('Professor demo seed completed')
  } catch (error) {
    await db.exec('ROLLBACK')
    console.error('Professor demo seed failed', error)
    process.exitCode = 1
  } finally {
    await db.close()
  }
}

main()
