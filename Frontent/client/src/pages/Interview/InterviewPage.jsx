
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {  User, BookOpen, Zap } from 'lucide-react'

import InterviewSetup from '../../components/interview/InterviewSetup'
import QuestionCard from '../../components/interview/QuestionCard'
import Timer from '../../components/interview/Timer'
import { interviewService } from '../../services/interviewService'

const InterviewPage = () => {
  const [currentStep, setCurrentStep] = useState('setup') 
  const [session, setSession] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [isBlitzMode, setIsBlitzMode] = useState(false)

  const navigate = useNavigate()

  // Start Interview
  const handleStartInterview = async (settings) => {
    setIsLoading(true)
    setLoadingMessage('Starting interview...')

    try {
      setIsBlitzMode(settings.isBlitzMode || false)

      const response = await interviewService.startInterview(
        settings.topic,
        settings.duration,
        settings.difficulty
      )

      if (!response?.session) throw new Error('Invalid session response')

      setSession(response.session)
      setCurrentStep('interview')
      setCurrentQuestionIndex(0)
      toast.success('Interview started! Good luck!')
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Failed to start interview. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Submit Answer
  const handleSubmitAnswer = async (questionId, answer) => {
    if (!session) return

    setIsLoading(true)
    setLoadingMessage('Submitting answer...')

    try {
      const response = await interviewService.submitAnswer(
        session._id,
        questionId,
        answer
      )

      const updatedQuestions = session.questions.map((q) =>
        q._id === questionId
          ? { ...q, ...(response?.evaluation || {}), userAnswer: answer, isAnswered: true }
          : q
      )

      setSession({ ...session, questions: updatedQuestions })

      // Go to next question or finish
      if (currentQuestionIndex < updatedQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
      } else {
        await handleCompleteInterview()
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Error submitting answer.')
    } finally {
      setIsLoading(false)
    }
  }

  // Complete Interview
  const handleCompleteInterview = async () => {
    if (!session) return

    setIsLoading(true)
    setLoadingMessage('Completing interview...')

    try {
      await interviewService.completeInterview(session._id)
      navigate(`/results/${session._id}`)
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Error completing interview.')
    } finally {
      setIsLoading(false)
    }
  }

  // Timer ends
  const handleTimeUp = async () => {
    if (!session) return

    if (isBlitzMode) {
      toast.error(' Blitz! Skipping question...')
    } else {
      toast.error('Time up! Moving to next...')
    }

    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      await handleCompleteInterview()
    }
  }

  const currentQuestion = session?.questions?.[currentQuestionIndex] || null
  const progress = session ? ((currentQuestionIndex + 1) / session.questions.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Interview Practice
                </h1>
              </div>
              <p className="text-lg text-gray-600 font-medium">
                {currentStep === 'setup' && 'Configure your personalized interview session'}
                {currentStep === 'interview' && (
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Question {currentQuestionIndex + 1} of {session?.questions?.length || 0}
                    {isBlitzMode && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                        <Zap className="h-3 w-3" />
                        Blitz Mode
                      </span>
                    )}
                  </span>
                )}
              </p>
            </div>

            {/* Timer Section */}
            {currentStep === 'interview' && currentQuestion && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                <Timer
                  key={`${session._id}-${currentQuestion._id}`}
                  initialTime={
                    isBlitzMode
                      ? 30
                      : currentQuestion.timeLimit != null
                      ? currentQuestion.timeLimit * 60
                      : 5 * 60
                  }
                  onTimeUp={handleTimeUp}
                />
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {currentStep === 'interview' && session && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-white/60 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="relative">
          {currentStep === 'setup' && (
            <div className="animate-in fade-in-50 duration-500">
              <InterviewSetup onStartInterview={handleStartInterview} />
            </div>
          )}

          {currentStep === 'interview' && currentQuestion && (
            <div className="animate-in fade-in-50 slide-in-from-right-4 duration-500">
              <QuestionCard
                key={currentQuestion._id}
                question={currentQuestion}
                onSubmitAnswer={handleSubmitAnswer}
              />
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-in fade-in-0 duration-300"
            role="status"
            aria-live="polite"
          >
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 text-center max-w-sm mx-4 animate-in zoom-in-95 duration-300">
              <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Please Wait</h3>
              <p className="text-gray-600">{loadingMessage || 'Loading...'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InterviewPage