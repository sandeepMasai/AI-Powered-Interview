
import React, { useState } from 'react'
import { Send, Clock, HelpCircle } from 'lucide-react'

const QuestionCard = ({ question, onSubmitAnswer, timeLimit, currentQuestion, totalQuestions }) => {
  const [answer, setAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!answer.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmitAnswer(question._id, answer.trim())
      setAnswer('')
    } catch (error) {
      console.error('Error submitting answer:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="card">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion} of {totalQuestions}
          </span>
        </div>
        {timeLimit && (
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">
              {formatTime(timeLimit)}
            </span>
          </div>
        )}
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {question.question}
        </h2>
        {question.description && (
          <p className="text-gray-600 mb-4">{question.description}</p>
        )}
        {question.examples && question.examples.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Example:</h3>
            {question.examples.map((example, index) => (
              <div key={index} className="text-sm text-gray-600">
                {example.input && (
                  <p><strong>Input:</strong> {example.input}</p>
                )}
                {example.output && (
                  <p><strong>Output:</strong> {example.output}</p>
                )}
                {example.explanation && (
                  <p><strong>Explanation:</strong> {example.explanation}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="answer" className="form-label">
            Your Answer
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here... Be detailed and include examples where possible."
            className="form-input min-h-[120px] resize-vertical"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!answer.trim() || isSubmitting}
          className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          <span>{isSubmitting ? 'Submitting...' : 'Submit Answer'}</span>
        </button>
      </form>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">💡 Tips for a great answer:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be specific and provide examples</li>
          <li>• Explain your thought process</li>
          <li>• Mention best practices and alternatives</li>
          <li>• Include code snippets if relevant</li>
        </ul>
      </div>
    </div>
  )
}

export default QuestionCard