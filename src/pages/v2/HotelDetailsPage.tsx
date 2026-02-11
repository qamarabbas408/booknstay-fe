import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, DollarSign, Users, Calendar, Check, ChevronDown, Wifi, Car, Waves, Sparkles as SparklesIcon, Dumbbell, Info, Shield, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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

interface HotelDetails {
  id: number;
  name: string;
  description: string;
  stars: number;
  pricePerNight: number;
  totalStartingPrice: number;
  pricing_details: {
    base_price: number;
    tax_percentage: number;
    service_fee: number;
    currency: string;
  };
  location: {
    city: string | null;
    country: string | null;
    full_address: string | null;
    lat: number | null;
    lng: number | null;
  };
  room_tiers: RoomTier[];
  starting_price: number;
  image: string;
  rating: number;
  reviewCount: number;
  amenities: Amenity[];
  reviews: number;
}

const HotelDetailsPage: React.FC = () => {
  const navigate = useNavigate();

  // Mock hotel data (would come from API)
  const hotel: HotelDetails = {
    id: 40,
    name: "Sample Hotel 14",
    description: "This is a sample description for hotel 14, offering great amenities and comfortable stays.",
    stars: 5,
    pricePerNight: 100,
    totalStartingPrice: 100,
    pricing_details: {
      base_price: 100,
      tax_percentage: 0,
      service_fee: 0,
      currency: "USD"
    },
    location: {
      city: "Maldives",
      country: "Maldives",
      full_address: "123 Beach Road, Maldives",
      lat: null,
      lng: null
    },
    room_tiers: [
      {
        id: 3,
        name: "Standard Room",
        price: 100,
        max_guests: 3,
        description: "Standard Room"
      },
      {
        id: 6,
        name: "Deluxe Suite",
        price: 149.97,
        max_guests: 3,
        description: null
      }
    ],
    starting_price: 100,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    reviewCount: 120,
    amenities: [
      { name: "Gym", icon: "Dumbbell" },
      { name: "Parking", icon: "Car" },
      { name: "Pool", icon: "Waves" },
      { name: "Spa", icon: "Sparkles" },
      { name: "Free WiFi", icon: "Wifi" }
    ],
    reviews: 120
  };

  // Icon mapping
  const iconMap: Record<string, any> = {
    Wifi: Wifi,
    Car: Car,
    Waves: Waves,
    Sparkles: SparklesIcon,
    Dumbbell: Dumbbell,
  };

  // Reservation state
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [selectedRoomTier, setSelectedRoomTier] = useState<number | null>(null);
  const [showRoomSelection, setShowRoomSelection] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Calculate number of nights
  const calculateNights = (): number => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = calculateNights();
  const selectedRoom = hotel.room_tiers.find(tier => tier.id === selectedRoomTier);
  const roomPrice = selectedRoom?.price || hotel.starting_price;
  const subtotal = roomPrice * nights;
  const taxes = (subtotal * hotel.pricing_details.tax_percentage) / 100;
  const serviceFee = hotel.pricing_details.service_fee;
  const total = subtotal + taxes + serviceFee;

  const canReserve = checkInDate && checkOutDate && nights > 0 && selectedRoomTier && guests > 0;

  const handleReserve = () => {
    if (!canReserve) return;

    const reservationData = {
      hotelId: hotel.id,
      roomTierId: selectedRoomTier,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests,
      nights: nights,
      total: total,
    };

    console.log('Reservation Data:', reservationData);
    // Navigate to checkout
    navigate('/checkout', { state: reservationData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
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
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Back Button */}
        <Link
          to="/hotels"
          className="absolute top-6 left-6 flex items-center space-x-2 glass px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all group z-10"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold hidden sm:inline">Back to Hotels</span>
        </Link>

        {/* Hotel Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-3">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} size={20} fill="#fbbf24" className="text-yellow-400" />
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display text-white mb-3 leading-tight">
              {hotel.name}
            </h1>
            
            {hotel.location.full_address && (
              <div className="flex items-center text-white/90 text-lg">
                <MapPin size={20} className="mr-2" />
                <span>{hotel.location.full_address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <div className="p-9 gap-8">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Rating & Reviews */}
            <div className="glass rounded-2xl p-6 shadow-lg border border-white/40 animate-fadeInUp">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Star size={24} fill="#fbbf24" className="text-yellow-400" />
                    <span className="text-3xl font-display text-slate-900">{hotel.rating}</span>
                  </div>
                  <div className="border-l border-slate-300 pl-4">
                    <div className="text-sm text-slate-600">Based on</div>
                    <div className="font-bold text-slate-900">{hotel.reviewCount} reviews</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">Starting from</div>
                  <div className="text-3xl font-display gradient-text">
                    ${hotel.starting_price}
                  </div>
                  <div className="text-sm text-slate-600">per night</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="glass rounded-2xl p-6 md:p-8 shadow-lg border border-white/40 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              <h2 className="text-2xl font-display text-slate-900 mb-4">About This Hotel</h2>
              <p className="text-slate-600 font-serif text-lg leading-relaxed">
                {hotel.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="glass rounded-2xl p-6 md:p-8 shadow-lg border border-white/40 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <h2 className="text-2xl font-display text-slate-900 mb-6">Amenities</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity, index) => {
                  const Icon = iconMap[amenity.icon] || Info;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Icon size={20} className="text-indigo-600" />
                      </div>
                      <span className="font-semibold text-slate-900">{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Available Room Tiers */}
            <div className="glass rounded-2xl p-6 md:p-8 shadow-lg border border-white/40 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <h2 className="text-2xl font-display text-slate-900 mb-6">Available Rooms</h2>
              
              <div className="space-y-4">
                {hotel.room_tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedRoomTier === tier.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 hover:border-indigo-300 bg-white'
                    }`}
                    onClick={() => setSelectedRoomTier(tier.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900 mb-1">{tier.name}</h3>
                        {tier.description && (
                          <p className="text-sm text-slate-600 mb-3">{tier.description}</p>
                        )}
                        <div className="flex items-center text-sm text-slate-600">
                          <Users size={16} className="mr-1.5" />
                          <span>Up to {tier.max_guests} guests</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-display text-indigo-600">
                          ${tier.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-slate-600">per night</div>
                        {selectedRoomTier === tier.id && (
                          <div className="mt-2 flex items-center justify-end text-indigo-600">
                            <Check size={16} className="mr-1" />
                            <span className="text-sm font-semibold">Selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

   
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;