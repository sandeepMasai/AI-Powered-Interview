
import React, { useState } from 'react'
import { useInterview } from '../../context/InterviewContext'
import { User, Mail, Save, Edit3, Bell, Clock } from 'lucide-react'
import { authService } from '../../services/authService'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, logout } = useInterview()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    preferences: user?.preferences || {
      interviewDuration: 30,
      difficulty: 'medium',
      preferredTopics: [],
      notifications: {
        email: true,
        reminder: true
      }
    }
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePreferenceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }))
  }

  const handleNotificationChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notifications: {
          ...prev.preferences.notifications,
          [type]: value
        }
      }
    }))
  }

  const handleSave = async () => {
    try {
      await authService.updateProfile(formData)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
      console.error('Profile update error:', error)
    }
  }

  const topics = [
    'react', 'javascript', 'nodejs', 'mongodb', 'html', 'css', 'system-design'
  ]

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to view your profile</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              )}
            </div>
          </div>

          {/* Interview Preferences */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Interview Preferences</h2>

            <div className="space-y-6">
              <div>
                <label className="form-label">Default Duration</label>
                <select
                  value={formData.preferences.interviewDuration}
                  onChange={(e) => handlePreferenceChange('interviewDuration', parseInt(e.target.value))}
                  className="form-input"
                  disabled={!isEditing}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              <div>
                <label className="form-label">Difficulty Level</label>
                <select
                  value={formData.preferences.difficulty}
                  onChange={(e) => handlePreferenceChange('difficulty', e.target.value)}
                  className="form-input"
                  disabled={!isEditing}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="form-label">Preferred Topics</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {topics.map((topic) => (
                    <label key={topic} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.preferences.preferredTopics?.includes(topic)}
                        onChange={(e) => {
                          const currentTopics = formData.preferences.preferredTopics || []
                          const newTopics = e.target.checked
                            ? [...currentTopics, topic]
                            : currentTopics.filter(t => t !== topic)
                          handlePreferenceChange('preferredTopics', newTopics)
                        }}
                        className="rounded text-blue-600"
                        disabled={!isEditing}
                      />
                      <span className="text-sm text-gray-700 capitalize">{topic}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Email Notifications</div>
                  <div className="text-sm text-gray-600">Receive email updates about your progress</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.preferences.notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  className="rounded text-blue-600"
                  disabled={!isEditing}
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Reminder Notifications</div>
                  <div className="text-sm text-gray-600">Get reminders to practice</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.preferences.notifications.reminder}
                  onChange={(e) => handleNotificationChange('reminder', e.target.checked)}
                  className="rounded text-blue-600"
                  disabled={!isEditing}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Account Info */}
        <div className="space-y-6">
          {/* Account Summary */}
          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-gray-600 text-sm">{user.email}</p>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Your Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Interviews Completed</span>
                <span className="font-medium text-gray-900">{user.progress?.totalSessions || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Score</span>
                <span className="font-medium text-gray-900">{user.progress?.averageScore || 0}/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">DSA Problems Solved</span>
                <span className="font-medium text-gray-900">{user.progress?.dsaStats?.totalProblemsSolved || 0}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Account Actions</h3>
            <div className="space-y-2">
              <button
                onClick={logout}
                className="w-full btn-secondary"
              >
                Sign Out
              </button>
              <button className="w-full text-red-600 hover:text-red-700 text-sm font-medium">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile