
import React, { useState, useEffect } from 'react'
import { useInterview } from '../../context/InterviewContext'
import ProblemStatement from '../../components/dsa/ProblemStatement'
import CodeEditor from '../../components/dsa/CodeEditor'
import TestCases from '../../components/dsa/TestCases'
import DsaResults from '../../components/dsa/DsaResults'
import { dsaService } from '../../services/dsaService'
import toast from 'react-hot-toast'

const DsaPractice = () => {
  const { setDsaSession } = useInterview()
  const [problems, setProblems] = useState([])
  const [currentProblem, setCurrentProblem] = useState(null)
  const [userCode, setUserCode] = useState('')
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    fetchProblems()
  }, [])

  const fetchProblems = async () => {
    try {
      setIsLoading(true)
      const response = await dsaService.getProblems({
        topic: 'arrays',
        difficulty: 'easy',
        limit: 10
      })
      setProblems(response.problems)
      if (response.problems.length > 0) {
        setCurrentProblem(response.problems[0])
        setUserCode(generateInitialCode(response.problems[0]))
      }
    } catch (error) {
      toast.error('Failed to load problems')
      console.error('Problem fetch error:', error)
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
    if (!currentProblem) return

    setIsRunning(true)
    try {
      const response = await dsaService.evaluateSolution(
        currentProblem._id,
        code,
        'javascript'
      )
      setResults(response.evaluation)
      setDsaSession(response.evaluation)
      toast.success('Code executed successfully!')
    } catch (error) {
      toast.error('Failed to run code')
      console.error('Code execution error:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const handleResetCode = () => {
    setUserCode(generateInitialCode(currentProblem))
    setResults(null)
  }

  const handleNextProblem = () => {
    if (problems.length > 0) {
      const currentIndex = problems.findIndex(p => p._id === currentProblem._id)
      const nextIndex = (currentIndex + 1) % problems.length
      const nextProblem = problems[nextIndex]
      setCurrentProblem(nextProblem)
      setUserCode(generateInitialCode(nextProblem))
      setResults(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!currentProblem) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No problems available</p>
        <button
          onClick={fetchProblems}
          className="btn-primary mt-4"
        >
          Load Problems
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">DSA Practice</h1>
        <p className="text-gray-600 mt-2">
          Solve coding problems and test your solutions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Problem Statement */}
        <div>
          <ProblemStatement problem={currentProblem} />
        </div>

        {/* Right Column - Code Editor and Results */}
        <div className="space-y-6">
          <CodeEditor
            initialCode={userCode}
            language="javascript"
            onRunCode={handleRunCode}
            onReset={handleResetCode}
            isLoading={isRunning}
          />

          <TestCases
            testCases={currentProblem.testCases}
            results={results?.results}
            isLoading={isRunning}
          />

          {results && (
            <DsaResults
              results={results}
              onTryAgain={handleResetCode}
              onNextProblem={handleNextProblem}
            />
          )}
        </div>
      </div>

      {/* Problem Navigation */}
      {problems.length > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => {
              const currentIndex = problems.findIndex(p => p._id === currentProblem._id)
              const prevIndex = (currentIndex - 1 + problems.length) % problems.length
              setCurrentProblem(problems[prevIndex])
              setUserCode(generateInitialCode(problems[prevIndex]))
              setResults(null)
            }}
            className="btn-secondary"
          >
            Previous Problem
          </button>

          <span className="text-gray-600">
            Problem {problems.findIndex(p => p._id === currentProblem._id) + 1} of {problems.length}
          </span>

          <button
            onClick={handleNextProblem}
            className="btn-primary"
          >
            Next Problem
          </button>
        </div>
      )}
    </div>
  )
}

export default DsaPractice