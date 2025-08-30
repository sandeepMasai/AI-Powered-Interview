
import React, { useState, useEffect } from 'react'
import { Clock, AlertCircle } from 'lucide-react'

const Timer = ({ initialTime, onTimeUp, isActive = true }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    setTimeLeft(initialTime)
    setIsWarning(false)
  }, [initialTime])

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          onTimeUp?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, timeLeft, onTimeUp])

  useEffect(() => {
    setIsWarning(timeLeft <= 30 && timeLeft > 0)
  }, [timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (timeLeft <= 0) {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <AlertCircle className="w-5 h-5" />
        <span className="font-medium">Time's up!</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${
      isWarning ? 'text-orange-600' : 'text-gray-600'
    }`}>
      <Clock className="w-5 h-5" />
      <span className="font-medium">{formatTime(timeLeft)}</span>
      {isWarning && (
        <span className="text-sm">(Hurry up!)</span>
      )}
    </div>
  )
}

export default Timer