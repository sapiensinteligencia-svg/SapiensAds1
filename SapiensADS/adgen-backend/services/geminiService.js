const { GoogleGenerativeAI } = require('@google/generative-ai')
const { generateAdImage }    = require('./ideogramService')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const LANGUAGE_CONFIG = {
  es: { name: 'español',   locale: 'es-MX' },
  en: { name: 'inglés',    locale: 'en-US' },
  pt: { name: 'portugués', locale: 'pt-BR' },
}

const VISUAL_STYLE_CONFIG = {
  bold_product: {
    name: 'Bold Product',
    prompt: (idea, cta, format, langName) => `
STYLE: Real photograph taken with a professional DSLR or medium format camera. 
This is NOT an illustration, NOT a 3D render, NOT a cartoon, NOT digital art.
This is a real studio photograph — photorealistic, tangible, physical, 8K resolution.
Shot on Phase One IQ4, Hasselblad H6D or Canon EOS R5. Looks like a real product in a real studio.

SUBJECT: ${idea} — this is the ONLY product or service in the image. Do NOT generate anything unrelated.

LIGHTING: Three-point professional studio lighting. Dramatic rim highlight from upper-left, fill light from right. Deep dark background (rich black or midnight navy). Subject elevated with perfect specular reflections underneath. Smoke or steam if relevant.

SCENE: The ${idea} product or service is the absolute HERO — large, centered, dramatically lit. Every surface texture perfectly visible. Shallow depth of field creates smooth dark bokeh background. Dynamic diagonal composition with powerful energy.

CTA OVERLAY — floating above the scene, not printed on any product:
- Display the text "${cta}" as a floating text element above the photographic scene
- Style: bold bright typography floating in the lower portion of the image, with a strong drop shadow separating it from the background
- It must look like a post-production text layer added on top of the photo, NOT part of the physical scene
- Creative freedom on exact position, rotation, size and font weight — but clearly readable and visually separate from the products
- Text in ${langName}, spelled PERFECTLY, no typos

NO other text anywhere. No headlines, no subheadlines, no logos, no watermarks, no product labels with text.
Fill the ENTIRE canvas. Professional advertising agency quality.
FORMAT: ${format.ratio} — ${format.label} ${format.sublabel}
    `.trim(),
  },

  lifestyle_clean: {
    name: 'Lifestyle Clean',
    prompt: (idea, cta, format, langName) => `
Hyperrealistic lifestyle commercial photography. Editorial magazine quality, authentic candid feel, 8K resolution.

SUBJECT: ${idea} — this is the ONLY product or service in the image. Do NOT generate anything unrelated.

LIGHTING: Natural golden hour sunlight from left, warm soft shadows. Completely natural and unposed feel.

SCENE: A real person using the ${idea} product — but the PRODUCT is the clear visual hero, not the person. The product must be large, sharp, and prominently featured in the foreground. The woman's hands and hair are visible but slightly secondary — they provide context and lifestyle feel without overshadowing the product. The product is in sharp focus, the person and background are softly blurred into warm bokeh. Think of how GHD or Dyson shoots their lifestyle ads — the tool is always the star, the person provides the aspirational context. Warm golden hour light, authentic candid feel, but the product dominates the frame.

CTA OVERLAY — floating above the scene, not printed on any surface:
- Display the text "${cta}" as a floating text element above the photographic scene
- Style: warm friendly typography floating naturally over the image, with a soft semi-transparent pill background or subtle shadow
- It must look like a post-production text layer added on top of the photo, NOT part of the physical scene
- Creative freedom on exact position and font style — warm, approachable, editorial feel
- Text in ${langName}, spelled PERFECTLY, no typos

NO other text anywhere. No headlines, no subheadlines, no logos, no watermarks.
Fill the ENTIRE canvas. Real lifestyle brand campaign quality.
FORMAT: ${format.ratio} — ${format.label} ${format.sublabel}
    `.trim(),
  },

  minimalist_studio: {
    name: 'Minimalist Studio',
    prompt: (idea, cta, format, langName) => `
Hyperrealistic minimalist commercial still life photography. Luxury product catalog quality, clinical sharpness, 8K resolution.

SUBJECT: ${idea} — this is the ONLY product or service in the image. Do NOT generate anything unrelated.

LIGHTING: Single large softbox directly overhead, soft even illumination, zero harsh shadows. Pure white or very light gray seamless background. Single perfect soft shadow at base.

SCENE: The ${idea} sits perfectly centered on a flawless surface. Every material detail rendered with photographic precision. Generous white space. Clinical, precise, premium. Ultra-luxury brand catalog aesthetic.

CTA OVERLAY — floating above the scene, not printed on any surface:
- Display the text "${cta}" as a floating text element above the photographic scene
- Style: thin elegant typography floating in the lower area, with generous space around it
- It must look like a post-production text layer added on top of the photo, NOT part of the physical scene
- Creative freedom on exact position — minimal, sophisticated, premium feel
- Text in ${langName}, spelled PERFECTLY, no typos

NO other text anywhere. No headlines, no subheadlines, no logos, no watermarks.
Fill the ENTIRE canvas. Luxury brand catalog quality.
FORMAT: ${format.ratio} — ${format.label} ${format.sublabel}
    `.trim(),
  },

  gradient_vivid: {
    name: 'Gradient Vivid',
    prompt: (idea, cta, format, langName) => `
Hyperrealistic digital-physical hybrid commercial photography. Mixed studio and colored LED panel lighting, 8K resolution.

SUBJECT: ${idea} — this is the ONLY product or service in the image. Do NOT generate anything unrelated.

LIGHTING: Multiple colored LED panels creating real physical color gradients (vivid purple-to-pink or cyan-to-blue or orange-to-yellow). Real lights in a real studio. Colored light wraps around the subject with natural color bleeding on surfaces.

SCENE: The ${idea} is the centerpiece surrounded by real physical abstract elements — colored acrylic shapes, glass prisms, geometric mirrors catching and refracting colored LED light. Background wall bathed in vivid gradient from practical lights. Trendy, energetic, contemporary.

CTA OVERLAY — floating above the scene, not printed on any object:
- Display the text "${cta}" as a floating text element above the photographic scene
- Style: bold vivid typography floating dynamically over the image, with neon glow or bright color treatment
- It must look like a post-production text layer added on top of the photo, NOT part of the physical scene
- Creative freedom on position and angle — energetic, modern, eye-catching
- Text in ${langName}, spelled PERFECTLY, no typos

NO other text anywhere. No headlines, no subheadlines, no logos, no watermarks.
Fill the ENTIRE canvas. Real studio photography with practical lighting effects.
FORMAT: ${format.ratio} — ${format.label} ${format.sublabel}
    `.trim(),
  },

  cinematic_dark: {
    name: 'Cinematic Dark',
    prompt: (idea, cta, format, langName) => `
Hyperrealistic cinematic luxury commercial photography. Single dramatic key light, cinema camera quality, 8K resolution.

SUBJECT: ${idea} — this is the ONLY product or service in the image. Do NOT generate anything unrelated.

LIGHTING: Single hard key light from upper-left at 45 degrees. Deep dramatic shadows across 60% of frame. Subject catches brilliant specular highlight. Subtle backlight rim from behind. Real atmospheric haze or smoke in the air catching light rays.

SCENE: The ${idea} emerges from deep darkness, dramatically lit. Background almost entirely black with subtle texture — dark wood, aged marble, or brushed dark metal. Real atmospheric smoke drifts through air. Gold and copper reflections on surfaces. Ultra-premium, cinematic luxury.

CTA OVERLAY — floating above the scene, not printed on any surface:
- Display the text "${cta}" as a floating text element above the photographic scene
- Style: elegant gold or white typography floating dramatically over the dark scene, with subtle glow
- It must look like a post-production text layer added on top of the photo, NOT part of the physical scene
- Creative freedom on position — cinematic, luxury, dramatic feel
- Text in ${langName}, spelled PERFECTLY, no typos

NO other text anywhere. No headlines, no subheadlines, no logos, no watermarks.
Fill the ENTIRE canvas. Real luxury cinema commercial frame quality.
FORMAT: ${format.ratio} — ${format.label} ${format.sublabel}
    `.trim(),
  },
}

const STRATEGY_COPY = {
  // Venta agresiva
  impact: (idea, format, langName) => `
Eres experto en copywriting publicitario para Meta Ads en México.
NEGOCIO: ${idea}
Genera copy publicitario en ${langName} con ESTRATEGIA DE VENTA AGRESIVA Y ALTA ENERGÍA.
IMPORTANTE: NO uses palabras prohibidas: adelgaza, cura, trata, baja de peso,
transforma tu cuerpo, gana dinero, ingreso pasivo, resultados garantizados de salud,
suplemento, antes y después corporal. Solo vende el SERVICIO y la EXPERIENCIA.
Formato del anuncio: ${format.ratio} (${format.label} ${format.sublabel})
Responde SOLO este JSON sin texto extra:
{
  "headline": "TITULAR agresivo de alta energía, máximo 6 palabras, 2-3 emojis estratégicos 💥👊🔥",
  "subheadline": "Frase de impacto directo que golpea al cliente, máximo 10 palabras",
  "body": "Copy de venta agresiva, 180-250 caracteres, 4-6 emojis 💥👊🔥⚡, hook poderoso + beneficio contundente + precio o valor + CTA directo",
  "cta": "CTA directo y poderoso, máximo 4 palabras"
}`.trim(),

  // Neutro/Profesional
  solution: (idea, format, langName) => `
Eres experto en copywriting publicitario para Meta Ads en México.
NEGOCIO: ${idea}
Genera copy publicitario en ${langName} con ESTRATEGIA NEUTRA Y PROFESIONAL.
IMPORTANTE: NO uses palabras prohibidas: adelgaza, cura, trata, baja de peso,
transforma tu cuerpo, gana dinero, ingreso pasivo, resultados garantizados de salud,
suplemento, antes y después corporal. Solo vende el SERVICIO y la EXPERIENCIA.
Formato del anuncio: ${format.ratio} (${format.label} ${format.sublabel})
Responde SOLO este JSON sin texto extra:
{
  "headline": "Titular profesional y claro, máximo 6 palabras, 0-1 emojis sutiles",
  "subheadline": "Beneficio principal del servicio, tono confiable, máximo 10 palabras",
  "body": "Copy neutro y profesional, 80-120 caracteres, 0-2 emojis sutiles, beneficio + propuesta de valor + CTA suave",
  "cta": "CTA suave y profesional, máximo 4 palabras"
}`.trim(),

  // Sentido de urgencia
  emotion: (idea, format, langName) => `
Eres experto en copywriting publicitario para Meta Ads en México.
NEGOCIO: ${idea}
Genera copy publicitario en ${langName} con ESTRATEGIA DE SENTIDO DE URGENCIA EXTREMA Y FOMO.
IMPORTANTE: NO uses palabras prohibidas: adelgaza, cura, trata, baja de peso,
transforma tu cuerpo, gana dinero, ingreso pasivo, resultados garantizados de salud,
suplemento, antes y después corporal. Solo vende el SERVICIO y la EXPERIENCIA.
Formato del anuncio: ${format.ratio} (${format.label} ${format.sublabel})
Responde SOLO este JSON sin texto extra:
{
  "headline": "TITULAR con MÁXIMA urgencia y FOMO, máximo 6 palabras, emojis 🚨⏰🔥",
  "subheadline": "Consecuencia de NO actuar ahora, máximo 10 palabras",
  "body": "Copy de urgencia extrema, 150-200 caracteres, 3-4 emojis 🚨⏰🔥💥, deadline real + escasez + consecuencia + CTA inmediato",
  "cta": "CTA de acción inmediata, máximo 4 palabras"
}`.trim(),
}

function buildImagePrompt(idea, headline, cta, subheadline, visualStyleId, langId, strategyId, format) {
  const vs   = VISUAL_STYLE_CONFIG[visualStyleId] || VISUAL_STYLE_CONFIG.bold_product
  const lang = LANGUAGE_CONFIG[langId]            || LANGUAGE_CONFIG.es
  return vs.prompt(idea, cta, format, lang.name)
}

async function generateAd(idea, format, logo, strategyId = 'impact', langId = 'es', visualStyleId = 'bold_product') {
  const model  = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const lang   = LANGUAGE_CONFIG[langId]   || LANGUAGE_CONFIG.es
  const copyFn = STRATEGY_COPY[strategyId] || STRATEGY_COPY.impact

  const result = await model.generateContent(copyFn(idea, format, lang.name))
  const text   = result.response.text()
  const clean  = text.replace(/```json|```/g, '').trim()
  const copy   = JSON.parse(clean)

  console.log('=== COPY GENERADO ===')
  console.log(copy)

  const imagePrompt = buildImagePrompt(
    idea, copy.headline, copy.cta, copy.subheadline,
    visualStyleId, langId, strategyId, format
  )

  const imageUrl = await generateAdImage({
    imagePrompt,
    format,
    logo,
  })

  return { ...copy, imageUrl }
}

async function generateCopy(idea, format, langName, strategyId) {
  const model  = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const copyFn = STRATEGY_COPY[strategyId] || STRATEGY_COPY.impact

  const result = await model.generateContent(copyFn(idea, format, langName))
  const text   = result.response.text()
  const clean  = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

async function generateAdVariations(idea, logo, langId = 'es', visualStyleId = 'bold_product') {
  const lang    = LANGUAGE_CONFIG[langId] || LANGUAGE_CONFIG.es
  const formats = [
    { id: 'instagram_square', width: 1080, height: 1080, ratio: '1:1',  label: 'Instagram', sublabel: 'Post cuadrado'   },
    { id: 'instagram_story',  width: 1080, height: 1920, ratio: '9:16', label: 'Instagram', sublabel: 'Story vertical'  },
    { id: 'facebook_post',    width: 1200, height: 628,  ratio: '16:9', label: 'Facebook',  sublabel: 'Post horizontal' },
  ]
  const strategies = ['impact', 'solution', 'emotion']

  const copyPromises = strategies.flatMap(strategyId =>
    formats.map(format =>
      generateCopy(idea, format, lang.name, strategyId).then(copy => ({
        ...copy,
        strategyId,
        format,
      }))
    )
  )
  const allCopies = await Promise.all(copyPromises)

  const imagePromises = allCopies.map(copy =>
    generateAdImage({
      imagePrompt: buildImagePrompt(
        idea, copy.headline, copy.cta, copy.subheadline,
        visualStyleId, langId, copy.strategyId, copy.format
      ),
      format: copy.format,
      logo,
    }).then(imageUrl => ({ ...copy, imageUrl }))
  )
  const allVariations = await Promise.all(imagePromises)

  const grouped = {}
  strategies.forEach(strategyId => {
    grouped[strategyId] = allVariations.filter(v => v.strategyId === strategyId)
  })

  return grouped
}

async function generateVideoScript(idea, copy, strategyId, langId, audioType, customScript) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const lang  = LANGUAGE_CONFIG[langId] || LANGUAGE_CONFIG.es

  const strategyTone = {
    impact:   'agresivo y de alta energía, venta directa y poderosa',
    solution: 'profesional y confiable, claro y neutro',
    emotion:  'urgente con FOMO extremo, sensación de escasez y deadline',
  }

  const hasCustomScript = customScript && customScript.trim().length > 0

  const scriptInstructions = hasCustomScript
    ? `
GUIÓN PERSONALIZADO DEL CLIENTE (usa esto como narración principal):
"${customScript.trim()}"
REGLAS PARA EL GUIÓN DEL CLIENTE:
- USA EXACTAMENTE este texto como la narración del video
- Solo corrige errores ortográficos obvios, NO cambies el mensaje
- NO lo reemplaces con otro texto
- NO lo combines con el copy del banner
- Adapta el ritmo para que quepa en 8 segundos si es necesario
    `.trim()
    : `
NARRACIÓN AUTOMÁTICA:
- Genera una narración basándote en el copy del anuncio
- Titular: "${copy.headline}"
- Subtítulo: "${copy.subheadline}"
- CTA: "${copy.cta}"
    `.trim()

  const audioInstructions = audioType === 'voice'
    ? 'AUDIO: Voz en off únicamente. El narrador debe decir exactamente el guión proporcionado.'
    : 'AUDIO: Música de fondo instrumental solamente. Sin narración ni voz.'

  const prompt = `
Eres un director creativo experto en spots publicitarios.
Genera el videoPrompt para un spot publicitario.

NEGOCIO: ${idea}
TONO: ${strategyTone[strategyId] || strategyTone.impact}
IDIOMA DE LA NARRACIÓN: ${lang.name}
${audioInstructions}

${scriptInstructions}

INSTRUCCIONES DE CÁMARA:
- La cámara se mueve suavemente alrededor de una escena estática
- Movimientos lentos y elegantes: pan suave, zoom lento, traveling circular
- Sin cortes bruscos, una sola escena continua de 8 segundos

Responde SOLO este JSON sin texto extra:
{
  "fullNarration": "${hasCustomScript ? customScript.trim() : 'narración generada automáticamente'}",
  "musicDescription": "descripción del tipo de música ideal (vacío si es solo voz)",
  "videoPrompt": "prompt completo en inglés para Veo 3.1 Lite incluyendo: movimientos de cámara suaves, descripción visual del producto/negocio, iluminación, ambiente${audioType === 'voice' ? ', y voice over con la narración exacta entre comillas' : ', y descripción de la música de fondo'}"
}
  `.trim()

  console.log('=== SCRIPT INSTRUCTIONS ===')
  console.log(scriptInstructions)

  const result = await model.generateContent(prompt)
  const text   = result.response.text()
  const clean  = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

module.exports = { generateAd, generateVideoScript, generateAdVariations }