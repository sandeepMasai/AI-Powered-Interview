
import api from './api'

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data.user
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData)
    return response.data
  }
}