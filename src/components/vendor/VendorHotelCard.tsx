import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  MapPin,
  DollarSign,
  Bed,
  Users,
  TrendingUp,
  Calendar,
  Image as ImageIcon,
  MoreVertical,
  ChevronRight,
  Building2,
  Package,
  CheckCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { APIENDPOINTS } from '../../utils/ApiConstants';
import { AppRoutes } from '../../utils/AppRoutes';

interface RoomTier {
  id: number;
  type: string;
  description: string;
  base_price: number;
  max_occupancy: number;
  total_inventory: number;
  status: 'active' | 'inactive';
  available: number;
  is_locked: boolean;
  active_bookings_count: number;
}

interface GalleryImage {
  id: number;
  url: string;
  is_primary: boolean;
}

interface Location {
  country: string;
  city: string;
  full_address: string;
  zip_code: string;
  latitude: number;
  longitude: number;
}

interface Amenity {
  id: number;
  name: string;
  icon: string;
  slug: string;
}

interface Hotel {
  id: number;
  name: string;
  image: string;
  thumbnail: string;
  description: string;
  room_tiers: RoomTier[];
  gallery: GalleryImage[];
  location: Location;
  amenities: Amenity[];
  location_summary: string;
  stars: number;
  status: 'active' | 'inactive' | 'pending';
  pricePerNight: number;
  bookings: number;
  revenue: number;
  rating: number;
  reviews: number;
  createdAt: string;
}

interface VendorHotelCardProps {
  hotel: Hotel;
  onEdit?: (hotelId: number) => void;
  onDelete?: (hotelId: number) => void;
  onToggleStatus?: (hotelId: number) => void;
  onTierManage?:(hotelId:number)=>void; 
  baseImageUrl?: string;
}

const VendorHotelCard: React.FC<VendorHotelCardProps> = ({
  hotel,
  onEdit,
  onDelete,
  onToggleStatus,
  onTierManage,
  baseImageUrl = APIENDPOINTS.content_url
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  console.log("Hotel", hotel);
  const primaryImage = hotel.gallery.find(img => img.is_primary)?.url || hotel.image || hotel.thumbnail;
  const imageUrl = imageError
    ? 'https://placehold.co/800x600?text=Hotel+Image'
    : `${baseImageUrl}${primaryImage}`;

  const activeRoomTiers = hotel.room_tiers.filter(tier => tier.status === 'active');
  const totalRooms = hotel.room_tiers.reduce((sum, tier) => sum + tier.total_inventory, 0);
  const availableRooms = hotel.room_tiers.reduce((sum, tier) => sum + tier.available, 0);
  const occupancyRate = totalRooms > 0 ? ((totalRooms - availableRooms) / totalRooms) * 100 : 0;

  const handleEdit = () => {
    setShowMenu(false);
    onEdit?.(hotel.id);
  };

  console.log(`${baseImageUrl}${primaryImage}`);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${hotel.name}"?`)) {
      setShowMenu(false);
      onDelete?.(hotel.id);
    }
  };

  const handleToggleStatus = () => {
    setShowMenu(false);
    onToggleStatus?.(hotel.id);
  };

  const handleTierMange = () => {
    // setShowMenu(false);
    onTierManage?.(hotel.id);
  }

  return (
    <div className="glass rounded-3xl overflow-hidden shadow-lg border border-white/40 hover:shadow-2xl transition-all duration-300 group">
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
        
        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
        }
      `}</style>

      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={hotel.name}
          onError={(error) => {
            console.log(error);
            setImageError(true)
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <div className={`px-3 py-1.5 rounded-full backdrop-blur-md border flex items-center space-x-1.5 ${hotel.status === 'active'
              ? 'bg-green-500/90 border-green-300 text-white'
              : hotel.status === 'pending'
                ? 'bg-amber-500/90 border-amber-300 text-white'
                : 'bg-slate-500/90 border-slate-300 text-white'
            }`}>
            {hotel.status === 'active' ? <CheckCircle size={14} /> : <Lock size={14} />}
            <span className="text-xs font-bold uppercase tracking-wider">
              {hotel.status}
            </span>
          </div>
        </div>

        {/* Gallery Count */}
        <div className="absolute top-4 right-4">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 flex items-center space-x-1.5">
            <ImageIcon size={14} className="text-white" />
            <span className="text-white text-xs font-bold">{hotel.gallery.length}</span>
          </div>
        </div>

        {/* Star Rating */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center space-x-1">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} size={16} fill="#fbbf24" className="text-yellow-400" />
            ))}
          </div>
        </div>

        {/* Menu Button */}
        <div className="absolute bottom-4 right-4">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <MoreVertical size={18} className="text-slate-700" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                ></div>

                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-20">
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-indigo-50 transition-colors text-left"
                  >
                    <Edit2 size={16} className="text-indigo-600" />
                    <span className="text-sm font-semibold text-slate-700">Edit Hotel</span>
                  </button>

                  <button
                    onClick={handleToggleStatus}
                    className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-amber-50 transition-colors text-left"
                  >
                    {hotel.status === 'active' ? (
                      <>
                        <EyeOff size={16} className="text-amber-600" />
                        <span className="text-sm font-semibold text-slate-700">Deactivate</span>
                      </>
                    ) : (
                      <>
                        <Eye size={16} className="text-green-600" />
                        <span className="text-sm font-semibold text-slate-700">Activate</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDelete}
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
      </div>

      {/* Content Section */}
      <div className="p-6">

        {/* Hotel Name & Location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
            {hotel.name}
          </h3>
          <div className="flex items-center text-slate-600 text-sm">
            <MapPin size={16} className="mr-1.5 flex-shrink-0" />
            <span className="truncate">{hotel.location_summary}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5 pb-5 border-b border-slate-200">
          {/* Total Bookings */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center space-x-2 mb-1">
              <Calendar size={16} className="text-blue-600" />
              <span className="text-xs font-semibold text-blue-900">Bookings</span>
            </div>
            <div className="text-2xl font-display text-blue-700">{hotel.bookings}</div>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign size={16} className="text-green-600" />
              <span className="text-xs font-semibold text-green-900">Revenue</span>
            </div>
            <div className="text-2xl font-display text-green-700">
              ${hotel.revenue.toLocaleString()}
            </div>
          </div>

          {/* Occupancy Rate */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp size={16} className="text-purple-600" />
              <span className="text-xs font-semibold text-purple-900">Occupancy</span>
            </div>
            <div className="text-2xl font-display text-purple-700">
              {occupancyRate.toFixed(0)}%
            </div>
          </div>

          {/* Rating */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-3 border border-amber-100">
            <div className="flex items-center space-x-2 mb-1">
              <Star size={16} className="text-amber-600" />
              <span className="text-xs font-semibold text-amber-900">Rating</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <div className="text-2xl font-display text-amber-700">
                {hotel.rating || 'N/A'}
              </div>
              {hotel.reviews > 0 && (
                <span className="text-xs text-amber-600">({hotel.reviews})</span>
              )}
            </div>
          </div>
        </div>

        {/* Room Tiers */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-slate-900 text-sm">Room Tiers ({activeRoomTiers.length})</h4>
            <button
              onClick={handleTierMange}
              className="group text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center transition-colors cursor-pointer"
            >
              <span>Manage</span>
              <span className="transform transition-transform duration-200 group-hover:translate-x-1">
                <ChevronRight size={14} />
              </span>
            </button>

          </div>

          {activeRoomTiers.length > 0 ? (
            <div className="space-y-2">
              {activeRoomTiers.slice(0, 2).map((tier) => (
                <div
                  key={tier.id}
                  className="bg-slate-50 rounded-xl p-3 border border-slate-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-semibold text-slate-900 text-sm mb-1">
                        {tier.type}
                      </h5>
                      <div className="flex items-center space-x-3 text-xs text-slate-600">
                        <div className="flex items-center">
                          <Users size={12} className="mr-1" />
                          <span>{tier.max_occupancy} guests</span>
                        </div>
                        <div className="flex items-center">
                          <Package size={12} className="mr-1" />
                          <span>{tier.total_inventory} rooms</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-indigo-600">
                        ${tier.base_price}
                      </div>
                      <div className="text-xs text-slate-500">per night</div>
                    </div>
                  </div>

                  {/* Availability Bar */}
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${tier.available > tier.total_inventory / 2
                            ? 'bg-green-500'
                            : tier.available > 0
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                        style={{ width: `${(tier.available / tier.total_inventory) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                      {tier.available}/{tier.total_inventory}
                    </span>
                  </div>

                  {tier.active_bookings_count > 0 && (
                    <div className="mt-2 text-xs text-slate-500">
                      {tier.active_bookings_count} active booking{tier.active_bookings_count !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              ))}

              {activeRoomTiers.length > 2 && (
                <div className="text-center pt-1">
                  <Link
                    to={`/vendor/hotels/${hotel.id}/room-tiers`}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    +{activeRoomTiers.length - 2} more tier{activeRoomTiers.length - 2 !== 1 ? 's' : ''}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200">
              <Bed size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-500 mb-3">No room tiers added yet</p>
              <Link
                to={`/${AppRoutes.vendorBase}/${AppRoutes.vendorAddRoomtier}${hotel.id}`}
                className="inline-flex items-center space-x-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <span>Add Room Tier</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Amenities */}
        {hotel.amenities.length > 0 && (
          <div className="mb-5 pb-5 border-b border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-3">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.slice(0, 4).map((amenity) => (
                <div
                  key={amenity.id}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-200"
                >
                  {amenity.name}
                </div>
              ))}
              {hotel.amenities.length > 4 && (
                <div className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                  +{hotel.amenities.length - 4} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to={`/vendor/hotels/${hotel.id}`}
            className="flex items-center justify-center space-x-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
          >
            <Eye size={16} />
            <span>View Details</span>
          </Link>

          <Link
            to={`/vendor/hotels/${hotel.id}/edit`}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/40 transition-all"
          >
            <Edit2 size={16} />
            <span>Edit</span>
          </Link>
        </div>

        {/* Created Date */}
        <div className="mt-4 text-center text-xs text-slate-500">
          Created on {new Date(hotel.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
};

export default VendorHotelCard;