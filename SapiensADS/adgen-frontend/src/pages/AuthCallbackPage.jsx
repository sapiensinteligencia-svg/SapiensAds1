import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate       = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) { navigate('/login'); return }

    const payload = JSON.parse(atob(token.split('.')[1]))
    localStorage.setItem('sapiensads_token', token)
    localStorage.setItem('sapiensads_user', JSON.stringify({ id: payload.id }))

    navigate('/')
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500
                        rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm">Iniciando sesión...</p>
      </div>
    </div>
  )
}