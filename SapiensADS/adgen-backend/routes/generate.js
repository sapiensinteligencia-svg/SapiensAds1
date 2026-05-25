
const express                             = require('express')
const router                              = express.Router()
const multer                              = require('multer')
const { generateAd, generateVideoScript, generateAdVariations } = require('../services/geminiService')
const { generateAdVideo }                 = require('../services/videoService')
const authMiddleware                      = require('../middleware/auth')

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten imágenes JPG, PNG o WebP'))
    }
  }
})

router.post('/generate', authMiddleware, upload.single('logo'), async (req, res) => {
  console.log('=== GENERATE REQUEST ===')
  console.log('Idea:', req.body.idea)
  console.log('Strategy:', req.body.strategy)
  console.log('Language:', req.body.language)
  console.log('VisualStyle:', req.body.visualStyle)
  console.log('Logo:', req.file ? req.file.originalname : 'ninguno')

  const { idea, strategy, language, visualStyle } = req.body
  const format = JSON.parse(req.body.format)
  const user   = req.user
  const logo   = req.file

  if (!idea || !idea.trim())
    return res.status(400).json({ error: 'El campo idea es requerido' })
  if (!format)
    return res.status(400).json({ error: 'El campo format es requerido' })
  if (user.credits <= 0)
    return res.status(403).json({ error: 'No tienes créditos disponibles' })

  try {
    const result = await generateAd(
      idea, format, logo,
      strategy    || 'impact',
      language    || 'es',
      visualStyle || 'bold_product'
    )

    user.credits -= 1
    await user.save()

    res.json({ ...result, creditsRemaining: user.credits })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al generar el anuncio' })
  }
})

router.post('/generate-video', authMiddleware, async (req, res) => {
  console.log('=== GENERATE VIDEO REQUEST ===')
  console.log('AudioType:', req.body.audioType)
  console.log('CustomScript recibido:', req.body.customScript)

  const {
    imageBase64, imageMimeType,
    idea, strategyId, visualStyleId,
    langId, audioType, customScript
  } = req.body

  const format = req.body.format ? JSON.parse(req.body.format) : { id: 'instagram_square' }
  const copy   = req.body.copy   ? JSON.parse(req.body.copy)   : {}
  const user   = req.user

  if (!imageBase64)
    return res.status(400).json({ error: 'Se requiere la imagen' })
  if (user.credits <= 0)
    return res.status(403).json({ error: 'No tienes créditos disponibles' })

  try {
    console.log('Generando guión con Gemini...')
    const script = await generateVideoScript(
      idea, copy,
      strategyId   || 'impact',
      langId       || 'es',
      audioType    || 'music',
      customScript || ''
    )

    console.log('=== GUIÓN GENERADO ===')
    console.log(JSON.stringify(script, null, 2))

    const videoUrl = await generateAdVideo({
      imageBase64,
      imageMimeType: imageMimeType || 'image/jpeg',
      videoPrompt:   script.videoPrompt,
      format,
      audioType:     audioType || 'music',
    })

    user.credits -= 1
    await user.save()

    res.json({
      videoUrl,
      script,
      creditsRemaining: user.credits
    })
  } catch (err) {
    console.error('Error generando video:', err)
    res.status(500).json({ error: 'Error al generar el spot' })
  }
})

router.post('/generate-variations', authMiddleware, upload.single('logo'), async (req, res) => {
  console.log('=== GENERATE VARIATIONS REQUEST ===')
  console.log('Idea:', req.body.idea)
  console.log('Language:', req.body.language)
  console.log('VisualStyle:', req.body.visualStyle)
  console.log('Logo:', req.file ? req.file.originalname : 'ninguno')

  const { idea, language, visualStyle } = req.body
  const user = req.user
  const logo = req.file

  if (!idea || !idea.trim())
    return res.status(400).json({ error: 'El campo idea es requerido' })
  if (user.credits <= 0)
    return res.status(403).json({ error: 'No tienes créditos disponibles' })

  try {
    const variations = await generateAdVariations(
      idea, logo,
      language    || 'es',
      visualStyle || 'bold_product'
    )

    user.credits -= 1
    await user.save()

    res.json({ variations, creditsRemaining: user.credits })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al generar las variaciones' })
  }
})

module.exports = router