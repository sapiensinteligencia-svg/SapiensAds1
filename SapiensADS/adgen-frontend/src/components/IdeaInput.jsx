import { useState, useRef } from 'react'

const EXAMPLES = [
  'Tacos artesanales en Chicago',
  'Ropa deportiva online',
  'Clínica dental en CDMX',
  'Café artesanal con envío',
]

export default function IdeaInput({ value, onChange, maxChars, onImageChange, image }) {
  const fileRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Solo se permiten imágenes JPG, PNG o WebP')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede pesar más de 5MB')
      return
    }
    onImageChange(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const syntheticEvent = { target: { files: [file] } }
      handleFile(syntheticEvent)
    }
  }

  return (
    <div className="space-y-4">

      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest">
          Describe tu negocio
        </label>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value.slice(0, maxChars))}
          placeholder='Ej: "vendo tacos artesanales en Chicago, quiero atraer clientes en Instagram..."'
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                     placeholder-gray-600 resize-none focus:outline-none focus:border-purple-500
                     text-sm leading-relaxed transition"
        />
        <p className={`text-right text-xs ${value.length >= maxChars ? 'text-red-400' : 'text-gray-600'}`}>
          {value.length} / {maxChars}
        </p>
      </div>

      {/* Subida de logo */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest">
          Logo del negocio
          <span className="ml-2 text-gray-600 normal-case tracking-normal font-normal">
            — opcional
          </span>
        </label>

        {image ? (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10
                          rounded-xl px-4 py-3">
            <img
              src={URL.createObjectURL(image)}
              alt="Logo"
              className="w-10 h-10 object-contain rounded-lg border border-white/10 bg-black/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{image.name}</p>
              <p className="text-xs text-gray-500">
                {(image.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <button
              onClick={() => { onImageChange(null); fileRef.current.value = '' }}
              className="text-gray-500 hover:text-white transition p-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current.click()}
            className="border border-dashed border-white/15 rounded-xl px-4 py-5
                       flex flex-col items-center gap-2 cursor-pointer
                       hover:border-purple-500/40 hover:bg-purple-500/5 transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p className="text-xs text-gray-500 text-center">
              Arrastra tu logo aquí o{' '}
              <span className="text-purple-400">haz clic para seleccionar</span>
            </p>
            <p className="text-xs text-gray-600">JPG, PNG o WebP — máx. 5MB</p>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Ejemplos rápidos</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => onChange(ex)}
              className="text-xs px-3 py-1.5 rounded-full border border-purple-500/30
                         bg-purple-500/10 text-purple-300 hover:bg-purple-500/25 transition"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}