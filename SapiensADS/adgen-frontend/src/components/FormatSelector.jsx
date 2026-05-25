const FORMATS = [
  {
    id: 'instagram_square',
    label: 'Instagram',
    sublabel: 'Post cuadrado',
    ratio: '1:1',
    width: 1080,
    height: 1080,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
    previewClass: 'aspect-square',
  },
  {
    id: 'instagram_story',
    label: 'Instagram',
    sublabel: 'Story vertical',
    ratio: '9:16',
    width: 1080,
    height: 1920,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
    previewClass: 'aspect-[9/16]',
  },
  {
    id: 'facebook_post',
    label: 'Facebook',
    sublabel: 'Post horizontal',
    ratio: '16:9',
    width: 1200,
    height: 628,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    previewClass: 'aspect-video',
  },
]

export { FORMATS }

export default function FormatSelector({ selected, onChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest">
        Formato del anuncio
      </label>
      <div className="grid grid-cols-3 gap-3">
        {FORMATS.map(format => (
          <button
            key={format.id}
            onClick={() => onChange(format)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition
              ${selected?.id === format.id
                ? 'border-purple-500 bg-purple-500/15 text-purple-300'
                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/8'
              }`}
          >
            <div className={`${selected?.id === format.id ? 'text-purple-400' : 'text-gray-500'}`}>
              {format.icon}
            </div>
            <div className="text-center">
              <p className="text-xs font-medium leading-tight">{format.label}</p>
              <p className="text-xs opacity-60 leading-tight">{format.sublabel}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border
              ${selected?.id === format.id
                ? 'border-purple-500/40 bg-purple-500/10 text-purple-400'
                : 'border-white/10 text-gray-600'
              }`}>
              {format.ratio}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}