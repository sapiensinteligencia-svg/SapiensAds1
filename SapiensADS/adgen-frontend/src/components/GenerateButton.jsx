import { useState } from 'react'

export default function GenerateButton({ onClick, loading, disabled }) {
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    if (disabled || loading) return
    setClicked(true)
    setTimeout(() => setClicked(false), 600)
    onClick()
  }

  return (
    <div className="relative group">

      {/* Resplandor exterior */}
      <div className={`absolute -inset-0.5 rounded-2xl blur-sm transition-all duration-500
                       bg-gradient-to-r from-purple-600 via-violet-500 to-purple-600
                       ${disabled ? 'opacity-0' : 'opacity-40 group-hover:opacity-70'}`} />

      {/* Botón principal */}
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className={`relative w-full py-4 rounded-2xl text-sm font-semibold
                    tracking-wide transition-all duration-300 overflow-hidden
                    ${disabled
                      ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/8'
                      : 'text-white border-0 cursor-pointer'
                    }`}
        style={!disabled ? {
          background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
          boxShadow: clicked ? '0 0 30px rgba(124, 58, 237, 0.6)' : '0 4px 20px rgba(124, 58, 237, 0.3)',
          transform: clicked ? 'scale(0.98)' : 'scale(1)',
        } : {}}
      >
        {/* Brillo animado */}
        {!disabled && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent
                            via-white/10 to-transparent -skew-x-12
                            animate-shimmer" />
          </div>
        )}

        {/* Contenido */}
        <div className="relative flex items-center justify-center gap-2">
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white
                               rounded-full animate-spin" />
              <span>Generando...</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                   className={`transition-transform duration-300 ${disabled ? '' : 'group-hover:rotate-12'}`}>
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              <span>Generar anuncio</span>
              {!disabled && (
                <span className="opacity-60 text-xs">→</span>
              )}
            </>
          )}
        </div>

        {/* Partículas al hacer clic */}
        {clicked && (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/80"
                style={{
                  left: '50%',
                  top:  '50%',
                  animation: `particle 0.6s ease-out forwards`,
                  animationDelay: `${i * 0.05}s`,
                  transform: `rotate(${i * 60}deg)`,
                }}
              />
            ))}
          </>
        )}

      </button>
    </div>
  )
}