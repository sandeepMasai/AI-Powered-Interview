
import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/authService'

const InterviewContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  interviewSession: null,
  dsaSession: null
}

function interviewReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        user: action.payload.user, 
        token: action.payload.token,
        error: null,
        isLoading: false 
      }
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        token: null,
        interviewSession: null,
        dsaSession: null 
      }
    case 'SET_INTERVIEW_SESSION':
      return { ...state, interviewSession: action.payload }
    case 'SET_DSA_SESSION':
      return { ...state, dsaSession: action.payload }
    default:
      return state
  }
}

export function InterviewProvider({ children }) {
  const [state, dispatch] = useReducer(interviewReducer, initialState)

  useEffect(() => {
    if (state.token) {
      getUserProfile()
    }
  }, [state.token])

  const getUserProfile = async () => {
    try {
      const userData = await authService.getProfile()
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: userData, token: state.token } })
    } catch (error) {
      console.error('Failed to get user profile:', error)
      logout()
    }
  }

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authService.login(email, password)
      localStorage.setItem('token', response.token)
      dispatch({ type: 'LOGIN_SUCCESS', payload: response })
      return response
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authService.register(userData)
      localStorage.setItem('token', response.token)
      dispatch({ type: 'LOGIN_SUCCESS', payload: response })
      return response
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    setInterviewSession: (session) => dispatch({ type: 'SET_INTERVIEW_SESSION', payload: session }),
    setDsaSession: (session) => dispatch({ type: 'SET_DSA_SESSION', payload: session })
  }

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  )
}

export const useInterview = () => {
  const context = useContext(InterviewContext)
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider')
  }
  return context
}