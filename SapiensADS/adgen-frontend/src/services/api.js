
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('sapiensads_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sapiensads_token')
      localStorage.removeItem('sapiensads_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const generateAd = async (idea, format, strategy, language, visualStyle, image) => {
  const formData = new FormData()
  formData.append('idea', idea)
  formData.append('format', JSON.stringify({
    id:       format.id,
    width:    format.width,
    height:   format.height,
    ratio:    format.ratio,
    label:    format.label,
    sublabel: format.sublabel,
  }))
  formData.append('strategy',    strategy.id)
  formData.append('language',    language.id)
  formData.append('visualStyle', visualStyle.id)
  if (image) formData.append('logo', image)

  const { data } = await api.post('/api/generate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export const generateVariations = async (idea, language, visualStyle, image) => {
  const formData = new FormData()
  formData.append('idea', idea)
  formData.append('language',    language.id)
  formData.append('visualStyle', visualStyle.id)
  if (image) formData.append('logo', image)

  const { data } = await api.post('/api/generate-variations', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export const getMe = async () => {
  const { data } = await api.get('/api/auth/me')
  return data
}