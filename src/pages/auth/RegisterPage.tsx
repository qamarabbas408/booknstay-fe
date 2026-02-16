import React from 'react';
import { Link } from 'react-router-dom';
import { User, Building2, ArrowLeft, ArrowRight } from 'lucide-react';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-fadeIn">
          <Link to="/" className="inline-flex items-center text-slate-600 hover:text-indigo-600 mb-8 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-display text-slate-900 mb-4">
            Join <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">BookNStay</span>
          </h1>
          <p className="text-xl text-slate-600 font-serif">
            Choose how you want to use our platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Guest Card */}
          <Link to="/register/guest" className="group relative animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative h-full glass p-8 rounded-3xl border border-white/40 hover:border-indigo-300 transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl bg-white/60 backdrop-blur-xl">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <User size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Guest Account</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Discover and book amazing hotels and events. Manage your trips and get exclusive deals.
              </p>
              <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform">
                Create Guest Account <ArrowRight className="ml-2" size={18} />
              </div>
            </div>
          </Link>

          {/* Vendor Card */}
          <Link to="/register/vendor" className="group relative animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative h-full glass p-8 rounded-3xl border border-white/40 hover:border-purple-300 transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl bg-white/60 backdrop-blur-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Building2 size={32} className="text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Vendor Account</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                List your properties or events. Manage bookings, track revenue, and grow your business.
              </p>
              <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
                Become a Partner <ArrowRight className="ml-2" size={18} />
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <p className="text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
