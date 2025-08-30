
import React from 'react'
import { X, CheckCircle, XCircle, AlertCircle, BarChart3 } from 'lucide-react'

const ResultsModal = ({ isOpen, onClose, results, session }) => {
  if (!isOpen) return null

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score) => {
    if (score >= 8) return <CheckCircle className="w-5 h-5 text-green-600" />
    if (score >= 6) return <AlertCircle className="w-5 h-5 text-yellow-600" />
    return <XCircle className="w-5 h-5 text-red-600" />
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Interview Results</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Score */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Performance</h3>
            <div className={`text-4xl font-bold ${getScoreColor(session.score)} mb-2`}>
              {session.score}/10
            </div>
            <p className="text-gray-600">
              You answered {session.questions.filter(q => q.userAnswer).length} out of {session.questions.length} questions
            </p>
          </div>
        </div>

        {/* Questions and Answers */}
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Feedback</h3>
          
          {session.questions.map((question, index) => (
            <div key={question._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900">
                  Question {index + 1}: {question.question}
                </h4>
                {question.score !== undefined && (
                  <div className="flex items-center space-x-2">
                    {getScoreIcon(question.score)}
                    <span className={`font-medium ${getScoreColor(question.score)}`}>
                      {question.score}/10
                    </span>
                  </div>
                )}
              </div>

              {question.userAnswer && (
                <div className="mb-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Your Answer:</h5>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded">{question.userAnswer}</p>
                </div>
              )}

              {question.feedback && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Feedback:</h5>
                  <p className="text-gray-600 bg-blue-50 p-3 rounded">{question.feedback}</p>
                </div>
              )}

              {question.missedPoints && question.missedPoints.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-red-700 mb-2">Missed Points:</h5>
                  <ul className="text-red-600 text-sm space-y-1">
                    {question.missedPoints.map((point, i) => (
                      <li key={i}>• {point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Practice Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultsModal