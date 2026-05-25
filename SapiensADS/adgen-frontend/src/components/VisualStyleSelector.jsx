const VISUAL_STYLES = [
  {
    id: 'bold_product',
    name: 'Bold Product',
    description: 'Producto grande, fondo oscuro dramático',
    icon: '⚡',
  },
  {
    id: 'lifestyle_clean',
    name: 'Lifestyle',
    description: 'Personas con el producto, ambiente natural',
    icon: '🌿',
  },
  {
    id: 'minimalist_studio',
    name: 'Minimalista',
    description: 'Fondo neutro, producto centrado, premium',
    icon: '✦',
  },
  {
    id: 'gradient_vivid',
    name: 'Gradiente',
    description: 'Fondo vibrante, estética moderna',
    icon: '🎨',
  },
  {
    id: 'cinematic_dark',
    name: 'Cinemático',
    description: 'Iluminación dramática, lujo y gastronomía',
    icon: '🎬',
  },
]

export { VISUAL_STYLES }

export default function VisualStyleSelector({ selected, onChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest">
        Estilo visual
      </label>
      <div className="grid grid-cols-5 gap-2">
        {VISUAL_STYLES.map(style => (
          <button
            key={style.id}
            onClick={() => onChange(style)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition
              ${selected?.id === style.id
                ? 'border-purple-500 bg-purple-500/15 text-purple-300'
                : 'border-white/10 bg-white/4 text-gray-400 hover:border-white/20 hover:bg-white/6'
              }`}
          >
            <span className="text-xl">{style.icon}</span>
            <span className="text-xs font-medium leading-tight text-center">
              {style.name}
            </span>
          </button>
        ))}
      </div>
      {selected && (
        <p className="text-xs text-gray-600 text-center">{selected.description}</p>
      )}
    </div>
  )
}