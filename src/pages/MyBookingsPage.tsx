import React, { useState } from 'react';
import { Calendar, MapPin, Ticket, Download, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle, Users, Filter, Search, Sparkles, CreditCard, Mail, Phone } from 'lucide-react';

// Mock booking data
interface Booking {
  id: number;
  type: 'hotel' | 'event';
  title: string;
  location: string;
  dates: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  price: number;
  image: string;
  guestsOrTickets?: string;
  bookingCode?: string;
  checkIn?: string;
  checkOut?: string;
}

const mockBookings: Booking[] = [
  {
    id: 1,
    type: 'hotel',
    title: "Grand Azure Resort",
    location: "Maldives",
    dates: "Jul 10 – Jul 17, 2026",
    checkIn: "Jul 10, 2026 • 3:00 PM",
    checkOut: "Jul 17, 2026 • 11:00 AM",
    status: 'confirmed',
    price: 1750,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    guestsOrTickets: "2 adults, 1 room",
    bookingCode: "BNS-H-001248"
  },
  {
    id: 2,
    type: 'event',
    title: "Summer Music Festival",
    location: "Wembley Arena, London",
    dates: "Aug 15, 2026 • 6:00 PM",
    status: 'confirmed',
    price: 170,
    image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&w=800&q=80",
    guestsOrTickets: "2 tickets • VIP Section",
    bookingCode: "BNS-E-002891"
  },
  {
    id: 3,
    type: 'hotel',
    title: "Coastal Haven Villa",
    location: "Santorini, Greece",
    dates: "Sep 5 – Sep 12, 2026",
    checkIn: "Sep 5, 2026 • 2:00 PM",
    checkOut: "Sep 12, 2026 • 12:00 PM",
    status: 'pending',
    price: 2240,
    image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=800&q=80",
    guestsOrTickets: "4 guests, 2 rooms",
    bookingCode: "BNS-H-003456"
  },
  {
    id: 4,
    type: 'event',
    title: "Tech Innovation Expo",
    location: "Silicon Valley Convention Center",
    dates: "Apr 20, 2025 • 9:00 AM",
    status: 'completed',
    price: 120,
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
    guestsOrTickets: "1 ticket • General Admission",
    bookingCode: "BNS-E-001234"
  },
  {
    id: 5,
    type: 'hotel',
    title: "The Urban Boutique",
    location: "New York, USA",
    dates: "Mar 15 – Mar 18, 2025",
    status: 'cancelled',
    price: 540,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    guestsOrTickets: "2 guests, 1 room",
    bookingCode: "BNS-H-002789"
  }
];

const MyBookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'hotel' | 'event'>('all');

  const filteredBookings = mockBookings
    .filter(b => {
      const matchesTab = activeTab === 'upcoming' 
        ? ['confirmed', 'pending'].includes(b.status)
        : ['completed', 'cancelled'].includes(b.status);
      
      const matchesSearch = searchQuery === '' ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'all' || b.type === filterType;
      
      return matchesTab && matchesSearch && matchesType;
    });

  const hasBookings = filteredBookings.length > 0;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: CheckCircle,
          label: 'Confirmed'
        };
      case 'pending':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          icon: Clock,
          label: 'Pending'
        };
      case 'cancelled':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          icon: XCircle,
          label: 'Cancelled'
        };
      case 'completed':
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          icon: CheckCircle,
          label: 'Completed'
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          icon: AlertCircle,
          label: status
        };
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
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
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-4px);
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

      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-white/30">
              <Calendar size={16} />
              <span className="text-sm font-semibold">Your Travel Dashboard</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display mb-3 leading-tight">
              My Bookings
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-serif max-w-2xl mx-auto">
              Manage your upcoming adventures and past experiences
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="glass p-2 rounded-2xl shadow-xl">
              <div className="flex items-center bg-white/90 p-3 rounded-xl">
                <Search className="text-indigo-600 mr-3 flex-shrink-0" size={20} />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-slate-800 placeholder:text-slate-400 w-full font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Tabs & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Tabs */}
          <div className="inline-flex bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-slate-200 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Upcoming ({mockBookings.filter(b => ['confirmed', 'pending'].includes(b.status)).length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'past'
                  ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Past ({mockBookings.filter(b => ['completed', 'cancelled'].includes(b.status)).length})
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All', icon: Filter },
              { value: 'hotel', label: 'Hotels', icon: MapPin },
              { value: 'event', label: 'Events', icon: Ticket }
            ].map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.value}
                  onClick={() => setFilterType(filter.value as any)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                    filterType === filter.value
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white/80 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {!hasBookings ? (
          <div className="glass p-12 md:p-16 rounded-3xl text-center border border-white/40 animate-fadeInUp">
            <div className="w-24 h-24 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar size={48} className="text-indigo-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display text-slate-900 mb-3">
              {searchQuery ? 'No matching bookings' : 'No bookings yet'}
            </h2>
            <p className="text-slate-600 font-serif text-lg mb-8 max-w-md mx-auto">
              {searchQuery 
                ? 'Try adjusting your search or filters'
                : 'Start exploring amazing hotels and unforgettable events — your next adventure awaits!'}
            </p>
            {!searchQuery && (
              <button className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-indigo-500/30 transition-all">
                Browse Hotels & Events
              </button>
            )}
          </div>
        ) : (
          /* Bookings List */
          <div className="space-y-6">
            {filteredBookings.map((booking, index) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={booking.id}
                  className="glass rounded-2xl overflow-hidden shadow-md hover:shadow-2xl card-hover border border-white/40 animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Image Section */}
                    <div className="relative w-full lg:w-80 h-56 lg:h-auto overflow-hidden flex-shrink-0 group">
                      <img
                        src={booking.image}
                        alt={booking.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Type Badge */}
                      <div className="absolute top-4 left-4">
                        <div className={`glass px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                          booking.type === 'hotel' 
                            ? 'bg-emerald-500/90 text-white' 
                            : 'bg-purple-500/90 text-white'
                        }`}>
                          {booking.type === 'hotel' ? '🏨 Hotel' : '🎫 Event'}
                        </div>
                      </div>

                      {/* Booking Code */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="glass backdrop-blur-md bg-white/90 px-3 py-2 rounded-lg">
                          <div className="text-xs text-slate-500 mb-0.5">Booking Code</div>
                          <div className="font-bold text-slate-900 text-sm">{booking.bookingCode}</div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-6 lg:p-8 flex flex-col">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="font-display text-2xl text-slate-900 mb-2 leading-tight">
                            {booking.title}
                          </h3>
                          <div className="flex items-center text-slate-600 mb-3">
                            <MapPin size={18} className="mr-2 flex-shrink-0 text-slate-400" />
                            <span className="font-medium">{booking.location}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`flex items-center px-4 py-2 rounded-xl border-2 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} font-semibold`}>
                          <StatusIcon size={18} className="mr-2" />
                          <span>{statusConfig.label}</span>
                        </div>
                      </div>

                      {/* Date/Time Info */}
                      <div className="bg-indigo-50 rounded-xl p-4 mb-4">
                        <div className="flex items-center text-indigo-700 font-semibold mb-2">
                          <Calendar size={18} className="mr-2" />
                          <span>{booking.dates}</span>
                        </div>
                        
                        {booking.checkIn && booking.checkOut && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-sm">
                            <div className="flex items-center text-slate-600">
                              <Clock size={16} className="mr-2 text-indigo-500" />
                              <div>
                                <div className="text-xs text-slate-500">Check-in</div>
                                <div className="font-semibold">{booking.checkIn}</div>
                              </div>
                            </div>
                            <div className="flex items-center text-slate-600">
                              <Clock size={16} className="mr-2 text-indigo-500" />
                              <div>
                                <div className="text-xs text-slate-500">Check-out</div>
                                <div className="font-semibold">{booking.checkOut}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Guest/Ticket Info */}
                      <div className="flex items-center text-slate-600 mb-6">
                        <Users size={18} className="mr-2 text-slate-400" />
                        <span className="font-medium">{booking.guestsOrTickets}</span>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-auto flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4 pt-6 border-t border-slate-200">
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Total Amount</div>
                          <div className="text-3xl font-display gradient-text">
                            ${booking.price.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {booking.status !== 'cancelled' && (
                            <>
                              <button className="flex items-center justify-center px-5 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-indigo-400 hover:text-indigo-600 transition-all">
                                <Download size={18} className="mr-2" />
                                <span className="hidden sm:inline">Download</span>
                              </button>
                              
                              <button className="flex items-center justify-center px-5 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-indigo-400 hover:text-indigo-600 transition-all">
                                <Mail size={18} className="mr-2" />
                                <span className="hidden sm:inline">Email</span>
                              </button>
                            </>
                          )}
                          
                          <button className="flex-1 sm:flex-none flex items-center justify-center bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all group">
                            <span>View Details</span>
                            <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        {hasBookings && (
          <div className="mt-12 glass rounded-2xl p-8 border border-white/40 text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Need Help?</h3>
            <p className="text-slate-600 mb-6">Our support team is here to assist you 24/7</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="flex items-center px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-indigo-400 transition-all">
                <Phone size={18} className="mr-2" />
                Contact Support
              </button>
              <button className="flex items-center px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                <Mail size={18} className="mr-2" />
                Send Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;