# Git Workflow - Curso Backend

## Convencion de commits
Usa este formato:

`tipo(scope opcional): descripcion corta`

Tipos recomendados:
- `feat`: nueva funcionalidad
- `fix`: correccion de bug
- `chore`: tareas de mantenimiento
- `docs`: cambios de documentacion
- `refactor`: mejora interna sin cambiar comportamiento
- `test`: pruebas

Ejemplos:
- `feat(intro-express): agrega ruta /projects`
- `fix(intro-express): corrige puerto por variable de entorno`
- `chore(repo): mejora .gitignore global`

## Flujo diario
1. `git status`
2. `git add -A`
3. `git commit -m "tipo(scope): descripcion"`
4. `git push`

## Ramas recomendadas
- `main`: estable
- `feat/<tema>`: trabajo de funcionalidades
- `fix/<tema>`: correcciones
