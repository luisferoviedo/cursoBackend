// Núcleo de autenticación del sistema.
// Aquí viven las reglas reales de registro, login y lectura del usuario actual.
// El controller solo traduce HTTP; el service decide validaciones, seguridad y contratos.

// bcrypt protege contraseñas usando hashing seguro.
const bcrypt = require('bcrypt')
// JWT se usa para firmar y verificar tokens de acceso.
const jwt = require('jsonwebtoken')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

// Los services lanzan errores con status para mantener separado negocio vs. transporte HTTP.
const createAuthError = (status, message) => {
  const error = new Error(message)
  error.status = status

  return error
}

// Cualquier usuario que salga al cliente debe pasar por aquí.
// Este helper evita fugas de password_hash y mantiene uniforme el contrato público del usuario.
const sanitizeUser = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at
  }
}

// Flujo completo de registro:
// valida contrato -> protege password con bcrypt -> inserta en SQLite -> devuelve usuario seguro.
const registerUser = async (db, userData) => {
  const name = userData.name?.trim()
  const email = userData.email?.trim().toLowerCase()
  const password = userData.password

  if (!name || !email || !password) {
    throw createAuthError(400, 'Name, email and password are required')
  }

  if (!EMAIL_REGEX.test(email)) {
    throw createAuthError(400, 'Email format is invalid')
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw createAuthError(400, `Password must have at least ${MIN_PASSWORD_LENGTH} characters`)
  }

  const existingUser = await db.get(
    'SELECT * FROM users WHERE email = ?',
    [email]
  )

  if (existingUser) {
    throw createAuthError(409, 'Email already registered')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const result = await db.run(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  )

  const createdUser = await db.get(
    'SELECT * FROM users WHERE id = ?',
    [result.lastID]
  )

  return sanitizeUser(createdUser)
}

// /auth/me depende de esta función.
// El token ya fue validado por verifyAuth; aquí solo convertimos sub -> usuario real de base de datos.
const getCurrentUser = async (db, userId) => {
  const user = await db.get(
    'SELECT * FROM users WHERE id = ?',
    [userId]
  )

  if (!user) {
    throw createAuthError(404, 'User not found')
  }

  return sanitizeUser(user)
}

// Login verifica credenciales y firma un JWT con el mínimo contexto útil.
// sub identifica al usuario; email y role permiten autorización y trazabilidad sin consultas extra inmediatas.
const loginUser = async (db, credentials) => {
  const email = credentials.email?.trim().toLowerCase()
  const password = credentials.password

  if (!email || !password) {
    throw createAuthError(400, 'Email and password are required')
  }

  if (!EMAIL_REGEX.test(email)) {
    throw createAuthError(400, 'Email format is invalid')
  }

  const user = await db.get(
    'SELECT * FROM users WHERE email = ?',
    [email]
  )

  if (!user) {
    throw createAuthError(401, 'Invalid credentials')
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash)

  if (!isPasswordValid) {
    throw createAuthError(401, 'Invalid credentials')
  }

  if (!process.env.JWT_SECRET) {
    throw createAuthError(500, 'JWT secret is not configured')
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    }
  )

  return {
    token,
    user: sanitizeUser(user)
  }
}

// Exportamos solo las funciones públicas del módulo auth.
module.exports = {
  getCurrentUser,
  registerUser,
  loginUser
}
