import React, { useState } from 'react';
import { Calendar, Users, CreditCard, CheckCircle, ChevronLeft, ChevronRight, Search, Filter, Star, Wifi, Tv, Coffee, Wind, UtensilsCrossed, Dumbbell, PartyPopper, Car, X, Plus, Minus, Phone, Mail, MapPin, User, IdCard, Globe, DollarSign } from 'lucide-react';

// Room types data
interface RoomType {
  id: number;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  available: number;
  image: string;
  amenities: string[];
  size: string;
  bedType: string;
}

const roomTypes: RoomType[] = [
  {
    id: 1,
    name: 'Standard Room',
    description: 'Comfortable and cozy room perfect for solo travelers or couples',
    pricePerNight: 180,
    capacity: 2,
    available: 32,
    image: '🛏️',
    size: '250 sq ft',
    bedType: 'Queen Bed',
    amenities: ['WiFi', 'TV', 'AC', 'Room Service', 'Daily Housekeeping'],
  },
  {
    id: 2,
    name: 'Deluxe Suite',
    description: 'Spacious suite with separate living area and premium amenities',
    pricePerNight: 250,
    capacity: 3,
    available: 15,
    image: '🏨',
    size: '400 sq ft',
    bedType: 'King Bed',
    amenities: ['WiFi', 'TV', 'AC', 'Minibar', 'Balcony', 'Coffee Maker', 'Room Service'],
  },
  {
    id: 3,
    name: 'Executive Villa',
    description: 'Luxurious villa with private pool and exclusive services',
    pricePerNight: 420,
    capacity: 6,
    available: 7,
    image: '🏰',
    size: '800 sq ft',
    bedType: '2 King Beds',
    amenities: ['WiFi', 'TV', 'AC', 'Kitchen', 'Private Pool', 'Butler Service', 'Gym Access'],
  },
  {
    id: 4,
    name: 'Family Suite',
    description: 'Perfect for families with connecting rooms and kid-friendly amenities',
    pricePerNight: 320,
    capacity: 5,
    available: 10,
    image: '👨‍👩‍👧‍👦',
    size: '600 sq ft',
    bedType: '1 King + 2 Twin',
    amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Play Area', 'Extra Beds'],
  },
];

// Additional services
interface AdditionalService {
  id: number;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
}

const additionalServices: AdditionalService[] = [
  {
    id: 1,
    name: 'Airport Pickup',
    description: 'Complimentary airport transfer service',
    price: 50,
    icon: <Car size={20} />,
  },
  {
    id: 2,
    name: 'Breakfast Package',
    description: 'Daily buffet breakfast for all guests',
    price: 25,
    icon: <Coffee size={20} />,
  },
  {
    id: 3,
    name: 'Spa Services',
    description: 'Access to spa and wellness center',
    price: 80,
    icon: <PartyPopper size={20} />,
  },
  {
    id: 4,
    name: 'Gym Access',
    description: '24/7 fitness center access',
    price: 15,
    icon: <Dumbbell size={20} />,
  },
];

interface BookingData {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  selectedRoom: RoomType | null;
  guestDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    address: string;
    idNumber: string;
    specialRequests: string;
  };
  selectedServices: number[];
  paymentMethod: 'credit-card' | 'debit-card' | 'cash' | '';
}

const AddBooking: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    rooms: 1,
    selectedRoom: null,
    guestDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      address: '',
      idNumber: '',
      specialRequests: '',
    },
    selectedServices: [],
    paymentMethod: '',
  });

  const getTotalNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const start = new Date(bookingData.checkIn);
    const end = new Date(bookingData.checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotal = () => {
    let total = 0;
    if (bookingData.selectedRoom) {
      total += bookingData.selectedRoom.pricePerNight * getTotalNights() * bookingData.rooms;
    }
    bookingData.selectedServices.forEach(serviceId => {
      const service = additionalServices.find(s => s.id === serviceId);
      if (service) {
        total += service.price * getTotalNights();
      }
    });
    return total;
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleService = (serviceId: number) => {
    setBookingData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }));
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return bookingData.checkIn && bookingData.checkOut && bookingData.adults > 0;
      case 2:
        return bookingData.selectedRoom !== null;
      case 3:
        return (
          bookingData.guestDetails.firstName &&
          bookingData.guestDetails.lastName &&
          bookingData.guestDetails.email &&
          bookingData.guestDetails.phone
        );
      case 4:
        return bookingData.paymentMethod !== '';
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  New Booking
                </h1>
                <p className="text-sm text-slate-600">Create a new reservation</p>
              </div>
            </div>
            <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, title: 'Dates & Guests', icon: <Calendar size={20} /> },
              { num: 2, title: 'Select Room', icon: <Search size={20} /> },
              { num: 3, title: 'Guest Details', icon: <User size={20} /> },
              { num: 4, title: 'Payment', icon: <CreditCard size={20} /> },
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step.num
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {currentStep > step.num ? <CheckCircle size={24} /> : step.icon}
                  </div>
                  <p
                    className={`mt-2 text-sm font-medium hidden md:block ${
                      currentStep >= step.num ? 'text-indigo-600' : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {idx < 3 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-all ${
                      currentStep > step.num ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-slate-200'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Dates & Guests */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Select Dates & Guests</h2>
                
                <div className="space-y-6">
                  {/* Date Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Check-in Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="date"
                          value={bookingData.checkIn}
                          onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Check-out Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="date"
                          value={bookingData.checkOut}
                          onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                          min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {getTotalNights() > 0 && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                      <p className="text-indigo-900 font-semibold">
                        Total Stay: {getTotalNights()} {getTotalNights() === 1 ? 'night' : 'nights'}
                      </p>
                    </div>
                  )}

                  {/* Guest Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Adults *</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setBookingData({ ...bookingData, adults: Math.max(1, bookingData.adults - 1) })}
                          className="w-10 h-10 bg-slate-200 hover:bg-slate-300 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Minus size={20} />
                        </button>
                        <div className="flex-1 text-center">
                          <input
                            type="number"
                            value={bookingData.adults}
                            onChange={(e) => setBookingData({ ...bookingData, adults: Math.max(1, parseInt(e.target.value) || 1) })}
                            className="w-full text-center py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <button
                          onClick={() => setBookingData({ ...bookingData, adults: bookingData.adults + 1 })}
                          className="w-10 h-10 bg-slate-200 hover:bg-slate-300 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Children</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setBookingData({ ...bookingData, children: Math.max(0, bookingData.children - 1) })}
                          className="w-10 h-10 bg-slate-200 hover:bg-slate-300 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Minus size={20} />
                        </button>
                        <div className="flex-1 text-center">
                          <input
                            type="number"
                            value={bookingData.children}
                            onChange={(e) => setBookingData({ ...bookingData, children: Math.max(0, parseInt(e.target.value) || 0) })}
                            className="w-full text-center py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <button
                          onClick={() => setBookingData({ ...bookingData, children: bookingData.children + 1 })}
                          className="w-10 h-10 bg-slate-200 hover:bg-slate-300 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Rooms</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setBookingData({ ...bookingData, rooms: Math.max(1, bookingData.rooms - 1) })}
                          className="w-10 h-10 bg-slate-200 hover:bg-slate-300 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Minus size={20} />
                        </button>
                        <div className="flex-1 text-center">
                          <input
                            type="number"
                            value={bookingData.rooms}
                            onChange={(e) => setBookingData({ ...bookingData, rooms: Math.max(1, parseInt(e.target.value) || 1) })}
                            className="w-full text-center py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <button
                          onClick={() => setBookingData({ ...bookingData, rooms: bookingData.rooms + 1 })}
                          className="w-10 h-10 bg-slate-200 hover:bg-slate-300 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">Total Guests:</span> {bookingData.adults} {bookingData.adults === 1 ? 'Adult' : 'Adults'}
                      {bookingData.children > 0 && `, ${bookingData.children} ${bookingData.children === 1 ? 'Child' : 'Children'}`}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      <span className="font-semibold text-slate-900">Total Rooms:</span> {bookingData.rooms}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Select Room */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Choose Your Room</h2>
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
                      <Filter size={18} />
                      <span className="hidden md:inline">Filter</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {roomTypes.map(room => (
                      <div
                        key={room.id}
                        onClick={() => setBookingData({ ...bookingData, selectedRoom: room })}
                        className={`border-2 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                          bookingData.selectedRoom?.id === room.id
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-lg'
                            : 'border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Room Image/Icon */}
                          <div className="flex-shrink-0">
                            <div className="w-full md:w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-6xl">
                              {room.image}
                            </div>
                          </div>

                          {/* Room Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-slate-900">{room.name}</h3>
                                <p className="text-sm text-slate-600 mt-1">{room.description}</p>
                              </div>
                              {bookingData.selectedRoom?.id === room.id && (
                                <CheckCircle className="text-indigo-600" size={24} />
                              )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm text-slate-600">
                              <div>
                                <span className="font-semibold text-slate-900">Size:</span> {room.size}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900">Bed:</span> {room.bedType}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900">Capacity:</span> {room.capacity} guests
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900">Available:</span>{' '}
                                <span className="text-green-600">{room.available} rooms</span>
                              </div>
                            </div>

                            {/* Amenities */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {room.amenities.slice(0, 5).map((amenity, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                                >
                                  {amenity}
                                </span>
                              ))}
                              {room.amenities.length > 5 && (
                                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                                  +{room.amenities.length - 5} more
                                </span>
                              )}
                            </div>

                            {/* Price */}
                            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                              <div>
                                <p className="text-sm text-slate-600">Price per night</p>
                                <p className="text-2xl font-bold text-indigo-600">${room.pricePerNight}</p>
                              </div>
                              <button
                                onClick={() => setBookingData({ ...bookingData, selectedRoom: room })}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                                  bookingData.selectedRoom?.id === room.id
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                }`}
                              >
                                {bookingData.selectedRoom?.id === room.id ? 'Selected' : 'Select Room'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Services */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Additional Services (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {additionalServices.map(service => (
                      <div
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          bookingData.selectedServices.includes(service.id)
                            ? 'border-indigo-600 bg-indigo-50/50'
                            : 'border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            bookingData.selectedServices.includes(service.id)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {service.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-slate-900">{service.name}</h4>
                                <p className="text-sm text-slate-600 mt-1">{service.description}</p>
                              </div>
                              {bookingData.selectedServices.includes(service.id) && (
                                <CheckCircle className="text-indigo-600" size={20} />
                              )}
                            </div>
                            <p className="text-lg font-bold text-indigo-600 mt-2">${service.price}/night</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Guest Details */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Guest Information</h2>

                <div className="space-y-6">
                  {/* Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="text"
                          value={bookingData.guestDetails.firstName}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              guestDetails: { ...bookingData.guestDetails, firstName: e.target.value },
                            })
                          }
                          placeholder="John"
                          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Last Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="text"
                          value={bookingData.guestDetails.lastName}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              guestDetails: { ...bookingData.guestDetails, lastName: e.target.value },
                            })
                          }
                          placeholder="Doe"
                          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="email"
                          value={bookingData.guestDetails.email}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              guestDetails: { ...bookingData.guestDetails, email: e.target.value },
                            })
                          }
                          placeholder="john.doe@example.com"
                          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="tel"
                          value={bookingData.guestDetails.phone}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              guestDetails: { ...bookingData.guestDetails, phone: e.target.value },
                            })
                          }
                          placeholder="+92 300 1234567"
                          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="text"
                          value={bookingData.guestDetails.country}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              guestDetails: { ...bookingData.guestDetails, country: e.target.value },
                            })
                          }
                          placeholder="Pakistan"
                          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="text"
                          value={bookingData.guestDetails.city}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              guestDetails: { ...bookingData.guestDetails, city: e.target.value },
                            })
                          }
                          placeholder="Jhelum"
                          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-slate-400" size={20} />
                      <input
                        type="text"
                        value={bookingData.guestDetails.address}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            guestDetails: { ...bookingData.guestDetails, address: e.target.value },
                          })
                        }
                        placeholder="Street address"
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* ID Number */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      ID/Passport Number
                    </label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="text"
                        value={bookingData.guestDetails.idNumber}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            guestDetails: { ...bookingData.guestDetails, idNumber: e.target.value },
                          })
                        }
                        placeholder="XXXXX-XXXXXXX-X"
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={bookingData.guestDetails.specialRequests}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          guestDetails: { ...bookingData.guestDetails, specialRequests: e.target.value },
                        })
                      }
                      placeholder="Any special requirements or preferences..."
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment Method</h2>

                <div className="space-y-4">
                  {[
                    { id: 'credit-card', name: 'Credit Card', icon: <CreditCard size={24} /> },
                    { id: 'debit-card', name: 'Debit Card', icon: <CreditCard size={24} /> },
                    { id: 'cash', name: 'Cash on Arrival', icon: <DollarSign size={24} /> },
                  ].map(method => (
                    <div
                      key={method.id}
                      onClick={() => setBookingData({ ...bookingData, paymentMethod: method.id as any })}
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                        bookingData.paymentMethod === method.id
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-lg'
                          : 'border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-xl ${
                              bookingData.paymentMethod === method.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {method.icon}
                          </div>
                          <span className="text-lg font-semibold text-slate-900">{method.name}</span>
                        </div>
                        {bookingData.paymentMethod === method.id && (
                          <CheckCircle className="text-indigo-600" size={24} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {bookingData.paymentMethod && bookingData.paymentMethod !== 'cash' && (
                  <div className="mt-6 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-sm text-slate-600 mb-4">Card details will be collected at check-in</p>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                      <p className="text-sm text-slate-700">
                        Your booking is secured. Card will only be charged upon check-in.
                      </p>
                    </div>
                  </div>
                )}

                {/* Terms & Conditions */}
                <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
                  <h3 className="font-semibold text-amber-900 mb-3">Cancellation Policy</h3>
                  <ul className="space-y-2 text-sm text-amber-800">
                    <li>• Free cancellation up to 24 hours before check-in</li>
                    <li>• 50% refund for cancellations within 24 hours</li>
                    <li>• No refund for no-shows</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Booking Summary</h3>

              <div className="space-y-4">
                {/* Dates */}
                {bookingData.checkIn && bookingData.checkOut && (
                  <div className="pb-4 border-b border-slate-200">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Check-in:</span>
                      <span className="font-semibold text-slate-900">{bookingData.checkIn}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Check-out:</span>
                      <span className="font-semibold text-slate-900">{bookingData.checkOut}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Duration:</span>
                      <span className="font-semibold text-slate-900">
                        {getTotalNights()} {getTotalNights() === 1 ? 'night' : 'nights'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Guests */}
                <div className="pb-4 border-b border-slate-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Adults:</span>
                    <span className="font-semibold text-slate-900">{bookingData.adults}</span>
                  </div>
                  {bookingData.children > 0 && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Children:</span>
                      <span className="font-semibold text-slate-900">{bookingData.children}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Rooms:</span>
                    <span className="font-semibold text-slate-900">{bookingData.rooms}</span>
                  </div>
                </div>

                {/* Selected Room */}
                {bookingData.selectedRoom && (
                  <div className="pb-4 border-b border-slate-200">
                    <p className="text-sm text-slate-600 mb-2">Room Type:</p>
                    <p className="font-semibold text-slate-900 mb-1">{bookingData.selectedRoom.name}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        ${bookingData.selectedRoom.pricePerNight} × {getTotalNights()} nights × {bookingData.rooms}{' '}
                        {bookingData.rooms === 1 ? 'room' : 'rooms'}
                      </span>
                      <span className="font-semibold text-slate-900">
                        ${bookingData.selectedRoom.pricePerNight * getTotalNights() * bookingData.rooms}
                      </span>
                    </div>
                  </div>
                )}

                {/* Additional Services */}
                {bookingData.selectedServices.length > 0 && (
                  <div className="pb-4 border-b border-slate-200">
                    <p className="text-sm text-slate-600 mb-3">Additional Services:</p>
                    {bookingData.selectedServices.map(serviceId => {
                      const service = additionalServices.find(s => s.id === serviceId);
                      return service ? (
                        <div key={serviceId} className="flex justify-between text-sm mb-2">
                          <span className="text-slate-700">{service.name}</span>
                          <span className="font-semibold text-slate-900">
                            ${service.price * getTotalNights()}
                          </span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                {/* Total */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-slate-900">Total Amount:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      ${calculateTotal()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Including all taxes and fees</p>
                </div>

                {/* Guest Info Preview */}
                {currentStep >= 3 && bookingData.guestDetails.firstName && (
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-2">Guest Name:</p>
                    <p className="font-semibold text-slate-900">
                      {bookingData.guestDetails.firstName} {bookingData.guestDetails.lastName}
                    </p>
                    {bookingData.guestDetails.email && (
                      <p className="text-sm text-slate-600 mt-1">{bookingData.guestDetails.email}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between items-center gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              currentStep === 1
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-slate-400 hover:shadow-md'
            }`}
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceedToNextStep()}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                canProceedToNextStep()
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Next
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              disabled={!canProceedToNextStep()}
              className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                canProceedToNextStep()
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle size={20} />
              Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBooking;