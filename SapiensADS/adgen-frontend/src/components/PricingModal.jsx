import { createPortal } from 'react-dom'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    period: 'siempre gratis',
    generations: 3,
    description: 'Para probar la plataforma',
    features: [
      '3 anuncios al mes',
      'Formatos Instagram y Facebook',
      'Copy con IA',
      'Banner con diseño básico',
    ],
    cta: 'Tu plan actual',
    disabled: true,
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '199',
    period: 'al mes',
    generations: 30,
    description: 'Para negocios y freelancers',
    features: [
      '30 anuncios al mes',
      'Todos los formatos',
      'Copy + imagen con IA',
      'Banner profesional',
      'Descarga en alta resolución',
    ],
    cta: 'Comenzar Pro',
    disabled: false,
    highlighted: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '499',
    period: 'al mes',
    generations: 100,
    description: 'Para agencias y e-commerce',
    features: [
      '100 anuncios al mes',
      'Todos los formatos',
      'Copy + imagen con IA',
      'Banner profesional',
      'Descarga en alta resolución',
      'Historial completo',
    ],
    cta: 'Comenzar Business',
    disabled: false,
    highlighted: false,
  },
]

export default function PricingModal({ open, onClose, reason }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-3xl bg-gray-900 border border-white/10 rounded-2xl
                      overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/8">
          <div>
            {reason === 'limit' ? (
              <>
                <p className="text-xs text-red-400 uppercase tracking-widest font-medium mb-1">
                  Límite alcanzado
                </p>
                <h2 className="text-xl font-medium text-white">
                  Agotaste tus generaciones del mes
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Actualiza tu plan para seguir generando anuncios
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-purple-400 uppercase tracking-widest font-medium mb-1">
                  Planes
                </p>
                <h2 className="text-xl font-medium text-white">
                  Elige el plan que necesitas
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Cancela cuando quieras, sin compromisos
                </p>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition p-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`relative rounded-xl border p-5 flex flex-col gap-4 transition
                ${plan.highlighted
                  ? 'border-purple-500 bg-purple-500/8'
                  : 'border-white/8 bg-white/3'
                }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-600 text-white text-xs px-3 py-1
                                   rounded-full font-medium">
                    Más popular
                  </span>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-white">{plan.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                {plan.price === '0' ? (
                  <span className="text-3xl font-medium text-white">Gratis</span>
                ) : (
                  <>
                    <span className="text-xs text-gray-500">$</span>
                    <span className="text-3xl font-medium text-white">{plan.price}</span>
                    <span className="text-xs text-gray-500">MXN / {plan.period}</span>
                  </>
                )}
              </div>

              <ul className="space-y-2 flex-1">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round"
                         className="shrink-0 mt-0.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                disabled={plan.disabled}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition
                  ${plan.disabled
                    ? 'border border-white/10 text-gray-600 cursor-default'
                    : plan.highlighted
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'border border-white/15 text-gray-300 hover:bg-white/5'
                  }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-gray-600">
            Todos los planes incluyen acceso inmediato · Sin tarjeta para el plan Free
          </p>
        </div>

      </div>
    </div>
  )
}

export { PLANS }