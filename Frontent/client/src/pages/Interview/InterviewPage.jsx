
import React, { useState } from 'react'
import { useInterview } from '../../context/InterviewContext'
import InterviewSetup from '../../components/interview/InterviewSetup'
import QuestionCard from '../../components/interview/QuestionCard'
import Timer from '../../components/interview/Timer'
import ResultsModal from '../../components/interview/ResultsModal'
import { interviewService } from '../../services/interviewService'
import toast from 'react-hot-toast'

const InterviewPage = () => {
  const { setInterviewSession } = useInterview()
  const [currentStep, setCurrentStep] = useState('setup') // setup, interview, results
  const [session, setSession] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleStartInterview = async (settings) => {
    setIsLoading(true)
    try {
      const response = await interviewService.startInterview(
        settings.topic,
        settings.duration,
        settings.difficulty
      )
      setSession(response.session)
      setInterviewSession(response.session)
      setCurrentStep('interview')
      toast.success('Interview started! Good luck!')
    } catch (error) {
      toast.error('Failed to start interview. Please try again.')
      console.error('Interview start error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitAnswer = async (questionId, answer) => {
    if (!session) return

    try {
      const response = await interviewService.submitAnswer(
        session._id,
        questionId,
        answer
      )
      
      // Update session with the evaluated answer
      const updatedSession = {
        ...session,
        questions: session.questions.map(q =>
          q._id === questionId
            ? { ...q, ...response.evaluation }
            : q
        )
      }
      
      setSession(updatedSession)
      setInterviewSession(updatedSession)

      // Move to next question or complete interview
      if (currentQuestionIndex < session.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        toast.success('Answer submitted!')
      } else {
        await handleCompleteInterview()
      }
    } catch (error) {
      toast.error('Failed to submit answer. Please try again.')
      console.error('Answer submission error:', error)
    }
  }

  const handleCompleteInterview = async () => {
    if (!session) return

    setIsLoading(true)
    try {
      const response = await interviewService.completeInterview(session._id)
      setSession(response.session)
      setCurrentStep('results')
      toast.success('Interview completed!')
    } catch (error) {
      toast.error('Failed to complete interview. Please try again.')
      console.error('Interview completion error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTimeUp = () => {
    toast.error('Time is up! Moving to next question...')
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      handleCompleteInterview()
    }
  }

  const currentQuestion = session?.questions[currentQuestionIndex]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interview Practice</h1>
          <p className="text-gray-600 mt-2">
            {currentStep === 'setup' && 'Setup your interview session'}
            {currentStep === 'interview' && `Question ${currentQuestionIndex + 1} of ${session?.questions.length}`}
            {currentStep === 'results' && 'Interview Results'}
          </p>
        </div>
        
        {currentStep === 'interview' && session && (
          <Timer
            initialTime={currentQuestion?.timeLimit * 60 || 300}
            onTimeUp={handleTimeUp}
            isActive={true}
          />
        )}
      </div>

      {/* Content */}
      {currentStep === 'setup' && (
        <InterviewSetup onStartInterview={handleStartInterview} />
      )}

      {currentStep === 'interview' && currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          onSubmitAnswer={handleSubmitAnswer}
          timeLimit={currentQuestion.timeLimit * 60}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={session.questions.length}
        />
      )}

      {currentStep === 'results' && session && (
        <ResultsModal
          isOpen={true}
          onClose={() => setCurrentStep('setup')}
          results={session}
          session={session}
        />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">
              {currentStep === 'setup' && 'Starting interview...'}
              {currentStep === 'interview' && 'Submitting answer...'}
              {currentStep === 'results' && 'Completing interview...'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default InterviewPage