import { useEffect, useState } from 'react'

const ICONS = {
  error:   '❌',
  warning: '⚠️',
  success: '✅',
  info:    'ℹ️',
}

const COLORS = {
  error:   'border-red-500/30 bg-red-500/10 text-red-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  success: 'border-green-500/30 bg-green-500/10 text-green-300',
  info:    'border-purple-500/30 bg-purple-500/10 text-purple-300',
}

export default function Toast({ message, type = 'error', onClose, onRetry, duration = 5000 }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 10)
    if (!onRetry) {
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onClose, 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 w-full max-w-sm px-4
                  transition-all duration-300
                  ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transform: `translateX(-50%) translateY(${visible ? '0' : '16px'})` }}
    >
      <div className={`rounded-xl border px-4 py-3 shadow-xl ${COLORS[type]}`}>
        <div className="flex items-start gap-3">
          <span className="text-lg shrink-0 mt-0.5">{ICONS[type]}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-relaxed">{message}</p>
            {onRetry && (
              <button
                onClick={() => { handleClose(); setTimeout(onRetry, 300) }}
                className="mt-2 text-xs underline underline-offset-2 opacity-80 hover:opacity-100 transition">
                Reintentar
              </button>
            )}
          </div>
          <button
            onClick={handleClose}
            className="shrink-0 opacity-60 hover:opacity-100 transition mt-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}