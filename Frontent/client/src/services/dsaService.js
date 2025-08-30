// src/services/dsaService.js
import api from './api'

export const dsaService = {
  getProblems: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    
    const response = await api.get(`/dsa/problems?${params}`)
    return response.data
  },

  getProblem: async (problemId) => {
    const response = await api.get(`/dsa/problems/${problemId}`)
    return response.data
  },

  evaluateSolution: async (problemId, code, language = 'javascript') => {
    const response = await api.post('/dsa/evaluate', {
      problemId,
      code,
      language
    })
    return response.data
  },

  getSolutionHistory: async (problemId, page = 1, limit = 10) => {
    const response = await api.get(`/dsa/history/${problemId}?page=${page}&limit=${limit}`)
    return response.data
  }
}