import { useState, useEffect } from 'react'
import { register as registerService, login as loginService } from '../services/authService'

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('sapiensads_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const handleRegister = async ({ name, email, password }) => {
    setLoading(true)
    setError(null)
    try {
      await registerService({ name, email, password })
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al crear la cuenta'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const data = await loginService({ email, password })
      localStorage.setItem('sapiensads_token', data.token)
      localStorage.setItem('sapiensads_user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al iniciar sesión'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('sapiensads_token')
    localStorage.removeItem('sapiensads_user')
    setUser(null)
  }

  return { user, loading, error, handleRegister, handleLogin, handleLogout }
}