

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { interviewService } from "../../services/interviewService"
import { Trophy, CheckCircle, XCircle, BarChart3, Home, RotateCcw, Share2, Download, Star, TrendingUp, Award, Target } from "lucide-react"

export default function CompleteInterviewPage() {
  const { sessionId } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true)
      try {
        const res = await interviewService.completeInterview(sessionId)
        setResult(res)
      } catch (err) {
        console.error("Error fetching results:", err)
      }
      setLoading(false)
    }
    fetchResult()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 text-center max-w-md mx-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Analyzing Your Performance</h3>
          <p className="text-gray-600">Please wait while we compile your interview results...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 text-center max-w-md mx-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Results Not Found</h3>
          <p className="text-gray-600 mb-6">We couldn't find your interview results. Please try again.</p>
          <Link to="/interview" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
            <RotateCcw className="h-4 w-4" />
            Start New Interview
          </Link>
        </div>
      </div>
    )
  }

  const totalQuestions = result.questions?.length || 0
  const answeredQuestions = result.questions?.filter(q => q.userAnswer)?.length || 0
  const averageScore = totalQuestions > 0 ? (result.questions.reduce((sum, q) => sum + (q.score || 0), 0) / totalQuestions).toFixed(1) : 0
  const passedQuestions = result.questions?.filter(q => (q.score || 0) > 0)?.length || 0

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500'
    if (score >= 60) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  const getScoreTextColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceMessage = (score) => {
    if (score >= 80) return { message: "Excellent Performance!", icon: Trophy, color: "text-green-600" }
    if (score >= 60) return { message: "Good Job!", icon: Star, color: "text-yellow-600" }
    return { message: "Keep Practicing!", icon: Target, color: "text-red-600" }
  }

  const performance = getPerformanceMessage(result.score || 0)
  const PerformanceIcon = performance.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 shadow-lg mb-6">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <span className="text-lg font-semibold text-gray-700">Interview Completed</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Your Interview Results
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Here's a comprehensive breakdown of your performance and areas for improvement
          </p>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Score Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <PerformanceIcon className={`h-8 w-8 ${performance.color}`} />
                  <h2 className="text-3xl font-bold text-gray-900">{performance.message}</h2>
                </div>
                
                <div className="relative mb-8">
                  <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${getScoreColor(result.score || 0)} flex items-center justify-center shadow-2xl`}>
                    <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center">
                      <span className={`text-3xl font-bold ${getScoreTextColor(result.score || 0)}`}>
                        {result.score || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Award className="h-8 w-8 text-yellow-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{answeredQuestions}/{totalQuestions}</div>
                    <div className="text-gray-600">Questions Answered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{averageScore}</div>
                    <div className="text-gray-600">Average Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{passedQuestions}</div>
                  <div className="text-gray-600">Questions Passed</div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{Math.round((passedQuestions / totalQuestions) * 100)}%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{totalQuestions}</div>
                  <div className="text-gray-600">Total Questions</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Link to="/interview" className="group">
            <button className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <RotateCcw className="h-5 w-5" />
              Practice Again
            </button>
          </Link>
          
          <button className="flex items-center gap-3 bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:border-indigo-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <Share2 className="h-5 w-5" />
            Share Results
          </button>
          
          <button className="flex items-center gap-3 bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:border-indigo-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <Download className="h-5 w-5" />
            Download Report
          </button>
          
          <Link to="/" className="group">
            <button className="flex items-center gap-3 bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:border-indigo-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <Home className="h-5 w-5" />
              Back to Home
            </button>
          </Link>
        </div>

        {/* Detailed Question Results */}
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Detailed Question Analysis</h2>
            <p className="text-lg text-gray-600">Review your answers and get insights for improvement</p>
          </div>

          {result.questions?.map((q, idx) => (
            <div key={q._id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="p-6">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {idx + 1}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {q.question}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-full text-white font-bold shadow-lg bg-gradient-to-r ${getScoreColor(q.score || 0)}`}>
                      {q.score || 0}%
                    </div>
                    {(q.score || 0) >= 60 ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                </div>

                {/* Answer Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Your Answer
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
                      <p className="text-gray-700 leading-relaxed">
                        {q.userAnswer || (
                          <span className="text-gray-400 italic">No answer provided</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      AI Feedback
                    </h4>
                    <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
                      <p className="text-gray-700 leading-relaxed">
                        {q.feedback || "No feedback available"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Missed Points */}
                {q.missedPoints?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      Areas for Improvement
                    </h4>
                    <div className="bg-red-50 rounded-xl p-4 border-l-4 border-red-500">
                      <ul className="space-y-2">
                        {q.missedPoints.map((mp, i) => (
                          <li key={i} className="flex items-start gap-3 text-red-700">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{mp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center py-12">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Ready to Improve Your Skills?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Practice makes perfect! Take another interview to continue improving your technical skills.
            </p>
            <Link to="/interview" className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <RotateCcw className="h-5 w-5" />
              Start New Interview
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

