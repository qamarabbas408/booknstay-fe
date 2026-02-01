import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, Home, Building2, Calendar, BookOpen, User, LogIn, LogOut, LayoutDashboard, ChevronDown, Hotel, Ticket, Settings, CreditCard, Users, PlusCircle, TrendingUp, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const authModalRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
    setShowAuthModal(false);
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (authModalRef.current && !authModalRef.current.contains(event.target as Node)) {
        setShowAuthModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Guest navigation links
  const guestNavLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/hotels', label: 'Hotels', icon: Building2 },
    { to: '/events', label: 'Events', icon: Calendar },
    { to: '/bookings', label: 'My Bookings', icon: BookOpen },
  ];

  // Vendor navigation links
  const vendorNavLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/vendor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/vendor/properties', label: 'My Properties', icon: Hotel },
    { to: '/vendor/bookings', label: 'Bookings', icon: BookOpen },
    { to: '/vendor/analytics', label: 'Analytics', icon: TrendingUp },
  ];

  const currentNavLinks = user?.role === 'vendor' ? vendorNavLinks : guestNavLinks;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Archivo', -apple-system, sans-serif;
        }
        
        .font-display {
          font-family: 'Archivo', sans-serif;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        
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
        
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
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
        
        .dropdown-enter {
          animation: scaleIn 0.2s ease-out forwards;
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
          
          {/* Desktop Navigation - Role-based */}
          <div className="hidden lg:flex items-center space-x-8">
            {currentNavLinks.slice(1, user?.role === 'vendor' ? undefined : -1).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-slate-700 font-medium hover:text-indigo-600 transition-colors relative group ${
                  location.pathname === link.to ? 'text-indigo-600' : ''
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${
                  location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <>
                {/* Vendor Badge/Quick Action */}
                {user.role === 'vendor' && (
                  <Link
                    to="/vendor/properties/new"
                    className="flex items-center space-x-2 text-slate-700 hover:text-indigo-600 font-semibold px-4 py-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <PlusCircle size={18} />
                    <span className="hidden xl:inline">Add Property</span>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-slate-700 hover:text-indigo-600 font-medium focus:outline-none transition-colors px-3 py-2 rounded-xl hover:bg-slate-50"
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white border-2 ${
                      user.role === 'vendor' 
                        ? 'bg-linear-to-r from-purple-600 to-pink-600 border-purple-300' 
                        : 'bg-linear-to-r from-indigo-600 to-blue-600 border-indigo-300'
                    }`}>
                      {user.role === 'vendor' ? <Building2 size={18} /> : <User size={18} />}
                    </div>
                    <div className="text-left hidden xl:block">
                      <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                      <div className="font-semibold text-sm">{user.name}</div>
                    </div>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="dropdown-enter absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                      {/* Profile Header */}
                      <div className={`px-5 py-4 ${
                        user.role === 'vendor' 
                          ? 'bg-linear-to-r from-purple-50 to-pink-50 border-b border-purple-100' 
                          : 'bg-linear-to-r from-indigo-50 to-blue-50 border-b border-indigo-100'
                      }`}>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                            user.role === 'vendor' 
                              ? 'bg-linear-to-r from-purple-600 to-pink-600' 
                              : 'bg-linear-to-r from-indigo-600 to-blue-600'
                          }`}>
                            {user.role === 'vendor' ? <Building2 size={22} /> : <User size={22} />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-bold text-slate-900">{user.name}</p>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                user.role === 'vendor' 
                                  ? 'bg-purple-100 text-purple-700' 
                                  : 'bg-indigo-100 text-indigo-700'
                              }`}>
                                {user.role}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="p-2">
                        {user.role === 'vendor' ? (
                          <>
                            <Link
                              to="/vendor/dashboard"
                              className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <LayoutDashboard size={18} className="mr-3" />
                              Dashboard
                            </Link>
                            <Link
                              to="/vendor/properties"
                              className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <Hotel size={18} className="mr-3" />
                              My Properties
                            </Link>
                            <Link
                              to="/vendor/bookings"
                              className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <BookOpen size={18} className="mr-3" />
                              Bookings
                            </Link>
                            <Link
                              to="/vendor/earnings"
                              className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <CreditCard size={18} className="mr-3" />
                              Earnings
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/bookings"
                              className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <BookOpen size={18} className="mr-3" />
                              My Bookings
                            </Link>
                            <Link
                              to="/profile"
                              className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <User size={18} className="mr-3" />
                              Profile
                            </Link>
                          </>
                        )}
                        
                        <Link
                          to="/settings"
                          className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings size={18} className="mr-3" />
                          Settings
                        </Link>
                      </div>

                      {/* Switch Account Type (Optional) */}
                      {user.role === 'guest' && (
                        <div className="p-2 border-t border-slate-100 bg-linear-to-r from-purple-50/50 to-pink-50/50">
                          <Link
                            to="/vendor/register"
                            className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <div className="flex items-center">
                              <Building2 size={18} className="mr-3" />
                              <span>Become a Vendor</span>
                            </div>
                            <ChevronRight size={16} />
                          </Link>
                        </div>
                      )}

                      {/* Logout */}
                      <div className="border-t border-slate-100 p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <LogOut size={18} className="mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Auth Modal Trigger */}
                <div className="relative" ref={authModalRef}>
                  <button
                    onClick={() => setShowAuthModal(!showAuthModal)}
                    className="bg-linear-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center space-x-2"
                  >
                    <LogIn size={18} />
                    <span>Get Started</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${showAuthModal ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Auth Type Selector Dropdown */}
                  {showAuthModal && (
                    <div className="dropdown-enter absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                      <div className="p-4 bg-linear-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                        <h3 className="font-bold text-slate-900 mb-1">Choose Account Type</h3>
                        <p className="text-xs text-slate-600">Select how you want to use BookNStay</p>
                      </div>

                      <div className="p-3 space-y-2">
                        {/* Guest Account */}
                        <Link
                          to="/register/guest"
                          className="block p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
                          onClick={() => setShowAuthModal(false)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                              <User size={24} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-slate-900">Guest Account</h4>
                                <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                Book hotels and event tickets for your travels
                              </p>
                            </div>
                          </div>
                        </Link>

                        {/* Vendor Account */}
                        <Link
                          to="/register/vendor"
                          className="block p-4 rounded-xl border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all group"
                          onClick={() => setShowAuthModal(false)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white flex-shrink-0">
                              <Building2 size={24} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-slate-900">Vendor Account</h4>
                                <ChevronRight size={18} className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                List properties and manage bookings for your business
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>

                      <div className="p-3 bg-slate-50 border-t border-slate-100">
                        <p className="text-xs text-center text-slate-600">
                          Already have an account?{' '}
                          <Link
                            to="/login"
                            className="text-indigo-600 hover:text-indigo-700 font-semibold"
                            onClick={() => setShowAuthModal(false)}
                          >
                            Login
                          </Link>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
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
                {isAuthenticated && user && (
                  <div className={`mx-4 mb-6 p-4 rounded-2xl border-2 ${
                    user.role === 'vendor'
                      ? 'bg-linear-to-r from-purple-50 to-pink-50 border-purple-200'
                      : 'bg-linear-to-r from-indigo-50 to-blue-50 border-indigo-200'
                  }`}>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                        user.role === 'vendor'
                          ? 'bg-linear-to-r from-purple-600 to-pink-600'
                          : 'bg-linear-to-r from-indigo-600 to-blue-600'
                      }`}>
                        {user.role === 'vendor' ? <Building2 size={22} /> : <User size={22} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                            user.role === 'vendor'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 px-4">
                  {currentNavLinks.map((link, index) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.to;
                    
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`mobile-menu-item flex items-center space-x-3 px-4 py-4 rounded-xl transition-all ${
                          isActive
                            ? user?.role === 'vendor'
                              ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                              : 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
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

                {/* Additional Links for Authenticated Users */}
                {isAuthenticated && user && (
                  <>
                    <div className="my-6 px-4">
                      <div className="border-t border-slate-200"></div>
                    </div>

                    <div className="space-y-2 px-4">
                      {user.role === 'vendor' ? (
                        <>
                          <Link
                            to="/vendor/properties/new"
                            className="mobile-menu-item flex items-center space-x-3 px-4 py-4 rounded-xl text-slate-700 hover:bg-slate-50 transition-all"
                          >
                            <PlusCircle size={22} className="text-slate-500" />
                            <span className="font-semibold text-lg">Add Property</span>
                          </Link>
                          <Link
                            to="/vendor/earnings"
                            className="mobile-menu-item flex items-center space-x-3 px-4 py-4 rounded-xl text-slate-700 hover:bg-slate-50 transition-all"
                          >
                            <CreditCard size={22} className="text-slate-500" />
                            <span className="font-semibold text-lg">Earnings</span>
                          </Link>
                        </>
                      ) : (
                        <Link
                          to="/vendor/register"
                          className="mobile-menu-item flex items-center justify-between px-4 py-4 rounded-xl bg-linear-to-r from-purple-50 to-pink-50 border-2 border-purple-200 text-purple-700 hover:border-purple-300 transition-all"
                        >
                          <div className="flex items-center space-x-3">
                            <Building2 size={22} />
                            <span className="font-semibold text-lg">Become a Vendor</span>
                          </div>
                          <ChevronRight size={20} />
                        </Link>
                      )}
                      
                      <Link
                        to="/settings"
                        className="mobile-menu-item flex items-center space-x-3 px-4 py-4 rounded-xl text-slate-700 hover:bg-slate-50 transition-all"
                      >
                        <Settings size={22} className="text-slate-500" />
                        <span className="font-semibold text-lg">Settings</span>
                      </Link>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-6 border-t border-slate-200 space-y-3">
                {isAuthenticated && user ? (
                  <button
                    onClick={handleLogout}
                    className="mobile-menu-item flex items-center justify-center space-x-2 w-full bg-red-50 text-red-600 px-6 py-4 rounded-xl font-bold text-lg hover:bg-red-100 transition-all border-2 border-red-200"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <>
                    {/* Guest Login */}
                    <Link
                      to="/login?type=guest"
                      className="mobile-menu-item flex items-center justify-between w-full bg-linear-to-r from-indigo-600 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <User size={20} />
                        <span>Guest Login</span>
                      </div>
                      <ChevronRight size={20} />
                    </Link>

                    {/* Vendor Login */}
                    <Link
                      to="/login?type=vendor"
                      className="mobile-menu-item flex items-center justify-between w-full bg-linear-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Building2 size={20} />
                        <span>Vendor Login</span>
                      </div>
                      <ChevronRight size={20} />
                    </Link>

                    {/* Register Link */}
                    <Link
                      to="/register"
                      className="mobile-menu-item flex items-center justify-center space-x-2 w-full border-2 border-slate-200 text-slate-700 px-6 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all"
                    >
                      <Users size={20} />
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