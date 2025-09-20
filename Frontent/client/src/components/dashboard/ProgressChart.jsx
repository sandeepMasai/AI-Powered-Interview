

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { TrendingUp, Calendar } from 'lucide-react'

const ProgressChart = ({ data }) => {
  const hasValidData = Array.isArray(data) && data.length > 0

  // Fallback sample data if no valid data
  const chartData = hasValidData
    ? data
    : [
        { date: 'Jan', score: 65 },
        { date: 'Feb', score: 72 },
        { date: 'Mar', score: 68 },
        { date: 'Apr', score: 75 },
        { date: 'May', score: 82 },
        { date: 'Jun', score: 78 },
        { date: 'Jul', score: 85 },
        { date: 'Aug', score: 45 },
        { date: 'Sep', score: 55 },
        { date: 'Oct', score: 35 },
        { date: 'Nov', score: 75 },
        { date: 'Dec', score: 85 }
      ]

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
        <div className="flex items-center space-x-2 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+15% this month</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={12}
              tickMargin={8}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              domain={[0, 100]}
              tickMargin={8}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [`Score: ${value}`, '']}
              labelStyle={{ color: '#4b5563', fontWeight: 500 }}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', stroke: '#fff', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#2563eb' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>Last 30 days</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Interview Score</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressChart
