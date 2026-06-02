import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import * as authApi from '../services/auth'
import { api, setAccessToken } from '../services/api'

const AuthContext = createContext(null)

function getStoredToken() {
  return localStorage.getItem('accessToken') || ''
}

export function AuthProvider({ children }) {
  const [accessToken, setToken] = useState(getStoredToken)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const refreshPromiseRef = useRef(null)
  const notifiedRef = useRef(false)

  const applyToken = useCallback((token) => {
    setToken(token || '')
    setAccessToken(token || '')
    if (token) localStorage.setItem('accessToken', token)
    else localStorage.removeItem('accessToken')
  }, [])

  const bootstrap = useCallback(async () => {
    try {
      if (accessToken) setAccessToken(accessToken)
      const meRes = await authApi.me()
      setUser(meRes.user)
    } catch {
      try {
        const refreshRes = await authApi.refresh()
        applyToken(refreshRes.accessToken)
        setUser(refreshRes.user)
      } catch {
        applyToken('')
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }, [accessToken, applyToken])

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  useEffect(() => {
    const id = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status
        const original = error?.config || {}
        const url = String(original.url || '')
        const isAuthEndpoint =
          url.includes('/api/auth/login') || url.includes('/api/auth/register') || url.includes('/api/auth/refresh')

        if (status !== 401 || original._retry || isAuthEndpoint) {
          return Promise.reject(error)
        }

        original._retry = true

        try {
          if (!refreshPromiseRef.current) {
            refreshPromiseRef.current = authApi
              .refresh()
              .then((res) => {
                applyToken(res.accessToken)
                setUser(res.user)
                return res.accessToken
              })
              .finally(() => {
                refreshPromiseRef.current = null
              })
          }

          const newToken = await refreshPromiseRef.current
          original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newToken}` }
          return api(original)
        } catch (refreshErr) {
          applyToken('')
          setUser(null)
          if (!notifiedRef.current) {
            notifiedRef.current = true
            toast.error('Session expired. Please sign in again.')
            setTimeout(() => {
              notifiedRef.current = false
            }, 1200)
          }
          return Promise.reject(refreshErr)
        }
      },
    )

    return () => {
      api.interceptors.response.eject(id)
    }
  }, [applyToken])

  const login = useCallback(
    async (payload) => {
      const res = await authApi.login(payload)
      applyToken(res.accessToken)
      setUser(res.user)
      toast.success('Welcome back')
      return res
    },
    [applyToken],
  )

  const register = useCallback(async (payload) => {
    const res = await authApi.register(payload)
    toast.success('Account created. Please sign in.')
    return res
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      applyToken('')
      setUser(null)
      toast.success('Logged out')
    }
  }, [applyToken])

  const value = useMemo(
    () => ({
      user,
      accessToken,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      refresh: async () => {
        const res = await authApi.refresh()
        applyToken(res.accessToken)
        setUser(res.user)
        return res
      },
    }),
    [user, accessToken, loading, login, register, logout, applyToken],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

