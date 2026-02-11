import React from 'react';
import { X, MapPin, Star, Wifi, Coffee, Car, Dumbbell, Check, Loader2, AlertCircle, Building2, Bed, Package, DollarSign, Users, Calendar, TrendingUp, Image as ImageIcon, Waves, Lock } from 'lucide-react';
import { useGetVendorHotelByIdQuery } from '../../store/services/hotelApi';
// import SkeletonLoader from '../SkeletonLoader';
import SkeletonLoader from '../SkeletonLoader';
import { APIENDPOINTS } from '../../utils/ApiConstants';
import { AppImages } from '../../utils/AppImages';

interface VendorHotelDetailsModalProps {
  isOpen: boolean;
  hotelId: number | null;
  onClose: () => void;
}

const VendorHotelDetailsModal: React.FC<VendorHotelDetailsModalProps> = ({ isOpen, hotelId, onClose }) => {
  const { data: hotelResponse, isLoading, isError } = useGetVendorHotelByIdQuery(hotelId!, {
    skip: !hotelId || !isOpen,
  });

  const hotel = hotelResponse?.data;
  console.log("API Response ===",hotelResponse);

  if (!isOpen) return null;

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return AppImages.placeholders.hotels_placeholder;
    if (path.startsWith('http')) return path;
    return `${APIENDPOINTS.content_url}${path}`;
  };

  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('wifi')) return Wifi;
    if (lower.includes('breakfast') || lower.includes('coffee')) return Coffee;
    if (lower.includes('pool') || lower.includes('waves')) return Waves; // Assuming Waves for pool
    if (lower.includes('gym') || lower.includes('fitness')) return Dumbbell;
    if (lower.includes('parking') || lower.includes('car')) return Car;
    return Check; // Default icon
  };

  const displayAmenities = hotel?.amenities.map(amenity => ({
    icon: getAmenityIcon(amenity.name),
    name: amenity.name
  })) || [];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
        .glass {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
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
      <div
        className="glass rounded-3xl shadow-2xl border border-white/40 w-full max-w-4xl max-h-[90vh] flex flex-col pointer-events-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-2xl font-display text-slate-900">Hotel Details</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <SkeletonLoader type="hotel-details-modal" />
          </div>
        ) : isError || !hotel ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 text-center py-12">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Error Loading Hotel</h3>
            <p className="text-slate-600">Could not retrieve hotel details. Please try again.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {/* Hotel Name & Status */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-3xl font-display text-slate-900 mb-1">{hotel.name}</h3>
                <div className="flex items-center text-slate-600 text-sm">
                  <MapPin size={16} className="mr-1.5" />
                  <span>{hotel.location?.full_address || `${hotel.city}, ${hotel.location?.country}`}</span>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-full backdrop-blur-md border flex items-center space-x-1.5 ${hotel.status === 'active'
                  ? 'bg-green-500/90 border-green-300 text-white'
                  : hotel.status === 'pending'
                    ? 'bg-amber-500/90 border-amber-300 text-white'
                    : 'bg-slate-500/90 border-slate-300 text-white'
                }`}>
                {hotel.status === 'active' ? <Check size={14} /> : <Lock size={14} />}
                <span className="text-xs font-bold uppercase tracking-wider">
                  {hotel.status}
                </span>
              </div>
            </div>

            {/* Image Gallery (simplified for modal) */}
            <div className="grid grid-cols-4 gap-2 mb-6 h-48">
              {(hotel.gallery || []).slice(0, 4).map((img, idx) => (
                <div key={img.id} className={`relative overflow-hidden rounded-xl ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}>
                  <img
                    src={getImageUrl(img.url)}
                    alt={`${hotel.name} image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {(!hotel.images || hotel.images.length === 0) && (
                 <div className="col-span-4 flex items-center justify-center bg-slate-100 rounded-xl text-slate-400">
                   <ImageIcon size={48} />
                 </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="font-bold text-slate-900 mb-2">Description</h4>
              <p className="text-slate-700 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Star Rating</p>
                <div className="flex items-center">
                  {Array.from({ length: hotel.star_rating || 0 }).map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" className="text-yellow-400" />
                  ))}
                  {hotel.star_rating === 0 && <span className="text-sm text-slate-600">N/A</span>}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Property Type</p>
                <p className="font-semibold text-slate-900 capitalize">{hotel.property_type || 'Hotel'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Total Rooms</p>
                <p className="font-semibold text-slate-900">{hotel.total_rooms || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Base Price</p>
                <p className="font-semibold text-slate-900">${hotel.base_price || '0.00'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Contact Email</p>
                <p className="font-semibold text-slate-900 break-all">{hotel.contact_email || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Contact Phone</p>
                <p className="font-semibold text-slate-900">{hotel.contact_phone || 'N/A'}</p>
              </div>
            </div>

            {/* Amenities */}
            {displayAmenities.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 mb-3">Amenities</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {displayAmenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-3 bg-white rounded-xl border border-slate-200">
                      <amenity.icon size={18} className="text-indigo-600" />
                      <span className="text-sm text-slate-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Room Tiers Summary */}
            {hotel.room_tiers && hotel.room_tiers.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 mb-3">Room Tiers ({hotel.room_tiers.length})</h4>
                <div className="space-y-3">
                  {hotel.room_tiers.map((tier) => (
                    <div key={tier.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-slate-900">{tier.type}</h5>
                        <span className="font-bold text-indigo-600">${tier.price}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Users size={14} className="mr-1" /> {tier.max_occupancy} guests
                        </div>
                        <div className="flex items-center">
                          <Package size={14} className="mr-1" /> {tier.total_inventory} rooms
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Policies */}
            <div className="mb-6">
              <h4 className="font-bold text-slate-900 mb-2">Policies</h4>
              <div className="space-y-2 text-slate-700 text-sm">
                <p><strong>Cancellation Policy:</strong> {hotel.cancellation_policy || 'N/A'}</p>
                <p><strong>House Rules:</strong> {hotel.house_rules || 'No specific rules provided.'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorHotelDetailsModal;