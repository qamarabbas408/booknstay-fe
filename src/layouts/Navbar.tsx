import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="text-3xl font-display gradient-text">BookNStay</div>
          <Sparkles className="text-indigo-500 group-hover:rotate-12 transition-transform" size={20} />
        </Link>
        
        <div className="hidden lg:flex items-center space-x-8">
          <Link to="/hotels" className="text-slate-700 font-medium hover:text-indigo-600 transition-colors relative group">
            Hotels
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/events" className="text-slate-700 font-medium hover:text-indigo-600 transition-colors relative group">
            Events
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/bookings" className="text-slate-700 font-medium hover:text-indigo-600 transition-colors relative group">
            My Bookings
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link to="/vendor/register" className="hidden md:block text-slate-700 font-semibold px-5 py-2 hover:bg-slate-100 rounded-xl transition-colors">
            List Property
          </Link>
          <Link to="/login" className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;