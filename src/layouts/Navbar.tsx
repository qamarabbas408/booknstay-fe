import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, Home, Building2, Calendar, BookOpen, User, LogIn, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/hotels', label: 'Hotels', icon: Building2 },
    { to: '/events', label: 'Events', icon: Calendar },
    { to: '/bookings', label: 'My Bookings', icon: BookOpen },
  ];

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .mobile-menu-enter {
          animation: slideInRight 0.3s ease-out forwards;
        }
        
        .mobile-menu-item {
          animation: slideDown 0.3s ease-out forwards;
          opacity: 0;
        }
        
        .backdrop-enter {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .hamburger-line {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hamburger-open .line-1 {
          transform: rotate(45deg) translateY(8px);
        }
        
        .hamburger-open .line-2 {
          opacity: 0;
          transform: translateX(20px);
        }
        
        .hamburger-open .line-3 {
          transform: rotate(-45deg) translateY(-8px);
        }
      `}</style>

      <nav className={`glass sticky top-0 z-50 border-b border-white/40 shadow-sm transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-2xl sm:text-3xl font-display gradient-text">BookNStay</div>
            <Sparkles className="text-indigo-500 group-hover:rotate-12 transition-transform" size={20} />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-slate-700 font-medium hover:text-indigo-600 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-slate-700 hover:text-indigo-600 font-medium focus:outline-none transition-colors p-1 rounded-lg hover:bg-slate-50"
                >
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200">
                    <User size={18} />
                  </div>
                  <span className="font-semibold">{user.name}</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-fadeIn origin-top-right overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/50">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                    </div>
                    
                    <div className="p-2">
                      {user.role === 'vendor' ? (
                        <Link
                          to="/vendor/dashboard"
                          className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                        >
                          <LayoutDashboard size={18} className="mr-2.5" />
                          Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/bookings"
                          className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                        >
                          <BookOpen size={18} className="mr-2.5" />
                          My Bookings
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-100 p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut size={18} className="mr-2.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center space-x-2"
              >
                <LogIn size={18} />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden w-10 h-10 flex flex-col items-center justify-center space-y-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
              isMobileMenuOpen ? 'hamburger-open' : ''
            }`}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line line-1 w-6 h-0.5 bg-slate-700 rounded-full"></span>
            <span className="hamburger-line line-2 w-6 h-0.5 bg-slate-700 rounded-full"></span>
            <span className="hamburger-line line-3 w-6 h-0.5 bg-slate-700 rounded-full"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden backdrop-enter"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Mobile Menu Drawer */}
          <div className="fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-white z-50 lg:hidden shadow-2xl mobile-menu-enter overflow-y-auto">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-display gradient-text">BookNStay</div>
                  <Sparkles className="text-indigo-500" size={18} />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-slate-700" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex-1 py-6">
                <div className="space-y-2 px-4">
                  {isAuthenticated && user && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center space-x-3 mb-1">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {navLinks.map((link, index) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.to;
                    
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`mobile-menu-item flex items-center space-x-3 px-4 py-4 rounded-xl transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <Icon size={22} className={isActive ? 'text-white' : 'text-slate-500'} />
                        <span className="font-semibold text-lg">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="my-6 px-4">
                  <div className="border-t border-slate-200"></div>
                </div>

                {/* Additional Mobile Links */}
                <div className="space-y-2 px-4">
                  {isAuthenticated && user && user.role === 'vendor' && (
                    <Link
                      to="/vendor/dashboard"
                      className="mobile-menu-item flex items-center space-x-3 px-4 py-4 rounded-xl text-slate-700 hover:bg-slate-50 transition-all"
                      style={{ animationDelay: `${navLinks.length * 0.1}s` }}
                    >
                      <LayoutDashboard size={22} className="text-slate-500" />
                      <span className="font-semibold text-lg">Dashboard</span>
                    </Link>
                  )}
                  
                  {!isAuthenticated && (
                    <Link
                      to="/vendor/register"
                      className="mobile-menu-item flex items-center space-x-3 px-4 py-4 rounded-xl text-slate-700 hover:bg-slate-50 transition-all"
                      style={{ animationDelay: `${navLinks.length * 0.1}s` }}
                    >
                      <Building2 size={22} className="text-slate-500" />
                      <span className="font-semibold text-lg">List Your Property</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-6 border-t border-slate-200 space-y-3">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="mobile-menu-item flex items-center justify-center space-x-2 w-full bg-red-50 text-red-600 px-6 py-4 rounded-xl font-bold text-lg hover:bg-red-100 transition-all"
                    style={{ animationDelay: `${(navLinks.length + 1) * 0.1}s` }}
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="mobile-menu-item flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:shadow-indigo-500/40"
                      style={{ animationDelay: `${(navLinks.length + 1) * 0.1}s` }}
                    >
                      <LogIn size={20} />
                      <span>Sign In</span>
                    </Link>

                    <Link
                      to="/register"
                      className="mobile-menu-item flex items-center justify-center space-x-2 w-full border-2 border-slate-200 text-slate-700 px-6 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all"
                      style={{ animationDelay: `${(navLinks.length + 2) * 0.1}s` }}
                    >
                      <User size={20} />
                      <span>Create Account</span>
                    </Link>
                  </>
                )}

                <p className="text-xs text-center text-slate-500 pt-2">
                  © 2026 BookNStay. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;