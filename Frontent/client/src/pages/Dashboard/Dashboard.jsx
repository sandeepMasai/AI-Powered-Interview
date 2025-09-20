import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Award, Clock, Code, TrendingUp, ArrowRight, Sparkles, Play, BarChart3, Target, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { progressService } from "../../services/progressService";
import ProgressChart from "../../components/dashboard/ProgressChart";
import WeakAreas from "../../components/dashboard/WeakAreas";
import Recommendations from "../../components/dashboard/Recommendations";
import SessionHistory from "../../components/dashboard/SessionHistory";
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-4 w-96 h-96 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Card className="border-2 border-gray-200 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg animate-pulse">
                <BarChart3 className="h-10 w-10 text-white animate-spin" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-800">Loading Dashboard</h3>
                <p className="text-gray-600 text-lg">Preparing your personalized insights...</p>
              </div>
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-4 w-96 h-96 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Card className="max-w-2xl w-full mx-4 border-2 border-gray-200 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center space-y-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-lg">
                <Sparkles className="w-12 h-12 text-gray-400" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-gray-900">Welcome to Your Dashboard</h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                  Start your first interview session to unlock personalized insights, progress tracking, and AI-powered recommendations.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  onClick={fetchDashboardData} 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-semibold transition-all duration-300"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Refresh Dashboard
                </Button>
                <Button 
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link to="/interview">
                    <Play className="h-5 w-5 mr-2" />
                    Start First Interview
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
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
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      description: "Practice sessions completed",
      progress: Math.min((userProgress?.totalSessions ?? 0) * 10, 100)
    },
    {
      icon: Award,
      label: "Average Score",
      value: `${userProgress?.averageScore ?? 0}/10`,
      change: "+5%",
      trend: "up",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100",
      description: "Performance rating",
      progress: (userProgress?.averageScore ?? 0) * 10
    },
    {
      icon: Clock,
      label: "Time Practiced",
      value: `${Math.round((userProgress?.totalTimeSpent ?? 0) / 60)}h`,
      change: "+8%",
      trend: "up",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      description: "Hours of preparation",
      progress: Math.min(Math.round((userProgress?.totalTimeSpent ?? 0) / 60) * 5, 100)
    },
    {
      icon: Code,
      label: "DSA Problems",
      value: userProgress?.dsaStats?.totalProblemsSolved ?? 0,
      change: "+15%",
      trend: "up",
      color: "from-amber-500 to-orange-500",
      bgColor: "from-amber-50 to-orange-100",
      description: "Coding challenges completed",
      progress: Math.min((userProgress?.dsaStats?.totalProblemsSolved ?? 0) * 2, 100)
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-4 w-96 h-96 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
              Track your progress, analyze performance, and accelerate your interview preparation journey with AI-powered insights
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <Link to="/interview">
                <Play className="w-5 h-5 mr-2" />
                Start Interview
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="border-2 border-gray-300 hover:border-blue-300 hover:bg-blue-50 font-semibold transition-all duration-300"
            >
              <Link to="/dsa">
                <Code className="w-5 h-5 mr-2" />
                Practice DSA
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <Card 
                key={index} 
                className="border-2 border-gray-200 shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm overflow-hidden group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mb-2">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        {stat.description}
                      </p>
                      <Progress value={stat.progress} className="h-2" />
                    </div>
                    <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-emerald-500 mr-2" />
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      {stat.change}
                    </Badge>
                    <span className="text-sm text-gray-500 ml-2">
                      from last week
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts and Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Progress Chart */}
          <div className="xl:col-span-2">
            <Card className="border-2 border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      Performance Trend
                    </CardTitle>
                    <p className="text-gray-600">Your progress over time</p>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      <span className="font-medium">Interview Score</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ProgressChart data={chartData} />
              </CardContent>
            </Card>
          </div>

          {/* Weak Areas */}
          <div className="space-y-6">
            <Card className="border-2 border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  Areas to Improve
                </CardTitle>
                <p className="text-gray-600">Focus on these topics</p>
              </CardHeader>
              <CardContent>
                <WeakAreas weakAreas={userProgress?.weakAreas ?? []} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommendations and History */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Recommendations */}
          <Card className="border-2 border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  AI Recommendations
                </CardTitle>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                  <Zap className="w-3 h-3 mr-1" />
                  Smart
                </Badge>
              </div>
              <p className="text-gray-600">Personalized study suggestions</p>
            </CardHeader>
            <CardContent>
              <Recommendations />
            </CardContent>
          </Card>

          {/* Session History */}
          <Card className="border-2 border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    Recent Activity
                  </CardTitle>
                  <p className="text-gray-600">Your latest sessions</p>
                </div>
                <Button asChild variant="ghost" size="sm" className="hover:bg-blue-50 group">
                  <Link to="/history">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <SessionHistory
                sessions={recentSessions ?? []}
                evaluations={recentEvaluations ?? []}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;