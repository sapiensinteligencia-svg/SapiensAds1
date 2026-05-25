
import { useAdGenerator }  from './hooks/useAdGenerator'
import { useToast }        from './hooks/useToast'
import { useEffect, useRef, useState } from 'react'
import IdeaInput           from './components/IdeaInput'
import LanguageSelector    from './components/LanguageSelector'
import VisualStyleSelector from './components/VisualStyleSelector'
import GenerateButton      from './components/GenerateButton'
import ResultCard          from './components/ResultCard'
import LoadingState        from './components/LoadingState'
import Navbar              from './components/Navbar'
import HistoryPanel        from './components/HistoryPanel'
import PricingModal        from './components/PricingModal'
import Toast               from './components/Toast'
import PageTransition      from './components/PageTransition'

const FLOATING_ICONS = [
  { icon: '📣', label: 'megaphone', x: '8%',  y: '15%', delay: '0s',   duration: '12s', size: 'text-2xl' },
  { icon: '📊', label: 'chart',     x: '88%', y: '20%', delay: '2s',   duration: '14s', size: 'text-xl'  },
  { icon: '🚀', label: 'rocket',    x: '5%',  y: '55%', delay: '4s',   duration: '10s', size: 'text-2xl' },
  { icon: '⭐', label: 'star',      x: '92%', y: '60%', delay: '1s',   duration: '16s', size: 'text-lg'  },
  { icon: '💡', label: 'idea',      x: '15%', y: '80%', delay: '3s',   duration: '13s', size: 'text-xl'  },
  { icon: '🎯', label: 'target',    x: '82%', y: '85%', delay: '5s',   duration: '11s', size: 'text-2xl' },
  { icon: '💎', label: 'diamond',   x: '50%', y: '8%',  delay: '6s',   duration: '15s', size: 'text-lg'  },
  { icon: '📱', label: 'phone',     x: '25%', y: '92%', delay: '2.5s', duration: '12s', size: 'text-xl'  },
  { icon: '🎨', label: 'palette',   x: '70%', y: '12%', delay: '7s',   duration: '14s', size: 'text-lg'  },
  { icon: '✨', label: 'sparkle',   x: '95%', y: '40%', delay: '1.5s', duration: '9s',  size: 'text-xl'  },
  { icon: '🔥', label: 'fire',      x: '3%',  y: '35%', delay: '8s',   duration: '13s', size: 'text-lg'  },
  { icon: '💬', label: 'chat',      x: '60%', y: '90%', delay: '4.5s', duration: '11s', size: 'text-xl'  },
]

const METRICS = [
  { value: 10000, suffix: '+', label: 'Anuncios generados',   icon: '🖼️' },
  { value: 3,     suffix: '',  label: 'Estrategias de venta', icon: '🧠' },
  { value: 5,     suffix: '',  label: 'Estilos visuales',     icon: '🎨' },
  { value: 8,     suffix: 's', label: 'Spots publicitarios',  icon: '🎬' },
]

function AnimatedCounter({ target, suffix, duration = 1500 }) {
  const [count, setCount]     = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const steps     = 40
    const interval  = duration / steps
    const increment = target / steps
    let current     = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, interval)
    return () => clearInterval(timer)
  }, [started, target, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

function FloatingIcons() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {FLOATING_ICONS.map((item) => (
        <div
          key={item.label}
          className={`absolute ${item.size} select-none`}
          style={{
            left: item.x,
            top:  item.y,
            opacity: 0.12,
            animation: `floatIcon ${item.duration} ease-in-out infinite`,
            animationDelay: item.delay,
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  )
}

function MetricsRow() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {METRICS.map((metric) => (
        <div
          key={metric.label}
          className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm
                     p-3 text-center space-y-1 hover:border-purple-500/20
                     hover:bg-purple-500/5 transition-all duration-300">
          <div className="text-xl">{metric.icon}</div>
          <div className="text-lg font-bold text-white">
            <AnimatedCounter target={metric.value} suffix={metric.suffix} />
          </div>
          <div className="text-xs text-gray-500 leading-tight">{metric.label}</div>
        </div>
      ))}
    </div>
  )
}

function FormSection({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-4 space-y-3
                    hover:border-white/12 transition-colors duration-300">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
        {title}
      </p>
      {children}
    </div>
  )
}

export default function App() {
  const {
    idea, setIdea,
    language, setLanguage,
    visualStyle, setVisualStyle,
    image, setImage,
    result, variations,
    activeStrategy, setActiveStrategy,
    activeFormat, setActiveFormat,
    history, loading, error,
    credits, user,
    showPricing, pricingReason,
    openPricing, setShowPricing,
    handleGenerate, handleRegenerate, handleRetry, handleReset, handleSelectHistory,
    MAX_CHARS
  } = useAdGenerator()

  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    if (error && error.action !== 'pricing') {
      showToast(error.message, error.type, error.retryable ? handleRetry : null)
    }
  }, [error])

  return (
    <div className="min-h-screen text-white flex flex-col animate-gradient-bg relative overflow-hidden">

      {/* Orbes de fondo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-glow absolute -top-40 -left-40 w-96 h-96 rounded-full
                        bg-purple-600/15 blur-3xl" />
        <div className="animate-glow absolute top-1/2 -right-40 w-80 h-80 rounded-full
                        bg-purple-800/10 blur-3xl"
             style={{ animationDelay: '4s' }} />
        <div className="animate-glow absolute -bottom-40 left-1/3 w-72 h-72 rounded-full
                        bg-violet-700/10 blur-3xl"
             style={{ animationDelay: '8s' }} />
      </div>

      <FloatingIcons />

      <Navbar credits={credits} user={user} onOpenPricing={openPricing} />

      <main className="relative flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-lg space-y-6">

          {!loading && !result && (
            <div className="text-center space-y-4 animate-fadeIn pb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                              border border-purple-500/30 bg-purple-500/10 text-purple-300
                              text-xs font-medium mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                Powered by Gemini & Nano Banana 2
              </div>
              <h1 className="text-4xl font-semibold tracking-tight leading-tight"
                  style={{
                    background: 'linear-gradient(135deg, #f3e8ff 0%, #d8b4fe 40%, #a855f7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                Crea anuncios<br/>que venden
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Describe tu negocio y la IA genera el banner y el copy<br/>
                listo para publicar en redes sociales
              </p>
              <MetricsRow />
            </div>
          )}

          {loading ? (
            <PageTransition id="loading">
              <LoadingState format={{ id: 'instagram_square', ratio: '1:1' }} />
            </PageTransition>
          ) : result ? (
            <PageTransition id={result.id}>
              <div className="space-y-6">
                <ResultCard
                  result={result}
                  format={{ id: activeFormat }}
                  variations={variations}
                  activeStrategy={activeStrategy}
                  activeFormat={activeFormat}
                  onChangeStrategy={setActiveStrategy}
                  onChangeFormat={setActiveFormat}
                  onReset={handleReset}
                  onRegenerate={handleRegenerate}
                />
                <HistoryPanel
                  history={history}
                  onSelect={handleSelectHistory}
                  currentId={result.id}
                />
              </div>
            </PageTransition>
          ) : (
            <PageTransition id="form">
              <div className="space-y-4">

                <FormSection title="Tu negocio">
                  <IdeaInput
                    value={idea}
                    onChange={setIdea}
                    maxChars={MAX_CHARS}
                    image={image}
                    onImageChange={setImage}
                  />
                </FormSection>

                <FormSection title="Estilo visual">
                  <VisualStyleSelector selected={visualStyle} onChange={setVisualStyle} />
                </FormSection>

                <FormSection title="Idioma">
                  <LanguageSelector selected={language} onChange={setLanguage} />
                </FormSection>

                {error && (
                  <p className="text-sm text-red-400 text-center animate-fadeIn">{error.message}</p>
                )}

                <GenerateButton
                  onClick={handleGenerate}
                  loading={loading}
                  disabled={!idea.trim() || !language || !visualStyle}
                />

                <HistoryPanel
                  history={history}
                  onSelect={handleSelectHistory}
                  currentId={result?.id}
                />

              </div>
            </PageTransition>
          )}

        </div>
      </main>

      <footer className="relative w-full border-t border-white/6 px-6 py-4 text-center">
        <p className="text-xs text-gray-700">
          SapiensADS AI · Powered by Gemini & Nano Banana 2
        </p>
      </footer>

      <PricingModal
        open={showPricing}
        onClose={() => setShowPricing(false)}
        reason={pricingReason}
      />

      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          onRetry={toast.onRetry}
        />
      )}

    </div>
  )
}