import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft, MapPin, Compass, HelpCircle, Mail, Sparkles } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { to: '/', label: 'Home', icon: Home, description: 'Back to homepage' },
    { to: '/hotels', label: 'Hotels', icon: MapPin, description: 'Browse accommodations' },
    { to: '/events', label: 'Events', icon: Compass, description: 'Discover events' },
    { to: '/bookings', label: 'My Bookings', icon: Search, description: 'View your trips' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-4 overflow-hidden">
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
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
          }
          50% { 
            transform: translateY(-20px) rotate(5deg);
          }
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
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
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
        
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-8px);
        }
      `}</style>

      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors z-10 glass px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold hidden sm:inline">Go Back</span>
      </button>

      {/* Main Content */}
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12 animate-scaleIn">
          {/* 404 Illustration */}
          <div className="mb-8 relative">
            {/* Large 404 Text */}
            <div className="text-[180px] md:text-[240px] font-display leading-none gradient-text opacity-20 select-none">
              404
            </div>
            
            {/* Centered Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-2xl animate-float">
                <HelpCircle size={80} className="text-indigo-600" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl border border-white/40 mb-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <h1 className="text-4xl md:text-5xl font-display text-slate-900 mb-4 leading-tight">
              Oops! Page Not Found
            </h1>
            <p className="text-lg md:text-xl text-slate-600 font-serif leading-relaxed max-w-2xl mx-auto">
              We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps it never existed.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="animate-fadeInUp" style={{animationDelay: '0.3s'}}>
          <h2 className="text-2xl font-display text-slate-900 text-center mb-6">
            Where would you like to go?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="glass rounded-2xl p-6 text-center card-hover shadow-md border border-white/40 group"
                  style={{animationDelay: `${0.4 + index * 0.1}s`}}
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">{link.label}</h3>
                  <p className="text-sm text-slate-600">{link.description}</p>
                </Link>
              );
            })}
          </div>

          {/* Search Section */}
          <div className="glass rounded-2xl p-6 md:p-8 shadow-lg border border-white/40 mb-8 animate-fadeInUp" style={{animationDelay: '0.8s'}}>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Search size={24} className="text-indigo-600" />
              <h3 className="font-bold text-xl text-slate-900">Search for something</h3>
            </div>
            <div className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search hotels, events, or destinations..."
                  className="flex-1 px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-indigo-400 outline-none transition-all text-slate-800 font-medium"
                />
                <button className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/40 transition-all">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeInUp" style={{animationDelay: '0.9s'}}>
            {/* Contact Support */}
            <div className="glass rounded-2xl p-6 border border-white/40 shadow-md">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">Need Help?</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Our support team is here to assist you
                  </p>
                  <a
                    href="mailto:support@booknstay.com"
                    className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm inline-flex items-center group"
                  >
                    Contact Support
                    <ArrowLeft size={16} className="ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            {/* Report Issue */}
            <div className="glass rounded-2xl p-6 border border-white/40 shadow-md">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white flex-shrink-0">
                  <Sparkles size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">Report a Problem</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Help us improve by reporting broken links
                  </p>
                  <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm inline-flex items-center group">
                    Report Issue
                    <ArrowLeft size={16} className="ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Home Button */}
          <div className="text-center mt-8 animate-fadeInUp" style={{animationDelay: '1s'}}>
            <Link
              to="/"
              className="inline-flex items-center justify-center space-x-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-indigo-500/40 transition-all group"
            >
              <Home size={24} />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-slate-500 mt-8 animate-fadeInUp" style={{animationDelay: '1.1s'}}>
          Error Code: 404 • Page Not Found
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;