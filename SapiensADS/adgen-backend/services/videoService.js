const { fal } = require('@fal-ai/client')

fal.config({ credentials: process.env.FAL_KEY })

async function generateAdVideo({ imageBase64, imageMimeType, videoPrompt, format, audioType }) {
  const aspectRatio = format.id === 'instagram_story' ? '9:16' : '16:9'

  console.log('=== FAL.AI VEO 3.1 LITE ===')
  console.log('Prompt completo:\n', videoPrompt)
  console.log('Audio type:', audioType)
  console.log('Aspect ratio:', aspectRatio)

  const imageBuffer = Buffer.from(imageBase64.split(',')[1], 'base64')
  const imageBlob   = new Blob([imageBuffer], { type: imageMimeType || 'image/jpeg' })
  const imageUrl    = await fal.storage.upload(imageBlob)

  console.log('Imagen subida a fal.ai:', imageUrl)

  const result = await fal.subscribe('fal-ai/veo3.1/lite/image-to-video', {
    input: {
      prompt:           videoPrompt,
      image_url:        imageUrl,
      aspect_ratio:     aspectRatio,
      duration:         '8s',
      resolution:       '720p',
      generate_audio:   audioType !== 'none',
      safety_tolerance: '4',
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === 'IN_PROGRESS') {
        update.logs?.map(log => log.message).forEach(msg => console.log('FAL:', msg))
      }
    }
  })

  console.log('Video generado:', result.data.video.url)
  return result.data.video.url
}

module.exports = { generateAdVideo }