import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Camera,
  Award,
  Target,
  TrendingUp,
  LogOut,
  Upload,
  Settings,
  Bell,
  Shield,
  Clock
} from 'lucide-react';
import { authService } from '../../services/authService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await authService.getProfile();
      setProfile(data);
      setEditForm({
        name: data.name,
        email: data.email,
        image: data.image || null
      });
    } catch (error) {
      toast.error('Failed to load profile');
      console.error('Profile error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updateData = {
        name: editForm.name,
        email: editForm.email
      };

      if (editForm.image && editForm.image !== profile.image) {
        updateData.image = editForm.image;
      }

      const response = await authService.updateProfile(updateData);
      
      if (response.success) {
        setProfile({ ...profile, ...updateData });
        setIsEditing(false);
        setImagePreview(null);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Update error:', error);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: profile.name,
      email: profile.email,
      image: profile.image || null
    });
    setIsEditing(false);
    setImagePreview(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setImagePreview(base64String);
        setEditForm({ ...editForm, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
    }
  };

  const getAvatarSrc = () => {
    if (imagePreview) return imagePreview;
    if (profile?.image) return profile.image;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&size=200&background=3b82f6&color=ffffff&bold=true`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <LoadingSpinner size="large" />
            <p className="text-gray-600 animate-pulse">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center py-12 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">Profile Not Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Unable to load your profile information.
              </p>
            </div>
            <button onClick={fetchProfile} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: Target,
      label: 'Total Sessions',
      value: profile.progress?.totalSessions || 0,
      color: 'blue',
      description: 'Interview sessions completed'
    },
    {
      icon: Award,
      label: 'Average Score',
      value: `${profile.progress?.averageScore || 0}/10`,
      color: 'green',
      description: 'Performance rating'
    },
    {
      icon: TrendingUp,
      label: 'Strong Areas',
      value: profile.progress?.strongAreas?.length || 0,
      color: 'purple',
      description: 'Topics you excel at'
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-blue">
              Profile
            </h1>
            <p className="text-lg text-gray-600">
              Manage your account information and preferences
            </p>
          </div>
          
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button onClick={handleCancel} className="btn-secondary">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button onClick={handleSave} className="btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="btn-primary">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
                <button onClick={handleLogout} className="btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              </div>
            );
          })}
        </div>

        {/* Main Profile Card */}
        <div className="card-elevated p-8 space-y-8">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                <img
                  src={getAvatarSrc()}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-8 h-8 text-white" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-2xl font-bold"
                    placeholder="Your Name"
                  />
                ) : (
                  <h2 className="text-3xl font-bold text-gray-900">{profile.name}</h2>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="w-4 h-4" />
                <span className="capitalize">{profile.role}</span>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Progress Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Progress Overview
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-blue-700">Total Sessions</span>
                    <span className="text-lg font-bold text-blue-900">{profile.progress?.totalSessions || 0}</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-green-700">Average Score</span>
                    <span className="text-lg font-bold text-green-900">{profile.progress?.averageScore || 0}/10</span>
                  </div>
                </div>

                {profile.progress?.weakAreas && profile.progress.weakAreas.length > 0 && (
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                    <span className="text-sm font-medium text-orange-700 block mb-2">Areas to Improve</span>
                    <div className="flex flex-wrap gap-1">
                      {profile.progress.weakAreas.slice(0, 3).map((area, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded-full">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-purple-700">Interview Duration</span>
                    <span className="text-lg font-bold text-purple-900">{profile.preferences?.interviewDuration || 30} min</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-indigo-700">Difficulty Level</span>
                    <span className="text-lg font-bold text-indigo-900 capitalize">{profile.preferences?.difficulty || 'Medium'}</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700 block">Notifications</span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Email</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full ${profile.preferences?.notifications?.email ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Reminders</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full ${profile.preferences?.notifications?.reminder ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strong Areas */}
          {profile.progress?.strongAreas && profile.progress.strongAreas.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                Strong Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.progress.strongAreas.map((area, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full text-sm font-medium border border-green-200 hover:shadow-md transition-all"
                  >
                    <Award className="w-3 h-3" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;