
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
  prompt: (idea, headline, subheadline, cta, format, langName) => `
SUBJECT — THE ONLY PRODUCT OR SERVICE IN THIS IMAGE: ${idea}
DO NOT generate cameras, generic products, skincare items, or any object unrelated to: ${idea}

Hyperrealistic commercial photography. Photorealistic, 8K resolution, ultra-sharp details, zero CGI feel.

LIGHTING SETUP: Three-point professional studio lighting — dramatic rim highlights from upper-left, fill light from right, hair light from behind. Deep dark background (rich black or midnight navy). The subject elevated on invisible surface with perfect specular reflections underneath.

SCENE: The ${idea} product or service visual sits center-frame, dramatically lit, every surface texture visible. Shallow depth of field blurs background into smooth bokeh. Smoke or steam rising naturally if relevant to ${idea}.

TEXT OVERLAY ELEMENTS (rendered as physical light projections on the scene):
- Upper portion: the text "${headline}" projected as crisp white light-painted typography on the dark background — slightly glowing at edges, uppercase, heavy weight.
- Top-right corner: a small frosted glass square with the text "TU LOGO AQUÍ" etched in white — looks like a premium frosted label.
- Lower-center: the text "${subheadline}" as soft white light-painted text on the dark background, medium weight, clean modern typeface.
- Bottom: the text "${cta}" inside a physical glowing pill-shaped neon tube — warm red or amber neon with realistic glow and tube shadows.

CRITICAL RULES:
- Fill the ENTIRE canvas. No blank or gray areas anywhere.
- The subject is EXCLUSIVELY: ${idea} — nothing else.
- Do NOT print the words "TOP SECTION", "MIDDLE SECTION", "BOTTOM SECTION", "headline", "subheadline".
- This must look like a real professional studio photograph.

FORMAT: ${format.ratio} — ${format.label} ${format.sublabel}
  `.trim(),
  },

  lifestyle_clean: {
  name: 'Lifestyle Clean',
  prompt: (idea, headline, subheadline, cta, format, langName) => `
SUBJECT — THE ONLY PRODUCT OR SERVICE IN THIS IMAGE: ${idea}
DO NOT generate cameras, generic products, skincare items, or any object unrelated to: ${idea}

Hyperrealistic lifestyle commercial photography. Editorial magazine quality, authentic candid feel, 8K resolution.

LIGHTING SETUP: Natural golden hour sunlight from the left, warm soft shadows, white bounce card on the right. Completely natural and unposed feel.

SCENE: Real people authentically using or enjoying ${idea} in a warm real-world environment — a sunlit space relevant to ${idea}. Candid expressions, natural body language. Background blurred into creamy bokeh. Warm color grade: lifted shadows, golden highlights.

TEXT OVERLAY ELEMENTS (integrated naturally into the photograph):
- Upper portion: the text "${headline}" on a frosted semi-transparent film strip — physical acetate with clean white typography, soft drop shadow.
- Top-right corner: a small frosted glass square with the text "TU LOGO AQUÍ" — like a physical sticker on frosted glass.
- Mid-lower area: the text "${subheadline}" on a thin semi-transparent warm dark bar — like a lower-third on a high-end TV commercial.
- Bottom: the text "${cta}" inside a physical coral or warm terracotta pill — like a real painted wooden sign with text screenprinted in white.

CRITICAL RULES:
- Fill the ENTIRE canvas. No blank or gray areas anywhere.
- The subject is EXCLUSIVELY: ${idea} — nothing else.
- Do NOT print the words "TOP SECTION", "MIDDLE SECTION", "BOTTOM SECTION", "headline", "subheadline".
- This must look like a real lifestyle brand campaign photograph.

FORMAT: ${format.ratio} — ${format.label} ${format.sublabel}
  `.trim(),
  },

  minimalist_studio: {
  name: 'Minimalist Studio',
  prompt: (idea, headline, subheadline, cta, format, langName) => `
SUBJECT — THE ONLY PRODUCT OR SERVICE IN THIS IMAGE: ${idea}
DO NOT generate cameras, generic products, skincare items, or any object unrelated to: ${idea}

Hyperrealistic minimalist commercial still life photography. Luxury product catalog quality, clinical sharpness, 8K resolution.

LIGHTING SETUP: Single large softbox directly overhead, soft even illumination, zero harsh shadows. Pure white seamless paper background. The subject casts a single perfect soft shadow at its base — the only shadow in frame.

SCENE: The ${idea} product sits on a flawless white surface, perfectly centered. Every material detail rendered with photographic precision — textures, labels, finishes, edges. Generous empty white space surrounds the subject. Clinical, precise, premium.

TEXT OVERLAY ELEMENTS (printed directly on the white surface — visible paper texture under the ink):
- Upper area: the text "${headline}" printed in dark charcoal thin-weight typography — ink sits slightly on paper surface, micro-texture visible.
- Top-right corner: a small thin-bordered square with the text "TU LOGO AQUÍ" in minimal gray letters — like a real placeholder printed on a product sheet.
- Below the subject: the text "${subheadline}" printed in medium gray, same paper-ink texture, elegant tracking.
- Bottom: the text "${cta}" inside a minimal dark-outlined pill shape drawn on the paper — like a designer's annotation on a real product sheet.

CRITICAL RULES:
- Fill the ENTIRE canvas. No blank or gray areas anywhere.
- The subject is EXCLUSIVELY: ${idea} — nothing else.
- Do NOT print the words "TOP SECTION", "MIDDLE SECTION", "BOTTOM SECTION", "headline", "subheadline".
- This must look like a real luxury brand product catalog photograph.

FORMAT: ${format.ratio} — ${format.label} ${format.sublabel}
  `.trim(),
  },

  gradient_vivid: {
  name: 'Gradient Vivid',
  prompt: (idea, headline, subheadline, cta, format, langName) => `
SUBJECT — THE ONLY PRODUCT OR SERVICE IN THIS IMAGE: ${idea}
DO NOT generate cameras, generic products, skincare items, or any object unrelated to: ${idea}

Hyperrealistic digital-physical hybrid commercial photography. Mixed studio and colored LED panel lighting, 8K resolution.

LIGHTING SETUP: Multiple colored LED panels lighting the background wall — creating real physical color gradients (vivid purple-to-pink or cyan-to-blue). These are real lights in a real studio. The colored light wraps around the subject creating natural color bleeding on its surfaces.

SCENE: The ${idea} product or service visual is the centerpiece, surrounded by real physical abstract elements — colored acrylic shapes, glass prisms, geometric mirrors — all catching and refracting the colored LED light. The background wall is bathed in vivid gradient from practical lights.

TEXT OVERLAY ELEMENTS (physical signs placed in the studio during the shoot):
- Upper area: the text "${headline}" displayed on a physical LED matrix panel in the background — real LEDs, visible pixel grid at edges, white bright light, slightly overexposed.
- Top-right corner: a small backlit acrylic square with the text "TU LOGO AQUÍ" — glowing from within like a real lightbox sign.
- Below the subject: the text "${subheadline}" on a thinner physical LED strip panel — same real LED aesthetic, slightly dimmer.
- Bottom: the text "${cta}" on a physical neon-style LED flex tube bent into a pill shape — real neon-adjacent glow, visible tube mounting hardware at ends.

CRITICAL RULES:
- Fill the ENTIRE canvas. No blank or gray areas anywhere.
- The subject is EXCLUSIVELY: ${idea} — nothing else.
- Do NOT print the words "TOP SECTION", "MIDDLE SECTION", "BOTTOM SECTION", "headline", "subheadline".
- This must look like a real studio photograph with practical lighting effects.

FORMAT: ${format.ratio} — ${format.label} ${format.sublabel}
  `.trim(),
  },

  cinematic_dark: {
  name: 'Cinematic Dark',
  prompt: (idea, headline, subheadline, cta, format, langName) => `
SUBJECT — THE ONLY PRODUCT OR SERVICE IN THIS IMAGE: ${idea}
DO NOT generate cameras, generic products, skincare items, or any object unrelated to: ${idea}

Hyperrealistic cinematic luxury commercial photography. Single dramatic key light, cinema camera quality, 8K resolution.

LIGHTING SETUP: Single hard key light from upper-left at 45 degrees — deep dramatic shadows across 60% of frame. Subject catches brilliant specular highlight against surrounding darkness. Subtle backlight rim-lights the subject from behind. Real atmospheric haze or smoke fills the air catching light rays.

SCENE: The ${idea} product or service visual emerges from deep darkness, dramatically lit. Background is almost entirely black with subtle texture — weathered dark wood, aged black marble, or brushed dark metal relevant to ${idea}. Real atmospheric smoke or mist drifts through the air catching the key light. Gold and copper reflections catch on surfaces.

TEXT OVERLAY ELEMENTS (physical gold-leaf printed elements placed in the scene):
- Upper area: the text "${headline}" as physical gold-leaf letterpress typography — gold catches the key light unevenly, some letters brighter than others, tactile and real.
- Top-right corner: a small dark rectangle with gold-leaf border containing the text "TU LOGO AQUÍ" in small gold letterpress text — like a real luxury brand stamp.
- Below the subject: the text "${subheadline}" in thin gold or silver letterpress text — same physical gold-leaf quality, elegant and restrained.
- Bottom: the text "${cta}" engraved into a small dark metal pill-shaped badge with gold text — like a real premium product badge.

CRITICAL RULES:
- Fill the ENTIRE canvas. No blank or gray areas anywhere.
- The subject is EXCLUSIVELY: ${idea} — nothing else.
- Do NOT print the words "TOP SECTION", "MIDDLE SECTION", "BOTTOM SECTION", "headline", "subheadline".
- This must look like a real frame from a luxury cinema commercial.

FORMAT: ${format.ratio} — ${format.label} ${format.sublabel}
  `.trim(),
  },
}

const STRATEGY_COPY = {
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
  "headline": "TITULAR EN MAYÚSCULAS con urgencia real y escasez, máximo 6 palabras, usa emojis ⏰🔥⚡",
  "subheadline": "Hook urgente con escasez en menos de 10 palabras",
  "body": "Copy con urgencia real, 120-180 caracteres, 2-3 emojis (⏰🔥⚡), hook urgente + escasez + beneficio",
  "cta": "CTA con tiempo o escasez, máximo 4 palabras"
}`.trim(),

  solution: (idea, format, langName) => `
Eres experto en copywriting publicitario para Meta Ads en México.
NEGOCIO: ${idea}
Genera copy publicitario en ${langName} con ESTRATEGIA NEUTRA, PROFESIONAL Y CLARA.
IMPORTANTE: NO uses palabras prohibidas: adelgaza, cura, trata, baja de peso,
transforma tu cuerpo, gana dinero, ingreso pasivo, resultados garantizados de salud,
suplemento, antes y después corporal. Solo vende el SERVICIO y la EXPERIENCIA.
Formato del anuncio: ${format.ratio} (${format.label} ${format.sublabel})
Responde SOLO este JSON sin texto extra:
{
  "headline": "Titular profesional y claro que identifica el problema o beneficio, máximo 6 palabras, 0-1 emojis sutiles",
  "subheadline": "Beneficio + servicio en menos de 10 palabras, tono neutro y confiable",
  "body": "Copy profesional y claro, 80-120 caracteres, 0-2 emojis sutiles, beneficio + servicio + CTA suave",
  "cta": "CTA suave y profesional, máximo 4 palabras"
}`.trim(),

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
  "headline": "TITULAR alta energía emojizado y emocional, máximo 6 palabras, 2-3 emojis estratégicos",
  "subheadline": "Frase impactante que conecta emocionalmente, máximo 10 palabras",
  "body": "Copy alta energía, 180-250 caracteres, 4-6 emojis estratégicos, hook emojizado + frase impactante + slogan + CTA directo",
  "cta": "CTA directo y poderoso, máximo 4 palabras"
}`.trim(),
}

function buildImagePrompt(idea, headline, cta, subheadline, visualStyleId, langId, strategyId, format) {
  const vs   = VISUAL_STYLE_CONFIG[visualStyleId] || VISUAL_STYLE_CONFIG.bold_product
  const lang = LANGUAGE_CONFIG[langId]            || LANGUAGE_CONFIG.es

  const placeholders = {
    es: { headline: "TU TITULAR AQUÍ", subheadline: "TU COPY AQUÍ", cta: "TU CTA AQUÍ" },
    en: { headline: "YOUR HEADLINE HERE", subheadline: "YOUR SUBHEADLINE HERE", cta: "YOUR CTA HERE" },
    pt: { headline: "SEU TÍTULO AQUI", subheadline: "SEU SUBTÍTULO AQUI", cta: "SEU CTA AQUI" },
  }

  const ph = placeholders[langId] || placeholders.es

  return vs.prompt(idea, ph.headline, ph.subheadline, ph.cta, format, lang.name)
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
    impact:   'urgente y poderoso, con energía alta y llamadas a la acción inmediatas',
    solution: 'profesional y confiable, presentando el problema y la solución claramente',
    emotion:  'cálido y emotivo, conectando con las aspiraciones y sentimientos del cliente',
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