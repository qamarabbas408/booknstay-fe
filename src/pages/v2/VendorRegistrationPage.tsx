import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, User, Mail, Lock, Phone, Globe, CheckCircle, ArrowRight, ArrowLeft, Eye, EyeOff, Sparkles, Shield } from 'lucide-react';
import { useRegisterVendorMutation } from '../../store/services/AuthApi';
import { CustomToaster, showToast } from '../../components/CustomToaster';

const VendorRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state - matching backend field names exactly
  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    password: '',
    password_confirmation: '', // Laravel expects this field name for confirmed validation
    companyName: '',
    businessType: 'hotel', // Default value, must be one of: hotel, resort, event_venue, other
    phone: '',
    website: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerVendor, { isLoading }] = useRegisterVendorMutation();

  // Business type options matching backend enum
  const businessTypes = [
    { value: 'hotel', label: 'Hotel', icon: '🏨', description: 'Traditional hotel accommodations' },
    { value: 'resort', label: 'Resort', icon: '🏖️', description: 'Resort & vacation properties' },
    { value: 'event_venue', label: 'Event Venue', icon: '🎪', description: 'Event spaces & venues' },
    { value: 'other', label: 'Other', icon: '🏢', description: 'Other accommodation types' },
  ];

  // Client-side validation matching backend rules
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // ownerName: required|string
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }

    // email: required|email|unique:users
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // password: required|min:8|confirmed
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // password confirmation
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    // companyName: required|string
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company Name is required';
    }

    // businessType: required|in:hotel,resort,event_venue,other
    if (!formData.businessType) {
      newErrors.businessType = 'Business type is required';
    } else if (!['hotel', 'resort', 'event_venue', 'other'].includes(formData.businessType)) {
      newErrors.businessType = 'Invalid business type selected';
    }

    // phone: required|string
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    // website: required|string|url
    // if (!formData.website.trim()) {
    //   newErrors.website = 'Website URL is required';
    // } else if (!/^https?:\/\/.+\..+/.test(formData.website)) {
    //   newErrors.website = 'Please enter a valid URL (e.g., https://example.com)';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await registerVendor({ ...formData, role: 'vendor' }).unwrap();
      showToast.success('Registration successful! Please wait for approval.');
      navigate('/registration-pending');
      
    } catch (error: any) {
      // Handle backend validation errors
      if (error?.data?.errors) {
        setErrors(error.data.errors);
      } else {
        setErrors({ general: error?.data?.message || 'Registration failed. Please try again.' });
        showToast.error(error?.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 flex items-center justify-center p-4">
      <CustomToaster />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Crimson+Pro:wght@400;600&display=swap');
        
        * {
          font-family: 'Archivo', -apple-system, sans-serif;
        }
        
        .font-display {
          font-family: 'Archivo', sans-serif;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        
        .font-serif {
          font-family: 'Crimson Pro', serif;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="fixed top-6 left-6 flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors z-10 glass px-4 py-2.5 rounded-xl shadow-lg"
      >
        <ArrowLeft size={20} />
        <span className="font-semibold hidden sm:inline">Back to Home</span>
      </Link>

      {/* Main Content */}
      <div className="max-w-2xl w-full relative z-10">
        <div className="glass rounded-3xl shadow-2xl border border-white/40 overflow-hidden animate-fadeInUp">
          
          {/* Header */}
          <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white p-8 md:p-12 text-center">
            <div className="absolute inset-0 bg-black/10"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 size={40} className="text-white" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-display mb-3 leading-tight">
                Become a Vendor
              </h1>
              <p className="text-lg text-white/90 font-serif">
                List your property and start earning today
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
            
            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {errors.general}
              </div>
            )}

            {/* Owner Information */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <User size={20} className="mr-2 text-purple-600" />
                Owner Information
              </h2>
              
              <div className="space-y-4">
                {/* Owner Name - required|string */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Owner Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
                      errors.ownerName 
                        ? 'border-red-400 focus:border-red-500' 
                        : 'border-slate-200 focus:border-indigo-400'
                    }`}
                  />
                  {errors.ownerName && (
                    <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>
                  )}
                </div>

                {/* Email - required|email|unique:users */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
                        errors.email 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-slate-200 focus:border-indigo-400'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password - required|min:8|confirmed */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
                        errors.password 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-slate-200 focus:border-indigo-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">Minimum 8 characters</p>
                </div>

                {/* Password Confirmation */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
                        errors.password_confirmation 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-slate-200 focus:border-indigo-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="pt-6 border-t border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Building2 size={20} className="mr-2 text-purple-600" />
                Business Information
              </h2>
              
              <div className="space-y-4">
                {/* Company Name - required|string */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Grand Hotel & Resort"
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
                      errors.companyName 
                        ? 'border-red-400 focus:border-red-500' 
                        : 'border-slate-200 focus:border-indigo-400'
                    }`}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                  )}
                </div>

                {/* Business Type - required|in:hotel,resort,event_venue,other */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {businessTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, businessType: type.value }));
                          if (errors.businessType) {
                            setErrors(prev => ({ ...prev, businessType: '' }));
                          }
                        }}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          formData.businessType === type.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 hover:border-purple-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="text-2xl">{type.icon}</span>
                          <span className={`font-bold ${
                            formData.businessType === type.value ? 'text-purple-700' : 'text-slate-900'
                          }`}>
                            {type.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{type.description}</p>
                      </button>
                    ))}
                  </div>
                  {errors.businessType && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessType}</p>
                  )}
                </div>

                {/* Phone - required|string */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 1234567"
                      className={`w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
                        errors.phone 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-slate-200 focus:border-indigo-400'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Website - required|string|url */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Website URL <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://www.yourhotel.com"
                      className={`w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
                        errors.website 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-slate-200 focus:border-indigo-400'
                      }`}
                    />
                  </div>
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-600">{errors.website}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center">
                <Sparkles size={18} className="mr-2 text-purple-600" />
                Why Join BookNStay?
              </h3>
              <ul className="space-y-2">
                {[
                  'Reach thousands of potential customers',
                  'Easy-to-use booking management system',
                  'Secure payment processing',
                  'Real-time analytics and reporting',
                  '24/7 customer support'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start text-sm text-slate-700">
                    <CheckCircle size={16} className="text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Vendor Account</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Security Notice */}
            <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
              <Shield size={16} className="text-green-600" />
              <span>Your information is secure and encrypted</span>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login?type=vendor" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistrationPage;