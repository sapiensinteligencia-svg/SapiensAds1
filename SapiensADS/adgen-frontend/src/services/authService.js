import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
})

export const register = async ({ name, email }) => {
  const { data } = await api.post('/api/auth/register', { name, email })
  return data
}
