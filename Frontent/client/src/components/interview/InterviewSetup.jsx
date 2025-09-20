
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Clock, Zap, Target, BookOpen, Play } from 'lucide-react'

const InterviewSetup = ({ onStartInterview }) => {
  const [topic, setTopic] = useState('javascript')
  const [duration, setDuration] = useState(30)
  const [difficulty, setDifficulty] = useState('medium')
  const [isBlitzMode, setIsBlitzMode] = useState(false)

  const handleStart = () => {
    if (!onStartInterview) return
    onStartInterview({ topic, duration, difficulty, isBlitzMode })
  }

  const topicOptions = [
    { value: 'javascript', label: 'JavaScript Fundamentals', icon: '📝' },
    { value: 'react', label: 'React & Frontend', icon: '⚛️' },
    { value: 'algorithms', label: 'Data Structures & Algorithms', icon: '🧮' },
    { value: 'system-design', label: 'System Design', icon: '🏗️' },
    { value: 'backend', label: 'Backend Development', icon: '⚙️' },
  ]

  const difficultyOptions = [
    { value: 'easy', label: 'Easy - Entry Level', color: 'text-green-600', bgColor: 'bg-green-50' },
    { value: 'medium', label: 'Medium - Intermediate', color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { value: 'hard', label: 'Hard - Advanced', color: 'text-red-600', bgColor: 'bg-red-50' },
  ]

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
          <Target className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Interview Setup
        </h1>
        <p className="text-gray-600 text-lg">
          Configure your technical interview session
        </p>
      </div>

      {/* Topic Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <Label className="text-lg font-semibold text-gray-900">Interview Topic</Label>
            <p className="text-sm text-gray-600">Choose your focus area</p>
          </div>
        </div>
        <Select value={topic} onValueChange={setTopic}>
          <SelectTrigger className="h-14 bg-white border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors duration-200 shadow-sm">
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
            {topicOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="hover:bg-blue-50 focus:bg-blue-50 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Duration Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
            <Clock className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <Label className="text-lg font-semibold text-gray-900">Interview Duration</Label>
            <p className="text-sm text-gray-600">Select session length</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[15, 30, 45].map((mins) => (
            <Card 
              key={mins}
              className={`cursor-pointer transition-all duration-300 border-2 hover:scale-105 ${
                duration === mins 
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg ring-2 ring-blue-200 ring-opacity-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
              }`}
              onClick={() => setDuration(mins)}
            >
              <CardContent className="p-6 text-center">
                <div className={`text-3xl font-bold mb-1 ${
                  duration === mins ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {mins}
                </div>
                <div className={`text-sm font-medium ${
                  duration === mins ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  minutes
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
            <Target className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <Label className="text-lg font-semibold text-gray-900">Difficulty Level</Label>
            <p className="text-sm text-gray-600">Match your skill level</p>
          </div>
        </div>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="h-14 bg-white border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-colors duration-200 shadow-sm">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
            {difficultyOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="hover:bg-purple-50 focus:bg-purple-50 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${option.bgColor} border-2 ${option.color.replace('text-', 'border-')}`}></div>
                  <span className={`font-medium ${option.color}`}>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Blitz Mode */}
      <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1">
                <Label className="text-lg font-semibold text-amber-900">Blitz Mode</Label>
                <p className="text-sm text-amber-700">
                  Quick 30-second questions for rapid practice
                </p>
              </div>
            </div>
            <Switch
              checked={isBlitzMode}
              onCheckedChange={setIsBlitzMode}
              className="data-[state=checked]:bg-amber-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Start Button */}
      <div className="pt-4">
        <Button 
          onClick={handleStart}
          size="lg"
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Play className="h-5 w-5 mr-3" />
          Start Interview Session
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="border-2 border-gray-200 bg-gray-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Session Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Topic:</span>
              <span className="ml-2 font-medium text-gray-900">
                {topicOptions.find(t => t.value === topic)?.label}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <span className="ml-2 font-medium text-gray-900">{duration} minutes</span>
            </div>
            <div>
              <span className="text-gray-600">Difficulty:</span>
              <span className={`ml-2 font-medium ${difficultyOptions.find(d => d.value === difficulty)?.color}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Blitz Mode:</span>
              <span className={`ml-2 font-medium ${isBlitzMode ? 'text-amber-600' : 'text-gray-900'}`}>
                {isBlitzMode ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InterviewSetup
