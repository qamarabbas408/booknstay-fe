import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, Star, Ticket, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import { APIENDPOINTS } from '../utils/ApiConstants';
import { AppImages } from '../utils/AppImages';
import { useGetHotelsQuery } from '../store/services/hotelApi';
import { useGetEventsQuery } from '../store/services/eventApi';
import PulseLoader from '../components/PulseLoader';

// Mock data interfaces for type safety
interface Item {
  id: number;
  type: 'hotel' | 'event';
  title: string;
  location: string;
  price: string;
  rating?: number;
  image: string;
  date?: string;
  featured?: boolean;
}

const categories = [
  { name: 'Luxury Hotels', icon: '✨', color: 'from-amber-500 to-orange-600' },
  { name: 'Music Events', icon: '🎵', color: 'from-purple-500 to-pink-600' },
  { name: 'Beach Resorts', icon: '🏖️', color: 'from-cyan-500 to-blue-600' },
  { name: 'City Breaks', icon: '🏙️', color: 'from-slate-500 to-gray-700' }
];

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'hotels' | 'events'>('all');
  const [searchFocus, setSearchFocus] = useState(false);

  const { data: hotelsData, isLoading: isLoadingHotels } = useGetHotelsQuery({ limit: 3 });
  const { data: eventsData, isLoading: isLoadingEvents } = useGetEventsQuery({ limit: 3 });

  const hotels: Item[] = hotelsData?.data?.map((hotel) => ({
    id: hotel.id,
    type: 'hotel',
    title: hotel.name,
    location: hotel.location,
    price: `$${hotel.pricePerNight}/night`,
    rating: hotel.rating,
    image: hotel.image ? (hotel.image.startsWith('http') ? hotel.image : `${APIENDPOINTS.content_url}${hotel.image}`) : AppImages.placeholders.hotels_placeholder,
    featured: hotel.featured,
  })) || [];

  const events: Item[] = eventsData?.data?.map((event) => ({
    id: event.id,
    type: 'event',
    title: event.title,
    location: event.location,
    price: event.price,
    rating: event.rating,
    image: event.image ? (event.image.startsWith('http') ? event.image : `${APIENDPOINTS.content_url}${event.image}`) : AppImages.placeholders.event_placeholder,
    date: event.start_date,
    featured: event.featured,
  })) || [];

  const filteredItems = activeTab === 'all' 
    ? [...hotels, ...events]
    : activeTab === 'hotels' ? hotels : events;

  const isLoading = isLoadingHotels || isLoadingEvents;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
  

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 noise"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-40">
          <div className="text-center mb-12 animate-fadeInUp">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
              <TrendingUp size={16} className="text-white" />
              <span className="text-white text-sm font-semibold">Trending Now: Summer Getaways</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display text-white mb-6 leading-tight">
              Your Next Adventure
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-200 via-pink-200 to-purple-200">
                Starts Here
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 font-serif max-w-2xl mx-auto mb-12">
              Seamlessly book luxury stays and discover unforgettable events — all in one elegant platform.
            </p>
          </div>
          
          {/* Enhanced Search Bar */}
          <div 
            className={`max-w-5xl mx-auto animate-fadeInUp ${searchFocus ? 'scale-105' : ''}`}
            style={{animationDelay: '0.2s', transition: 'transform 0.3s ease'}}
          >
            <div className="glass p-3 rounded-2xl shadow-2xl">
              <div className="flex flex-col lg:flex-row items-stretch space-y-3 lg:space-y-0 lg:space-x-3">
                <div 
                  className="flex items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl flex-1 border-2 border-transparent focus-within:border-indigo-400 transition-all"
                  onFocus={() => setSearchFocus(true)}
                  onBlur={() => setSearchFocus(false)}
                >
                  <MapPin className="text-indigo-600 mr-3 flex-shrink-0" size={22} />
                  <input 
                    type="text" 
                    placeholder="Destination or venue" 
                    className="bg-transparent outline-none text-slate-800 placeholder:text-slate-400 w-full font-medium"
                  />
                </div>
                
                <div className="flex items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl flex-1 border-2 border-transparent focus-within:border-indigo-400 transition-all">
                  <Calendar className="text-indigo-600 mr-3 flex-shrink-0" size={22} />
                  <input 
                    type="text" 
                    placeholder="Check-in • Check-out" 
                    className="bg-transparent outline-none text-slate-800 placeholder:text-slate-400 w-full font-medium"
                  />
                </div>
                
                <button className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:shadow-indigo-500/40 group">
                  <Search className="mr-2 group-hover:scale-110 transition-transform" size={22} />
                  <span>Explore</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <div 
              key={cat.name}
              className="glass p-6 rounded-2xl text-center cursor-pointer card-hover animate-slideInRight border border-white/40"
              style={{animationDelay: `${idx * 0.1}s`}}
            >
              <div className={`text-4xl mb-3 inline-block bg-linear-to-br ${cat.color} p-3 rounded-xl`}>
                {cat.icon}
              </div>
              <h3 className="font-bold text-slate-800">{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-display text-slate-900 mb-2">Curated for You</h2>
            <p className="text-slate-600 text-lg font-serif">Handpicked experiences that inspire</p>
          </div>
          
          <div className="hidden md:flex items-center space-x-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-xl shadow-sm border border-slate-200">
            {(['all', 'hotels', 'events'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <PulseLoader />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, idx) => (
              <div 
                key={`${item.type}-${item.id}`} 
                className="bg-white rounded-3xl overflow-hidden shadow-md card-hover border border-slate-100 animate-fadeInUp"
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <button
                onClick={()=>item.type === 'event' ? navigate(`/event/${item.id}`) : navigate(`/hotel/${item.id}`)}
                 className="relative h-64 overflow-hidden group  cursor-pointer">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = item.type === 'hotel' ? AppImages.placeholders.hotels_placeholder : AppImages.placeholders.event_placeholder;
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`glass px-4 py-2 rounded-full backdrop-blur-md ${
                      item.type === 'hotel' 
                        ? 'bg-emerald-500/90' 
                        : 'bg-purple-500/90'
                    }`}>
                      <span className="text-white text-xs font-bold uppercase tracking-wider">
                        {item.type}
                      </span>
                    </div>
                  </div>
                  
                  {/* Featured Badge */}
                  {item.featured && (
                    <div className="absolute top-4 right-4 bg-linear-to-r from-yellow-400 to-orange-500 px-3 py-1.5 rounded-full">
                      <span className="text-white text-xs font-bold flex items-center">
                        <Sparkles size={12} className="mr-1" />
                        Featured
                      </span>
                    </div>
                  )}
                </button>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl text-slate-900 leading-tight pr-2">{item.title}</h3>
                    {item.rating && (
                      <div className="flex items-center bg-amber-50 px-2.5 py-1 rounded-lg flex-shrink-0">
                        <Star size={14} fill="#f59e0b" className="text-amber-500 mr-1" />
                        <span className="text-sm font-bold text-amber-700">{item.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-slate-500 text-sm mb-2">
                    <MapPin size={16} className="mr-1.5 text-slate-400" />
                    <span>{item.location}</span>
                  </div>
                  
                  {item.date && (
                    <div className="flex items-center text-indigo-600 text-sm mb-4 font-semibold">
                      <Calendar size={16} className="mr-1.5" />
                      <span>{item.date}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-4">
                    <div>
                      <div className="text-sm text-slate-500 mb-0.5">From</div>
                      <div className="text-2xl font-display text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                        {item.price}
                      </div>
                    </div>
                    
                    {item.type === 'event' ? (
                      <button onClick={()=>navigate(`/event/booking/${item.id}}`)} className="flex items-center font-bold bg-linear-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all group">
                        <Ticket size={18} className="mr-2 group-hover:rotate-12 transition-transform" />
                        Get Tickets
                      </button>
                    ) : (
                      <button className="flex items-center font-bold bg-linear-to-r from-indigo-600 to-blue-600 text-white px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all group">
                        <span>Book Now</span>
                        <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate(activeTab === 'events' ? '/events' : '/hotels')}
            className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl"
          >
            Discover More Experiences
          </button>
        </div>
      </main>

      {/* Vendor CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-indigo-900 to-purple-900"></div>
        <div className="absolute inset-0 noise opacity-50"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="bg-linear-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-white/10 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-white text-center lg:text-left lg:mr-8">
                <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-6">
                  <Sparkles size={16} />
                  <span className="text-sm font-semibold">For Business Partners</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-display mb-4 leading-tight">
                  List Your Property or Event
                </h2>
                
                <p className="text-xl text-white/80 font-serif leading-relaxed max-w-2xl">
                  Join thousands of successful partners. Showcase your venue, manage bookings effortlessly, 
                  and connect with travelers worldwide.
                </p>
                
                <div className="flex flex-wrap items-center gap-4 mt-8 text-sm text-white/70">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span>Commission-free for 30 days</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span>24/7 partner support</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                  Register Now
                </button>
                <button className="border-2 border-white/40 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;