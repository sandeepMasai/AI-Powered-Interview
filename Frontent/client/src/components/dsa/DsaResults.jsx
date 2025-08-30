
import React from 'react'
import { CheckCircle, XCircle, AlertCircle, BarChart3, Clock, Cpu } from 'lucide-react'

const DsaResults = ({ results, onTryAgain, onNextProblem }) => {
  if (!results) return null

  const passedCount = results.results?.filter(r => r.passed).length || 0
  const totalCount = results.results?.length || 0
  const allPassed = passedCount === totalCount

  return (
    <div className="card">
      <div className="text-center mb-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          allPassed ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {allPassed ? (
            <CheckCircle className="w-8 h-8 text-green-600" />
          ) : (
            <XCircle className="w-8 h-8 text-red-600" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {allPassed ? 'Congratulations! 🎉' : 'Keep Trying! 💪'}
        </h2>
        <p className="text-gray-600">
          {allPassed 
            ? 'You passed all test cases!'
            : `You passed ${passedCount} out of ${totalCount} test cases`
          }
        </p>
      </div>

      {/* Score and Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <BarChart3 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{results.overallScore}%</div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {results.executionSummary?.averageTime?.toFixed(3)}s
          </div>
          <div className="text-sm text-gray-600">Avg. Time</div>
        </div>
      </div>

      {/* Feedback */}
      {results.feedback && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-blue-900 mb-2 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Feedback
          </h3>
          <p className="text-blue-800">{results.feedback}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={onTryAgain}
          className="flex-1 btn-secondary"
        >
          Try Again
        </button>
        <button
          onClick={onNextProblem}
          className="flex-1 btn-primary"
        >
          Next Problem
        </button>
      </div>

      {/* Detailed Results */}
      {!allPassed && results.results && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Detailed Results</h3>
          <div className="space-y-2">
            {results.results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  result.passed ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Test Case {index + 1}</span>
                  <span className={`font-medium ${
                    result.passed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                {!result.passed && result.error && (
                  <p className="text-sm text-red-600 mt-1">{result.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DsaResults