import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Mail, CheckCircle, AlertCircle, RefreshCw, LogOut, ArrowLeft, Shield, Phone, MessageSquare, Sparkles } from 'lucide-react';

const WaitingApprovalPage: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [emailResent, setEmailResent] = useState(false);

  // Mock user data for static UI
  const mockUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "vendor" // or "guest"
  };

  const handleCheckStatus = () => {
    setIsChecking(true);
    // Simulate checking
    setTimeout(() => {
      setIsChecking(false);
    }, 2000);
  };

  const handleResendEmail = () => {
    setEmailResent(true);
    setTimeout(() => {
      setEmailResent(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-4">
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
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
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
        
        .progress-ring {
          transform: rotate(-90deg);
        }
        
        .progress-ring-circle {
          stroke-dasharray: 283;
          stroke-dashoffset: 283;
          animation: progress 2s ease-out forwards;
        }
        
        @keyframes progress {
          to {
            stroke-dashoffset: 94;
          }
        }
      `}</style>

      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="fixed top-6 left-6 flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors z-10 glass px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl"
      >
        <ArrowLeft size={20} />
        <span className="font-semibold hidden sm:inline">Back to Home</span>
      </Link>

      {/* Main Content */}
      <div className="max-w-2xl w-full relative z-10">
        <div className="glass rounded-3xl shadow-2xl border border-white/40 overflow-hidden animate-scaleIn">
          
          {/* Header Section */}
          <div className="relative bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-8 md:p-12 text-center overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              {/* Animated Clock Icon */}
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <svg className="progress-ring w-24 h-24" viewBox="0 0 100 100">
                  <circle
                    className="text-white/20"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="progress-ring-circle text-white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock size={40} className="animate-pulse" />
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-display mb-3 leading-tight">
                Registration Pending
              </h1>
              <p className="text-xl text-white/90 font-serif">
                Your account is awaiting approval
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-10">
            {/* User Info */}
            <div className="bg-indigo-50 rounded-2xl p-6 mb-8 border border-indigo-100 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                  <Shield size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">Account Under Review</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    Thank you for registering, <span className="font-semibold text-indigo-600">{mockUser.name}</span>! 
                    Our team is currently reviewing your {mockUser.role === 'vendor' ? 'vendor' : 'account'} application.
                  </p>
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail size={16} className="mr-2 text-indigo-600" />
                    <span>{mockUser.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="mb-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <h3 className="font-bold text-lg text-slate-900 mb-5">Approval Process</h3>
              <div className="space-y-5">
                {/* Step 1 - Completed */}
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="font-semibold text-slate-900 mb-0.5">Registration Submitted</h4>
                    <p className="text-sm text-slate-600">Your application has been received successfully</p>
                  </div>
                </div>

                {/* Step 2 - In Progress */}
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 border-2 border-amber-300">
                      <Clock size={20} className="text-amber-600 animate-pulse" />
                    </div>
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center space-x-2 mb-0.5">
                      <h4 className="font-semibold text-slate-900">Admin Review</h4>
                      <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">Our team is verifying your information</p>
                  </div>
                </div>

                {/* Step 3 - Pending */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle size={20} className="text-slate-400" />
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="font-semibold text-slate-500 mb-0.5">Account Activation</h4>
                    <p className="text-sm text-slate-500">You'll receive an email once approved</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Next Section */}
            <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles size={20} className="text-purple-600" />
                <h3 className="font-bold text-lg text-slate-900">What happens next?</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-700 font-bold text-sm">1</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Our admin team will review your application within <strong className="text-purple-700">24-48 hours</strong>
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-700 font-bold text-sm">2</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    You'll receive an <strong className="text-purple-700">email notification</strong> once your account is approved
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-700 font-bold text-sm">3</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Once approved, you can <strong className="text-purple-700">sign in and start using</strong> all platform features
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-8 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              <button
                onClick={handleCheckStatus}
                disabled={isChecking}
                className="w-full flex items-center justify-center space-x-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChecking ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    <span>Checking Status...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={20} />
                    <span>Check Approval Status</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResendEmail}
                disabled={emailResent}
                className="w-full flex items-center justify-center space-x-2 border-2 border-slate-200 text-slate-700 px-6 py-4 rounded-xl font-semibold hover:border-indigo-400 hover:text-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail size={20} />
                <span>{emailResent ? 'Email Sent!' : 'Resend Confirmation Email'}</span>
              </button>

              {emailResent && (
                <div className="flex items-center justify-center space-x-2 text-green-600 text-sm bg-green-50 py-3 rounded-xl border border-green-200">
                  <CheckCircle size={16} />
                  <span>Confirmation email has been resent to {mockUser.email}</span>
                </div>
              )}
            </div>

            {/* Help Section */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-200 animate-fadeInUp" style={{animationDelay: '0.5s'}}>
              <h3 className="font-bold text-slate-900 mb-3 flex items-center">
                <MessageSquare size={20} className="mr-2 text-indigo-600" />
                Need Help?
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                If you have questions about your application or need assistance, our support team is here to help.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="mailto:support@booknstay.com"
                  className="flex items-center justify-center space-x-2 bg-white border-2 border-slate-200 text-slate-700 px-4 py-3 rounded-xl font-semibold hover:border-indigo-400 hover:text-indigo-600 transition-all"
                >
                  <Mail size={18} />
                  <span>Email Support</span>
                </a>
                <a
                  href="tel:+1234567890"
                  className="flex items-center justify-center space-x-2 bg-white border-2 border-slate-200 text-slate-700 px-4 py-3 rounded-xl font-semibold hover:border-indigo-400 hover:text-indigo-600 transition-all"
                >
                  <Phone size={18} />
                  <span>Call Us</span>
                </a>
              </div>
            </div>

            {/* Logout Button */}
            <Link
              to="/login"
              className="w-full flex items-center justify-center space-x-2 text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </Link>

            {/* Footer Note */}
            <p className="text-center text-xs text-slate-500 mt-6 leading-relaxed">
              By registering with BookNStay, you agree to our{' '}
              <Link to="/terms" className="text-indigo-600 hover:underline font-semibold">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-indigo-600 hover:underline font-semibold">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 glass rounded-2xl p-6 border border-white/40 text-center shadow-lg animate-fadeInUp" style={{animationDelay: '0.6s'}}>
          <p className="text-sm text-slate-600 leading-relaxed">
            Want to explore the platform while you wait?{' '}
            <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline inline-flex items-center">
              Browse as Guest
              <ArrowLeft size={16} className="ml-1 rotate-180" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaitingApprovalPage;