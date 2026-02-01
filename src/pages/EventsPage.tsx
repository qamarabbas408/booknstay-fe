import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Star, Ticket, ChevronRight, Sparkles, Filter, Clock, Music, Users, Zap, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useGetEventCategoriesQuery } from '../store/services/miscApi';
import { useGetEventsQuery } from '../store/services/eventApi';
import EventFilters from '../components/EventFilters';
import {type FilterState } from '../components/EventFilters';
import PulseLoader from '../components/PulseLoader';
import SkeletonLoader from '../components/SkeletonLoader';

const EventsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [showFilters, setShowFilters] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedLocation, setAppliedLocation] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 1000,
    dateFilter: 'all',
    featured: false,
    trending: false,
    sortBy: 'upcoming',
  });
  const [page, setPage] = useState(1);

  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetEventCategoriesQuery();
  
  const apiCategories = categoriesData?.data || [];
  
  // Sort categories by event count descending
  const sortedCategories = [...apiCategories].sort((a, b) => b.events_count - a.events_count);

  const allEventsCategory = {
    id: 0,
    name: 'All Events',
    slug: 'all',
    events_count: sortedCategories.reduce((acc, cat) => acc + cat.events_count, 0),
    color_gradient: 'from-slate-500 to-gray-700'
  };

  const displayCategories = showAllCategories 
    ? [allEventsCategory, ...sortedCategories]
    : [allEventsCategory, ...sortedCategories.slice(0, 5)];

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [appliedSearch, appliedLocation, selectedCategory, filters]);

  const handleSearch = () => {
    setAppliedSearch(searchQuery);
    setAppliedLocation(locationQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setLocationQuery('');
    setAppliedSearch('');
    setAppliedLocation('');
  };

  // API Call
  const { data: eventsData, isLoading: isEventsLoading, isFetching } = useGetEventsQuery({
    search: appliedSearch || appliedLocation || undefined,
    category: selectedCategory !== 'All Events' ? selectedCategory : undefined,
    min_price: filters.minPrice > 0 ? filters.minPrice : undefined,
    max_price: filters.maxPrice < 1000 ? filters.maxPrice : undefined,
    featured: filters.featured || undefined,
    trending: filters.trending || undefined,
    date_filter: filters.dateFilter !== 'all' ? filters.dateFilter : undefined,
    sort_by: filters.sortBy,
    page,
    limit: 9,
  });

  const events = eventsData?.data || [];
  const pagination = eventsData?.pagination;

  const EventImage = ({ src, alt }: { src: string; alt: string }) => {
    const [imgSrc, setImgSrc] = useState(src);
    useEffect(() => setImgSrc(src), [src]);
    return (
      <img
        src={imgSrc}
        alt={alt}
        onError={() => setImgSrc('https://placehold.co/800x600?text=No+Image')}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
    );
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
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

       

        .gradient-text {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-linear-to-br from-purple-600 via-pink-600 to-orange-500 py-20">
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events..."
                    className="bg-transparent outline-none text-slate-800 placeholder:text-slate-400 w-full font-medium"
                  />
                </div>
                
                <div className="flex items-center bg-white/90 backdrop-blur-sm p-4 rounded-xl flex-1">
                  <MapPin className="text-purple-600 mr-3" size={22} />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="City or venue"
                    className="bg-transparent outline-none text-slate-800 placeholder:text-slate-400 w-full font-medium"
                  />
                </div>
                
                <button 
                  onClick={handleSearch}
                  className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all"
                >
                  Search
                </button>

                {(searchQuery || locationQuery || appliedSearch || appliedLocation) && (
                  <button 
                    onClick={handleClearSearch}
                    className="bg-white/90 backdrop-blur-sm text-slate-600 px-6 py-4 rounded-xl font-bold hover:bg-white hover:text-red-600 transition-all flex items-center justify-center"
                  >
                    <X size={20} className="mr-2" />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        {isCategoriesLoading ? (
          <div className="flex justify-center py-8">
            <PulseLoader />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {displayCategories.map((cat, idx) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`bg-white ring-purple-100 p-4 rounded-xl text-center cursor-pointer animate-fadeInUp  transition-all duration-300 ${
                    selectedCategory === cat.name 
                      ? 'border-transparent bg-linear-to-br from-orange-500 to-red-600 shadow-lg scale-105 ring-1 ring-offset-1' 
                      : 'border-white/40 hover:border-purple-300 hover:shadow-md hover:-translate-y-1'
                  }`}
                  style={{animationDelay: `${idx * 0.05}s`}}
                >
                  <h3 className={`font-bold text-sm mb-1 ${selectedCategory === cat.name ? 'text-white' : 'text-slate-800'}`}>
                    {cat.name}
                  </h3>
                  <p className={`text-xs ${selectedCategory === cat.name ? 'text-white/90' : 'text-slate-500'}`}>
                    {cat.events_count} events
                  </p>
                </button>
              ))}
            </div>

            {sortedCategories.length > 5 && (
              <div className="flex justify-center mt-6">
                <button 
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg border border-white/50 text-sm font-bold text-slate-700 hover:text-purple-600 hover:bg-white transition-all"
                >
                  <span>{showAllCategories ? 'Show Less Categories' : 'Show All Categories'}</span>
                  {showAllCategories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            )}
          </>
        )}
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
              {events.length} events available
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
        {isEventsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonLoader key={i} type="event" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, idx) => (
              <div 
                key={event.id}
                className="bg-white rounded-3xl overflow-hidden shadow-md card-hover cursor-pointer border border-slate-100 animate-fadeInUp"
                style={{animationDelay: `${idx * 0.05}s`}}
              >
                <div className="relative h-56 overflow-hidden group">
                  <EventImage src={event.image} alt={event.title} />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-purple-600/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <span className="text-white text-xs font-bold uppercase tracking-wider">
                        {event.category}
                      </span>
                    </div>
                    {event.featured && (
                      <div className="bg-linear-to-r from-yellow-400 to-orange-500 px-3 py-1.5 rounded-full flex items-center">
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

                  {event.is_sold_out && (
                    <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center">
                      <span className="text-white text-xs font-bold">Sold Out</span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center text-white text-sm mb-2">
                      <Calendar size={14} className="mr-1.5" />
                      <span className="font-semibold">{event.start_date}</span>
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
                      <div className="text-2xl font-display text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">
                        {event.price}
                      </div>
                    </div>
                    
                    <button 
                      disabled={event.is_sold_out}
                      className={`flex items-center font-bold px-5 py-3 rounded-xl transition-all group ${
                        event.is_sold_out 
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                          : 'bg-linear-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
                      }`}
                    >
                      <Ticket size={18} className={`mr-2 ${!event.is_sold_out && 'group-hover:rotate-12 transition-transform'}`} />
                      {event.is_sold_out ? 'Sold Out' : 'Get Tickets'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.lastPage > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
              className="px-5 py-3 bg-white border-2 border-slate-200 rounded-xl hover:border-purple-400 font-semibold transition-all disabled:opacity-50"
            >
              Previous
            </button>
            
            <span className="px-5 py-3 bg-white border-2 border-slate-200 rounded-xl font-semibold">
              Page {pagination.currentPage} of {pagination.lastPage}
            </span>

            <button
              onClick={() => setPage(p => Math.min(pagination.lastPage, p + 1))}
              disabled={page === pagination.lastPage || isFetching}
              className="px-5 py-3 bg-white border-2 border-slate-200 rounded-xl hover:border-purple-400 font-semibold transition-all disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <EventFilters 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)} 
        onApplyFilters={handleApplyFilters} 
      />

      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden bg-linear-to-br from-purple-900 via-pink-900 to-orange-900">
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

    </div>
  );
};

export default EventsPage;