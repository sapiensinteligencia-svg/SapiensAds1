import { useEffect, useRef } from 'react'

export default function HistoryPanel({ history, onSelect, currentId }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current && history.length > 0) {
      containerRef.current.scrollTo({ left: 0, behavior: 'smooth' })
    }
  }, [history.length])

  if (history.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
        Anuncios anteriores
      </p>
      <div
        ref={containerRef}
        className="space-y-2"
      >
        {history.map((entry, index) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry)}
            className={`w-full text-left rounded-xl border transition-all duration-300
                        overflow-hidden group
              ${currentId === entry.id
                ? 'border-purple-500/50 bg-purple-500/10'
                : 'border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15'
              }`}
            style={{
              animation: `slideInFromRight 0.4s ease forwards`,
              animationDelay: `${index * 0.05}s`,
              opacity: 0,
            }}
          >
            <div className="flex items-center gap-3 p-3">

              {/* Miniatura */}
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0
                              bg-gray-900 border border-white/10 relative">
                {entry.imageUrl ? (
                  <img
                    src={entry.imageUrl}
                    alt={entry.headline}
                    className="w-full h-full object-cover transition-transform duration-500
                               group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round">
                      <rect width="18" height="18" x="3" y="3" rx="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                  </div>
                )}

                {/* Overlay al hover */}
                <div className="absolute inset-0 bg-purple-500/20 opacity-0
                                group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium truncate transition-colors duration-200
                  ${currentId === entry.id ? 'text-purple-200' : 'text-gray-300 group-hover:text-white'}`}>
                  {entry.headline}
                </p>
                <p className="text-xs text-gray-600 truncate mt-0.5">{entry.idea}</p>

                {/* Tags */}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {entry.strategy && (
                    <span className="text-xs px-1.5 py-0.5 rounded-md bg-white/5
                                     border border-white/8 text-gray-500">
                      {entry.strategy.id === 'impact'   ? '⚡' :
                       entry.strategy.id === 'solution' ? '🧠' : '❤️'}
                    </span>
                  )}
                  {entry.visualStyle && (
                    <span className="text-xs px-1.5 py-0.5 rounded-md bg-white/5
                                     border border-white/8 text-gray-500">
                      {entry.visualStyle.id === 'bold_product'     ? '⚡' :
                       entry.visualStyle.id === 'lifestyle_clean'  ? '🌿' :
                       entry.visualStyle.id === 'minimalist_studio'? '✦' :
                       entry.visualStyle.id === 'gradient_vivid'   ? '🎨' : '🎬'}
                    </span>
                  )}
                  {entry.language && (
                    <span className="text-xs px-1.5 py-0.5 rounded-md bg-white/5
                                     border border-white/8 text-gray-500">
                      {entry.language.id === 'es' ? '🇲🇽' :
                       entry.language.id === 'en' ? '🇺🇸' : '🇧🇷'}
                    </span>
                  )}
                </div>
              </div>

              {/* Formato + flecha */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full border
                  ${currentId === entry.id
                    ? 'border-purple-500/40 text-purple-400 bg-purple-500/10'
                    : 'border-white/10 text-gray-600'
                  }`}>
                  {entry.format?.ratio || '1:1'}
                </span>
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  className={`transition-all duration-300
                    ${currentId === entry.id
                      ? 'text-purple-400 translate-x-0'
                      : 'text-gray-700 group-hover:text-gray-400 group-hover:translate-x-0.5'
                    }`}>
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>

            </div>
          </button>
        ))}
      </div>
    </div>
  )
}