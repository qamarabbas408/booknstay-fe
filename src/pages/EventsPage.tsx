import React, { useState } from 'react';
import { Search, Calendar, MapPin, Star, Ticket, ChevronRight, Sparkles, Filter, Clock, Music, Users, Zap } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  category: string;
  location: string;
  venue: string;
  price: string;
  date: string;
  time: string;
  image: string;
  rating: number;
  attendees: number;
  featured?: boolean;
  trending?: boolean;
}

const events: Event[] = [
  {
    id: 1,
    title: "Summer Music Festival 2026",
    category: "Music",
    location: "London, UK",
    venue: "Wembley Arena",
    price: "$85",
    date: "Aug 15, 2026",
    time: "7:00 PM",
    image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    attendees: 12500,
    featured: true,
    trending: true
  },
  {
    id: 2,
    title: "Tech Innovation Expo",
    category: "Technology",
    location: "San Francisco, USA",
    venue: "Silicon Valley Convention Center",
    price: "$120",
    date: "Sept 10, 2026",
    time: "9:00 AM",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    attendees: 8000,
    featured: true
  },
  {
    id: 3,
    title: "International Film Festival",
    category: "Film",
    location: "Cannes, France",
    venue: "Palais des Festivals",
    price: "$200",
    date: "Oct 5, 2026",
    time: "6:00 PM",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    attendees: 15000,
    trending: true
  },
  {
    id: 4,
    title: "Art & Design Week",
    category: "Art",
    location: "New York, USA",
    venue: "Metropolitan Gallery",
    price: "$65",
    date: "Nov 12, 2026",
    time: "10:00 AM",
    image: "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    attendees: 5000
  },
  {
    id: 5,
    title: "Food & Wine Festival",
    category: "Food",
    location: "Barcelona, Spain",
    venue: "Montjuïc Park",
    price: "$95",
    date: "Sept 20, 2026",
    time: "12:00 PM",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    attendees: 10000,
    featured: true
  },
  {
    id: 6,
    title: "Jazz Night Live",
    category: "Music",
    location: "New Orleans, USA",
    venue: "Preservation Hall",
    price: "$55",
    date: "Aug 22, 2026",
    time: "8:00 PM",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    attendees: 3000
  },
  {
    id: 7,
    title: "Business Leadership Summit",
    category: "Business",
    location: "Dubai, UAE",
    venue: "Dubai World Trade Centre",
    price: "$250",
    date: "Oct 18, 2026",
    time: "9:00 AM",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    attendees: 6000
  },
  {
    id: 8,
    title: "Comedy Night Special",
    category: "Comedy",
    location: "Los Angeles, USA",
    venue: "The Comedy Store",
    price: "$45",
    date: "Sept 5, 2026",
    time: "9:00 PM",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    attendees: 2500
  },
  {
    id: 9,
    title: "Sports Championship Finals",
    category: "Sports",
    location: "Tokyo, Japan",
    venue: "Olympic Stadium",
    price: "$150",
    date: "Nov 30, 2026",
    time: "3:00 PM",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    attendees: 20000,
    trending: true
  }
];

const categories = [
  { name: 'All Events', count: 245, color: 'from-slate-500 to-gray-700' },
  { name: 'Music', count: 89, color: 'from-purple-500 to-pink-600' },
  { name: 'Technology', count: 56, color: 'from-blue-500 to-cyan-600' },
  { name: 'Food & Wine', count: 34, color: 'from-orange-500 to-red-600' },
  { name: 'Art & Culture', count: 42, color: 'from-indigo-500 to-purple-600' },
  { name: 'Sports', count: 24, color: 'from-green-500 to-emerald-600' }
];

const EventsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = selectedCategory === 'All Events' 
    ? events 
    : events.filter(event => event.category === selectedCategory || selectedCategory.includes(event.category));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
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

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .glass {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .gradient-text {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 animate-fadeInUp">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
              <Zap size={16} className="text-yellow-300" />
              <span className="text-white text-sm font-semibold">Live Events Happening Now</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-display text-white mb-4 leading-tight">
              Discover Amazing Events
            </h1>
            
            <p className="text-xl text-white/90 font-serif max-w-2xl mx-auto">
              From concerts to conferences, find experiences that inspire and connect
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <div className="glass p-3 rounded-2xl shadow-2xl">
              <div className="flex flex-col md:flex-row items-stretch space-y-3 md:space-y-0 md:space-x-3">
                <div className="flex items-center bg-white/90 backdrop-blur-sm p-4 rounded-xl flex-1">
                  <Search className="text-purple-600 mr-3" size={22} />
                  <input 
                    type="text" 
                    placeholder="Search events..." 
                    className="bg-transparent outline-none text-slate-800 placeholder:text-slate-400 w-full font-medium"
                  />
                </div>
                
                <div className="flex items-center bg-white/90 backdrop-blur-sm p-4 rounded-xl flex-1">
                  <MapPin className="text-purple-600 mr-3" size={22} />
                  <input 
                    type="text" 
                    placeholder="City or venue" 
                    className="bg-transparent outline-none text-slate-800 placeholder:text-slate-400 w-full font-medium"
                  />
                </div>
                
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, idx) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`glass p-4 rounded-xl text-center cursor-pointer card-hover animate-fadeInUp border transition-all ${
                selectedCategory === cat.name 
                  ? 'border-purple-400 bg-gradient-to-br ' + cat.color + ' text-white' 
                  : 'border-white/40 hover:border-purple-300'
              }`}
              style={{animationDelay: `${idx * 0.05}s`}}
            >
              <h3 className={`font-bold text-sm mb-1 ${selectedCategory === cat.name ? 'text-white' : 'text-slate-800'}`}>
                {cat.name}
              </h3>
              <p className={`text-xs ${selectedCategory === cat.name ? 'text-white/90' : 'text-slate-500'}`}>
                {cat.count} events
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Header with Filters */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display text-slate-900 mb-2">
              {selectedCategory}
            </h2>
            <p className="text-slate-600">
              {filteredEvents.length} events available
            </p>
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-white px-5 py-3 rounded-xl border-2 border-slate-200 hover:border-purple-400 transition-colors font-semibold"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, idx) => (
            <div 
              key={event.id}
              className="bg-white rounded-3xl overflow-hidden shadow-md card-hover cursor-pointer border border-slate-100 animate-fadeInUp"
              style={{animationDelay: `${idx * 0.05}s`}}
            >
              <div className="relative h-56 overflow-hidden group">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="bg-purple-600/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">
                      {event.category}
                    </span>
                  </div>
                  {event.featured && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1.5 rounded-full flex items-center">
                      <Sparkles size={12} className="text-white mr-1" />
                      <span className="text-white text-xs font-bold">Featured</span>
                    </div>
                  )}
                </div>

                {event.trending && (
                  <div className="absolute top-4 right-4 bg-red-500/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center animate-pulse">
                    <Zap size={12} className="text-white mr-1" />
                    <span className="text-white text-xs font-bold">Trending</span>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center text-white text-sm mb-2">
                    <Calendar size={14} className="mr-1.5" />
                    <span className="font-semibold">{event.date}</span>
                    <span className="mx-2">•</span>
                    <Clock size={14} className="mr-1.5" />
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-xl text-slate-900 mb-3 leading-tight">
                  {event.title}
                </h3>
                
                <div className="flex items-center text-slate-600 text-sm mb-2">
                  <MapPin size={16} className="mr-1.5 text-slate-400" />
                  <span>{event.venue}, {event.location}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-lg">
                    <Star size={14} fill="#f59e0b" className="text-amber-500 mr-1" />
                    <span className="text-sm font-bold text-amber-700">{event.rating}</span>
                  </div>
                  
                  <div className="flex items-center text-slate-500 text-sm">
                    <Users size={14} className="mr-1.5" />
                    <span>{event.attendees.toLocaleString()} going</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                  <div>
                    <div className="text-sm text-slate-500 mb-0.5">From</div>
                    <div className="text-2xl font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {event.price}
                    </div>
                  </div>
                  
                  <button className="flex items-center font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all group">
                    <Ticket size={18} className="mr-2 group-hover:rotate-12 transition-transform" />
                    Get Tickets
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl">
            Load More Events
          </button>
        </div>
      </main>

      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-6">
            <Music size={16} className="text-white" />
            <span className="text-white text-sm font-semibold">For Event Organizers</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display text-white mb-4 leading-tight">
            Host Your Next Event With Us
          </h2>
          
          <p className="text-xl text-white/90 font-serif mb-8 max-w-2xl mx-auto">
            Reach thousands of attendees, manage ticketing seamlessly, and create unforgettable experiences
          </p>
          
          <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl">
            List Your Event
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-3xl font-display mb-4 gradient-text">BookNStay</div>
              <p className="text-slate-400 leading-relaxed font-serif">
                Your gateway to extraordinary stays and unforgettable experiences.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Explore</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Hotels</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Experiences</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Support</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cancellation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
            <p>© 2026 BookNStay. Crafted with care.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EventsPage;