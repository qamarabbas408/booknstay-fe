import React, { useState } from 'react';
import { MapPin, Star, Users, Bed, Wifi, Coffee, Car, Dumbbell, Waves, Sparkles, Heart, Eye, ChevronRight } from 'lucide-react';
import { AppImages } from '../../utils/AppImages';

interface RoomTier {
  id: number;
  name: string;
  price: number;
  max_guests: number;
  description: string | null;
}

interface Amenity {
  name: string;
  icon: string;
}

interface Location {
  city: string | null;
  country: string | null;
  full_address: string | null;
  lat: string | null;
  lng: string | null;
}

interface PricingDetails {
  base_price: number;
  tax_percentage: number;
  service_fee: number;
  currency: string;
}

interface HotelCardProps {
  id: number;
  name: string;
  description: string;
  stars: number;
  pricePerNight: number;
  totalStartingPrice: number;
  pricing_details: PricingDetails;
  location: Location;
  room_tiers: RoomTier[];
  starting_price: number;
  image: string;
  rating: number;
  reviewCount: number;
  amenities: Amenity[];
  onLike?: (id: number) => void;
  onView?: (id: number) => void;
  isLiked?: boolean;
}

const HotelCard: React.FC<HotelCardProps> = ({
  id,
  name,
  description,
  stars,
  pricing_details,
  location,
  room_tiers,
  starting_price,
  image,
  rating,
  reviewCount,
  amenities,
  onLike,
  onView,
  isLiked = false
}) => {
  const [liked, setLiked] = useState(isLiked);

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Wifi, Coffee, Car, Dumbbell, Waves, Sparkles
    };
    return icons[iconName] || Wifi;
  };

  const handleLike = () => {
    setLiked(!liked);
    if (onLike) {
      onLike(id);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(id);
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl border border-slate-200 transition-all duration-300 hover:-translate-y-2">
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

        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Image Section */}
      <div className="relative h-64 overflow-hidden group">
        <img
          src={image ?? AppImages.placeholders.hotels_placeholder}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Star Rating Badge */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center shadow-lg">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < stars ? "#f59e0b" : "none"}
                className={i < stars ? "text-amber-500" : "text-slate-300"}
              />
            ))}
          </div>
        </div>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-2.5 rounded-full hover:scale-110 transition-transform shadow-lg"
        >
          <Heart
            size={20}
            fill={liked ? "#ec4899" : "none"}
            className={liked ? "text-pink-500" : "text-slate-600"}
          />
        </button>

        {/* Location Badge */}
        {location.city && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center shadow-lg">
            <MapPin size={14} className="text-indigo-600 mr-1.5" />
            <span className="text-sm font-semibold text-slate-900">
              {location.city}, {location.country}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Hotel Name & Rating */}
        <div className="mb-4">
          <h3 className="text-xl font-display text-slate-900 mb-2 leading-tight">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-lg">
              <Star size={14} fill="#f59e0b" className="text-amber-500 mr-1" />
              <span className="text-sm font-bold text-amber-700">{rating}</span>
            </div>
            <span className="text-sm text-slate-500">({reviewCount} reviews)</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Room Tiers */}
        <div className="mb-4">
          <div className="flex items-center text-xs text-slate-500 font-semibold mb-2">
            <Bed size={14} className="mr-1.5" />
            <span>Available Room Types ({room_tiers.length})</span>
          </div>
          <div className="space-y-2">
            {room_tiers.slice(0, 2).map((tier) => (
              <div
                key={tier.id}
                className="flex items-center justify-between bg-slate-50 rounded-lg p-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{tier.name}</p>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <Users size={12} className="mr-1" />
                    <span>Up to {tier.max_guests} guests</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-display text-indigo-600">
                    ${tier.price}
                  </p>
                  <p className="text-xs text-slate-500">per night</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-5">
          <p className="text-xs text-slate-500 font-semibold mb-2">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {amenities.slice(0, 4).map((amenity, idx) => {
              const Icon = getIconComponent(amenity.icon);
              return (
                <div
                  key={idx}
                  className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  <Icon size={12} className="mr-1.5" />
                  {amenity.name}
                </div>
              );
            })}
            {amenities.length > 4 && (
              <div className="flex items-center bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
                +{amenities.length - 4} more
              </div>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-5 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Starting from</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-display gradient-text">
                  ${starting_price}
                </p>
                <span className="text-sm text-slate-500">/night</span>
              </div>
              {pricing_details.tax_percentage > 0 && (
                <p className="text-xs text-slate-500 mt-1">
                  +{pricing_details.tax_percentage}% tax & fees
                </p>
              )}
            </div>

            <button 
              onClick={handleView}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all group"
            >
              <Eye size={18} />
              <span>View</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HotelCard; 