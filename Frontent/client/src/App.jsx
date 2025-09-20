import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import InterviewPage from './pages/Interview/InterviewPage'
import DsaPractice from './pages/Dsa/DsaPractice'
import Profile from './pages/Profile/Profile'
import DsaProblem from './pages/Dsa/DsaProblem'
import ProtectedRoute from './components/common/ProtectedRoute';
import ResultsModal from './components/interview/ResultsModal'

import './App.css'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dsa" element={<DsaPractice />} />
          
          <Route path="/dsa/problem/:problemId?" element={<DsaProblem />} />


 {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <InterviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results/:sessionId"
            element={
              <ProtectedRoute>
                <ResultsModal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  )
}

export default App



