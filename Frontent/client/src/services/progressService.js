
import api from './api'

export const progressService = {
  getDashboard: async () => {
    const response = await api.get('/progress/dashboard')
    return response.data.dashboard
  },

  getProgressHistory: async (days = 30) => {
    const response = await api.get(`/progress/history?days=${days}`)
    return response.data.progress
  },

  getWeakAreas: async () => {
    const response = await api.get('/progress/weak-areas')
    return response.data.weakAreas
  },

  getRecommendations: async () => {
    const response = await api.get('/progress/recommendations')
    return response.data.recommendations
  }
}