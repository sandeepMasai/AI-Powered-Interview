
import React from 'react'
import { Lightbulb, Clock, TrendingUp, BookOpen } from 'lucide-react'

const Recommendations = () => {
  const recommendations = [
    {
      type: 'practice',
      title: 'React Hooks Practice',
      description: 'Based on your performance, we recommend practicing React Hooks concepts',
      icon: BookOpen,
      priority: 'high',
      time: '15 min'
    },
    {
      type: 'learn',
      title: 'Async JavaScript Patterns',
      description: 'Learn about Promises, async/await, and error handling patterns',
      icon: Lightbulb,
      priority: 'medium',
      time: '20 min'
    },
    {
      type: 'challenge',
      title: 'System Design Challenge',
      description: 'Try our system design challenge to improve your architecture skills',
      icon: TrendingUp,
      priority: 'low',
      time: '30 min'
    }
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <Lightbulb className="w-5 h-5 text-yellow-600" />
        <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon
          return (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{rec.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(rec.priority)}`}>
                      {rec.priority} priority
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{rec.time}</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Start Now →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 text-center">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All Recommendations
        </button>
      </div>
    </div>
  )
}

export default Recommendations