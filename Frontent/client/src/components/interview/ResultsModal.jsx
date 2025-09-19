import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { interviewService } from "../../services/interviewService"

function ResultsModal() {
  const { sessionId } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true)
      try {
        const res = await interviewService.completeInterview(sessionId)
        setResult(res) // backend already sends { score, questions }
      } catch (err) {
        console.error("Error fetching results:", err)
      }
      setLoading(false)
    }
    fetchResult()
  }, [sessionId])

  if (loading) return <p className="text-center mt-10">Loading results...</p>
  if (!result) return <p className="text-center mt-10 text-red-500">No results found</p>

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Final Score */}
      <div className="border border-gray-300 rounded-lg p-6 text-center shadow">
        <h2 className="text-2xl font-bold">Interview Completed 🎉</h2>
        <p className="text-lg mt-2">Your Final Score</p>
        <p className="text-4xl font-bold text-indigo-600 mt-1">{result.score}</p>
      </div>

      {/* Questions with feedback */}
      <div className="space-y-6">
        {result.questions.map((q, idx) => (
          <div key={q._id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold">
              Q{idx + 1}. {q.question}
            </h3>

            <div className="mt-3">
              <p className="font-medium">Your Answer:</p>
              <p className="bg-gray-100 p-2 rounded">{q.userAnswer || "No answer given"}</p>
            </div>

            <div className="mt-3">
              <p className="font-medium">Score:</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold ${
                  q.score > 0 ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {q.score}
              </span>
            </div>

            <div className="mt-3">
              <p className="font-medium">Feedback:</p>
              <p className="text-sm text-gray-700">{q.feedback}</p>
            </div>

            {q.missedPoints?.length > 0 && (
              <div className="mt-3">
                <p className="font-medium text-red-700">Missed Points:</p>
                <ul className="list-disc list-inside text-sm text-red-600">
                  {q.missedPoints.map((mp, i) => (
                    <li key={i}>{mp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <hr className="my-6 border-gray-300" />
    </div>
  )
}

export default ResultsModal
