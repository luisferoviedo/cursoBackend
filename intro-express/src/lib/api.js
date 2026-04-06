import axios from 'axios'

export const api = axios.create({
  baseURL: '/api'
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete api.defaults.headers.common.Authorization
}

export function getApiErrorMessage(error, fallbackMessage) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallbackMessage
  }

  return fallbackMessage
}
