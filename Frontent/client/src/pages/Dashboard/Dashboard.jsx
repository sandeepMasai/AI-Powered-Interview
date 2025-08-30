
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Target,
  Code,
  MessageSquare,
  Award,
  Clock
} from 'lucide-react'
import { progressService } from '../../services/progressService'
import ProgressChart from '../../components/dashboard/ProgressChart'
import WeakAreas from '../../components/dashboard/WeakAreas'
import Recommendations from '../../components/dashboard/Recommendations'
import SessionHistory from '../../components/dashboard/SessionHistory'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const data = await progressService.getDashboard()
      setDashboardData(data)
    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error('Dashboard error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load dashboard data</p>
        <button
          onClick={fetchDashboardData}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    )
  }

  const { userProgress, recentSessions, recentEvaluations, sessionStats, dsaStats } = dashboardData

  const stats = [
    {
      icon: MessageSquare,
      label: 'Total Interviews',
      value: userProgress.totalSessions,
      change: '+12%',
      trend: 'up',
      color: 'blue'
    },
    {
      icon: Award,
      label: 'Average Score',
      value: `${userProgress.averageScore}/10`,
      change: '+5%',
      trend: 'up',
      color: 'green'
    },
    {
      icon: Clock,
      label: 'Time Practiced',
      value: `${Math.round(userProgress.totalTimeSpent / 60)}h`,
      change: '+8%',
      trend: 'up',
      color: 'purple'
    },
    {
      icon: Code,
      label: 'DSA Problems Solved',
      value: userProgress.dsaStats?.totalProblemsSolved || 0,
      change: '+15%',
      trend: 'up',
      color: 'orange'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Track your progress and improve your interview skills
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link to="/interview" className="btn-primary">
            Start Interview
          </Link>
          <Link to="/dsa" className="btn-secondary">
            Practice DSA
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} mt-1`}>
                    {stat.change} from last week
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts and Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Chart */}
        <div className="lg:col-span-2">
          <ProgressChart data={sessionStats} />
        </div>

        {/* Weak Areas */}
        <div>
          <WeakAreas weakAreas={userProgress.weakAreas} />
        </div>
      </div>

      {/* Recommendations and History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommendations */}
        <Recommendations />

        {/* Session History */}
        <SessionHistory sessions={recentSessions} evaluations={recentEvaluations} />
      </div>
    </div>
  )
}

export default Dashboard