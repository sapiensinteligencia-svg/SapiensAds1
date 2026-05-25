
import { useState } from 'react'
import AudioSelector from './AudioSelector'
import LoadingState from './LoadingState'
import VariationTabs from './VariationTabs'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy}
      className={`text-xs px-2 py-0.5 rounded border transition-all duration-200
        ${copied
          ? 'border-green-500/40 bg-green-500/10 text-green-400'
          : 'border-white/10 text-gray-600 hover:border-purple-500/30 hover:text-purple-400'
        }`}>
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  )
}

export default function ResultCard({ result, format, variations, activeStrategy, activeFormat, onChangeStrategy, onChangeFormat, onReset, onRegenerate }) {  const [audioOption, setAudioOption]             = useState({ id: 'music', label: 'Música' })
  const [customScript, setCustomScript]           = useState('')
  const [videoUrl, setVideoUrl]                   = useState(null)
  const [loadingVideo, setLoadingVideo]           = useState(false)
  const [videoError, setVideoError]               = useState(null)
  const [showSpotSection, setShowSpotSection]     = useState(false)
  const [activeTab, setActiveTab]                 = useState('banner')

const current = variations
  ? variations[activeStrategy]?.find(v => v.format.id === activeFormat) || variations[activeStrategy]?.[0]
  : result

const currentFormat = current?.format || format

  const copyAll = () => {
    const text = current.headline + '\n\n' + current.subheadline + '\n\n' + current.body + '\n\n' + current.cta
    navigator.clipboard.writeText(text)
  }

const previewClass = currentFormat.id === 'instagram_story'
  ? 'aspect-[9/16]'
  : currentFormat.id === 'facebook_post'
  ? 'aspect-video'
  : 'aspect-square'

  const handleDownload = async () => {
    const url      = activeTab === 'video' ? videoUrl : current.imageUrl
    const filename = activeTab === 'video' ? 'spot-sapiensads.mp4' : 'banner-sapiensads.png'
    if (!url) return
    try {
      const response = await fetch(url)
      const blob     = await response.blob()
      const blobUrl  = URL.createObjectURL(blob)
      const link     = document.createElement('a')
      link.href      = blobUrl
      link.download  = filename
      link.click()
      URL.revokeObjectURL(blobUrl)
    } catch {
      window.open(url, '_blank')
    }
  }

  const handleChangeVariation = (index) => {
    setVideoUrl(null)
    setActiveTab('banner')
    setShowSpotSection(false)
    onChangeVariation(index)
  }

  const handleGenerateVideo = async () => {
    setLoadingVideo(true)
    setVideoError(null)

    try {
      const img     = document.querySelector('img[alt="' + current.headline + '"]')
      const canvas  = document.createElement('canvas')
      canvas.width  = (img && img.naturalWidth)  || 1080
      canvas.height = (img && img.naturalHeight) || 1080
      const ctx     = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.85)

      const token  = localStorage.getItem('sapiensads_token')
      const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/generate-video'

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          imageBase64,
          imageMimeType:  'image/jpeg',
          idea:           result.idea,
          strategyId:     current.strategyId || (result.strategy && result.strategy.id) || 'impact',
          visualStyleId:  (result.visualStyle && result.visualStyle.id) || 'bold_product',
          langId:         (result.language    && result.language.id)    || 'es',
          audioType:      audioOption.id,
          customScript:   customScript,
          format:         JSON.stringify(format),
          copy:           JSON.stringify({
            headline:    current.headline,
            subheadline: current.subheadline,
            body:        current.body,
            cta:         current.cta,
          })
        })
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Error al generar el spot')
      }

      const data = await response.json()
      setVideoUrl(data.videoUrl)
      setActiveTab('video')
    } catch (err) {
      const status = err?.status || err?.response?.status
      if (status === 403) {
        setVideoError('No tienes créditos disponibles para generar el spot.')
      } else if (status === 503) {
        setVideoError('El modelo de video está ocupado. Intenta de nuevo en unos segundos.')
      } else if (err?.message?.includes('fetch')) {
        setVideoError('Sin conexión. Verifica tu internet e intenta de nuevo.')
      } else {
        setVideoError(err.message || 'Error al generar el spot. Intenta de nuevo.')
      }
    } finally {
      setLoadingVideo(false)
    }
  }

  return (
    <div className="space-y-4 animate-slideUp">

      <div className="flex items-center justify-between">
        <span className="text-xs text-purple-400 font-medium uppercase tracking-widest">
          Tu anuncio
        </span>
        <button onClick={copyAll}
          className="text-xs text-purple-400 border border-purple-500/30 px-3 py-1
                     rounded-md hover:bg-purple-500/10 transition">
          Copiar todo
        </button>
      </div>

      {variations && (
        <VariationTabs
          activeStrategy={activeStrategy}
          activeFormat={activeFormat}
          onChangeStrategy={(s) => { setVideoUrl(null); setActiveTab('banner'); onChangeStrategy(s) }}
          onChangeFormat={(f) => { setVideoUrl(null); setActiveTab('banner'); onChangeFormat(f) }}
        />
      )}

      {videoUrl && (
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('banner')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition
              ${activeTab === 'banner' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            🖼 Banner
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition
              ${activeTab === 'video' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            🎬 Spot
          </button>
        </div>
      )}

      <div
        className={`w-full ${previewClass} rounded-2xl overflow-hidden relative border border-purple-500/20`}
        style={{
          boxShadow: '0 8px 40px rgba(124, 58, 237, 0.25), 0 2px 8px rgba(0,0,0,0.4)',
          animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
      >
        {activeTab === 'banner' ? (
          current.imageUrl ? (
            <img
              src={current.imageUrl}
              alt={current.headline}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <p className="text-gray-600 text-sm">Sin imagen</p>
            </div>
          )
        ) : (
          videoUrl ? (
            <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
          ) : null
        )}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
      </div>

      <button
        onClick={handleDownload}
        className="w-full py-3 rounded-xl text-sm text-purple-300 border border-purple-500/30
                   hover:bg-purple-500/10 transition flex items-center justify-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        {activeTab === 'video' ? 'Descargar spot' : 'Descargar banner'}
      </button>

      <div className="border border-white/10 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowSpotSection(!showSpotSection)}
          className="w-full p-4 flex items-center justify-between bg-white/4 hover:bg-white/6 transition">
          <div className="flex items-center gap-3">
            <span className="text-lg">🎬</span>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Generar spot publicitario</p>
              <p className="text-xs text-gray-500">Video de 8 segundos con Veo 3.1 Lite</p>
            </div>
          </div>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#6b7280" strokeWidth="2" strokeLinecap="round"
            style={{
              transform: showSpotSection ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {showSpotSection && (
          <div className="p-4 space-y-4 border-t border-white/8">
            <AudioSelector
              selected={audioOption}
              onChange={setAudioOption}
              script={customScript}
              onScriptChange={setCustomScript}
            />
            {videoError && (
              <p className="text-sm text-red-400 text-center">{videoError}</p>
            )}
            {loadingVideo ? (
              <LoadingState format={format} isVideo={true} />
            ) : (
              <button
                onClick={handleGenerateVideo}
                className="w-full py-3.5 rounded-xl text-sm font-medium text-white
                           transition bg-purple-600 hover:bg-purple-700
                           flex items-center justify-center gap-2">
                🎬 Generar spot
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white/4 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Titular</p>
            <p className="text-base font-medium text-purple-200">{current.headline}</p>
          </div>
          <CopyButton text={current.headline} />
        </div>
        <div className="border-t border-white/6 pt-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Subtítulo</p>
            <p className="text-sm text-gray-300">{current.subheadline}</p>
          </div>
          <CopyButton text={current.subheadline} />
        </div>
        <div className="border-t border-white/6 pt-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Copy</p>
            <p className="text-sm text-gray-400 leading-relaxed">{current.body}</p>
          </div>
          <CopyButton text={current.body} />
        </div>
        <div className="border-t border-white/6 pt-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">CTA</p>
            <span className="inline-block bg-purple-600 text-white text-sm px-4 py-1.5 rounded-full">
              {current.cta}
            </span>
          </div>
          <CopyButton text={current.cta} />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onRegenerate}
          className="flex-1 py-3 rounded-xl text-sm text-purple-300 font-medium
                     border border-purple-500/30 hover:bg-purple-500/10 transition
                     flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 16H3v5"/>
          </svg>
          Regenerar
        </button>
        <button onClick={onReset}
          className="flex-1 py-3 rounded-xl text-sm text-gray-400
                     border border-white/10 hover:bg-white/5 transition">
          Nuevo anuncio
        </button>
      </div>

    </div>
  )
}