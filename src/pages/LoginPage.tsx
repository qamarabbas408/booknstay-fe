import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomToaster, showToast } from '../components/CustomToaster';
import { useLoginMutation } from '../store/services/AuthApi';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles, Chrome, Apple, Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const { user } = await login({ email, password }).unwrap();
    
    showToast.success('Login successful!');

    // 1. Business Logic: Check Vendor Status
    if (user.role === 'vendor') {
      if (user.status === 'pending') {
        // Redirect to your "Waiting Room" UI
        navigate('/registration-pending', { replace: true });
      } else {
        // Approved vendors go to dashboard
        navigate('/vendor/dashboard', { replace: true });
      }
      return; // Exit
    }

    // 2. Logic for Guests
    if (user.role === 'guest') {
      navigate('/dashboard', { replace: true });
      return;
    }

  } catch (err: any) {
    // If Laravel returns 403 (Forbidden) because of status, 
    // it will be caught here.
    const errorMessage = err.data?.message || 'Invalid credentials';
    showToast.error(errorMessage);
  }
};

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-4">
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
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .input-focus {
          transition: all 0.3s ease;
        }
        
        .input-focus:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15);
        }
        
        .noise {
          position: relative;
        }
        
        .noise::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        
        .shimmer-button {
          position: relative;
          overflow: hidden;
        }
        
        .shimmer-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        
        .shimmer-button:hover::before {
          left: 100%;
        }
      `}</style>

      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-stretch gap-8 relative z-10">
        
        {/* Left Side - Branding & Info */}
        <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-12 animate-slideInLeft">
          <a href="/" className="inline-flex items-center text-slate-700 hover:text-indigo-600 transition-colors mb-8 group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Home</span>
          </a>
          
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <div className="text-4xl font-display gradient-text">BookNStay</div>
              <Sparkles className="text-indigo-500" size={24} />
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-display text-slate-900 mb-6 leading-tight">
              Welcome Back
            </h1>
            
            <p className="text-xl text-slate-600 font-serif leading-relaxed max-w-md">
              Sign in to unlock exclusive deals, manage your bookings, and continue your journey with us.
            </p>
          </div>
          
          {/* Feature highlights */}
          <div className="space-y-4 max-w-md">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-lg">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Instant Booking Confirmation</h3>
                <p className="text-slate-600 text-sm">Get immediate confirmation for all your reservations</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-lg">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Exclusive Member Deals</h3>
                <p className="text-slate-600 text-sm">Access special rates and early-bird event tickets</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-pink-500 to-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-lg">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Manage Everything, Anywhere</h3>
                <p className="text-slate-600 text-sm">Your bookings and preferences in one place</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-8 lg:p-12 w-full max-w-md shadow-2xl border border-white/40 animate-fadeIn">
            <div className="mb-8">
              <h2 className="text-3xl font-display text-slate-900 mb-2">Sign In</h2>
              <p className="text-slate-600">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all input-focus text-slate-800 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all input-focus text-slate-800 placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 focus:ring-2"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-slate-600 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed shimmer-button"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 animate-spin" size={24} />
                    <span className="animate-pulse">Signing in...</span>
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-slate-500 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Social Sign In */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all group">
                <Chrome size={20} className="text-slate-600 group-hover:text-indigo-600 transition-colors" />
                <span className="font-semibold text-slate-700">Google</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all group">
                <Apple size={20} className="text-slate-600 group-hover:text-slate-900 transition-colors" />
                <span className="font-semibold text-slate-700">Apple</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-slate-600">
                Don't have an account?{' '}
                <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
                  Sign Up Free
                </a>
              </p>
            </div>

            {/* Terms */}
            <p className="mt-6 text-xs text-center text-slate-500 leading-relaxed">
              By signing in, you agree to our{' '}
              <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;