import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProgressChart from './ProgressChart' 

const ProgressChartWrapper = () => {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get('/api/progress/history?days=30')
        const sessionProgress = response.data.progress?.sessionProgress || []

        
        const formattedData = sessionProgress.map(item => ({
          date: item._id, 
          score: Math.round((item.averageScore || 0) * 10) 
        }))

        setChartData(formattedData)
      } catch (err) {
        setError('Failed to load progress data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [])

  if (loading) return <div className="card p-4 text-center">Loading progress chart...</div>
  if (error) return <div className="card p-4 text-center text-red-600">{error}</div>

  return <ProgressChart data={chartData} />
}

export default ProgressChartWrapper
