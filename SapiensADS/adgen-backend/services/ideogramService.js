const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const MAX_INTENTOS = 3

async function generateAdImage({ imagePrompt, format, logo }) {
  console.log('=== NANO BANANA 2 ===')
  console.log('Prompt:', imagePrompt.substring(0, 100))
  console.log('Logo:', logo ? 'sí' : 'no')

  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-image-preview',
  })

  const aspectRatio = format.id === 'instagram_story'
    ? '9:16'
    : format.id === 'facebook_post'
    ? '16:9'
    : '1:1'

  const parts = []

  if (logo) {
    const base64Logo = logo.buffer.toString('base64')
    parts.push({
      inlineData: {
        mimeType: logo.mimetype,
        data: base64Logo,
      }
    })
    parts.push({
      text: `Use this logo as a reference. Integrate it naturally into the advertising banner design. Place it in a visible but non-intrusive position (top corner or bottom corner). Maintain the logo's original colors and design.\n\n${imagePrompt}`
    })
  } else {
    parts.push({ text: imagePrompt })
  }

  // El modelo se niega de forma intermitente a rotular el CTA sobre la imagen y
  // responde con texto explicando por que. Con el mismo prompt suele funcionar
  // al reintentar, asi que se insiste antes de darlo por fallido.
  let ultimaRespuesta = null

  for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
    const response = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        responseModalities: ['image', 'text'],
        imageConfig: { aspectRatio }
      }
    })

    const candidates = response.response.candidates

    if (!candidates || candidates.length === 0) {
      ultimaRespuesta = 'la API no devolvió candidatos'
      console.warn(`Intento ${intento}/${MAX_INTENTOS}: sin candidatos`)
      continue
    }

    const responseParts = candidates[0].content.parts || []
    const imagePart     = responseParts.find(p => p.inlineData)

    if (imagePart)
      return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`

    // Sin imagen: el motivo viene en la parte de texto, hay que conservarlo
    ultimaRespuesta = responseParts.find(p => p.text)?.text?.trim() || `finishReason: ${candidates[0].finishReason}`
    console.warn(`Intento ${intento}/${MAX_INTENTOS}: respondió texto en vez de imagen — ${ultimaRespuesta.slice(0, 150)}`)
  }

  throw new Error(
    `Nano Banana 2 no generó imagen tras ${MAX_INTENTOS} intentos. ` +
    `Última respuesta del modelo: ${ultimaRespuesta}`
  )
}

module.exports = { generateAdImage }