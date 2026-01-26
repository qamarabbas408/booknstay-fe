import React, { useState } from 'react';
import { Calendar, Users, Star, DollarSign, BarChart2, Hotel, MessageSquare, Settings, ChevronRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

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
  status: 'confirmed' | 'pending' | 'cancelled';
  amount: string;
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
  },
  {
    id: 2,
    guestName: 'Sara Ali',
    checkIn: 'Jan 30, 2026',
    checkOut: 'Feb 1, 2026',
    roomType: 'Standard Room',
    status: 'pending',
    amount: '$380',
  },
  {
    id: 3,
    guestName: 'John Doe',
    checkIn: 'Feb 5, 2026',
    checkOut: 'Feb 10, 2026',
    roomType: 'Executive Villa',
    status: 'confirmed',
    amount: '$2,100',
  },
];

interface Room {
  id: number;
  type: string;
  total: number;
  available: number;
  pricePerNight: string;
  status: 'active' | 'maintenance';
}

const mockRooms: Room[] = [
  { id: 1, type: 'Standard Room', total: 50, available: 32, pricePerNight: '$180', status: 'active' },
  { id: 2, type: 'Deluxe Suite', total: 20, available: 15, pricePerNight: '$250', status: 'active' },
  { id: 3, type: 'Executive Villa', total: 10, available: 7, pricePerNight: '$320', status: 'maintenance' },
];

interface Review {
  id: number;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
}

const mockReviews: Review[] = [
  {
    id: 1,
    guestName: 'Ahmed Khan',
    rating: 5,
    comment: 'Amazing stay! Staff was wonderful.',
    date: 'Jan 20, 2026',
  },
  {
    id: 2,
    guestName: 'Sara Ali',
    rating: 4.5,
    comment: 'Great location, rooms were clean.',
    date: 'Jan 15, 2026',
  },
];

const VendorDashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-md border-r border-slate-200 shadow-lg z-30 hidden lg:block">
        <div className="p-6">
          <div className="text-2xl font-display gradient-text mb-12">Vendor Dashboard</div>
          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart2 size={20} /> },
              { id: 'bookings', label: 'Bookings', icon: <Calendar size={20} /> },
              { id: 'rooms', label: 'Room Management', icon: <Hotel size={20} /> },
              { id: 'reviews', label: 'Reviews & Ratings', icon: <Star size={20} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-display text-slate-900 mb-8">Welcome back, Qamar</h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {mockStats.map((stat, idx) => (
              <div key={idx} className="glass p-6 rounded-2xl border border-white/30 backdrop-blur-md shadow-xl card-hover">
                <div className="flex items-center justify-between mb-4">
                  {stat.icon}
                  <div className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-lg text-slate-600 mb-1">{stat.title}</h3>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Bookings */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                <Calendar className="text-indigo-600 mr-3" size={24} />
                Recent Bookings
              </h2>
              <button className="text-indigo-600 font-medium hover:underline flex items-center">
                View All
                <ChevronRight size={18} className="ml-1" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-2xl shadow-md border border-slate-100">
                <thead>
                  <tr className="bg-slate-50 text-left text-sm text-slate-600">
                    <th className="p-4">Guest</th>
                    <th className="p-4">Check-in</th>
                    <th className="p-4">Check-out</th>
                    <th className="p-4">Room Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookings.map(booking => (
                    <tr key={booking.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium">{booking.guestName}</td>
                      <td className="p-4">{booking.checkIn}</td>
                      <td className="p-4">{booking.checkOut}</td>
                      <td className="p-4">{booking.roomType}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 font-bold">{booking.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Room Management */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                <Hotel className="text-indigo-600 mr-3" size={24} />
                Room Inventory
              </h2>
              <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center">
                {/* <Plus size={18} className="mr-2" /> */}
                Add Room Type
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockRooms.map(room => (
                <div key={room.id} className="glass p-6 rounded-2xl border border-white/30 backdrop-blur-md shadow-xl card-hover">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-slate-900">{room.type}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      room.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-2 text-slate-600">
                    <p>Total Rooms: {room.total}</p>
                    <p>Available: {room.available}</p>
                    <p>Price/Night: {room.pricePerNight}</p>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button className="text-indigo-600 hover:underline">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Reviews */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                <MessageSquare className="text-indigo-600 mr-3" size={24} />
                Recent Reviews
              </h2>
              <button className="text-indigo-600 font-medium hover:underline flex items-center">
                View All
                <ChevronRight size={18} className="ml-1" />
              </button>
            </div>
            <div className="space-y-6">
              {mockReviews.map(review => (
                <div key={review.id} className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <Star size={18} fill="#f59e0b" className="text-amber-500 mr-1" />
                      <span className="font-bold text-amber-700">{review.rating}</span>
                    </div>
                    <span className="text-sm text-slate-500">{review.date}</span>
                  </div>
                  <p className="text-slate-700 mb-3">{review.comment}</p>
                  <p className="text-sm text-slate-600">- {review.guestName}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboardPage;