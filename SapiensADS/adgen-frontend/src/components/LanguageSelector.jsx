const LANGUAGES = [
  { id: 'es', label: 'Español', flag: '🇲🇽' },
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'pt', label: 'Português', flag: '🇧🇷' },
]

export { LANGUAGES }

export default function LanguageSelector({ selected, onChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest">
        Idioma del banner
      </label>
      <div className="flex gap-3">
        {LANGUAGES.map(lang => (
          <button
            key={lang.id}
            onClick={() => onChange(lang)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                        border transition text-sm
              ${selected?.id === lang.id
                ? 'border-purple-500 bg-purple-500/15 text-purple-300'
                : 'border-white/10 bg-white/4 text-gray-400 hover:border-white/20 hover:bg-white/6'
              }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}