const AUDIO_OPTIONS = [
  {
    id: 'music',
    label: 'Música',
    description: 'Música de fondo según el estilo visual',
    icon: '🎵',
  },
  {
    id: 'voice',
    label: 'Voz en off',
    description: 'Narrador lee el guión del anuncio',
    icon: '🎙️',
  },
]

export { AUDIO_OPTIONS }

export default function AudioSelector({ selected, onChange, script, onScriptChange }) {
  const showScriptField = selected?.id === 'voice'

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest">
        Audio del spot
      </label>
      <div className="grid grid-cols-2 gap-2">
        {AUDIO_OPTIONS.map(option => (
          <button
            key={option.id}
            onClick={() => onChange(option)}
            className={`flex items-center gap-3 p-3 rounded-xl border transition text-left
              ${selected?.id === option.id
                ? 'border-purple-500 bg-purple-500/15 text-purple-300'
                : 'border-white/10 bg-white/4 text-gray-400 hover:border-white/20 hover:bg-white/6'
              }`}
          >
            <span className="text-xl shrink-0">{option.icon}</span>
            <div className="min-w-0">
              <p className={`text-sm font-medium
                ${selected?.id === option.id ? 'text-purple-200' : 'text-gray-300'}`}>
                {option.label}
              </p>
              <p className="text-xs text-gray-600 leading-tight">{option.description}</p>
            </div>
          </button>
        ))}
      </div>

      {showScriptField && (
        <div className="space-y-2 animate-fadeIn">
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest">
            Guión de narración
            <span className="ml-2 text-gray-600 normal-case tracking-normal font-normal">
              — opcional
            </span>
          </label>
          <textarea
            value={script}
            onChange={e => onScriptChange(e.target.value)}
            placeholder="Escribe lo que quieres que diga el narrador... La IA corregirá la ortografía y adaptará el ritmo."
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                       text-white placeholder-gray-600 resize-none focus:outline-none
                       focus:border-purple-500 text-sm leading-relaxed transition"
          />
          <p className="text-xs text-gray-600">
            Si lo dejas vacío la IA genera la narración automáticamente.
          </p>
        </div>
      )}
    </div>
  )
}