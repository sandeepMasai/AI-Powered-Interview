import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Award, Clock, Code, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { progressService } from "../../services/progressService";
import ProgressChart from "../../components/dashboard/ProgressChart";
import WeakAreas from "../../components/dashboard/WeakAreas";
import Recommendations from "../../components/dashboard/Recommendations";
import SessionHistory from "../../components/dashboard/SessionHistory";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await progressService.getDashboard();
      console.log(data);
      
      if (!data) {
        setDashboardData(null);
        return;
      }

      const formattedStats = (data.sessionStats || []).map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        }),
        score: item.score
      }));

      setChartData(formattedStats);
      setDashboardData(data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.error("Dashboard error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <LoadingSpinner size="large" />
            <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center py-12 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">No Data Available</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Start your first interview session to see your progress and insights here.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={fetchDashboardData} className="btn-secondary">
                Try Again
              </button>
              <Link to="/interview" className="btn-primary">
                Start First Interview
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { userProgress, recentSessions, recentEvaluations } = dashboardData;

  const stats = [
    {
      icon: MessageSquare,
      label: "Total Interviews",
      value: userProgress?.totalSessions ?? 0,
      change: "+12%",
      trend: "up",
      color: "blue",
      description: "Practice sessions completed"
    },
    {
      icon: Award,
      label: "Average Score",
      value: `${userProgress?.averageScore ?? 0}/10`,
      change: "+5%",
      trend: "up",
      color: "green",
      description: "Performance rating"
    },
    {
      icon: Clock,
      label: "Time Practiced",
      value: `${Math.round((userProgress?.totalTimeSpent ?? 0) / 60)}h`,
      change: "+8%",
      trend: "up",
      color: "purple",
      description: "Hours of preparation"
    },
    {
      icon: Code,
      label: "DSA Problems Solved",
      value: userProgress?.dsaStats?.totalProblemsSolved ?? 0,
      change: "+15%",
      trend: "up",
      color: "orange",
      description: "Coding challenges completed"
    }
  ];

  const iconContainerClasses = {
    blue: "icon-container-blue",
    green: "icon-container-green",
    purple: "icon-container-purple",
    orange: "icon-container-orange"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-4 w-96 h-96 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-blue">
              Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Track your progress, analyze performance, and accelerate your interview preparation journey
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/interview" className="btn-primary group">
              Start Interview
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/dsa" className="btn-secondary">
              Practice DSA
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const iconClass = iconContainerClasses[stat.color];
            
            return (
              <div 
                key={index} 
                className="stat-card group hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`${iconClass} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    from last week
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts and Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Progress Chart */}
          <div className="xl:col-span-2">
            <div className="chart-container">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Performance Trend</h3>
                  <p className="text-gray-500 text-sm mt-1">Your progress over time</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <span>Interview Score</span>
                </div>
              </div>
              <ProgressChart data={chartData} />
            </div>
          </div>

          {/* Weak Areas */}
          <div className="space-y-6">
            <div className="chart-container">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Areas to Improve</h3>
                  <p className="text-gray-500 text-sm mt-1">Focus on these topics</p>
                </div>
              </div>
              <WeakAreas weakAreas={userProgress?.weakAreas ?? []} />
            </div>
          </div>
        </div>

        {/* Recommendations and History */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Recommendations */}
          <div className="chart-container">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">AI Recommendations</h3>
                <p className="text-gray-500 text-sm mt-1">Personalized study suggestions</p>
              </div>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <Recommendations />
          </div>

          {/* Session History */}
          <div className="chart-container">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
                <p className="text-gray-500 text-sm mt-1">Your latest sessions</p>
              </div>
              <Link to="/history" className="btn-ghost text-sm">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <SessionHistory
              sessions={recentSessions ?? []}
              evaluations={recentEvaluations ?? []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;