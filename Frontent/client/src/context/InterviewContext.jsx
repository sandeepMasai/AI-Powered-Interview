import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  interviewSession: null,
  dsaSession: null
};

function interviewReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        isLoading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        interviewSession: null,
        dsaSession: null,
        error: null
      };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_PROFILE':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'SET_INTERVIEW_SESSION':
      return { ...state, interviewSession: action.payload };
    case 'UPDATE_QUESTION_ANSWER':
      if (!state.interviewSession?.questions) return state;
      return {
        ...state,
        interviewSession: {
          ...state.interviewSession,
          questions: state.interviewSession.questions.map(q =>
            q._id === action.payload.questionId
              ? { ...q, ...action.payload.evaluation }
              : q
          )
        }
      };
    case 'COMPLETE_INTERVIEW':
      return { ...state, interviewSession: action.payload };
    case 'CLEAR_INTERVIEW_SESSION':
      return { ...state, interviewSession: null };
    case 'SET_DSA_SESSION':
      return { ...state, dsaSession: action.payload };
    case 'CLEAR_DSA_SESSION':
      return { ...state, dsaSession: null };
    default:
      return state;
  }
}

export const InterviewContext = createContext();

export function InterviewProvider({ children }) {
  const [state, dispatch] = useReducer(interviewReducer, initialState);

  // 🔹 Login
  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await authService.login(email, password);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: data.user,
          token: data.token
        }
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Login failed'
      });
      throw error;
    }
  };

  // 🔹 Register
  const register = async ({ name, email, password }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await authService.register({ name, email, password });
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: data.user,
          token: data.token
        }
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Registration failed'
      });
      throw error;
    }
  };

  // 🔹 Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('token');
  };

  // 🔹 Auto-login (when token exists)
  useEffect(() => {
    const autoLogin = async () => {
      if (state.token && !state.user) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const userData = await authService.getProfile();
          dispatch({ type: 'SET_USER', payload: userData });
        } catch (error) {
          console.error('Auto-login failed:', error);
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      }
    };
    autoLogin();
  }, [state.token, state.user]);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token);
    } else {
      localStorage.removeItem('token');
    }
  }, [state.token]);

  const value = {
    ...state,
    dispatch,
    login,
    register,   // ✅ Added here
    logout,
    setInterviewSession: (session) =>
      dispatch({ type: 'SET_INTERVIEW_SESSION', payload: session }),
    setDsaSession: (session) =>
      dispatch({ type: 'SET_DSA_SESSION', payload: session }),
    clearInterviewSession: () =>
      dispatch({ type: 'CLEAR_INTERVIEW_SESSION' }),
    clearDsaSession: () => dispatch({ type: 'CLEAR_DSA_SESSION' })
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
