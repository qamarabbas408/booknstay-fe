import React, { useState } from 'react';
import { Search, MapPin, Star, Filter, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

// Mock hotel data (expand as needed)
interface Hotel {
  id: number;
  name: string;
  location: string;
  pricePerNight: string;
  rating: number;
  reviewCount: number;
  image: string;
  stars: number;
  badges?: string[]; // e.g. "Free breakfast", "Pool"
  featured?: boolean;
}

const mockHotels: Hotel[] = [
  {
    id: 1,
    name: "Grand Azure Resort",
    location: "Maldives",
    pricePerNight: "$250",
    rating: 4.9,
    reviewCount: 1248,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    stars: 5,
    badges: ["All-inclusive", "Private beach", "Infinity pool"],
    featured: true,
  },
  {
    id: 2,
    name: "The Urban Boutique",
    location: "New York, USA",
    pricePerNight: "$180",
    rating: 4.7,
    reviewCount: 892,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    stars: 4,
    badges: ["Free WiFi", "Gym", "Central location"],
  },
  {
    id: 3,
    name: "Coastal Haven Villa",
    location: "Santorini, Greece",
    pricePerNight: "$320",
    rating: 4.8,
    reviewCount: 673,
    image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=800&q=80",
    stars: 5,
    badges: ["Sea view", "Breakfast included", "Spa"],
  },
  // Add 9–12 more for realistic grid feel...
];

const HotelsPage: React.FC = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 500]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false); // mobile toggle

  // In real app → use URL params or state management for filters/search
  const [sortBy, setSortBy] = useState('recommended');

  const filteredHotels = mockHotels
    // .filter(h => /* apply price, stars, amenities etc */)
    .sort((a, b) => {
      if (sortBy === 'price-low') return parseInt(a.pricePerNight.slice(1)) - parseInt(b.pricePerNight.slice(1));
      if (sortBy === 'price-high') return parseInt(b.pricePerNight.slice(1)) - parseInt(a.pricePerNight.slice(1));
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // recommended (or add logic later)
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-20">
      {/* Sticky Search/Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full md:w-auto">
              <div className="glass flex items-center p-3 rounded-xl border border-slate-200 focus-within:border-indigo-400">
                <MapPin className="text-indigo-600 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="Maldives, Santorini, New York..."
                  className="bg-transparent outline-none flex-1 text-slate-800 placeholder:text-slate-400"
                  defaultValue="Maldives"
                />
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center">
                <Search size={18} className="mr-2" />
                Update Search
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden bg-slate-100 p-3 rounded-xl"
              >
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>

          {/* Sort & quick filters */}
          <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
            <div className="text-slate-600">
              <span className="font-medium">Showing {filteredHotels.length} properties</span>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-slate-600 text-sm">Sort by:</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Guest Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 bg-white rounded-2xl shadow-lg p-6 border border-slate-100 h-fit sticky top-24`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <Filter size={18} className="mr-2 text-indigo-600" />
                Filters
              </h3>
              <button className="text-sm text-indigo-600 hover:underline">Clear all</button>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h4 className="font-semibold mb-3">Price per night</h4>
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              {/* Simple range slider - replace with real slider lib like rc-slider later */}
              <input
                type="range"
                min="50"
                max="1000"
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Star Rating */}
            <div className="mb-8">
              <h4 className="font-semibold mb-3">Star rating</h4>
              {[5, 4, 3].map(star => (
                <label key={star} className="flex items-center mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStars.includes(star)}
                    onChange={() => {
                      setSelectedStars(prev =>
                        prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
                      );
                    }}
                    className="mr-2 accent-indigo-600"
                  />
                  <span className="flex items-center">
                    {star} <Star size={14} fill="#f59e0b" className="text-amber-500 ml-1 mr-1" />+
                  </span>
                </label>
              ))}
            </div>

            {/* Amenities (expand with more) */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Amenities</h4>
              {['Free WiFi', 'Pool', 'Breakfast included', 'Parking', 'Spa', 'Beachfront'].map(item => (
                <label key={item} className="flex items-center mb-2 cursor-pointer">
                  <input type="checkbox" className="mr-2 accent-indigo-600" />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
              Apply Filters
            </button>
          </aside>

          {/* Results Grid */}
          <main className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map(hotel => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl card-hover transition-all duration-300 border border-slate-100 cursor-pointer group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {hotel.featured && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full text-white text-xs font-bold flex items-center">
                        <Star size={12} className="mr-1 fill-white" /> Featured
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-900 line-clamp-2">{hotel.name}</h3>
                      <div className="flex items-center bg-amber-50 px-2.5 py-1 rounded-lg">
                        <Star size={14} fill="#f59e0b" className="text-amber-500 mr-1" />
                        <span className="text-sm font-bold text-amber-700">{hotel.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-slate-500 text-sm mb-3">
                      <MapPin size={16} className="mr-1.5" />
                      {hotel.location}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {hotel.badges?.map(b => (
                        <span key={b} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                          {b}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-sm text-slate-500">From</div>
                        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                          ${hotel.pricePerNight}
                        </div>
                        <div className="text-xs text-slate-500">/ night</div>
                      </div>

                      <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                        View Deal
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination placeholder */}
            <div className="flex justify-center mt-12 gap-3">
              <button className="px-5 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50">Previous</button>
              <button className="px-5 py-3 bg-indigo-600 text-white rounded-xl">1</button>
              <button className="px-5 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50">2</button>
              <button className="px-5 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50">Next</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;