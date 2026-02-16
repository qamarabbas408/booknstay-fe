import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Edit2, 
  Trash2, 
  MoreVertical, 
  Hotel as HotelIcon, 
  Star, 
  MapPin, 
  DollarSign,
  Users,
  Bed,
  Image as ImageIcon,
  Lock,
  Unlock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
  Check,
  Wifi,
  Waves,
  Car,
  Dumbbell,
  Calendar,
  Package,
  Plus,
  RotateCcw,
  Award,
  Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetVendorHotelsQuery, useDeleteHotelMutation, type VendorHotel } from '../../store/services/hotelApi';
import { showToast } from '../CustomToaster';
import ConfirmationModal from './ConfirmationModal';
import { APIENDPOINTS } from '../../utils/ApiConstants';
import { Loader2 } from 'lucide-react';
import { useGetRoomTiersByHotelIdQuery, useDeleteRoomTypeMutation } from '../../store/services/roomApi';
import RoomTiersModal from './RoomTierModal';
import { AppRoutes } from '../../utils/AppRoutes';
import PulseLoader from '../PulseLoader';

const VendorHotelsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: hotelsData, isLoading } = useGetVendorHotelsQuery({
    search: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? statusFilter as any : undefined,
    sort_by: sortBy as any,
    min_price: minPrice ? Number(minPrice) : undefined,
    max_price: maxPrice ? Number(maxPrice) : undefined,
    page: currentPage,
    limit: 10,
  });

  const [deleteHotel, { isLoading: isDeleting }] = useDeleteHotelMutation();

  const hotels = hotelsData?.data || [];
  const pagination = hotelsData?.pagination || { total: 0, perPage: 10, currentPage: 1, lastPage: 1 };

  const [selectedHotel, setSelectedHotel] = useState<VendorHotel | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<number | null>(null);
  const [hotelToDelete, setHotelToDelete] = useState<number | null>(null);
  const [selectedHotelIdForTiers, setSelectedHotelIdForTiers] = useState<number | null>(null);

  const { data: roomTiersData, isLoading: isLoadingRoomTiers } = useGetRoomTiersByHotelIdQuery(selectedHotelIdForTiers ?? 0, {
    skip: !selectedHotelIdForTiers,
  });
  const [deleteRoomType] = useDeleteRoomTypeMutation();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const statusColors = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-slate-100 text-slate-700 border-slate-200',
    draft: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  const iconMap: Record<string, any> = {
    Wifi: Wifi,
    Waves: Waves,
    Car: Car,
    Dumbbell: Dumbbell,
  };

  const handleViewDetails = (hotel: VendorHotel) => {
    setSelectedHotel(hotel);
    setShowDetailModal(true);
    setActionMenuId(null);
  };

  const handleDeleteClick = (hotelId: number) => {
    setHotelToDelete(hotelId);
    setActionMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (hotelToDelete) {
      try {
        await deleteHotel(hotelToDelete).unwrap();
        showToast.success('Hotel deleted successfully');
        if (selectedHotel?.id === hotelToDelete) {
          setShowDetailModal(false);
          setSelectedHotel(null);
        }
        setHotelToDelete(null);
      } catch (error) {
        showToast.error('Failed to delete hotel');
      }
    }
  };

  const handleManageTiers = (hotelId: number) => {
    setSelectedHotelIdForTiers(hotelId);
    setActionMenuId(null);
    setShowDetailModal(false);
  };

  const handleDeleteRoomTier = async (tierId: number) => {
    try {
      await deleteRoomType(tierId).unwrap();
      showToast.success('Room tier deleted successfully');
    } catch (error: any) {
      showToast.error(error?.data?.message || 'Failed to delete room tier');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('recent');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
  };

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
    if (path.startsWith('http')) return path;
    return `${APIENDPOINTS.content_url}${path}`;
  };

  const totalRevenue = hotels.reduce((sum: number, h: VendorHotel) => sum + (h.revenue || 0), 0);
  const totalBookings = hotels.reduce((sum: number, h: VendorHotel) => sum + (h.bookings || 0), 0);
  const totalRooms = hotels.reduce((sum: number, h: VendorHotel) => 
    sum + (h.room_tiers?.reduce((rs: number, rt: any) => rs + rt.total_inventory, 0) || 0), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4 md:p-6 lg:p-8">
    
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-display text-slate-900 mb-3">
                Hotels Management
              </h1>
              <p className="text-lg text-slate-600">
                Manage your properties and room inventory
              </p>
            </div>
            <Link
              to="/vendor/add/hotel"
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
            >
              <Plus size={20} />
              <span className="hidden md:inline">Add Hotel</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-6 shadow-lg border border-white/40 mb-6">
          <div className="flex flex-col md:flex-row gap-4 my-4">
            
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hotels by name or location..."
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Filter Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-6 py-3 border-2 rounded-xl transition-colors font-semibold ${showFilters ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-slate-200 hover:border-indigo-400'}`}
            >
              <Filter size={20} />
              <span className="hidden md:inline">More Filters</span>
            </button>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200 animate-fadeIn">
            {/* Sort By */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all appearance-none cursor-pointer"
              >
                <option value="recent">Recently Added</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
               <label className="block text-xs font-semibold text-slate-500 mb-1">Min Price</label>
               <div className="relative">
                <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
                  placeholder="Min Price"
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all"
                />
              </div>
            </div>

            {/* Max Price */}
            <div>
               <label className="block text-xs font-semibold text-slate-500 mb-1">Max Price</label>
               <div className="relative">
                <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                  placeholder="Max Price"
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all"
                />
              </div>
            </div>

             {/* Reset Button */}
             <div className="flex items-end">
                <button 
                  onClick={handleResetFilters}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-xl font-semibold transition-colors"
                >
                  <RotateCcw size={18} />
                  <span>Reset Filters</span>
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
            <div>
              <div className="text-xs text-slate-600 mb-1">Total Properties</div>
              <div className="text-2xl font-display text-slate-900">{pagination.total}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 mb-1">Total Rooms</div>
              <div className="text-2xl font-display text-blue-600">{totalRooms}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 mb-1">Total Bookings</div>
              <div className="text-2xl font-display text-purple-600">{totalBookings}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 mb-1">Total Revenue</div>
              <div className="text-2xl font-display text-green-600">
                ${totalRevenue.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Hotels Table */}
        <div className="glass rounded-2xl shadow-lg border border-white/40">
          <div className="overflow-x-auto ">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <PulseLoader containerStyle="animate-spin text-indigo-600" size={40} />
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Property</th>
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Location</th>
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Room Tiers</th>
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Bookings</th>
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Revenue</th>
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Status</th>
                  <th className="text-right py-4 px-6 font-bold text-slate-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel: VendorHotel) => {
                  const totalInventory = hotel.room_tiers?.reduce((sum: number, rt: any) => sum + rt.total_inventory, 0) || 0;
                  const totalAvailable = hotel.room_tiers?.reduce((sum: number, rt: any) => sum + rt.available, 0) || 0;
                  const occupancyRate = totalInventory > 0 ? ((totalInventory - totalAvailable) / totalInventory) * 100 : 0;
                  const primaryImage = hotel.image;
                  
                  return (
                    <tr 
                      key={hotel.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      {/* Property */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                            <img 
                              src={getImageUrl(primaryImage)} 
                              alt={hotel.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="max-w-xs">
                            <div className="font-bold text-slate-900 text-sm mb-1">
                              {hotel.name}
                            </div>
                            <div className="flex items-center space-x-1 mb-1">
                              {Array.from({ length: hotel.stars || 0 }).map((_, i) => (
                                <Star key={i} size={12} fill="#fbbf24" className="text-yellow-400" />
                              ))}
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-slate-600">
                              <div className="flex items-center space-x-1">
                                <ImageIcon size={12} />
                                <span>{hotel.gallery?.length || 0}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar size={12} />
                                <span>{new Date(hotel.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-6">
                        <div className="flex items-start space-x-2 max-w-xs">
                          <MapPin size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <div className="font-semibold text-slate-900">{hotel.location?.city}</div>
                            <div className="text-xs text-slate-600">{hotel.location?.country}</div>
                          </div>
                        </div>
                      </td>

                      {/* Room Tiers */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900 text-sm">
                            {hotel.room_tiers?.length || 0} {hotel.room_tiers?.length === 1 ? 'tier' : 'tiers'}
                          </div>
                          <div className="text-xs text-slate-600">
                            {totalInventory} total rooms
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  occupancyRate >= 80 
                                    ? 'bg-red-500' 
                                    : occupancyRate >= 50 
                                      ? 'bg-amber-500' 
                                      : 'bg-green-500'
                                }`}
                                style={{ width: `${occupancyRate}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-600">
                              {occupancyRate.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Bookings */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-purple-600 text-sm">
                          {hotel.bookings || 0}
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-green-600 text-sm">
                          ${(hotel.revenue || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          ${hotel.pricePerNight || 0}/night
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[hotel.status]}`}>
                          {hotel.status.charAt(0).toUpperCase() + hotel.status.slice(1)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetails(hotel)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>

                          <div className="relative">
                            <button
                              onClick={() => setActionMenuId(actionMenuId === hotel.id ? null : hotel.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {/* Action Menu */}
                            {actionMenuId === hotel.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-10" 
                                  onClick={() => setActionMenuId(null)}
                                ></div>
                                
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-20 animate-slideDown">
                                  <Link
                                    to={`/vendor/hotel/${hotel.id}/edit`}
                                    className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-indigo-50 transition-colors text-left"
                                  >
                                    <Edit2 size={16} className="text-indigo-600" />
                                    <span className="text-sm font-semibold text-slate-700">Edit Hotel</span>
                                  </Link>
                                  
                                  <button
                                    onClick={() => handleManageTiers(hotel.id)}
                                    className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-purple-50 transition-colors text-left"
                                  >
                                    <Bed size={16} className="text-purple-600" />
                                    <span className="text-sm font-semibold text-slate-700">Manage Room Tiers</span>
                                  </button>
                                  
                                  <button
                                    onClick={() => handleDeleteClick(hotel.id)}
                                    className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-red-50 transition-colors text-left border-t border-slate-100"
                                  >
                                    <Trash2 size={16} className="text-red-600" />
                                    <span className="text-sm font-semibold text-red-600">Delete</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && hotels.length > 0 && (
            <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
              <div className="text-sm text-slate-600">
                Showing <span className="font-semibold">{(currentPage - 1) * pagination.perPage + 1}</span> to{' '}
                <span className="font-semibold">
                  {Math.min(currentPage * pagination.perPage, pagination.total)}
                </span>{' '}
                of <span className="font-semibold">{pagination.total}</span> properties
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-slate-200 hover:border-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>

                {[...Array(pagination.lastPage)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all ${
                      currentPage === i + 1
                        ? 'bg-indigo-600 text-white'
                        : 'border-2 border-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.lastPage))}
                  disabled={currentPage === pagination.lastPage}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-slate-200 hover:border-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hotel Detail Modal */}
      {showDetailModal && selectedHotel && (
        <HotelDetailModal
          hotel={selectedHotel}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedHotel(null);
          }}
          onEdit={() => {
            setShowDetailModal(false);
          }}
          onDelete={() => {
            handleDeleteClick(selectedHotel.id);
            setShowDetailModal(false);
          }}
          onManageTiers={() => handleManageTiers(selectedHotel.id)}
          iconMap={iconMap}
        />
      )}

      <ConfirmationModal
        isOpen={!!hotelToDelete}
        title="Delete Hotel"
        message="Are you sure you want to delete this hotel? This action cannot be undone."
        confirmText="Delete Hotel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setHotelToDelete(null)}
        isLoading={isDeleting}
        isDangerous={true}
      />

      {selectedHotelIdForTiers && (
        <RoomTiersModal
          isOpen={!!selectedHotelIdForTiers}
          onClose={() => setSelectedHotelIdForTiers(null)}
          hotelName={hotels.find((h: any) => h.id === selectedHotelIdForTiers)?.name || 'Hotel'}
          roomTiers={roomTiersData?.data || []}
          isLoading={isLoadingRoomTiers}
          onAddTier={() => navigate(`/${AppRoutes.vendorBase}/${AppRoutes.vendorAddRoomtier}/${selectedHotelIdForTiers}`)}
          onEditTier={(tierId) => navigate(`/${AppRoutes.vendorBase}/${AppRoutes.editRoomtier}/${tierId}`)}
          onDeleteTier={handleDeleteRoomTier}
        />
      )}
    </div>
  );
};


// Hotel Detail Modal Component
interface HotelDetailModalProps {
  hotel: VendorHotel; // VendorHotel type
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onManageTiers: () => void;
  iconMap: Record<string, any>;
}

const HotelDetailModal: React.FC<HotelDetailModalProps> = ({ 
  hotel, 
  onClose, 
  onEdit, 
  onDelete, 
  onManageTiers, 
  iconMap 
}) => {
  // Image URL helper
  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
    if (path.startsWith('http')) return path;
    return `https://your-api-url.com/storage/${path}`;
  };

  // Calculate stats
  const primaryImage = hotel.image;
  const totalInventory = hotel.room_tiers?.reduce((sum: number, rt: any) => sum + rt.total_inventory, 0) || 0;
  const totalAvailable = hotel.room_tiers?.reduce((sum: number, rt: any) => sum + rt.available, 0) || 0;
  const occupancyRate = totalInventory > 0 ? ((totalInventory - totalAvailable) / totalInventory) * 100 : 0;

  return (
    <>
  
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="glass shadow-2xl border border-white/40 w-full max-w-6xl max-h-[92vh] overflow-hidden pointer-events-auto animate-slideDown overflow-y-scroll scroll-w-normal scrollbar-hide"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Scrollable Content */}
          <div className="h-full overflow-y-auto">
            
            {/* Hero Header with Image */}
            <div className="relative h-96 overflow-hidden">
              <img 
                src={getImageUrl(primaryImage)} 
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white/20 transition-all hover:rotate-90 duration-300 border border-white/20"
              >
                <X size={24} className="text-white" />
              </button>

              {/* Floating Stats Badge */}
              <div className="absolute top-6 left-6">
                <div className="flex items-center space-x-3">
                  <div className="glass-dark px-4 py-2.5 rounded-xl border border-white/20 backdrop-blur-xl">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-white/80" />
                      <span className="text-white text-sm font-semibold">
                        Created {hotel.createdAt}
                      </span>
                    </div>
                  </div>
                  {hotel.rating > 0 && (
                    <div className="glass-dark px-4 py-2.5 rounded-xl border border-white/20 backdrop-blur-xl">
                      <div className="flex items-center space-x-2">
                        <Award size={16} className="text-yellow-400" />
                        <span className="text-white text-sm font-semibold">
                          {Number(hotel.rating).toFixed(1)} Rating
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Title Section */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                  <div className="flex-1">
                    {/* Status & Stars */}
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border ${
                        hotel.status === 'active' 
                          ? 'bg-green-500/90 text-white border-green-400' 
                          : 'bg-slate-500/90 text-white border-slate-400'
                      }`}>
                        {hotel.status.toUpperCase()}
                      </span>
                      <div className="flex items-center space-x-1 bg-amber-500/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400">
                        {Array.from({ length: hotel.stars || 0 }).map((_, i) => (
                          <Star key={i} size={14} fill="#fff" className="text-white" />
                        ))}
                      </div>
                      {hotel.gallery?.length > 0 && (
                        <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/30">
                          {hotel.gallery.length} Photos
                        </span>
                      )}
                    </div>
                    
                    {/* Hotel Name */}
                    <h2 className="text-4xl md:text-5xl font-display text-white mb-3 leading-tight drop-shadow-lg">
                      {hotel.name}
                    </h2>
                    
                    {/* Location */}
                    <div className="flex items-center text-white/90 text-lg drop-shadow-md">
                      <MapPin size={20} className="mr-2" />
                      <span>{hotel.location?.city}, {hotel.location?.country}</span>
                    </div>
                  </div>

                  {/* Price Badge */}
                  <div className="mt-6 md:mt-0 md:ml-6">
                    <div className="glass-dark backdrop-blur-xl border border-white/20 rounded-2xl p-5 text-center">
                      <div className="text-sm text-white/70 mb-1">Starting from</div>
                      <div className="text-4xl font-display text-white mb-1">
                        ${hotel.pricePerNight}
                      </div>
                      <div className="text-xs text-white/70">per night</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-10 space-y-10">
              
              {/* Quick Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center">
                      <Package size={24} className="text-blue-700" />
                    </div>
                  </div>
                  <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">Total Rooms</div>
                  <div className="text-3xl font-display text-blue-900">{totalInventory}</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border border-purple-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-200 flex items-center justify-center">
                      <Calendar size={24} className="text-purple-700" />
                    </div>
                  </div>
                  <div className="text-xs text-purple-600 font-semibold mb-1 uppercase tracking-wide">Bookings</div>
                  <div className="text-3xl font-display text-purple-900">{hotel.bookings || 0}</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 border border-green-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-green-200 flex items-center justify-center">
                      <TrendingUp size={24} className="text-green-700" />
                    </div>
                  </div>
                  <div className="text-xs text-green-600 font-semibold mb-1 uppercase tracking-wide">Revenue</div>
                  <div className="text-3xl font-display text-green-900">${(hotel.revenue || 0).toLocaleString()}</div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-5 border border-amber-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center">
                      <Users size={24} className="text-amber-700" />
                    </div>
                  </div>
                  <div className="text-xs text-amber-600 font-semibold mb-1 uppercase tracking-wide">Occupancy</div>
                  <div className="text-3xl font-display text-amber-900">{occupancyRate.toFixed(0)}%</div>
                </div>
              </div>

              {/* Description */}
              <div className="glass rounded-2xl p-8 border border-slate-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">About This Property</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">{hotel.description}</p>
              </div>

              {/* Location Card */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center">
                  <MapPin size={24} className="mr-3 text-indigo-600" />
                  Location Details
                </h3>
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
                  <div className="flex items-start space-x-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <MapPin size={32} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 text-lg mb-2">{hotel.location?.full_address}</div>
                      <div className="text-slate-600 mb-3">
                        {hotel.location?.city}, {hotel.location?.country}
                        {hotel.location?.zip_code && ` ${hotel.location.zip_code}`}
                      </div>
                      <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-indigo-200">
                        <span className="text-xs font-semibold text-slate-500">GPS:</span>
                        <span className="text-xs font-mono text-slate-700">
                          {hotel.location?.latitude}, {hotel.location?.longitude}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-5">
                    Property Amenities ({hotel.amenities.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {hotel.amenities.map((amenity: any) => {
                      const Icon = iconMap[amenity.icon] || HotelIcon;
                      return (
                        <div 
                          key={amenity.id} 
                          className="group flex items-center space-x-3 bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Icon size={22} className="text-indigo-600" />
                          </div>
                          <span className="text-sm font-semibold text-slate-900">{amenity.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Room Tiers */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">
                    Room Tiers ({hotel.room_tiers?.length || 0})
                  </h3>
                  <button
                    onClick={onManageTiers}
                    className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/40 transition-all"
                  >
                    <span>Manage Tiers</span>
                    <span>→</span>
                  </button>
                </div>
                
                <div className="space-y-5">
                  {hotel.room_tiers?.map((tier: any, index: number) => (
                    <div 
                      key={tier.id}
                      className={`rounded-2xl p-6 border-2 transition-all hover:shadow-xl ${
                        tier.is_locked 
                          ? 'bg-slate-50 border-slate-300' 
                          : 'bg-white border-slate-200 hover:border-indigo-300'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Tier Header */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h4 className="text-xl font-bold text-slate-900">{tier.type}</h4>
                            
                            {tier.is_locked && (
                              <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center space-x-1.5">
                                <Lock size={14} />
                                <span>Locked</span>
                              </div>
                            )}
                            
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              tier.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {tier.status}
                            </span>
                          </div>
                          
                          {tier.description && (
                            <p className="text-slate-600 leading-relaxed">{tier.description}</p>
                          )}
                        </div>
                        
                        {/* Price Badge */}
                        <div className="text-right ml-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl px-6 py-4 border border-indigo-200">
                          <div className="text-4xl font-display gradient-text mb-1">
                            ${tier.base_price}
                          </div>
                          <div className="text-xs text-slate-500 font-semibold">per night</div>
                        </div>
                      </div>

                      {/* Tier Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-5 border-t-2 border-slate-200">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <Users size={16} className="text-blue-600" />
                            <div className="text-xs text-blue-600 font-semibold uppercase">Max Guests</div>
                          </div>
                          <div className="text-2xl font-display text-blue-900">{tier.max_occupancy}</div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <Package size={16} className="text-purple-600" />
                            <div className="text-xs text-purple-600 font-semibold uppercase">Inventory</div>
                          </div>
                          <div className="text-2xl font-display text-purple-900">{tier.total_inventory}</div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <Check size={16} className="text-green-600" />
                            <div className="text-xs text-green-600 font-semibold uppercase">Available</div>
                          </div>
                          <div className="text-2xl font-display text-green-900">{tier.available}</div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar size={16} className="text-indigo-600" />
                            <div className="text-xs text-indigo-600 font-semibold uppercase">Bookings</div>
                          </div>
                          <div className="text-2xl font-display text-indigo-900">{tier.active_bookings_count}</div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp size={16} className="text-amber-600" />
                            <div className="text-xs text-amber-600 font-semibold uppercase">Occupancy</div>
                          </div>
                          <div className="text-2xl font-display text-amber-900">
                            {tier.total_inventory > 0 
                              ? ((tier.total_inventory - tier.available) / tier.total_inventory * 100).toFixed(0)
                              : 0}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              {hotel.gallery && hotel.gallery.length > 1 && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-5">
                    Property Gallery ({hotel.gallery.length} images)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {hotel.gallery.map((image: any, index: number) => (
                      <div 
                        key={image.id}
                        className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <img 
                          src={getImageUrl(image.path)} 
                          alt="Hotel"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                        
                        {image.is_primary && (
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ratings & Reviews */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Ratings & Reviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="text-sm text-slate-600 mb-3 font-semibold uppercase tracking-wide">Average Rating</div>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                        <Star size={32} fill="#fff" className="text-white" />
                      </div>
                      <span className="text-5xl font-display text-slate-900">
                        {hotel.rating > 0 ? Number(hotel.rating).toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="text-sm text-slate-600 mb-3 font-semibold uppercase tracking-wide">Total Reviews</div>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Users size={32} className="text-white" />
                      </div>
                      <span className="text-5xl font-display text-slate-900">{hotel.reviews || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer Actions */}
            <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent p-8 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to={`/vendor/hotel/${hotel.id}/edit`}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
                >
                  <Edit2 size={20} />
                  <span>Edit Hotel</span>
                </Link>

                <button
                  onClick={onManageTiers}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-purple-500/40 transition-all"
                >
                  <Package size={20} />
                  <span>Manage Tiers</span>
                </button>

                <button
                  onClick={onDelete}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-red-500/40 transition-all"
                >
                  <Trash2 size={20} />
                  <span>Delete Hotel</span>
                </button>
              </div>
              
              <button
                onClick={onClose}
                className="w-full mt-4 px-6 py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default VendorHotelsPage;