
import api from './api'

export const interviewService = {
  startInterview: async (topic, duration, difficulty) => {
    const response = await api.post('/interview/start', {
      topic,
      duration,
      difficulty
    })
    return response.data
  },

  submitAnswer: async (sessionId, questionId, answer) => {
    const response = await api.post('/interview/submit-answer', {
      sessionId,
      questionId,
      answer
    })
    return response.data
  },

  completeInterview: async (sessionId) => {
    const response = await api.post('/interview/complete', { sessionId })
    return response.data
  },

  getSession: async (sessionId) => {
    const response = await api.get(`/interview/session/${sessionId}`)
    return response.data
  },

  getSessionHistory: async (page = 1, limit = 10) => {
    const response = await api.get(`/interview/history?page=${page}&limit=${limit}`)
    return response.data
  }
}