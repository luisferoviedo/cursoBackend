-- Consultas de practica para abrir en DBCode sobre database.sqlite.

SELECT
  t.id,
  t.title,
  t.description,
  t.status,
  t.priority,
  t.project_id,
  p.name AS project_name,
  t.user_id,
  u.name AS assigned_user,
  t.due_date,
  t.created_at,
  t.updated_at
FROM tasks t
LEFT JOIN projects p ON p.id = t.project_id
LEFT JOIN users u ON u.id = t.user_id
ORDER BY t.id;

SELECT
  p.id,
  p.name,
  COUNT(t.id) AS total_tasks
FROM projects p
LEFT JOIN tasks t ON t.project_id = p.id
GROUP BY p.id, p.name
ORDER BY total_tasks DESC, p.id;

SELECT
  u.id,
  u.name,
  COUNT(t.id) AS assigned_tasks
FROM users u
LEFT JOIN tasks t ON t.user_id = u.id
GROUP BY u.id, u.name
ORDER BY assigned_tasks DESC, u.id;

SELECT *
FROM tasks
WHERE status = 'pending'
ORDER BY due_date;
