// Contrato compartido de estados para todo el proyecto.
// Usamos un formato canónico único y aceptamos aliases viejos para no romper pruebas.

const SHARED_STATUSES = ['pending', 'in_progress', 'done']

const STATUS_ALIASES = {
  pending: 'pending',
  in_progress: 'in_progress',
  done: 'done',
  'To do': 'pending',
  'In progress': 'in_progress',
  Done: 'done'
}

// Confirma si un valor está soportado por el sistema, aunque llegue en formato legacy.
const isSupportedStatus = (status) => {
  if (status === undefined || status === null) {
    return false
  }

  return STATUS_ALIASES[status] !== undefined
}

// Convierte cualquier alias soportado al valor canónico persistido en base de datos.
const normalizeStatus = (status) => {
  if (status === undefined || status === null) {
    return status
  }

  return STATUS_ALIASES[status] ?? null
}

module.exports = {
  SHARED_STATUSES,
  STATUS_ALIASES,
  isSupportedStatus,
  normalizeStatus
}
