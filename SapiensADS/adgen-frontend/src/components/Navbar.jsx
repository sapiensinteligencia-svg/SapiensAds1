export default function Navbar({ credits, onOpenPricing }) {
  const isLoggedIn = !!localStorage.getItem('sapiensads_token')
  const user = JSON.parse(localStorage.getItem('sapiensads_user') || '{}')

  const creditsColor = credits <= 0
    ? 'text-red-400 border-red-500/30 bg-red-500/10'
    : credits <= 5
    ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
    : 'text-purple-300 border-purple-500/30 bg-purple-500/10'

  const handleLogout = () => {
    localStorage.removeItem('sapiensads_token')
    localStorage.removeItem('sapiensads_user')
    window.location.href = '/login'
  }

  return (
    <nav className="w-full sticky top-0 z-40
                    border-b border-white/8
                    bg-white/3 backdrop-blur-xl
                    supports-[backdrop-filter]:bg-black/20">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-800
                          flex items-center justify-center shadow-lg shadow-purple-500/25">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <span className="font-semibold text-base tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #e9d5ff 0%, #a855f7 50%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
            SapiensADS AI
          </span>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">

          {isLoggedIn ? (
            <>
              {/* Créditos */}
              <button
                onClick={() => onOpenPricing('manual')}
                className={`hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5
                            rounded-full border transition hover:opacity-80 ${creditsColor}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                {credits} {credits === 1 ? 'generación' : 'generaciones'}
              </button>

              {/* Ver planes */}
              <button
                onClick={() => onOpenPricing('manual')}
                className="text-xs px-3 py-1.5 rounded-full border border-purple-500/40
                           text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 transition">
                Ver planes
              </button>

              {/* Usuario */}
              {user?.name && (
                <span className="hidden sm:block text-xs text-gray-500">
                  {user.name}
                </span>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-xs text-gray-600 hover:text-gray-400 transition px-2 py-1.5">
                Salir
              </button>
            </>
          ) : (
            <>
              <a href="/login"
                 className="text-xs px-3 py-1.5 rounded-full text-gray-400 hover:text-gray-200 transition">
                Iniciar sesión
              </a>
              <a href="/register"
                 className="text-xs px-3 py-1.5 rounded-full border border-purple-500/40
                            text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 transition">
                Crear cuenta gratis
              </a>
            </>
          )}

        </div>
      </div>
    </nav>
  )
}