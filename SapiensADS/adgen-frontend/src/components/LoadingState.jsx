import { useState, useEffect } from 'react'

const BANNER_MESSAGES = [
  { text: 'Analizando tu negocio...', icon: '🔍' },
  { text: 'Generando estrategia publicitaria...', icon: '🧠' },
  { text: 'Escribiendo copy persuasivo...', icon: '✍️' },
  { text: 'Diseñando la composición visual...', icon: '🎨' },
  { text: 'Generando imagen con IA...', icon: '🖼️' },
  { text: 'Añadiendo los últimos detalles...', icon: '✨' },
  { text: 'Casi listo...', icon: '🚀' },
]

const VIDEO_MESSAGES = [
  { text: 'Analizando el banner generado...', icon: '🔍' },
  { text: 'Escribiendo el guión del spot...', icon: '📝' },
  { text: 'Preparando escenas y movimientos...', icon: '🎬' },
  { text: 'Generando video con Veo 3.1 Lite...', icon: '🎥' },
  { text: 'Añadiendo audio al spot...', icon: '🎵' },
  { text: 'Procesando el video final...', icon: '⚙️' },
  { text: 'Casi listo, esto puede tardar un poco más...', icon: '⏳' },
]

export default function LoadingState({ format, isVideo = false }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible]           = useState(true)

  const messages = isVideo ? VIDEO_MESSAGES : BANNER_MESSAGES

  const intervalTime = isVideo
    ? Math.floor(60000 / messages.length)
    : Math.floor(12000 / messages.length)

  useEffect(() => {
    setCurrentIndex(0)
    setVisible(true)
  }, [isVideo])

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrentIndex(prev => {
          if (prev >= messages.length - 1) return prev
          return prev + 1
        })
        setVisible(true)
      }, 300)
    }, intervalTime)

    return () => clearInterval(interval)
  }, [messages.length, intervalTime])

  const previewClass = format.id === 'instagram_story'
    ? 'aspect-[9/16]'
    : format.id === 'facebook_post'
    ? 'aspect-video'
    : 'aspect-square'

  const progress = Math.round(((currentIndex + 1) / messages.length) * 100)

  return (
    <div className="w-full space-y-4 animate-fadeIn">

      {/* Previsualización del formato */}
      <div className={`w-full ${previewClass} rounded-xl border border-white/10
                       bg-gray-900 relative overflow-hidden`}>

        {/* Shimmer animado */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent
                          via-white/5 to-transparent animate-shimmer"
               style={{ backgroundSize: '200% 100%' }} />
        </div>

        {/* Contenido central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">

          {/* Spinner */}
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent
                            border-t-purple-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              {messages[currentIndex].icon}
            </div>
          </div>

          {/* Mensaje animado */}
          <div className="text-center space-y-1">
            <p
              className="text-sm font-medium text-white transition-all duration-300"
              style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(4px)' }}
            >
              {messages[currentIndex].text}
            </p>
            <p className="text-xs text-gray-600">
              {isVideo ? 'El video puede tardar hasta 90 segundos' : 'Esto puede tardar unos segundos'}
            </p>
          </div>

          {/* Barra de progreso */}
          <div className="w-full max-w-[200px] space-y-1">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: progress + '%' }}
              />
            </div>
            <p className="text-xs text-gray-600 text-center">{progress}%</p>
          </div>

        </div>

        {/* Esquinas decorativas */}
        <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-purple-500/30 rounded-tl" />
        <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-purple-500/30 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-purple-500/30 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-purple-500/30 rounded-br" />

      </div>

      {/* Etapas */}
      <div className="flex justify-between px-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300
              ${i < currentIndex
                ? 'bg-purple-500'
                : i === currentIndex
                ? 'bg-purple-400 scale-125'
                : 'bg-white/10'
              }`}
          />
        ))}
      </div>

    </div>
  )
}