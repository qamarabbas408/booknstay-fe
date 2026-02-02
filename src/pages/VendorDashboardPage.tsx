import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { Calendar, Users, Star, DollarSign, BarChart2, Hotel, MessageSquare, Settings, ChevronRight, AlertTriangle, CheckCircle, Clock, Bell, Search, Filter, Download, TrendingUp, TrendingDown, Menu, X, Phone, Mail, MapPin, Edit, Trash2, Plus, Eye, LogOut, Ticket } from 'lucide-react';

// Mock data for hotel vendor dashboard
interface Stat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  positive?: boolean;
}

const mockStats: Stat[] = [
  {
    title: 'Total Bookings',
    value: 156,
    icon: <Calendar className="text-indigo-600" size={24} />,
    change: '+12%',
    positive: true,
  },
  {
    title: 'Occupancy Rate',
    value: '78%',
    icon: <Users className="text-indigo-600" size={24} />,
    change: '+5%',
    positive: true,
  },
  {
    title: 'Revenue This Month',
    value: '$42,500',
    icon: <DollarSign className="text-indigo-600" size={24} />,
    change: '-2%',
    positive: false,
  },
  {
    title: 'Average Rating',
    value: 4.7,
    icon: <Star className="text-indigo-600" size={24} />,
    change: '+0.2',
    positive: true,
  },
];

interface Booking {
  id: number;
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'checked-in';
  amount: string;
  phone?: string;
  email?: string;
}

const mockBookings: Booking[] = [
  {
    id: 1,
    guestName: 'Ahmed Khan',
    checkIn: 'Jan 28, 2026',
    checkOut: 'Feb 2, 2026',
    roomType: 'Deluxe Suite',
    status: 'confirmed',
    amount: '$1,250',
    phone: '+92 300 1234567',
    email: 'ahmed@example.com',
  },
  {
    id: 2,
    guestName: 'Sara Ali',
    checkIn: 'Jan 30, 2026',
    checkOut: 'Feb 1, 2026',
    roomType: 'Standard Room',
    status: 'pending',
    amount: '$380',
    phone: '+92 301 7654321',
    email: 'sara@example.com',
  },
  {
    id: 3,
    guestName: 'John Doe',
    checkIn: 'Feb 5, 2026',
    checkOut: 'Feb 10, 2026',
    roomType: 'Executive Villa',
    status: 'confirmed',
    amount: '$2,100',
    phone: '+1 555 123 4567',
    email: 'john@example.com',
  },
  {
    id: 4,
    guestName: 'Maria Garcia',
    checkIn: 'Jan 28, 2026',
    checkOut: 'Jan 29, 2026',
    roomType: 'Standard Room',
    status: 'checked-in',
    amount: '$190',
    phone: '+34 600 111 222',
    email: 'maria@example.com',
  },
];

interface Room {
  id: number;
  type: string;
  total: number;
  available: number;
  pricePerNight: string;
  status: 'active' | 'maintenance';
  amenities?: string[];
}

const mockRooms: Room[] = [
  { 
    id: 1, 
    type: 'Standard Room', 
    total: 50, 
    available: 32, 
    pricePerNight: '$180', 
    status: 'active',
    amenities: ['WiFi', 'TV', 'AC']
  },
  { 
    id: 2, 
    type: 'Deluxe Suite', 
    total: 20, 
    available: 15, 
    pricePerNight: '$250', 
    status: 'active',
    amenities: ['WiFi', 'TV', 'AC', 'Minibar', 'Balcony']
  },
  { 
    id: 3, 
    type: 'Executive Villa', 
    total: 10, 
    available: 7, 
    pricePerNight: '$320', 
    status: 'maintenance',
    amenities: ['WiFi', 'TV', 'AC', 'Kitchen', 'Pool']
  },
];

interface Review {
  id: number;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
  responded: boolean;
}

const mockReviews: Review[] = [
  {
    id: 1,
    guestName: 'Ahmed Khan',
    rating: 5,
    comment: 'Amazing stay! Staff was wonderful and the room was spotless.',
    date: 'Jan 20, 2026',
    responded: true,
  },
  {
    id: 2,
    guestName: 'Sara Ali',
    rating: 4.5,
    comment: 'Great location, rooms were clean. Minor issue with WiFi.',
    date: 'Jan 15, 2026',
    responded: false,
  },
  {
    id: 3,
    guestName: 'John Doe',
    rating: 4,
    comment: 'Good value for money. Breakfast could be improved.',
    date: 'Jan 10, 2026',
    responded: true,
  },
];

interface Notification {
  id: number;
  type: 'booking' | 'review' | 'maintenance' | 'payment';
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'booking',
    message: 'New booking from Sara Ali',
    time: '5 mins ago',
    read: false,
  },
  {
    id: 2,
    type: 'review',
    message: 'New review received (4.5 stars)',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'maintenance',
    message: 'Room 305 maintenance completed',
    time: '2 hours ago',
    read: true,
  },
  {
    id: 4,
    type: 'payment',
    message: 'Payment received: $1,250',
    time: '3 hours ago',
    read: true,
  },
];

interface VendorEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  status: 'active' | 'draft' | 'past';
  ticketsSold: number;
  revenue: string;
}

const mockVendorEvents: VendorEvent[] = [
  {
    id: 1,
    title: 'Summer Music Festival',
    date: 'Aug 15, 2026',
    location: 'Wembley Arena',
    status: 'active',
    ticketsSold: 450,
    revenue: '$38,250'
  },
  {
    id: 2,
    title: 'Tech Innovation Summit',
    date: 'Sep 10, 2026',
    location: 'Convention Center',
    status: 'draft',
    ticketsSold: 0,
    revenue: '$0'
  },
];

const VendorDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const unreadNotifications = mockNotifications.filter(n => !n.read).length;

  const filteredBookings = mockBookings.filter(booking =>
    booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.roomType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm z-40">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Hotel Vendor
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-4 py-2 w-64">
              <Search size={18} className="text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-slate-100 rounded-lg"
              >
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    <span className="text-xs text-indigo-600">{unreadNotifications} new</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                          !notification.read ? 'bg-indigo-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            notification.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                            notification.type === 'review' ? 'bg-amber-100 text-amber-600' :
                            notification.type === 'maintenance' ? 'bg-red-100 text-red-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {notification.type === 'booking' && <Calendar size={16} />}
                            {notification.type === 'review' && <Star size={16} />}
                            {notification.type === 'maintenance' && <AlertTriangle size={16} />}
                            {notification.type === 'payment' && <DollarSign size={16} />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-900">{notification.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-slate-900">Qamar Hotel</p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>
              <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                Q
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white/90 backdrop-blur-md border-r border-slate-200 shadow-lg z-30 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 h-full flex flex-col">
          <nav className="space-y-2 flex-1">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart2 size={20} /> },
              { id: 'bookings', label: 'Bookings', icon: <Calendar size={20} /> },
              { id: 'events', label: 'Event Management', icon: <Ticket size={20} /> },
              { id: 'rooms', label: 'Room Management', icon: <Hotel size={20} /> },
              { id: 'reviews', label: 'Reviews & Ratings', icon: <Star size={20} /> },
              { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={20} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                  activeSection === item.id
                    ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              <span className="ml-3 font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-24 pb-20 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {activeSection === 'events' ? (
            <div className="animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Event Management</h1>
                  <p className="text-slate-600">Manage your events, tickets, and listings</p>
                </div>
                <button 
                  onClick={() => navigate('/vendor/events/create')}
                  className="px-5 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={18} />
                  Create Event
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockVendorEvents.map(event => (
                  <div key={event.id} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-slate-900 mb-1">{event.title}</h3>
                        <div className="flex items-center text-slate-500 text-sm">
                          <Calendar size={14} className="mr-1" />
                          {event.date}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'active' ? 'bg-green-100 text-green-700' :
                        event.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-slate-600 text-sm">
                        <MapPin size={16} className="mr-2 text-indigo-600" />
                        {event.location}
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                        <div>
                          <p className="text-xs text-slate-500">Tickets Sold</p>
                          <p className="font-bold text-slate-900">{event.ticketsSold}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Revenue</p>
                          <p className="font-bold text-indigo-600">{event.revenue}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      <button className="flex-1 text-indigo-600 hover:bg-indigo-50 py-2 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2">
                        <Edit size={16} />
                        Edit
                      </button>
                      <button className="flex-1 text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2">
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Welcome back, Qamar</h1>
              <p className="text-slate-600">Here's what's happening with your hotel today</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-slate-300 rounded-xl hover:shadow-md transition-all flex items-center gap-2">
                <Download size={18} />
                <span className="hidden md:inline">Export</span>
              </button>
              <button className="px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                <Plus size={18} />
                <span className="hidden md:inline">New Booking</span>
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {mockStats.map((stat, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    {stat.icon}
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${
                    stat.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {stat.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-sm text-slate-600 mb-1">{stat.title}</h3>
                <div className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-xl transition-all text-center">
                <Calendar className="mx-auto mb-2" size={24} />
                <span className="text-sm font-medium">Check-ins Today</span>
                <p className="text-2xl font-bold mt-1">3</p>
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-xl transition-all text-center">
                <Clock className="mx-auto mb-2" size={24} />
                <span className="text-sm font-medium">Check-outs Today</span>
                <p className="text-2xl font-bold mt-1">5</p>
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-xl transition-all text-center">
                <AlertTriangle className="mx-auto mb-2" size={24} />
                <span className="text-sm font-medium">Pending Tasks</span>
                <p className="text-2xl font-bold mt-1">2</p>
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-xl transition-all text-center">
                <MessageSquare className="mx-auto mb-2" size={24} />
                <span className="text-sm font-medium">New Messages</span>
                <p className="text-2xl font-bold mt-1">7</p>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mb-6">
            <div className="flex items-center bg-white rounded-xl px-4 py-3 border border-slate-200">
              <Search size={18} className="text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>

          {/* Recent Bookings */}
          <section className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                <Calendar className="text-indigo-600 mr-3" size={24} />
                Recent Bookings
              </h2>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-slate-300 rounded-xl hover:shadow-md transition-all flex items-center gap-2">
                  <Filter size={18} />
                  Filter
                </button>
                <button className="text-indigo-600 font-medium hover:underline flex items-center">
                  View All
                  <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-lg border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left text-sm text-slate-600 border-b border-slate-200">
                    <th className="p-4 font-semibold">Guest</th>
                    <th className="p-4 font-semibold">Check-in</th>
                    <th className="p-4 font-semibold">Check-out</th>
                    <th className="p-4 font-semibold">Room Type</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-slate-900">{booking.guestName}</div>
                        <div className="text-sm text-slate-500">{booking.email}</div>
                      </td>
                      <td className="p-4 text-slate-700">{booking.checkIn}</td>
                      <td className="p-4 text-slate-700">{booking.checkOut}</td>
                      <td className="p-4 text-slate-700">{booking.roomType}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          booking.status === 'checked-in' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {booking.status === 'confirmed' && <CheckCircle size={14} />}
                          {booking.status === 'pending' && <Clock size={14} />}
                          {booking.status === 'cancelled' && <X size={14} />}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">{booking.amount}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSelectedBooking(booking)}
                            className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors" title="Edit">
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900">{booking.guestName}</h3>
                      <p className="text-sm text-slate-500">{booking.roomType}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      booking.status === 'checked-in' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600 mb-3">
                    <div className="flex justify-between">
                      <span>Check-in:</span>
                      <span className="font-medium">{booking.checkIn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-out:</span>
                      <span className="font-medium">{booking.checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-bold text-slate-900">{booking.amount}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-slate-200">
                    <button className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
                      View Details
                    </button>
                    <button className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Room Management */}
          <section className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                <Hotel className="text-indigo-600 mr-3" size={24} />
                Room Inventory
              </h2>
              <button className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                <Plus size={18} />
                Add Room Type
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {mockRooms.map(room => (
                <div key={room.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-slate-900">{room.type}</h3>
                      <p className="text-2xl font-bold text-indigo-600 mt-1">{room.pricePerNight}</p>
                      <p className="text-sm text-slate-500">per night</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      room.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total Rooms:</span>
                      <span className="font-semibold text-slate-900">{room.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Available:</span>
                      <span className="font-semibold text-green-600">{room.available}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Occupied:</span>
                      <span className="font-semibold text-amber-600">{room.total - room.available}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Occupancy</span>
                      <span>{Math.round(((room.total - room.available) / room.total) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-linear-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${((room.total - room.available) / room.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {room.amenities && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-600 mb-2">Amenities:</p>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map((amenity, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button className="flex-1 text-indigo-600 hover:bg-indigo-50 py-2 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2">
                      <Edit size={16} />
                      Edit
                    </button>
                    <button className="flex-1 text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2">
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Reviews */}
          <section>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                <MessageSquare className="text-indigo-600 mr-3" size={24} />
                Recent Reviews
              </h2>
              <button className="text-indigo-600 font-medium hover:underline flex items-center">
                View All
                <ChevronRight size={18} className="ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {mockReviews.map(review => (
                <div key={review.id} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-amber-50 px-3 py-1 rounded-lg">
                        <Star size={16} fill="#f59e0b" className="text-amber-500 mr-1" />
                        <span className="font-bold text-amber-700">{review.rating}</span>
                      </div>
                      {review.responded && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                          Responded
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-slate-500">{review.date}</span>
                  </div>
                  <p className="text-slate-700 mb-4 leading-relaxed">{review.comment}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <p className="text-sm font-medium text-slate-900">- {review.guestName}</p>
                    {!review.responded && (
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                        Reply
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
            </>
          )}
        </div>
      </main>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-900">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 text-lg">Guest Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Users size={18} className="text-indigo-600" />
                      <span>{selectedBooking.guestName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Mail size={18} className="text-indigo-600" />
                      <span>{selectedBooking.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Phone size={18} className="text-indigo-600" />
                      <span>{selectedBooking.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-semibold text-slate-900 mb-3 text-lg">Booking Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Check-in</p>
                      <p className="font-semibold text-slate-900">{selectedBooking.checkIn}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Check-out</p>
                      <p className="font-semibold text-slate-900">{selectedBooking.checkOut}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Room Type</p>
                      <p className="font-semibold text-slate-900">{selectedBooking.roomType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        selectedBooking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        selectedBooking.status === 'checked-in' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-indigo-600">{selectedBooking.amount}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-slate-200">
                  <button className="flex-1 px-4 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                    Confirm Booking
                  </button>
                  <button className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:shadow-md transition-all">
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default VendorDashboardPage;