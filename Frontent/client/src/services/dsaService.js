
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

import axios from 'axios';

export const evaluateSolution = async ({ code, language, questionId }) => {
  const token = localStorage.getItem('token');

  try {
    const res = await axios.post(
      'http://localhost:2025/api/dsa/evaluate',
      { code, language, questionId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return res.data;
  } catch (err) {
    console.error('Solution evaluation error:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Server error');
  }
};
