import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RegisterPage() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [sent, setSent]         = useState(false)
  const { handleRegister, loading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await handleRegister({ name, email, password })
    if (result.success) setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm text-center space-y-6 animate-scaleIn">
          <div className="w-14 h-14 bg-purple-500/15 border border-purple-500/30
                          rounded-xl flex items-center justify-center mx-auto">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                 stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-medium text-white mb-2">Revisa tu correo</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Enviamos un enlace de verificación a<br/>
              <span className="text-purple-300">{email}</span>
            </p>
          </div>
          <p className="text-xs text-gray-600">
            ¿No lo ves? Revisa tu carpeta de spam
          </p>
          <Link to="/login"
            className="inline-block w-full py-3.5 rounded-xl border border-white/10
                       text-gray-400 text-sm hover:bg-white/5 transition text-center">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <nav className="w-full border-b border-white/8 px-6 py-4 flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="text-white font-medium text-sm">SapiensADS AI</span>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8 animate-fadeIn">

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-medium text-purple-100">Crea tu cuenta</h1>
            <p className="text-gray-500 text-sm">3 anuncios gratis, sin tarjeta de crédito</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs text-gray-400 uppercase tracking-widest font-medium">
                Nombre
              </label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Tu nombre" required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                           text-white placeholder-gray-600 text-sm focus:outline-none
                           focus:border-purple-500 transition" />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs text-gray-400 uppercase tracking-widest font-medium">
                Correo electrónico
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com" required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                           text-white placeholder-gray-600 text-sm focus:outline-none
                           focus:border-purple-500 transition" />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs text-gray-400 uppercase tracking-widest font-medium">
                Contraseña
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres" minLength={8} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                           text-white placeholder-gray-600 text-sm focus:outline-none
                           focus:border-purple-500 transition" />
            </div>

            {error && <p className="text-sm text-red-400 text-center animate-fadeIn">{error}</p>}

            <button type="submit" disabled={loading || !name || !email || !password}
              className="w-full py-3.5 rounded-xl font-medium text-white text-sm transition
                         bg-purple-600 hover:bg-purple-700 disabled:opacity-40
                         disabled:cursor-not-allowed mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando cuenta...
                </span>
              ) : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 transition">
              Inicia sesión
            </Link>
          </p>

        </div>
      </main>
    </div>
  )
}