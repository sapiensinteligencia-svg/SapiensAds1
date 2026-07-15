import { useState } from 'react'
import { register as registerService } from '../services/authService'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const handleRegister = async ({ name, email }) => {
    setLoading(true)
    setError(null)
    try {
      await registerService({ name, email })
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al crear la cuenta'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, handleRegister }
}
