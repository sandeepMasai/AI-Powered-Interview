import React, { useEffect, useState } from 'react'

const Timer = ({ initialTime, onTimeUp }) => {
  const [time, setTime] = useState(initialTime)

  useEffect(() => {
    setTime(initialTime)
  }, [initialTime])

  useEffect(() => {
    if (time <= 0) {
      onTimeUp()
      return
    }
    const interval = setInterval(() => setTime((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [time])

  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  return (
    <div className="bg-gray-200 px-3 py-1 rounded font-mono">
      {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  )
}

export default Timer
