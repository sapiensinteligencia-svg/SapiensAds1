
const VARIATION_LABELS = [
  { id: 'impact',   label: 'Agresiva',  emoji: '💥', color: 'red'   },
  { id: 'solution', label: 'Neutro',    emoji: '🧠', color: 'blue'  },
  { id: 'emotion',  label: 'Urgencia',  emoji: '🚨', color: 'orange' },
]

const FORMAT_LABELS = [
  { id: 'instagram_square', label: '1:1',  icon: '▪️' },
  { id: 'instagram_story',  label: '9:16', icon: '📱' },
  { id: 'facebook_post',    label: '16:9', icon: '🖥️' },
]

const colorMap = {
  red:   'border-red-500 bg-red-500/15 text-red-300',
  blue:  'border-blue-500 bg-blue-500/15 text-blue-300',
  amber: 'border-amber-500 bg-amber-500/15 text-amber-300',
  orange: 'border-orange-500 bg-orange-500/15 text-orange-300',
}

const inactiveMap = {
  red:   'border-white/10 text-gray-500 hover:border-red-500/30 hover:text-red-400',
  blue:  'border-white/10 text-gray-500 hover:border-blue-500/30 hover:text-blue-400',
  amber: 'border-white/10 text-gray-500 hover:border-amber-500/30 hover:text-amber-400',
  orange: 'border-white/10 text-gray-500 hover:border-orange-500/30 hover:text-orange-400',
}

export default function VariationTabs({ activeStrategy, activeFormat, onChangeStrategy, onChangeFormat }) {
  return (
    <div className="space-y-3">

      {/* Tabs de estrategia */}
      <div className="space-y-1.5">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
          Estrategia
        </p>
        <div className="flex gap-2">
          {VARIATION_LABELS.map(v => (
            <button
              key={v.id}
              onClick={() => onChangeStrategy(v.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3
                          rounded-xl border text-xs font-medium transition-all duration-200
                          ${activeStrategy === v.id ? colorMap[v.color] : inactiveMap[v.color]}`}
            >
              <span>{v.emoji}</span>
              <span>{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selector de formato */}
      <div className="space-y-1.5">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
          Formato
        </p>
        <div className="flex gap-2">
          {FORMAT_LABELS.map(f => (
            <button
              key={f.id}
              onClick={() => onChangeFormat(f.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3
                          rounded-xl border text-xs font-medium transition-all duration-200
                          ${activeFormat === f.id
                            ? 'border-purple-500 bg-purple-500/15 text-purple-300'
                            : 'border-white/10 text-gray-500 hover:border-purple-500/30 hover:text-purple-400'
                          }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}