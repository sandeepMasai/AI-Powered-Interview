import React, { useState } from "react"
import {
  Calendar,
  Clock,
  BarChart3,
  Eye,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { formatDate } from "../../utils/dateFormatter"

const SessionHistory = ({ sessions = [], evaluations = [] }) => {

  
  
  const [expandedSession, setExpandedSession] = useState(null)
  const [showAll, setShowAll] = useState(false)

  const displayedSessions = showAll ? sessions : sessions.slice(0, 3)
  const displayedEvaluations = showAll ? evaluations : evaluations.slice(0, 3)

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>

      {/* Interview Sessions */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Interview Sessions
        </h4>

        {sessions.length === 0 ? (
          <p className="text-gray-500">No sessions found.</p>
        ) : (
          <div className="space-y-3">
            {displayedSessions.map((session) => (
              <div
                key={session._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 capitalize">
                    {session.topic} ({session.difficulty})
                  </span>
                  <span
                    className={`font-bold ${
                      session.score != null
                        ? getScoreColor(session.score)
                        : "text-gray-400"
                    }`}
                  >
                    {session.score != null ? `${session.score}/10` : "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(session.startedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{session.duration ?? 0} min</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setExpandedSession(
                        expandedSession === session._id ? null : session._id
                      )
                    }
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    {expandedSession === session._id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>

                {expandedSession === session._id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Status: {session.status}
                    </p>
                    <p className="text-sm text-gray-600">
                      Completed: {formatDate(session.completedAt)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Questions: {session.questions?.length ?? 0}
                    </p>
                    {session.questions?.length > 0 && (
                      <ul className="list-disc pl-6 mt-2 text-sm text-gray-700">
                        {session.questions.map((q) => (
                          <li key={q._id}>{q.question}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {sessions.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 mt-3 text-sm"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Show All ({sessions.length})</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* DSA Evaluations */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-green-600" />
          DSA Submissions
        </h4>

        {evaluations.length === 0 ? (
          <p className="text-gray-500">No DSA submissions found.</p>
        ) : (
          <div className="space-y-3">
            {displayedEvaluations.map((evaluation) => (
              <div
                key={evaluation._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    {evaluation.problemId.title}
                  </span>
                  <span
                    className={`font-bold ${
                      evaluation.score >= 80
                        ? "text-green-600"
                        : evaluation.score >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {evaluation.score}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      evaluation.problemId.difficulty === "easy"
                        ? "bg-green-100 text-green-800"
                        : evaluation.problemId.difficulty === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {evaluation.problemId.difficulty}
                  </span>
                  <span>{formatDate(evaluation.submittedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {evaluations.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 mt-3 text-sm"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Show All ({evaluations.length})</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default SessionHistory
