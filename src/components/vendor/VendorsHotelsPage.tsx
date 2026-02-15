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
  RotateCcw
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

const VendorHotelsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: hotelsData, isLoading } = useGetVendorHotelsQuery({
    search: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? statusFilter as any : undefined,
    sort_by: sortBy as any,
    min_price: minPrice ? Number(minPrice) : undefined,
    max_price: maxPrice ? Number(maxPrice) : undefined,
  });

  const [deleteHotel, { isLoading: isDeleting }] = useDeleteHotelMutation();

  const hotels = hotelsData?.data || [];

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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>

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
              to="/vendor/hotels/create"
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
            >
              <Plus size={20} />
              <span className="hidden md:inline">Add Hotel</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-6 shadow-lg border border-white/40 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            
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
                onChange={(e) => setStatusFilter(e.target.value)}
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
                onChange={(e) => setSortBy(e.target.value)}
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
                  onChange={(e) => setMinPrice(e.target.value)}
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
                  onChange={(e) => setMaxPrice(e.target.value)}
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
              <div className="text-2xl font-display text-slate-900">{hotels.length}</div>
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
        <div className="glass rounded-2xl shadow-lg border border-white/40 overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
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
  hotel: VendorHotel;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onManageTiers: () => void;
  iconMap: Record<string, any>;
}

const HotelDetailModal: React.FC<HotelDetailModalProps> = ({ hotel, onClose, onEdit, onDelete, onManageTiers, iconMap }) => {
  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
    if (path.startsWith('http')) return path;
    return `${APIENDPOINTS.content_url}${path}`;
  };

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
          className="glass rounded-3xl shadow-2xl border border-white/40 w-full max-w-5xl max-h-[90vh] overflow-y-auto pointer-events-auto animate-slideDown"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header with Image */}
          <div className="relative h-80 overflow-hidden">
            <img 
              src={getImageUrl(primaryImage)} 
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X size={24} className="text-white" />
            </button>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  hotel.status === 'active' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-slate-500 text-white'
                }`}>
                  {hotel.status.toUpperCase()}
                </span>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: hotel.stars || 0 }).map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" className="text-yellow-400" />
                  ))}
                </div>
              </div>
              <h2 className="text-4xl font-display text-white mb-2">
                {hotel.name}
              </h2>
              <div className="flex items-center text-white/90">
                <MapPin size={18} className="mr-2" />
                <span>{hotel.location?.city}, {hotel.location?.country}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-xs text-blue-600 font-semibold mb-1">Total Rooms</div>
                <div className="text-2xl font-display text-blue-900">{totalInventory}</div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="text-xs text-purple-600 font-semibold mb-1">Bookings</div>
                <div className="text-2xl font-display text-purple-900">{hotel.bookings || 0}</div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="text-xs text-green-600 font-semibold mb-1">Revenue</div>
                <div className="text-2xl font-display text-green-900">${(hotel.revenue || 0).toLocaleString()}</div>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="text-xs text-amber-600 font-semibold mb-1">Occupancy</div>
                <div className="text-2xl font-display text-amber-900">{occupancyRate.toFixed(0)}%</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">About This Property</h3>
              <p className="text-slate-600 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Location</h3>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-blue-700" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 mb-1">{hotel.location?.full_address}</div>
                    <div className="text-sm text-slate-600">
                      {hotel.location?.city}, {hotel.location?.country}
                      {hotel.location?.zip_code && ` ${hotel.location.zip_code}`}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      Coordinates: {hotel.location?.latitude}, {hotel.location?.longitude}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {hotel.amenities.map((amenity: any) => {
                    const Icon = iconMap[amenity.icon] || HotelIcon;
                    return (
                      <div key={amenity.id} className="flex items-center space-x-3 bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                        <div className="w-10 h-10 rounded-lg bg-indigo-200 flex items-center justify-center flex-shrink-0">
                          <Icon size={20} className="text-indigo-700" />
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Room Tiers ({hotel.room_tiers?.length || 0})</h3>
                <button
                  onClick={onManageTiers}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Manage Tiers →
                </button>
              </div>
              
              <div className="space-y-4">
                {hotel.room_tiers?.map((tier: any) => (
                  <div 
                    key={tier.id}
                    className={`rounded-xl p-6 border-2 ${
                      tier.is_locked 
                        ? 'bg-slate-50 border-slate-300' 
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-bold text-slate-900">{tier.type}</h4>
                          {tier.is_locked && (
                            <div className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center space-x-1">
                              <Lock size={12} />
                              <span>Locked</span>
                            </div>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            tier.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {tier.status}
                          </span>
                        </div>
                        {tier.description && (
                          <p className="text-sm text-slate-600 mb-3">{tier.description}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-3xl font-display text-indigo-600">${tier.base_price}</div>
                        <div className="text-xs text-slate-500">per night</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-slate-200">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Max Guests</div>
                        <div className="flex items-center space-x-1">
                          <Users size={14} className="text-slate-400" />
                          <span className="font-bold text-slate-900">{tier.max_occupancy}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Inventory</div>
                        <div className="flex items-center space-x-1">
                          <Package size={14} className="text-slate-400" />
                          <span className="font-bold text-slate-900">{tier.total_inventory}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Available</div>
                        <div className="font-bold text-green-600">{tier.available}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Active Bookings</div>
                        <div className="font-bold text-purple-600">{tier.active_bookings_count}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Occupancy</div>
                        <div className="font-bold text-amber-600">
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
                <h3 className="text-lg font-bold text-slate-900 mb-4">Gallery ({hotel.gallery.length} images)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {hotel.gallery.map((image: any) => (
                    <div 
                      key={image.id}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <img 
                        src={getImageUrl(image.path)} 
                        alt="Hotel"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {image.is_primary && (
                        <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ratings & Reviews */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-slate-600 mb-2">Average Rating</div>
                  <div className="flex items-center space-x-2">
                    <Star size={24} fill={hotel.rating > 0 ? "#fbbf24" : "none"} className="text-yellow-400" />
                    <span className="text-3xl font-display text-slate-900">
                      {hotel.rating > 0 ? Number(hotel.rating).toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-2">Total Reviews</div>
                  <div className="text-3xl font-display text-slate-900">{hotel.reviews || 0}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-slate-200 bg-slate-50">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Link
                to={`/vendor/hotel/${hotel.id}/edit`}
                className="flex items-center justify-center space-x-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                <Edit2 size={18} />
                <span>Edit Hotel</span>
              </Link>

              <button
                onClick={onDelete}
                className="flex items-center justify-center space-x-2 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                <Trash2 size={18} />
                <span>Delete Hotel</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorHotelsPage;