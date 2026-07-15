
import { useState, useCallback, useEffect } from 'react'
import { generateVariations, getMe } from '../services/api'
import { STRATEGIES } from '../components/StrategySelector'
import { LANGUAGES } from '../components/LanguageSelector'
import { VISUAL_STYLES } from '../components/VisualStyleSelector'
import { parseApiError } from '../utils/errorHandler'

export function useAdGenerator() {
  const [idea, setIdea]               = useState('')
  const [language, setLanguage]       = useState(LANGUAGES[0])
  const [visualStyle, setVisualStyle] = useState(VISUAL_STYLES[0])
  const [image, setImage]             = useState(null)
  const [result, setResult]           = useState(null)
  const [variations, setVariations]   = useState(null)
  const [activeStrategy, setActiveStrategy] = useState('impact')
  const [activeFormat, setActiveFormat]     = useState('instagram_square')
  const [history, setHistory]         = useState([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [credits, setCredits]         = useState(null)
  const [user, setUser]               = useState(null)
  const [showPricing, setShowPricing] = useState(false)
  const [pricingReason, setPricingReason] = useState('manual')
  const MAX_CHARS = 300

  useEffect(() => {
    const token = localStorage.getItem('sapiensads_token')
    if (!token) return
    getMe()
      .then(data => {
        setCredits(data.credits)
        setUser(data)
        localStorage.setItem('sapiensads_user', JSON.stringify(data))
      })
      .catch(() => {})
  }, [])

  const openPricing = (reason = 'manual') => {
    setPricingReason(reason)
    setShowPricing(true)
  }

  const generate = useCallback(async (currentIdea, currentLanguage, currentVisualStyle, currentImage) => {
    if (!localStorage.getItem('sapiensads_token')) {
      window.location.href = '/register'
      return
    }
    if (credits !== null && credits <= 0) { openPricing('limit'); return }
    setLoading(true)
    setError(null)
    try {
      const data = await generateVariations(
        currentIdea, currentLanguage, currentVisualStyle, currentImage
      )

      setVariations(data.variations)
      setActiveStrategy('impact')
      setActiveFormat('instagram_square')

      const entry = {
        variations:  data.variations,
        idea:        currentIdea,
        language:    currentLanguage,
        visualStyle: currentVisualStyle,
        id:          Date.now()
      }
      setResult(entry)
      setHistory(prev => [entry, ...prev])

      if (data.creditsRemaining !== undefined) {
        setCredits(data.creditsRemaining)
      } else {
        setCredits(prev => prev - 1)
      }
    } catch (err) {
      const status = err?.response?.status || err?.status
      const parsed = parseApiError(err, status)
      setError({ ...parsed, raw: err })
      if (parsed.action === 'pricing') openPricing('limit')
      if (parsed.action === 'logout') {
        localStorage.removeItem('sapiensads_token')
        localStorage.removeItem('sapiensads_user')
        window.location.href = '/login'
      }
    } finally {
      setLoading(false)
    }
  }, [credits])

  const handleGenerate   = () => generate(idea, language, visualStyle, image)
  const handleRegenerate = () => generate(result.idea, result.language, result.visualStyle, null)
  const handleRetry      = () => generate(idea, language, visualStyle, image)

  const handleReset = () => {
    setResult(null)
    setVariations(null)
    setActiveStrategy('impact')
    setActiveFormat('instagram_square')
    setIdea('')
    setError(null)
  }

  const handleSelectHistory = (entry) => {
    setResult(entry)
    if (entry.variations)   setVariations(entry.variations)
    if (entry.language)     setLanguage(entry.language)
    if (entry.visualStyle)  setVisualStyle(entry.visualStyle)
  }

  return {
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
    MAX_CHARS,
  }
}