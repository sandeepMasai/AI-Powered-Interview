
import React from 'react'
import { CheckCircle, XCircle, Clock, Loader } from 'lucide-react'

const TestCases = ({ testCases, results, isLoading }) => {
  if (!testCases || testCases.length === 0) {
    return (
      <div className="card">
        <div className="text-center text-gray-600">
          No test cases available
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Cases</h3>
      
      <div className="space-y-3">
        {testCases.map((testCase, index) => {
          const result = results?.[index]
          const isPassed = result?.passed
          const isRunning = isLoading && !result

          return (
            <div
              key={index}
              className={`p-3 border rounded-lg ${
                isRunning
                  ? 'border-blue-200 bg-blue-50'
                  : isPassed
                  ? 'border-green-200 bg-green-50'
                  : result
                  ? 'border-red-200 bg-red-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {isRunning ? (
                    <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                  ) : isPassed ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : result ? (
                    <XCircle className="w-4 h-4 text-red-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="font-medium">Test Case {index + 1}</span>
                </div>
                {result && (
                  <span className={`text-sm font-medium ${
                    isPassed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPassed ? 'Passed' : 'Failed'}
                  </span>
                )}
              </div>

              <div className="text-sm space-y-1">
                <div>
                  <strong>Input:</strong>
                  <pre className="bg-white p-1 rounded mt-1 overflow-x-auto">
                    {testCase.input}
                  </pre>
                </div>
                <div>
                  <strong>Expected:</strong>
                  <pre className="bg-white p-1 rounded mt-1 overflow-x-auto">
                    {testCase.expectedOutput}
                  </pre>
                </div>
                {result && !isPassed && (
                  <div>
                    <strong>Got:</strong>
                    <pre className="bg-white p-1 rounded mt-1 overflow-x-auto">
                      {result.actualOutput || 'No output'}
                    </pre>
                  </div>
                )}
                {result?.error && (
                  <div>
                    <strong>Error:</strong>
                    <pre className="text-red-600 bg-white p-1 rounded mt-1 overflow-x-auto">
                      {result.error}
                    </pre>
                  </div>
                )}
                {result?.executionTime && (
                  <div className="text-xs text-gray-600">
                    Time: {result.executionTime}s | Memory: {result.memoryUsage}MB
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {results && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium">Summary:</span>
            <span className={`font-bold ${
              results.every(r => r.passed) ? 'text-green-600' : 'text-red-600'
            }`}>
              {results.filter(r => r.passed).length} / {results.length} passed
            </span>
          </div>
          {results.executionSummary && (
            <div className="text-sm text-gray-600 mt-2">
              Total time: {results.executionSummary.totalTime}s | 
              Average time: {results.executionSummary.averageTime}s | 
              Total memory: {results.executionSummary.totalMemory}MB
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TestCases