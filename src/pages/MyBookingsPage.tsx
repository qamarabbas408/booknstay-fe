import React, { useState } from 'react';
import { Calendar, MapPin, Ticket, Download, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';

// Mock booking data (hotel + event mixed)
interface Booking {
  id: number;
  type: 'hotel' | 'event';
  title: string;
  location: string;
  dates: string;          // e.g. "Aug 15 – Aug 20" or "Aug 15, 8:00 PM"
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  price: string;
  image: string;
  guestsOrTickets?: string; // "2 guests" or "2 tickets"
}

const mockBookings: Booking[] = [
  {
    id: 1,
    type: 'hotel',
    title: "Grand Azure Resort",
    location: "Maldives",
    dates: "Jul 10 – Jul 17, 2025",
    status: 'confirmed',
    price: "$1,750",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    guestsOrTickets: "2 adults, 1 room",
  },
  {
    id: 2,
    type: 'event',
    title: "Summer Music Festival",
    location: "Wembley Arena",
    dates: "Aug 15, 2025 • 6:00 PM",
    status: 'confirmed',
    price: "$170",
    image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&w=800&q=80",
    guestsOrTickets: "2 tickets",
  },
  {
    id: 3,
    type: 'hotel',
    title: "Coastal Haven Villa",
    location: "Santorini, Greece",
    dates: "Sep 5 – Sep 12, 2025",
    status: 'pending',
    price: "$2,240",
    image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=800&q=80",
    guestsOrTickets: "4 guests",
  },
  // Add past ones...
];

const MyBookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const filteredBookings = mockBookings.filter(b => {
    if (activeTab === 'upcoming') return ['confirmed', 'pending'].includes(b.status);
    return b.status === 'completed' || b.status === 'cancelled';
  });

  const hasBookings = filteredBookings.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-20 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display text-slate-900 mb-3">My Bookings</h1>
          <p className="text-lg text-slate-600 font-serif">
            Track your upcoming adventures and relive past memories
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-slate-200">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'past'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {!hasBookings ? (
          <div className="glass p-12 rounded-3xl text-center border border-white/40">
            <Calendar size={64} className="mx-auto text-slate-300 mb-6" />
            <h2 className="text-2xl font-bold text-slate-700 mb-4">No bookings yet</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Start exploring amazing hotels and unforgettable events — your next adventure awaits!
            </p>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold hover:shadow-xl transition-all">
              Browse Hotels & Events
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map(booking => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col md:flex-row group"
              >
                <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden flex-shrink-0">
                  <img
                    src={booking.image}
                    alt={booking.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <div className={`glass px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                      booking.type === 'hotel' ? 'bg-emerald-500/90 text-white' : 'bg-purple-500/90 text-white'
                    }`}>
                      {booking.type}
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-xl text-slate-900">{booking.title}</h3>
                      <div className="flex items-center text-slate-500 text-sm mt-1">
                        <MapPin size={16} className="mr-1.5" />
                        {booking.location}
                      </div>
                    </div>

                    <div className={`flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {booking.status === 'confirmed' && <CheckCircle size={16} className="mr-1.5" />}
                      {booking.status === 'cancelled' && <XCircle size={16} className="mr-1.5" />}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                  </div>

                  <div className="flex items-center text-indigo-600 font-medium mb-4">
                    <Calendar size={18} className="mr-2" />
                    {booking.dates}
                  </div>

                  <div className="mt-auto flex flex-wrap justify-between items-end gap-4">
                    <div>
                      <div className="text-sm text-slate-500">
                        {booking.guestsOrTickets}
                      </div>
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        {booking.price}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex items-center text-slate-700 hover:text-indigo-600 transition-colors">
                        <Download size={18} className="mr-1.5" />
                        Ticket/PDF
                      </button>
                      <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center">
                        View Details
                        <ChevronRight size={18} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;