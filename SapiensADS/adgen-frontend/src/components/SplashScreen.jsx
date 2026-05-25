import { useEffect, useState } from 'react'

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('visible'), 100)
    const t2 = setTimeout(() => setPhase('exit'),    2800)
    const t3 = setTimeout(() => onFinish(),          3400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center
                 animate-gradient-bg overflow-hidden"
      style={{
        opacity:    phase === 'exit' ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: phase === 'exit' ? 'none' : 'all',
      }}
    >
      {/* Orbes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-glow absolute -top-40 -left-40 w-96 h-96 rounded-full
                        bg-purple-600/25 blur-3xl" />
        <div className="animate-glow absolute -bottom-40 -right-40 w-80 h-80 rounded-full
                        bg-violet-700/20 blur-3xl"
             style={{ animationDelay: '2s' }} />
        <div className="animate-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"
             style={{ animationDelay: '1s' }} />
      </div>

      {/* Contenido */}
      <div
        className="relative flex flex-col items-center gap-8"
        style={{
          opacity:    phase === 'visible' || phase === 'exit' ? 1 : 0,
          transform:  phase === 'visible' || phase === 'exit' ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Ícono animado */}
        <div className="relative flex items-center justify-center">

          {/* Anillos orbitales */}
          <div className="absolute w-32 h-32 rounded-full border border-purple-500/20"
               style={{ animation: 'spinSlow 8s linear infinite' }} />
          <div className="absolute w-44 h-44 rounded-full border border-purple-500/10"
               style={{ animation: 'spinSlow 12s linear infinite reverse' }} />

          {/* Puntos en los anillos */}
          <div className="absolute w-32 h-32"
               style={{ animation: 'spinSlow 8s linear infinite' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                            w-2 h-2 rounded-full bg-purple-400" />
          </div>
          <div className="absolute w-44 h-44"
               style={{ animation: 'spinSlow 12s linear infinite reverse' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                            w-1.5 h-1.5 rounded-full bg-violet-400" />
          </div>

          {/* Resplandor central */}
          <div className="absolute w-24 h-24 rounded-2xl bg-purple-500/20 blur-xl
                          animate-pulse" />

          {/* Ícono principal */}
          <div className="relative w-20 h-20 rounded-2xl shadow-2xl shadow-purple-500/50
                          flex items-center justify-center overflow-hidden"
               style={{
                 background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 50%, #4c1d95 100%)',
                 animation: 'iconFloat 3s ease-in-out infinite',
               }}>

            {/* Brillo interno */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 rounded-t-2xl" />

            {/* Rayo */}
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                 stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                 style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>

            {/* Partículas internas */}
            <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-white/60
                            animate-ping" style={{ animationDuration: '1.5s' }} />
            <div className="absolute bottom-3 left-2 w-1 h-1 rounded-full bg-purple-200/60
                            animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Texto */}
        <div className="text-center space-y-2">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #f3e8ff 0%, #d8b4fe 40%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.4))',
            }}
          >
            SapiensADS AI
          </h1>
          <p className="text-gray-500 text-sm tracking-wide">
            Anuncios que venden, generados por IA
          </p>
        </div>

        {/* Barra de carga */}
        <div className="w-48 space-y-2">
          <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width:      phase === 'visible' || phase === 'exit' ? '100%' : '0%',
                transition: 'width 2.4s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)',
              }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}