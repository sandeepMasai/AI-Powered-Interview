
import { useState, useContext } from 'react';
import { InterviewContext } from '../context/InterviewContext';
import { dsaService } from '../services/dsaService';
import { fallbackProblems } from '../data/fallbackProblems';
import toast from 'react-hot-toast';

export const useDsa = () => {
  const { dsaSession, dispatch } = useContext(InterviewContext);
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const getProblems = async (filters = {}) => {
    try {
      setLoading(true);
      setUsingFallback(false);
      
      const response = await dsaService.getProblems(filters);
      
      if (response.success && response.problems.length > 0) {
        return response;
      } else {
        // No problems found, use fallback
        setUsingFallback(true);
        toast('Using demo problems', { icon: '💡' });
        return {
          success: true,
          problems: fallbackProblems,
          total: fallbackProblems.length,
          totalPages: 1,
          currentPage: 1
        };
      }
    } catch (error) {
      // Use fallback on error
      setUsingFallback(true);
      const errorMsg = error.message || 'Failed to fetch problems';
      toast.error('Using demo problems. ' + errorMsg);
      return {
        success: true,
        problems: fallbackProblems,
        total: fallbackProblems.length,
        totalPages: 1,
        currentPage: 1
      };
    } finally {
      setLoading(false);
    }
  };

  const getProblem = async (problemId) => {
    try {
      setLoading(true);
      setUsingFallback(false);
      
      const response = await dsaService.getProblem(problemId);
      
      if (response.success) {
        return response;
      } else {
        // Problem not found, try fallback
        const fallbackProblem = fallbackProblems.find(p => p._id === problemId);
        if (fallbackProblem) {
          setUsingFallback(true);
          toast('Using demo problem', { icon: '💡' });
          return {
            success: true,
            problem: fallbackProblem
          };
        } else {
          throw new Error('Problem not found');
        }
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to fetch problem';
      toast.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const evaluateSolution = async (problemId, code, language = 'javascript') => {
    try {
      setLoading(true);
      
      if (usingFallback) {
        // Simulate evaluation for fallback problems
        const problem = fallbackProblems.find(p => p._id === problemId) || fallbackProblems[0];
        const simulatedResult = simulateEvaluation(code, problem);
        
        dispatch({ type: 'SET_DSA_SESSION', payload: simulatedResult });
        toast.success('Code executed successfully! (Demo mode)');
        
        return {
          success: true,
          evaluation: simulatedResult,
          evaluationId: `demo-${Date.now()}`
        };
      } else {
        const response = await dsaService.evaluateSolution(problemId, code, language);
        
        if (response.success) {
          dispatch({ type: 'SET_DSA_SESSION', payload: response.evaluation });
          toast.success('Code executed successfully!');
          return response;
        }
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to evaluate solution';
      toast.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSolutionHistory = async (problemId, page = 1, limit = 10) => {
    try {
      setLoading(true);
      
      if (usingFallback) {
        // Return empty history for demo mode
        return {
          success: true,
          history: [],
          total: 0,
          totalPages: 0,
          currentPage: 1
        };
      } else {
        const response = await dsaService.getSolutionHistory(problemId, page, limit);
        return response;
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to fetch solution history';
      toast.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Simulate evaluation for fallback mode
  const simulateEvaluation = (code, problem) => {
    const hasFunction = code.includes(problem.functionName);
    const randomScore = hasFunction ? Math.floor(Math.random() * 40) + 60 : 30;
    const passed = randomScore > 70;
    
    return {
      totalTestCases: problem.testCases.length,
      passedTestCases: passed ? problem.testCases.length : Math.floor(problem.testCases.length / 2),
      results: problem.testCases.map((testCase, index) => ({
        testCaseId: index,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: passed ? testCase.expectedOutput : 'undefined',
        passed: passed || index % 2 === 0,
        executionTime: (Math.random() * 100).toFixed(2),
        memoryUsage: (Math.random() * 10).toFixed(2)
      })),
      overallScore: randomScore,
      feedback: hasFunction ? 
        (passed ? 'Great job! All test cases passed.' : 'Some test cases failed. Review your solution.') :
        `Make sure to implement the ${problem.functionName} function.`,
      executionSummary: {
        totalTime: (Math.random() * 200).toFixed(2),
        totalMemory: (Math.random() * 20).toFixed(2),
        averageTime: (Math.random() * 50).toFixed(2),
        averageMemory: (Math.random() * 5).toFixed(2)
      }
    };
  };

  const clearSession = () => {
    dispatch({ type: 'CLEAR_DSA_SESSION' });
  };

  return {
    // State
    dsaSession,
    loading,
    usingFallback,
    
    // Actions
    getProblems,
    getProblem,
    evaluateSolution,
    getSolutionHistory,
    clearSession,
    
    // Utility functions
    simulateEvaluation,
    
    // Derived state
    currentScore: dsaSession?.overallScore || 0,
    isOptimal: dsaSession?.overallScore >= 90,
  };
};

export default useDsa;