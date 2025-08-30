
import React from 'react'
import { Link } from 'react-router-dom'
import { useInterview } from '../context/InterviewContext'
import { Code, MessageSquare, BarChart3, Users, Rocket, CheckCircle } from 'lucide-react'

const Home = () => {
  const { user } = useInterview()

  const features = [
    {
      icon: MessageSquare,
      title: 'AI-Powered Interviews',
      description: 'Practice with realistic interview questions and get instant AI feedback on your answers.'
    },
    {
      icon: Code,
      title: 'DSA Problem Solving',
      description: 'Solve coding problems with our integrated code editor and test your solutions instantly.'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor your improvement with detailed analytics and personalized recommendations.'
    },
    {
      icon: Users,
      title: 'Community Learning',
      description: 'Learn from others and share your knowledge with the community of developers.'
    }
  ]

  const stats = [
    { label: 'Interview Questions', value: '1000+' },
    { label: 'DSA Problems', value: '500+' },
    { label: 'Active Users', value: '10K+' },
    { label: 'Success Stories', value: '2K+' }
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Your Technical
            <span className="text-gradient"> Interviews</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Practice with AI-powered interviews, solve DSA problems, and track your progress to land your dream tech job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link to="/interview" className="btn-primary text-lg px-8 py-3">
                  Start Interview
                </Link>
                <Link to="/dsa" className="btn-secondary text-lg px-8 py-3">
                  Practice DSA
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-3">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform provides comprehensive tools to help you prepare for technical interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="card-hover text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of developers who have successfully prepared for their technical interviews with our platform.
          </p>
          {!user && (
            <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Your Journey Today
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home