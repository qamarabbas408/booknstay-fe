import React, { useState, useEffect } from 'react';
import { Plus, X, Calendar, TrendingUp, DollarSign, BarChart3, Search } from 'lucide-react';
import VendorHotelCard from '../../components/vendor/VendorHotelCard';
import { useGetVendorHotelsQuery } from '../../store/services/hotelApi';
import { APIENDPOINTS } from '../../utils/ApiConstants';
import SkeletonLoader from '../../components/SkeletonLoader';
import { AppRoutes } from '../../utils/AppRoutes';
import { useNavigate } from 'react-router-dom';
import type { VendorHotel } from '../../store/services/hotelApi';

const VendorPropertiesPage = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'price_high' | 'price_low'>('recent');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading } = useGetVendorHotelsQuery({
    status: filterStatus,
    sort_by: sortBy,
    search: debouncedSearch,
    limit: 10
  });

  const vendorProperties = data?.data || [];
  const pagination = data?.pagination;

  // Calculate stats from the fetched data (or use separate API for stats if available)
  // For now, we can only calculate based on the current page or fetched data, 
  // but ideally stats should come from a dashboard API. 
  // We'll use the fetched list for simple stats or 0 if empty.
  const totalRevenue = vendorProperties.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const totalBookings = vendorProperties.reduce((sum, p) => sum + (p.bookings || 0), 0);
  const activeProperties = vendorProperties.filter(p => p.status === 'active').length;
  const totalProperties = pagination?.total || vendorProperties.length;

  const handleViewProperty = (id: number) => {
    console.log('View property:', id);
  };

  const handleEditProperty = (id: number) => {
    console.log('Edit property:', id);
  };

  const handleAnalytics = (id: number) => {
    console.log('Analytics for property:', id);
  };

  const handleDeleteProperty = (id: number) => {
    console.log('Delete property:', id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
     

      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 animate-slideUp">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-white/30">
                <TrendingUp size={16} />
                <span className="text-sm font-semibold">Property Management</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display mb-3 leading-tight">
                My Properties
              </h1>
              <p className="text-xl text-white/90 font-serif">
                Manage your hotel listings and track performance
              </p>
            </div>
            
            <button 
            onClick={() => navigate(`/${AppRoutes.vendorBase}/${AppRoutes.vendorAddHotel}`)}
            className="mt-6 md:mt-0 inline-flex items-center space-x-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:bg-slate-50 transition-all">
              <Plus size={22} />
              <span>Add Property</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slideUp" style={{animationDelay: '0.1s'}}>
            <div className="glass rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display text-white">{totalProperties}</p>
                </div>
              </div>
              <p className="text-white/80 text-sm font-medium">Total Properties</p>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 size={24} className="text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display text-white">{activeProperties}</p>
                </div>
              </div>
              <p className="text-white/80 text-sm font-medium">Active Listings</p>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar size={24} className="text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display text-white">{totalBookings}</p>
                </div>
              </div>
              <p className="text-white/80 text-sm font-medium">Total Bookings</p>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign size={24} className="text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display text-white">${(totalRevenue / 1000).toFixed(1)}k</p>
                </div>
              </div>
              <p className="text-white/80 text-sm font-medium">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="sticky top-16 z-40 glass border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-400 transition-all font-semibold"
              >
                {showFilters ? <X size={18} /> : <span>Filters</span>}
              </button>
              
              <div className="text-slate-600">
                <span className="font-bold text-slate-900 text-lg">{pagination?.total || 0}</span>
                <span className="ml-1">properties</span>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-slate-600 text-sm font-semibold hidden md:inline">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="recent">Recently Added</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 animate-slideUp`}>
            <div className="glass rounded-2xl shadow-lg p-6 border border-white/40 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display text-slate-900">Filter by Status</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { value: 'all', label: 'All Properties', color: 'indigo' },
                  { value: 'active', label: 'Active', color: 'green' },
                  { value: 'pending', label: 'Pending Approval', color: 'amber' },
                  { value: 'inactive', label: 'Inactive', color: 'slate' },
                ].map((status) => (
                  <label key={status.value} className={`flex items-center cursor-pointer p-3 rounded-xl transition-all ${
                    filterStatus === status.value 
                      ? 'bg-indigo-50 border-2 border-indigo-300' 
                      : 'bg-white border-2 border-slate-200 hover:border-indigo-200'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={filterStatus === status.value}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="w-5 h-5 text-indigo-600 border-2 border-slate-300 cursor-pointer"
                    />
                    <span className={`ml-3 font-semibold flex-1 ${
                      filterStatus === status.value ? 'text-indigo-900' : 'text-slate-700'
                    }`}>
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Properties List */}
          <main className="flex-1">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <SkeletonLoader key={i} type="hotel" />
                ))}
              </div>
            ) : vendorProperties.length === 0 ? (
              <div className="glass rounded-3xl p-16 text-center border border-white/40 shadow-lg">
                <div className="text-7xl mb-6">🏨</div>
                <h3 className="text-3xl font-display text-slate-900 mb-3">No properties found</h3>
                <p className="text-slate-600 text-lg font-serif mb-8">Start adding your properties to get started</p>
                <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                  <Plus size={20} />
                  <span>Add Your First Property</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {vendorProperties.map((property: VendorHotel) => (
                  <VendorHotelCard
                    key={property.id}
                    hotel={{
                      id: property.id,
                      name: property.name,
                      image: property.image || '',
                      thumbnail: property.thumbnail || '',
                      description: property.description,
                      room_tiers: property.room_tiers?.map(tier => ({...tier, description: tier.description || '', status: tier.status as 'active' | 'inactive'})) || [],
                      gallery: property.gallery || [],
                      location: {
                        country: property.location?.country || '',
                        city: property.location?.city || '',
                        full_address: property.location?.full_address || '',
                        zip_code: property.location?.zip_code || '',
                        latitude: Number(property.location?.latitude) || 0,
                        longitude: Number(property.location?.longitude) || 0,
                      },
                      amenities: property.amenities || [],
                      location_summary: property.location_summary || `${property.location?.city}, ${property.location?.country}`,
                      stars: property.stars || 0,
                      status: property.status as 'active' | 'inactive' | 'pending',
                      pricePerNight: property.pricePerNight || 0,
                      bookings: property.bookings || 0,
                      revenue: property.revenue || 0,
                      rating: property.rating || 0,
                      reviews: property.reviews || 0,
                      createdAt: property.createdAt,
                    }}
                    baseImageUrl={APIENDPOINTS.content_url}
                    onEdit={handleEditProperty}
                    onDelete={handleDeleteProperty}
                    onViewDetails={handleViewProperty}
                    onTierManage={(id) => navigate(`/${AppRoutes.vendorBase}/${AppRoutes.vendorAddRoomtier}/${id}`)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default VendorPropertiesPage;