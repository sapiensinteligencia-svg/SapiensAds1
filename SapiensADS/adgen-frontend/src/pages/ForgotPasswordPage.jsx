import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1500)
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

          {!sent ? (
            <>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-500/15 border border-purple-500/30
                                rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                       stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-medium text-purple-100">
                  ¿Olvidaste tu contraseña?
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Ingresa tu correo y te enviaremos un enlace para restablecerla
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs text-gray-400 uppercase tracking-widest font-medium">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                               text-white placeholder-gray-600 text-sm focus:outline-none
                               focus:border-purple-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-3.5 rounded-xl font-medium text-white text-sm transition
                             bg-purple-600 hover:bg-purple-700 disabled:opacity-40
                             disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white
                                       rounded-full animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    'Enviar enlace'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4 animate-scaleIn">
              <div className="w-14 h-14 bg-green-500/15 border border-green-500/30
                              rounded-xl flex items-center justify-center mx-auto">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                     stroke="#22c55e" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h2 className="text-2xl font-medium text-white">Revisa tu correo</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Enviamos un enlace de recuperación a<br/>
                <span className="text-purple-300">{email}</span>
              </p>
              <p className="text-xs text-gray-600">
                ¿No lo ves? Revisa tu carpeta de spam
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-xs text-purple-400 hover:text-purple-300 transition"
              >
                Usar otro correo
              </button>
            </div>
          )}

          <p className="text-center text-xs text-gray-600">
            <Link to="/login" className="text-purple-400 hover:text-purple-300 transition
                                         flex items-center justify-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Volver a iniciar sesión
            </Link>
          </p>

        </div>
      </main>

    </div>
  )
}