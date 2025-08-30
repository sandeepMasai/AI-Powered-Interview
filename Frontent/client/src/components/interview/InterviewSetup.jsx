
import React, { useState } from 'react'
import { Play, Clock, Target } from 'lucide-react'

const InterviewSetup = ({ onStartInterview }) => {
  const [formData, setFormData] = useState({
    topic: 'react',
    duration: 30,
    difficulty: 'medium'
  })

  const topics = [
    { value: 'react', label: 'React', icon: '⚛️' },
    { value: 'javascript', label: 'JavaScript', icon: '📜' },
    { value: 'nodejs', label: 'Node.js', icon: '🟢' },
    { value: 'mongodb', label: 'MongoDB', icon: '🍃' },
    { value: 'html', label: 'HTML/CSS', icon: '🎨' },
    { value: 'system-design', label: 'System Design', icon: '🏗️' }
  ]

  const durations = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '60 minutes' }
  ]

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ]

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onStartInterview(formData)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Your Interview</h1>
        <p className="text-gray-600">Choose your preferred topic, duration, and difficulty level</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Topic Selection */}
        <div>
          <label className="form-label">Select Topic</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {topics.map((topic) => (
              <button
                key={topic.value}
                type="button"
                onClick={() => handleChange('topic', topic.value)}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  formData.topic === topic.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{topic.icon}</div>
                <div className="font-medium text-gray-900">{topic.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div>
          <label className="form-label">Interview Duration</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {durations.map((duration) => (
              <button
                key={duration.value}
                type="button"
                onClick={() => handleChange('duration', duration.value)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${
                  formData.duration === duration.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Clock className="w-5 h-5 mx-auto mb-2 text-gray-600" />
                <div className="font-medium text-gray-900">{duration.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="form-label">Difficulty Level</label>
          <div className="grid grid-cols-3 gap-3">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.value}
                type="button"
                onClick={() => handleChange('difficulty', difficulty.value)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${
                  formData.difficulty === difficulty.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{difficulty.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          type="submit"
          className="w-full btn-primary flex items-center justify-center space-x-2 py-3 text-lg"
        >
          <Play className="w-5 h-5" />
          <span>Start Interview</span>
        </button>
      </form>
    </div>
  )
}

export default InterviewSetup