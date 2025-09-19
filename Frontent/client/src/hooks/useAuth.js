
import { useState, useContext } from 'react';
import { InterviewContext } from '../context/InterviewContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { user, token, isLoading, error, dispatch } = useContext(InterviewContext);
  const [authLoading, setAuthLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setAuthLoading(true);
      const response = await authService.login(email, password);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: response });
        toast.success('Login successful!');
        return response;
      }
    } catch (error) {
      const errorMsg = error.message || 'Login failed. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      toast.error(errorMsg);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setAuthLoading(true);
      const response = await authService.register(userData);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: response });
        toast.success('Registration successful!');
        return response;
      }
    } catch (error) {
      const errorMsg = error.message || 'Registration failed. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      toast.error(errorMsg);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userData) => {
    try {
      setAuthLoading(true);
      const response = await authService.updateProfile(userData);
      
      if (response.success) {
        dispatch({ type: 'UPDATE_PROFILE', payload: response.user });
        toast.success('Profile updated successfully!');
        return response;
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to update profile';
      toast.error(errorMsg);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (token) {
        const userData = await authService.getProfile();
        dispatch({ type: 'SET_USER', payload: userData });
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Don't throw error here as it's a background refresh
    }
  };

  return {
    // State
    user,
    token,
    isLoading: isLoading || authLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    
    // Status checks
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
  };
};

export default useAuth;