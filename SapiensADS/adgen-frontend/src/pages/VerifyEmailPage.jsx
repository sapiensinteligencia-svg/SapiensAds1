import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) { setStatus('error'); return }

    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/verify-email?token=${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm text-center space-y-6 animate-fadeIn">

        {status === 'loading' && (
          <>
            <div className="w-14 h-14 border-2 border-purple-500/30 border-t-purple-500
                            rounded-full animate-spin mx-auto" />
            <p className="text-gray-400">Verificando tu correo...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-14 h-14 bg-green-500/15 border border-green-500/30
                            rounded-xl flex items-center justify-center mx-auto">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                   stroke="#22c55e" strokeWidth="2" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-medium text-white mb-2">¡Correo verificado!</h1>
              <p className="text-gray-500 text-sm">Tu cuenta está activa. Ya puedes iniciar sesión.</p>
            </div>
            <Link to="/login"
              className="inline-block w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700
                         text-white text-sm font-medium transition text-center">
              Iniciar sesión
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-14 h-14 bg-red-500/15 border border-red-500/30
                            rounded-xl flex items-center justify-center mx-auto">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                   stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-medium text-white mb-2">Enlace inválido</h1>
              <p className="text-gray-500 text-sm">El enlace expiró o ya fue usado.</p>
            </div>
            <Link to="/register"
              className="inline-block w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700
                         text-white text-sm font-medium transition text-center">
              Crear cuenta nueva
            </Link>
          </>
        )}

      </div>
    </div>
  )
}