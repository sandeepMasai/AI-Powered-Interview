
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useInterview } from '../../context/InterviewContext'
import { Eye, EyeOff, UserPlus, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useInterview()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validatePassword = (password) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
      checks: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumber,
        hasSpecialChar
      }
    }
  }

  const passwordValidation = validatePassword(formData.password)
  const passwordsMatch = formData.password === formData.confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!passwordValidation.isValid) {
      toast.error('Please ensure your password meets all requirements')
      return
    }

    if (!passwordsMatch) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const PasswordRequirement = ({ met, children }) => (
    <div className="flex items-center space-x-2 text-sm">
      {met ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-red-500" />
      )}
      <span className={met ? 'text-green-600' : 'text-red-600'}>{children}</span>
    </div>
  )

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600">Join thousands of developers preparing for technical interviews</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input pr-10"
              placeholder="Create a strong password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <PasswordRequirement met={passwordValidation.checks.minLength}>
              At least 8 characters
            </PasswordRequirement>
            <PasswordRequirement met={passwordValidation.checks.hasUpperCase}>
              One uppercase letter
            </PasswordRequirement>
            <PasswordRequirement met={passwordValidation.checks.hasLowerCase}>
              One lowercase letter
            </PasswordRequirement>
            <PasswordRequirement met={passwordValidation.checks.hasNumber}>
              One number
            </PasswordRequirement>
            <PasswordRequirement met={passwordValidation.checks.hasSpecialChar}>
              One special character
            </PasswordRequirement>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input pr-10 ${
                formData.confirmPassword && !passwordsMatch ? 'border-red-500' : ''
              }`}
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          {formData.confirmPassword && !passwordsMatch && (
            <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !passwordValidation.isValid || !passwordsMatch}
          className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <UserPlus className="w-5 h-5" />
          )}
          <span>{isLoading ? 'Creating account...' : 'Create Account'}</span>
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Register