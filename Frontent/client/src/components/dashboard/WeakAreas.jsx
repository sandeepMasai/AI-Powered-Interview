import React from 'react'
import { AlertTriangle, TrendingUp, Target } from 'lucide-react'

const WeakAreas = ({ weakAreas = [] }) => {
  // Helper to get trend icon
  const getTrendIcon = (trend) => {
    return trend === 'up' 
      ? <TrendingUp className="w-4 h-4 text-green-600" />
      : <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />
  }

  // Helper to get score color
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Areas to Improve</h3>
      </div>

      {weakAreas.length === 0 ? (
        <p className="text-sm text-gray-500">No weak areas identified yet. Keep up the good work!</p>
      ) : (
        <div className="space-y-4">
          {weakAreas.map((area, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{area._id || area.topic}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        area.averageScore >= 70 ? 'bg-green-500' :
                        area.averageScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.round(area.averageScore)}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${getScoreColor(area.averageScore)}`}>
                    {Math.round(area.averageScore)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(area.trend || 'down')}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Focus on practicing these areas to improve your overall score.
          Try our targeted practice sessions for better results.
        </p>
      </div>
    </div>
  )
}

export default WeakAreas
