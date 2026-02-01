import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Filter, SlidersHorizontal, X, Sparkles, Heart, TrendingUp, Users, Wifi, Coffee, Waves, Dumbbell, Car } from 'lucide-react';
import { useGetHotelsQuery } from '../store/services/hotelApi';
import { useGetAmenitiesQuery } from '../store/services/miscApi';
import SkeletonLoader from '../components/SkeletonLoader';

const HotelsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 500]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const { data: amenitiesData } = useGetAmenitiesQuery();

  const iconMap: Record<string, React.ElementType> = {
    Wifi,
    Waves,
    Coffee,
    Car,
    Sparkles,
    Dumbbell,
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    setAppliedSearch(searchQuery);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setAppliedSearch('');
    setPage(1);
  };

  // API Query
  const { data: hotelsData, isLoading, isFetching } = useGetHotelsQuery({
    page,
    limit: 12,
    search: appliedSearch || undefined,
    min_price: priceRange[0],
    max_price: priceRange[1],
    sort_by: sortBy === 'price-low' ? 'price_low' : sortBy === 'price-high' ? 'price_high' : undefined,
    amenities: selectedAmenities,
    stars: selectedStars,
  });

  const hotels = hotelsData?.data || [];
  const pagination = hotelsData?.pagination;

  const filteredHotels = hotels;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [appliedSearch, priceRange, sortBy, selectedStars, selectedAmenities]);

  const clearFilters = () => {
    setPriceRange([50, 500]);
    setSelectedStars([]);
    setSelectedAmenities([]);
    handleClearSearch(); // Also clear the search query
  };

  const activeFiltersCount = selectedStars.length + selectedAmenities.length + 
    (priceRange[0] !== 50 || priceRange[1] !== 500 ? 1 : 0);

  const HotelImage = ({ src, alt }: { src: string; alt: string }) => {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
      setImgSrc(src);
    }, [src]);

    return (
      <img
        src={imgSrc}
        alt={alt}
        onError={() => setImgSrc('https://placehold.co/800x600?text=No+Image')}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
    );
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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-8px);
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
        
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
              <TrendingUp size={16} />
              <span className="text-sm font-semibold">Over 10,000 properties worldwide</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display mb-4 leading-tight">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl text-white/90 font-serif max-w-2xl mx-auto">
              Discover handpicked hotels and resorts for unforgettable experiences
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="glass p-3 rounded-2xl shadow-2xl">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center bg-white/90 p-4 rounded-xl">
                  <MapPin className="text-indigo-600 mr-3 flex-shrink-0" size={22} />
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none text-slate-800 placeholder:text-slate-400 w-full font-medium"
                  />
                </div>
                
                <button 
                  onClick={handleSearch}
                  className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-indigo-500/40 transition-all flex items-center justify-center"
                >
                  <Search className="mr-2" size={20} />
                  Search Hotels
                </button>

                {(searchQuery || appliedSearch) && (
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
      </div>

      {/* Filter & Sort Bar */}
      <div className="sticky top-0 z-40 glass border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="relative flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-400 transition-all font-semibold"
              >
                <SlidersHorizontal size={18} />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              
              <div className="text-slate-600">
                <span className="font-semibold text-slate-900">{filteredHotels.length}</span>
                <span className="hidden sm:inline"> properties found</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-slate-600 text-sm font-medium hidden md:inline">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-400 transition-all"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters - Desktop */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80`}>
            <div className="glass rounded-2xl shadow-lg p-6 border border-white/40 sticky top-24 custom-scrollbar max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display text-slate-900 flex items-center">
                  <Filter size={20} className="mr-2 text-indigo-600" />
                  Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-8 pb-8 border-b border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4">Price per night</h4>
                <div className="flex justify-between text-sm font-semibold text-indigo-600 mb-3">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>$50</span>
                  <span>$1000+</span>
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-8 pb-8 border-b border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4">Star rating</h4>
                <div className="space-y-3">
                  {[5, 4, 3].map((star) => (
                    <label key={star} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedStars.includes(star)}
                        onChange={() => {
                          setSelectedStars(prev =>
                            prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
                          );
                        }}
                        className="w-5 h-5 text-indigo-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className="ml-3 flex items-center font-medium text-slate-700 group-hover:text-slate-900">
                        {[...Array(star)].map((_, i) => (
                          <Star key={i} size={16} fill="#f59e0b" className="text-amber-500" />
                        ))}
                        <span className="ml-2">{star === 5 ? 'Luxury' : star === 4 ? 'Upscale' : 'Comfort'}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 mb-4">Amenities</h4>
                <div className="space-y-3">
                  {amenitiesData?.map((amenity) => {
                    const Icon = iconMap[amenity.icon] || Sparkles;
                    return (
                      <label key={amenity.id} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity.slug)}
                          onChange={() => {
                            setSelectedAmenities(prev =>
                              prev.includes(amenity.slug) 
                                ? prev.filter(a => a !== amenity.slug) 
                                : [...prev, amenity.slug]
                            );
                          }}
                          className="w-5 h-5 text-indigo-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        />
                        <Icon size={18} className="ml-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <span className="ml-2 font-medium text-slate-700 group-hover:text-slate-900">
                          {amenity.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonLoader key={i} type="hotel" />
                ))}
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">🏨</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No hotels found</h3>
                <p className="text-slate-600 mb-6">Try adjusting your filters or search criteria</p>
                <button
                  onClick={clearFilters}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredHotels.map((hotel, index) => (
                    <div
                      key={hotel.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl card-hover border border-slate-100 cursor-pointer group animate-fadeInUp"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative h-56 overflow-hidden">
                        <HotelImage src={hotel.image} alt={hotel.name} />
                        
                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(hotel.id);
                          }}
                          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all hover:scale-110"
                        >
                          <Heart
                            size={18}
                            className={favorites.includes(hotel.id) ? 'fill-red-500 text-red-500' : 'text-slate-600'}
                          />
                        </button>

                        {/* Featured Badge */}
                        {hotel.featured && (
                          <div className="absolute top-3 left-3 bg-linear-to-r from-yellow-400 to-orange-500 px-3 py-1.5 rounded-full flex items-center shadow-lg">
                            <Sparkles size={14} className="text-white mr-1" />
                            <span className="text-white text-xs font-bold">Featured</span>
                          </div>
                        )}

                        {/* Star Rating */}
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center">
                          {[...Array(hotel.stars)].map((_, i) => (
                            <Star key={i} size={12} fill="#f59e0b" className="text-amber-500" />
                          ))}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-slate-900 leading-tight line-clamp-2 flex-1 pr-2">
                            {hotel.name}
                          </h3>
                          <div className="flex items-center bg-amber-50 px-2.5 py-1.5 rounded-lg flex-shrink-0">
                            <Star size={14} fill="#f59e0b" className="text-amber-500 mr-1" />
                            <span className="text-sm font-bold text-amber-700">{hotel.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-slate-500 text-sm mb-1">
                          <MapPin size={16} className="mr-1.5 flex-shrink-0" />
                          <span>{hotel.location}</span>
                        </div>

                        <div className="flex items-center text-slate-400 text-xs mb-4">
                          <Users size={14} className="mr-1" />
                          <span>{hotel.reviewCount.toLocaleString()} reviews</span>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {hotel.badges?.slice(0, 2).map((badge) => (
                            <span
                              key={badge}
                              className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium"
                            >
                              {badge}
                            </span>
                          ))}
                          {hotel.badges && hotel.badges.length > 2 && (
                            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                              +{hotel.badges.length - 2} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                          <div>
                            <div className="text-xs text-slate-500 mb-0.5">From</div>
                            <div className="flex items-baseline">
                              <span className="text-2xl font-display gradient-text">
                                ${hotel.pricePerNight}
                              </span>
                              <span className="text-sm text-slate-500 ml-1">/ night</span>
                            </div>
                          </div>

                          <button className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all group-hover:scale-105">
                            View Deal
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.lastPage > 1 && (
                  <div className="flex justify-center items-center mt-12 gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1 || isFetching}
                      className="px-5 py-3 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-400 font-semibold transition-all disabled:opacity-50"
                    >
                      Previous
                    </button>
                    
                    <span className="px-5 py-3 bg-white border-2 border-slate-200 rounded-xl font-semibold">
                      Page {pagination.currentPage} of {pagination.lastPage}
                    </span>

                    <button
                      onClick={() => setPage(p => Math.min(pagination.lastPage, p + 1))}
                      disabled={page === pagination.lastPage || isFetching}
                      className="px-5 py-3 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-400 font-semibold transition-all disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          ></div>
          
          <div className="absolute inset-y-0 left-0 w-full sm:w-96 glass shadow-2xl overflow-y-auto custom-scrollbar animate-slideIn">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-display text-slate-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Same filter content as sidebar */}
              <div className="space-y-8">
                {/* Price Range */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-4">Price per night</h4>
                  <div className="flex justify-between text-sm font-semibold text-indigo-600 mb-3">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Star Rating */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-4">Star rating</h4>
                  <div className="space-y-3">
                    {[5, 4, 3].map((star) => (
                      <label key={star} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStars.includes(star)}
                          onChange={() => {
                            setSelectedStars(prev =>
                              prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
                            );
                          }}
                          className="w-5 h-5 text-indigo-600 border-2 border-slate-300 rounded"
                        />
                        <span className="ml-3 flex items-center font-medium text-slate-700">
                          {[...Array(star)].map((_, i) => (
                            <Star key={i} size={16} fill="#f59e0b" className="text-amber-500" />
                          ))}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-4">Amenities</h4>
                  <div className="space-y-3">
                    {amenitiesData?.map((amenity) => {
                      const Icon = iconMap[amenity.icon] || Sparkles;
                      return (
                        <label key={amenity.id} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedAmenities.includes(amenity.slug)}
                            onChange={() => {
                              setSelectedAmenities(prev =>
                                prev.includes(amenity.slug) 
                                  ? prev.filter(a => a !== amenity.slug) 
                                  : [...prev, amenity.slug]
                              );
                            }}
                            className="w-5 h-5 text-indigo-600 border-2 border-slate-300 rounded"
                          />
                          <Icon size={18} className="ml-3 text-slate-400" />
                          <span className="ml-2 font-medium text-slate-700">
                            {amenity.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Apply Buttons */}
              <div className="sticky bottom-0  bg-transparent  pt-6 mt-8 border-t border-slate-200 space-y-3">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                >
                  Show {filteredHotels.length} Results
                </button>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full glass border-2 border-slate-200 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelsPage;