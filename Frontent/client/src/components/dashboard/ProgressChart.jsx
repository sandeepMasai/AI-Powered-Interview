
import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Calendar } from 'lucide-react'

const ProgressChart = ({ data }) => {
  // Sample data if no data provided
  const chartData = data || [
    { date: 'Jan', score: 65 },
    { date: 'Feb', score: 72 },
    { date: 'Mar', score: 68 },
    { date: 'Apr', score: 75 },
    { date: 'May', score: 82 },
    { date: 'Jun', score: 78 },
    { date: 'Jul', score: 85 }
  ]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
        <div className="flex items-center space-x-2 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+15% this month</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#2563eb' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>Last 7 days</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Interview Score</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressChart