const STRATEGIES = [
  {
    id: 'impact',
    name: 'Impacto Directo',
    tag: 'Marketing agresivo',
    description: 'Urgencia, escasez y acción inmediata. Ideal para promociones y ofertas.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    emoji: '⚡',
    color: 'red',
    example: '"¡OFERTA HOY! Precio imbatible"',
  },
  {
    id: 'solution',
    name: 'Solución Inteligente',
    tag: 'Venta consultiva',
    description: 'Identifica el problema del cliente y presenta tu servicio como la respuesta.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4M12 8h.01"/>
      </svg>
    ),
    emoji: '🧠',
    color: 'blue',
    example: '"¿Cansado de X? Tenemos la solución"',
  },
  {
    id: 'emotion',
    name: 'Conexión Emocional',
    tag: 'Neuromarketing',
    description: 'Apela a emociones, aspiraciones y deseos profundos del cliente.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    emoji: '❤️',
    color: 'amber',
    example: '"Imagina la vida que mereces..."',
  },
]

export { STRATEGIES }

const colorMap = {
  red: {
    active:    'border-red-500 bg-red-500/10',
    glow:      '0 0 20px rgba(239, 68, 68, 0.3)',
    icon:      'text-red-400',
    iconBg:    'bg-red-500/15',
    tag:       'border-red-500/30 bg-red-500/10 text-red-400',
    check:     'bg-red-500 border-red-500',
    inactive:  'border-white/8 bg-white/3 hover:border-red-500/30 hover:bg-red-500/5',
  },
  blue: {
    active:    'border-blue-500 bg-blue-500/10',
    glow:      '0 0 20px rgba(59, 130, 246, 0.3)',
    icon:      'text-blue-400',
    iconBg:    'bg-blue-500/15',
    tag:       'border-blue-500/30 bg-blue-500/10 text-blue-400',
    check:     'bg-blue-500 border-blue-500',
    inactive:  'border-white/8 bg-white/3 hover:border-blue-500/30 hover:bg-blue-500/5',
  },
  amber: {
    active:    'border-amber-500 bg-amber-500/10',
    glow:      '0 0 20px rgba(245, 158, 11, 0.3)',
    icon:      'text-amber-400',
    iconBg:    'bg-amber-500/15',
    tag:       'border-amber-500/30 bg-amber-500/10 text-amber-400',
    check:     'bg-amber-500 border-amber-500',
    inactive:  'border-white/8 bg-white/3 hover:border-amber-500/30 hover:bg-amber-500/5',
  },
}

export default function StrategySelector({ selected, onChange }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2">
        {STRATEGIES.map(strategy => {
          const isActive = selected?.id === strategy.id
          const c        = colorMap[strategy.color]

          return (
            <button
              key={strategy.id}
              onClick={() => onChange(strategy)}
              className={`text-left p-4 rounded-xl border transition-all duration-300
                ${isActive ? c.active : c.inactive}`}
              style={isActive ? { boxShadow: c.glow } : {}}
            >
              <div className="flex items-center gap-4">

                {/* Ícono con fondo */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                                 shrink-0 transition-all duration-300
                                 ${isActive ? c.iconBg : 'bg-white/5'}`}>
                  <span className={`text-xl transition-all duration-300
                    ${isActive ? '' : 'grayscale opacity-50'}`}>
                    {strategy.emoji}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className={`text-sm font-semibold transition-colors duration-300
                      ${isActive ? 'text-white' : 'text-gray-300'}`}>
                      {strategy.name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${c.tag}`}>
                      {strategy.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {strategy.description}
                  </p>
                </div>

                {/* Check */}
                <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center
                                 justify-center transition-all duration-300
                                 ${isActive
                                   ? c.check
                                   : 'border-white/20 bg-transparent'
                                 }`}>
                  {isActive && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                         stroke="white" strokeWidth="3" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  )}
                </div>

              </div>

              {/* Ejemplo al seleccionar */}
              {isActive && (
                <div className={`mt-3 pt-3 border-t ${
                  strategy.color === 'red'   ? 'border-red-500/20' :
                  strategy.color === 'blue'  ? 'border-blue-500/20' :
                  'border-amber-500/20'
                }`}>
                  <p className={`text-xs italic ${c.icon}`}>
                    Ej: {strategy.example}
                  </p>
                </div>
              )}

            </button>
          )
        })}
      </div>
    </div>
  )
}