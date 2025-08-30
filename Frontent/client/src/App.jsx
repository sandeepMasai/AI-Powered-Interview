
import {  Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
// import { InterviewProvider } from './context/InterviewContext'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import InterviewPage from './pages/Interview/InterviewPage'
import DsaPractice from './pages/Dsa/DsaPractice'
import Profile from './pages/Profile/Profile'
import './App.css'

function App() {
  return (
    
      <>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/interview" element={<InterviewPage />} />
              <Route path="/dsa" element={<DsaPractice />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </>
   
  )
}

export default App