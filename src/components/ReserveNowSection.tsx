import React, { useState } from 'react';
import { Calendar, Users, LucideDoorOpen, ChevronDown, X, Coffee, Car, Waves, Wifi, Dumbbell } from 'lucide-react';
// import { LucideLucideDoorOpenOpen } from 'lucide-react';
interface RoomTier {
  id: number;
  name: string;
  price: number;
  max_guests: number;
  description: string;
}

interface Hotel {
  id: number;
  name: string;
  pricePerNight: number;
  room_tiers: RoomTier[];
  rating: number;
  reviews: number;
  amenities?: Array<{
    name: string;
    icon: string;
  }>;
}

const ReserveNowSection: React.FC = () => {
  // Static Hotel Data
  const hotel: Hotel = {
    id: 42,
    name: 'Sample Hotel 16',
    pricePerNight: 450,
    rating: 4.8,
    reviews: 120,
    room_tiers: [
      {
        id: 1,
        name: 'Standard Room',
        price: 450,
        max_guests: 2,
        description: 'A spacious suite with a private balcony and premium sea views.',
      },
      {
        id: 2,
        name: 'Deluxe Suite',
        price: 650,
        max_guests: 4,
        description: 'Luxurious suite with ocean view and larger living space.',
      },
      {
        id: 3,
        name: 'Presidential Villa',
        price: 1200,
        max_guests: 6,
        description: 'Exclusive villa with private pool and premium amenities.',
      },
    ],
    amenities: [
      {
        name: 'Breakfast',
        icon: 'Coffee',
      },
      {
        name: 'Parking',
        icon: 'Car',
      },
      {
        name: 'Pool',
        icon: 'Waves',
      },
      {
        name: 'WiFi',
        icon: 'Wifi',
      },
      {
        name: 'Gym',
        icon: 'Dumbbell',
      },
    ],
  };
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  const iconMap: Record<string, React.ReactNode> = {
    Coffee: <Coffee size={18} />,
    Car: <Car size={18} />,
    Waves: <Waves size={18} />,
    Wifi: <Wifi size={18} />,
    Dumbbell: <Dumbbell size={18} />,
  };

  // Calculate number of nights
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();
  const selectedRoomData = hotel.room_tiers.find(room => room.id === selectedRoom);
  const totalPrice = selectedRoomData ? selectedRoomData.price * nights : 0;

  const handleReserve = () => {
    if (!checkInDate || !checkOutDate || !selectedRoom) {
      alert('Please fill in all required fields');
      return;
    }
    console.log({
      hotelId: hotel.id,
      checkInDate,
      checkOutDate,
      guests,
      roomId: selectedRoom,
      totalPrice,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Archivo', -apple-system, sans-serif;
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Main Reservation Card */}
      <div className="glass rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 md:px-8 py-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Reserve Now</h2>
          <p className="text-indigo-100 text-sm md:text-base">
            Secure your stay at {hotel.name}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Booking Form */}
          <div className="space-y-6">
            {/* Date & Guest Selection Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Check-in Date */}
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Check-in Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-3.5 text-indigo-600 pointer-events-none" />
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              {/* Check-out Date */}
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Check-out Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-3.5 text-indigo-600 pointer-events-none" />
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Guests <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-400 transition-all text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-indigo-600" />
                      <span className="text-slate-800 font-medium">{guests}</span>
                    </div>
                    <ChevronDown size={18} className={`text-slate-600 transition-transform ${showGuestDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showGuestDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-lg z-10">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            setGuests(num);
                            setShowGuestDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-indigo-50 transition-colors border-b border-slate-100 last:border-b-0 ${
                            guests === num ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'
                          }`}
                        >
                          {num} Guest{num !== 1 ? 's' : ''}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Nights Summary */}
              {nights > 0 && (
                <div className="md:col-span-1 flex items-end">
                  <div className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100 rounded-xl p-3">
                    <p className="text-xs text-slate-600 font-semibold mb-1">Duration</p>
                    <p className="text-2xl font-bold text-indigo-600">{nights}</p>
                    <p className="text-xs text-slate-600">Night{nights !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Room Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Select Room <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotel.room_tiers.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${
                      selectedRoom === room.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className={`font-bold text-base mb-1 ${selectedRoom === room.id ? 'text-indigo-700' : 'text-slate-900'}`}>
                          {room.name}
                        </h4>
                        <p className="text-xs text-slate-600 mb-2">{room.description}</p>
                      </div>
                      <LucideDoorOpen size={20} className={selectedRoom === room.id ? 'text-indigo-600' : 'text-slate-400'} />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-slate-600" />
                        <span className="text-xs text-slate-600">
                          Up to {room.max_guests} guest{room.max_guests > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="font-bold text-indigo-600">
                        ${room.price}
                        <span className="text-xs text-slate-600 font-normal">/night</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Info */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Amenities Included</h4>
              <div className="flex flex-wrap gap-3">
                {hotel.amenities && hotel.amenities.length > 0 ? (
                  hotel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
                      {iconMap[amenity.icon] || <Coffee size={16} />}
                      <span className="text-xs text-slate-700 font-medium">{amenity.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-600">Standard amenities included</p>
                )}
              </div>
            </div>
          </div>

          {/* Price Summary & CTA */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            {nights > 0 && selectedRoomData && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    ${selectedRoomData.price} × {nights} night{nights !== 1 ? 's' : ''}
                  </span>
                  <span className="font-semibold text-slate-900">${(selectedRoomData.price * nights).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                  <span className="text-lg font-bold text-slate-900">Total Price</span>
                  <span className="text-3xl font-bold gradient-text">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleReserve}
              disabled={!checkInDate || !checkOutDate || !selectedRoom}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkInDate && checkOutDate && selectedRoom ? 'Reserve Now' : 'Complete Booking Details'}
            </button>

            <p className="text-xs text-center text-slate-600">
              ✓ Free cancellation up to 24 hours before check-in
            </p>
          </div>
        </div>
      </div>

      {/* Hotel Info Footer */}
      <div className="mt-6 glass rounded-2xl p-4 md:p-6 border border-white/40">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-slate-900 mb-1">{hotel.name}</h3>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(Math.round(hotel.rating))].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span className="text-sm text-slate-600">
                {hotel.rating} ({hotel.reviews} reviews)
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600 mb-1">Starting from</p>
            <p className="text-2xl font-bold gradient-text">${hotel.pricePerNight}</p>
            <p className="text-xs text-slate-600">per night</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReserveNowSection;
