import { useState, useContext } from 'react';
import { InterviewContext } from '../context/InterviewContext';
import { interviewService } from '../services/interviewService';
import toast from 'react-hot-toast';

export const useInterview = () => {
  const { interviewSession, dispatch } = useContext(InterviewContext);
  const [loading, setLoading] = useState(false);

  // Helper to normalize session object from API
const normalizeSession = (response) => ({
  _id: response.sessionId,  // map sessionId to _id
  questions: response.questions || [],
  duration: response.duration || 0,
});

const startInterview = async (topic, duration, difficulty = 'medium') => {
  try {
    setLoading(true);
    const response = await interviewService.startInterview(topic, duration, difficulty);

    if (response.success) {
      const normalizedSession = normalizeSession(response);
      dispatch({ type: 'SET_INTERVIEW_SESSION', payload: normalizedSession });
      toast.success('Interview session started!');
      return response;
    }
  } catch (error) {
    const errorMsg = error.message || 'Failed to start interview session';
    toast.error(errorMsg);
    throw error;
  } finally {
    setLoading(false);
  }
};


  const submitAnswer = async (sessionId, questionId, answer) => {
    try {
      setLoading(true);
      const response = await interviewService.submitAnswer(sessionId, questionId, answer);

      if (response.success) {
        // Update the question answer evaluation
        dispatch({ type: 'UPDATE_QUESTION_ANSWER', payload: { questionId, evaluation: response.evaluation } });
        toast.success('Answer submitted successfully!');
        return response;
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to submit answer';
      toast.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeInterview = async (sessionId) => {
    try {
      setLoading(true);
      const response = await interviewService.completeInterview(sessionId);

      if (response.success) {
        const normalizedSession = normalizeSession(response);
        dispatch({ type: 'COMPLETE_INTERVIEW', payload: normalizedSession });
        toast.success('Interview completed successfully!');
        return response;
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to complete interview';
      toast.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSessionHistory = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await interviewService.getSessionHistory(page, limit);
      return response;
    } catch (error) {
      const errorMsg = error.message || 'Failed to fetch session history';
      toast.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSession = async (sessionId) => {
    try {
      setLoading(true);
      const response = await interviewService.getSession(sessionId);
      return response;
    } catch (error) {
      const errorMsg = error.message || 'Failed to fetch session details';
      toast.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearSession = () => {
    dispatch({ type: 'CLEAR_INTERVIEW_SESSION' });
  };

  return {
    // State
    interviewSession,
    loading,

    // Actions
    startInterview,
    submitAnswer,
    completeInterview,
    getSessionHistory,
    getSession,
    clearSession,

    // Derived state
    currentQuestion: interviewSession?.questions?.find(q => !q.userAnswer),
    progress: interviewSession
      ? {
          total: interviewSession.questions.length,
          completed: interviewSession.questions.filter(q => q.userAnswer).length,
          percentage: Math.round(
            (interviewSession.questions.filter(q => q.userAnswer).length / interviewSession.questions.length) * 100
          )
        }
      : null
  };
};

export default useInterview;
