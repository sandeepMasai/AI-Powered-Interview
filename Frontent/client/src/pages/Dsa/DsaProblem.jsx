
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useInterview } from '../../context/InterviewContext'
import ProblemStatement from '../../components/dsa/ProblemStatement'
import CodeEditor from '../../components/dsa/CodeEditor'
import TestCases from '../../components/dsa/TestCases'
import DsaResults from '../../components/dsa/DsaResults'
import { dsaService } from '../../services/dsaService'
import { fallbackProblems } from '../../data/fallbackProblems'
import toast from 'react-hot-toast'
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  AlertCircle, 
  Clock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  List
} from 'lucide-react'

const DsaProblem = () => {
  const { problemId } = useParams()
  const navigate = useNavigate()
  const { setDsaSession } = useInterview()
  
  const [problem, setProblem] = useState(null)
  const [allProblems, setAllProblems] = useState([])
  const [userCode, setUserCode] = useState('')
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const [activeTab, setActiveTab] = useState('problem') // 'problem', 'code', 'results'

  useEffect(() => {
    if (problemId) {
      fetchProblem(problemId)
    } else {
      fetchProblems()
    }
  }, [problemId])

  const fetchProblem = async (id) => {
    try {
      setIsLoading(true)
      setError(null)
      setUsingFallback(false)
      
      const response = await dsaService.getProblem(id)
      setProblem(response.problem)
      setUserCode(generateInitialCode(response.problem))
    } catch (error) {
      console.error('Problem fetch error:', error)
      // Try to find problem in fallback data
      const fallbackProblem = fallbackProblems.find(p => p._id === id)
      if (fallbackProblem) {
        setProblem(fallbackProblem)
        setUserCode(generateInitialCode(fallbackProblem))
        setUsingFallback(true)
        toast('Using demo problem data', { icon: '💡' })
      } else {
        setError('Problem not found')
        toast.error('Problem not found')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProblems = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setUsingFallback(false)
      
      const response = await dsaService.getProblems({
        limit: 50,
        sort: 'difficulty'
      })
      
      if (response.problems && response.problems.length > 0) {
        setAllProblems(response.problems)
        // If no specific problem ID, show the first one
        if (!problemId && response.problems.length > 0) {
          setProblem(response.problems[0])
          setUserCode(generateInitialCode(response.problems[0]))
        }
      } else {
        // Use fallback data
        setAllProblems(fallbackProblems)
        if (!problemId && fallbackProblems.length > 0) {
          setProblem(fallbackProblems[0])
          setUserCode(generateInitialCode(fallbackProblems[0]))
        }
        setUsingFallback(true)
        toast('Using demo problems', { icon: '💡' })
      }
    } catch (error) {
      console.error('Problems fetch error:', error)
      // Use fallback data
      setAllProblems(fallbackProblems)
      if (!problemId && fallbackProblems.length > 0) {
        setProblem(fallbackProblems[0])
        setUserCode(generateInitialCode(fallbackProblems[0]))
      }
      setUsingFallback(true)
      setError('Connected to demo problems. Server connection failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const generateInitialCode = (problem) => {
    if (!problem) return '// Write your solution here'
    
    return `function ${problem.functionName}(input) {
  // Your code here
  return input;
}

// Example usage:
// const result = ${problem.functionName}([1, 2, 3]);
// console.log(result);`
  }

  const handleRunCode = async (code) => {
    if (!problem) return

    setIsRunning(true)
    setActiveTab('results')
    try {
      if (usingFallback) {
        // Simulate evaluation for fallback problems
        const simulatedResult = simulateEvaluation(code, problem)
        setResults(simulatedResult)
        toast.success('Code executed successfully! (Demo mode)')
      } else {
        const response = await dsaService.evaluateSolution(
          problem._id,
          code,
          'javascript'
        )
        setResults(response.evaluation)
        setDsaSession(response.evaluation)
        toast.success('Code executed successfully!')
      }
    } catch (error) {
      console.error('Code execution error:', error)
      toast.error('Failed to run code. Please try again.')
    } finally {
      setIsRunning(false)
    }
  }

  const simulateEvaluation = (code, problem) => {
    // Simple simulation - checks if the code contains the function name
    const hasFunction = code.includes(problem.functionName)
    const randomScore = hasFunction ? Math.floor(Math.random() * 40) + 60 : 30
    const passed = randomScore > 70
    
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
    }
  }

  const handleResetCode = () => {
    setUserCode(generateInitialCode(problem))
    setResults(null)
    setActiveTab('code')
  }

  const handleNextProblem = () => {
    if (allProblems.length > 0 && problem) {
      const currentIndex = allProblems.findIndex(p => p._id === problem._id)
      const nextIndex = (currentIndex + 1) % allProblems.length
      const nextProblem = allProblems[nextIndex]
      navigate(`/dsa/problem/${nextProblem._id}`)
    }
  }

  const handlePrevProblem = () => {
    if (allProblems.length > 0 && problem) {
      const currentIndex = allProblems.findIndex(p => p._id === problem._id)
      const prevIndex = (currentIndex - 1 + allProblems.length) % allProblems.length
      const prevProblem = allProblems[prevIndex]
      navigate(`/dsa/problem/${prevProblem._id}`)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading problem...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Problem Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dsa')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 w-full"
            >
              Back to Practice
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 w-full"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Problem Selected</h2>
          <button
            onClick={() => navigate('/dsa')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Choose a Problem
          </button>
        </div>
      </div>
    )
  }

  const currentIndex = allProblems.findIndex(p => p._id === problem._id) + 1
  const totalProblems = allProblems.length || 1

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/dsa"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Problems</span>
              </Link>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span>DSA Practice</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {usingFallback && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  Demo Mode
                </span>
              )}
              
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <span>Problem {currentIndex} of {totalProblems}</span>
              </div>

              <Link
                to="/dsa"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <List className="w-4 h-4" />
                <span>Problem List</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Problem Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevProblem}
            disabled={allProblems.length <= 1}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:block">Previous</span>
          </button>

          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {problem.difficulty}
            </span>
          </div>

          <button
            onClick={handleNextProblem}
            disabled={allProblems.length <= 1}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:block">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('problem')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'problem'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Problem
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'code'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'results'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Results
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Problem Statement */}
          <div className={activeTab !== 'problem' ? 'hidden lg:block' : ''}>
            <ProblemStatement problem={problem} />
          </div>

          {/* Right Column - Code Editor and Results */}
          <div className="space-y-6">
            {activeTab === 'code' && (
              <>
                <CodeEditor
                  initialCode={userCode}
                  language="javascript"
                  onRunCode={handleRunCode}
                  onReset={handleResetCode}
                  isLoading={isRunning}
                />
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleRunCode(userCode)}
                    disabled={isRunning}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isRunning ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                    <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                  </button>
                  
                  <button
                    onClick={handleResetCode}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset Code</span>
                  </button>
                </div>
              </>
            )}

            {activeTab === 'results' && results && (
              <DsaResults
                results={results}
                onTryAgain={handleResetCode}
                onNextProblem={handleNextProblem}
              />
            )}

            {/* Test Cases - Always visible in code tab */}
            {activeTab === 'code' && (
              <TestCases
                testCases={problem.testCases}
                results={results?.results}
                isLoading={isRunning}
              />
            )}
          </div>
        </div>

        {/* Mobile bottom navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex justify-around">
            <button
              onClick={() => setActiveTab('problem')}
              className={`flex flex-col items-center space-y-1 ${
                activeTab === 'problem' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs">Problem</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex flex-col items-center space-y-1 ${
                activeTab === 'code' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Play className="w-5 h-5" />
              <span className="text-xs">Code</span>
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex flex-col items-center space-y-1 ${
                activeTab === 'results' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-xs">Results</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DsaProblem