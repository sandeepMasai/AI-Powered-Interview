import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInterview } from '../../context/InterviewContext';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Rename to avoid conflict
  const { register: registerUser } = useInterview();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!passwordsMatch) {
    toast.error('Passwords do not match');
    return;
  }

  setIsLoading(true);

  try {
    await registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    toast.success('Account created successfully!');
    
    //  Redirect to login page after successful registration
    navigate('/login');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Registration failed. Please try again.';
    toast.error(message);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto py-10">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Join thousands of developers preparing for technical interviews
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="mb-2 block">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`pr-10 ${
                    formData.confirmPassword && !passwordsMatch
                      ? 'border-red-500'
                      : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && !passwordsMatch && (
                <p className="text-sm text-red-600 mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !passwordsMatch}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </CardContent>

          <CardFooter className="text-center flex flex-col gap-2 mt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
