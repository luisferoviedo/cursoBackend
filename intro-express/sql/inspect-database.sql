-- Consultas base para inspeccionar la SQLite del proyecto en DBCode.
-- Archivo objetivo de conexión:
-- /Users/luisferoviedo/Documents/Curso Backend/intro-express/database.sqlite

SELECT 'users' AS table_name, COUNT(*) AS total FROM users;
SELECT 'projects' AS table_name, COUNT(*) AS total FROM projects;
SELECT 'tasks' AS table_name, COUNT(*) AS total FROM tasks;

SELECT * FROM users ORDER BY id DESC;
SELECT * FROM projects ORDER BY id DESC;
SELECT * FROM tasks ORDER BY id DESC;
