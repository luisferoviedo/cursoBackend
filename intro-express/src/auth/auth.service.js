// Esta capa concentra la lógica de autenticación.
// No conoce req/res ni responde HTTP directamente.
// Su trabajo es:
// 1) validar datos básicos
// 2) consultar usuarios en SQLite
// 3) hashear contraseñas con bcrypt
// 4) generar JWT con jsonwebtoken

// bcrypt protege contraseñas usando hashing seguro.
const bcrypt = require('bcrypt')
// JWT se usa para firmar y verificar tokens de acceso.
const jwt = require('jsonwebtoken')

// Crea errores con status HTTP para que el controller pueda responder
// sin mezclar lógica de negocio con la capa HTTP.
const createAuthError = (status, message) => {
  const error = new Error(message)
  error.status = status

  return error
}

// Elimina campos sensibles antes de devolver el usuario al cliente.
// Así evitamos exponer password_hash por accidente.
const sanitizeUser = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at
  }
}

// Registra un usuario nuevo.
// Flujo: valida datos -> revisa email duplicado -> hashea password -> inserta usuario -> devuelve usuario limpio.
const registerUser = async (db, userData) => {
  const name = userData.name?.trim()
  const email = userData.email?.trim().toLowerCase()
  const password = userData.password

  if (!name || !email || !password) {
    throw createAuthError(400, 'Name, email and password are required')
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

// Devuelve el usuario autenticado actual usando el id guardado en el token.
// Esto permite exponer un endpoint /me sin repetir lógica en el controller.
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

// Valida credenciales y devuelve un JWT firmado.
// El token lleva datos mínimos del usuario para poder identificarlo en rutas protegidas.
const loginUser = async (db, credentials) => {
  const email = credentials.email?.trim().toLowerCase()
  const password = credentials.password

  if (!email || !password) {
    throw createAuthError(400, 'Email and password are required')
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
