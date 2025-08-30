
import React from 'react'
import { Target, Clock, AlertCircle } from 'lucide-react'

const ProblemStatement = ({ problem }) => {
  if (!problem) {
    return (
      <div className="card">
        <div className="text-center text-gray-600">
          Select a problem to get started
        </div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="card">
      {/* Problem Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{problem.title}</h1>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            <div className="flex items-center space-x-1 text-gray-600">
              <Target className="w-4 h-4" />
              <span>{problem.topic}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Description */}
      <div className="prose max-w-none mb-6">
        <p className="text-gray-700">{problem.description}</p>
      </div>

      {/* Constraints */}
      {problem.constraints && problem.constraints.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
            Constraints
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {problem.constraints.map((constraint, index) => (
              <li key={index}>• {constraint}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Examples */}
      {problem.examples && problem.examples.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Examples</h3>
          {problem.examples.map((example, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              {example.input && (
                <div className="mb-2">
                  <strong>Input:</strong>
                  <pre className="text-sm bg-white p-2 rounded mt-1 overflow-x-auto">
                    {example.input}
                  </pre>
                </div>
              )}
              {example.output && (
                <div className="mb-2">
                  <strong>Output:</strong>
                  <pre className="text-sm bg-white p-2 rounded mt-1 overflow-x-auto">
                    {example.output}
                  </pre>
                </div>
              )}
              {example.explanation && (
                <div>
                  <strong>Explanation:</strong>
                  <p className="text-sm mt-1">{example.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Function Signature */}
      {problem.functionName && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Function Signature</h4>
          <pre className="text-sm bg-white p-3 rounded overflow-x-auto">
            {`function ${problem.functionName}(...) {
  // Your code here
}`}
          </pre>
        </div>
      )}
    </div>
  )
}

export default ProblemStatement