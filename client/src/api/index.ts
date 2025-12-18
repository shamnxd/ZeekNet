import axios from 'axios'
import type { AxiosInstance } from 'axios'

let refreshPromise: Promise<string | null> | null = null
let getAuthToken: () => string | null = () => null
let logoutCallback: (() => void) | null = null
let updateTokenCallback: ((data: Record<string, unknown>, token: string) => void) | null = null

export const setUpdateTokenCallback = (callback: (data: Record<string, unknown>, token: string) => void) => {
  updateTokenCallback = callback
}

export const setAuthTokenGetter = (getter: () => string | null) => {
  getAuthToken = getter
}

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback
}

export const clearAuthToken = () => {
  getAuthToken = () => null
}

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token && config.headers) {
    const url = String(config.url || '')
    if (!url.startsWith('/api/auth/refresh')) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const errorMessage = error?.response?.data?.message || ''
    
    if (error?.response?.status === 403) {
      if ((errorMessage.includes('blocked') || errorMessage.includes('Company account is blocked')) && logoutCallback) {
        logoutCallback()
        return Promise.reject(error)
      }
    }
    
    if (error?.response?.status === 401 && errorMessage.includes('Invalid refresh token')) {
      if (logoutCallback) {
        logoutCallback()
      }
      return Promise.reject(error)
    }
    
    if (error?.response?.status === 401 && !original?._retry) {
      original._retry = true

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const resp = await api.post('/api/auth/refresh', {}, {
              headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
            })
            const newToken = resp.data?.token || resp.data?.data?.token || null
            const userData = resp.data?.data || null
            
            if (newToken && userData && updateTokenCallback) {
              updateTokenCallback(userData, newToken)
            }
            
            return newToken
          } catch (refreshError: unknown) {
            const refreshErrorMessage = (refreshError as { response?: { data?: { message?: string } } })?.response?.data?.message || ''
            if (refreshErrorMessage.includes('Invalid refresh token') && logoutCallback) {
              logoutCallback()
            } else if (logoutCallback) {
              logoutCallback()
            }
            return null
          }
        })().finally(() => {
          refreshPromise = null
        })
      }

      const token = await refreshPromise
      if (token && original?.headers) {
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      } else {
        if (logoutCallback) {
          logoutCallback()
        }
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export { jobApplicationApi } from './job-application.api'
export { chatApi } from './chat.api'
