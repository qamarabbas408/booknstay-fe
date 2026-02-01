import React, { useState } from 'react';
import { X, SlidersHorizontal, Calendar, DollarSign, Star, TrendingUp, ChevronDown } from 'lucide-react';

interface EventFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
}

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  dateFilter: 'all' | 'today' | 'tomorrow' | 'weekend';
  featured: boolean;
  trending: boolean;
  sortBy: 'upcoming' | 'price_low' | 'price_high';
}

const EventFilters: React.FC<EventFiltersProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 1000,
    dateFilter: 'all',
    featured: false,
    trending: false,
    sortBy: 'upcoming',
  });

  const [tempMinPrice, setTempMinPrice] = useState(filters.minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(filters.maxPrice);

  const handleApply = () => {
    onApplyFilters({
      ...filters,
      minPrice: tempMinPrice,
      maxPrice: tempMaxPrice,
    });
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      minPrice: 0,
      maxPrice: 1000,
      dateFilter: 'all',
      featured: false,
      trending: false,
      sortBy: 'upcoming',
    };
    setFilters(resetFilters);
    setTempMinPrice(0);
    setTempMaxPrice(1000);
    onApplyFilters(resetFilters);
  };

  const activeFiltersCount = 
    (filters.dateFilter !== 'all' ? 1 : 0) +
    (filters.featured ? 1 : 0) +
    (filters.trending ? 1 : 0) +
    (filters.minPrice !== 0 || filters.maxPrice !== 1000 ? 1 : 0);

  if (!isOpen) return null;

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
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        /* Custom Range Slider */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          background: linear-gradient(to right, #e2e8f0 0%, #e2e8f0 100%);
          border-radius: 10px;
          outline: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(168, 85, 247, 0.3);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(168, 85, 247, 0.3);
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      ></div>

      {/* Filter Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-96 glass z-50 shadow-2xl overflow-y-auto animate-slideIn">
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="sticky top-0 glass border-b border-slate-200 p-6 z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <SlidersHorizontal size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-display text-slate-900">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <p className="text-sm text-purple-600 font-semibold">
                      {activeFiltersCount} active filter{activeFiltersCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X size={24} className="text-slate-600" />
              </button>
            </div>
          </div>

          {/* Filter Content */}
          <div className="flex-1 p-6 space-y-8">
            
            {/* Sort By */}
            <div>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                <ChevronDown size={18} className="mr-2 text-purple-600" />
                Sort By
              </h3>
              <div className="space-y-2">
                {[
                  { value: 'upcoming', label: 'Upcoming Events', icon: '📅' },
                  { value: 'price_low', label: 'Price: Low to High', icon: '💰' },
                  { value: 'price_high', label: 'Price: High to Low', icon: '💎' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilters({ ...filters, sortBy: option.value as FilterState['sortBy'] })}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      filters.sortBy === option.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{option.icon}</span>
                      <span className={`font-semibold ${
                        filters.sortBy === option.value ? 'text-purple-600' : 'text-slate-700'
                      }`}>
                        {option.label}
                      </span>
                    </div>
                    {filters.sortBy === option.value && (
                      <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                <Calendar size={18} className="mr-2 text-purple-600" />
                When
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'all', label: 'All Dates', icon: '📆' },
                  { value: 'today', label: 'Today', icon: '☀️' },
                  { value: 'tomorrow', label: 'Tomorrow', icon: '🌅' },
                  { value: 'weekend', label: 'This Weekend', icon: '🎉' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilters({ ...filters, dateFilter: option.value as FilterState['dateFilter'] })}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      filters.dateFilter === option.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <span className="text-3xl mb-2">{option.icon}</span>
                    <span className={`text-sm font-semibold ${
                      filters.dateFilter === option.value ? 'text-purple-600' : 'text-slate-700'
                    }`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                <DollarSign size={18} className="mr-2 text-purple-600" />
                Price Range
              </h3>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <div className="text-xs text-slate-600 mb-1 font-medium">Minimum</div>
                    <div className="text-2xl font-bold text-purple-600">${tempMinPrice}</div>
                  </div>
                  <div className="text-slate-400">—</div>
                  <div className="text-center">
                    <div className="text-xs text-slate-600 mb-1 font-medium">Maximum</div>
                    <div className="text-2xl font-bold text-pink-600">${tempMaxPrice}</div>
                  </div>
                </div>
                
                {/* Min Price Slider */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-slate-600 mb-2 block">
                    Min Price: ${tempMinPrice}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={tempMinPrice}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value <= tempMaxPrice) {
                        setTempMinPrice(value);
                      }
                    }}
                    className="w-full"
                  />
                </div>
                
                {/* Max Price Slider */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-2 block">
                    Max Price: ${tempMaxPrice}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={tempMaxPrice}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= tempMinPrice) {
                        setTempMaxPrice(value);
                      }
                    }}
                    className="w-full"
                  />
                </div>

                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>$0</span>
                  <span>$1000+</span>
                </div>
              </div>
            </div>

            {/* Special Status */}
            <div>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                <Star size={18} className="mr-2 text-purple-600" />
                Special Events
              </h3>
              <div className="space-y-3">
                {/* Featured */}
                <label className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 hover:border-purple-300 bg-white cursor-pointer transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Star size={22} className="text-white" fill="white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Featured Events</div>
                      <div className="text-xs text-slate-600">Handpicked by our team</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
                    className="w-5 h-5 text-purple-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                </label>

                {/* Trending */}
                <label className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 hover:border-purple-300 bg-white cursor-pointer transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center">
                      <TrendingUp size={22} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Trending Events</div>
                      <div className="text-xs text-slate-600">Most popular right now</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={filters.trending}
                    onChange={(e) => setFilters({ ...filters, trending: e.target.checked })}
                    className="w-5 h-5 text-purple-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 glass border-t border-slate-200 p-6 space-y-3">
            <button
              onClick={handleApply}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/40 transition-all"
            >
              Apply Filters
            </button>
            
            {activeFiltersCount > 0 && (
              <button
                onClick={handleReset}
                className="w-full border-2 border-slate-200 text-slate-700 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventFilters;