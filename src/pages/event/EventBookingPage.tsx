import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, MapPin, Ticket, Users, AlertCircle, ChevronRight, Sparkles, Clock, Star, Heart, Share2, Plus, Minus, Tag, Shield, CreditCard, Info, TrendingUp, CheckCircle, Loader2, X, Building2, Hotel, Check } from 'lucide-react';
import { useGetEventByIdQuery, useCreateEventBookingMutation, type Bundle, type EventBookingFormData } from '../../store/services/eventApi';
import { useGetHotelByIdQuery } from '../../store/services/hotelApi';
import { APIENDPOINTS } from '../../utils/ApiConstants';
import { AppImages } from '../../utils/AppImages';
import SkeletonLoader from '../../components/SkeletonLoader';
import { CustomToaster, showToast } from '../../components/CustomToaster';
import { setPendingBooking, clearPendingBooking } from '../../store/slices/bookingSlice';
import StayPlayBundle from '../../components/vendor/StayPlayBundle';
import LocationComponent from '../../components/LocationComponent';
import RoomSelector from '../../components/RoomSelector';

const EventBookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: eventResponse, isLoading, isError } = useGetEventByIdQuery(Number(id), {
    skip: !id,
  });
  const [createEventBooking, { isLoading: isBooking }] = useCreateEventBookingMutation();
  const event = eventResponse?.data;
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: any) => state.auth || {});
  const pendingBooking = useSelector((state: any) => state.booking?.pendingBooking);
  const isAuthenticated = !!token;
  const isVendor = user?.role === 'vendor';

  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showBundleModal, setShowBundleModal] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [roomCount, setRoomCount] = useState(1);
  // / In your Order Summary section, update the hotel calculation:

  // Add these state variables with your other useState hooks:
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [dateError, setDateError] = useState('');

  // Add this helper function near your other functions:
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinCheckOutDate = () => {
    if (!checkInDate) return getTodayDate();
    const checkIn = new Date(checkInDate);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split('T')[0];
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const validateDates = () => {
    if (!checkInDate || !checkOutDate) {
      setDateError('Please select both check-in and check-out dates');
      return false;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      setDateError('Check-in date cannot be in the past');
      return false;
    }

    if (checkOut <= checkIn) {
      setDateError('Check-out date must be after check-in date');
      return false;
    }

    setDateError('');
    return true;
  };


  const { data: hotelResponse, isLoading: isLoadingHotel } = useGetHotelByIdQuery(selectedBundle?.hotel.id as number, {
    skip: !selectedBundle,
  });
  const hotel = hotelResponse?.data;

  useEffect(() => {
    if (pendingBooking && pendingBooking.eventId === id) {
      setQuantities(pendingBooking.quantities);
      // Clear the pending booking from store once restored so it doesn't persist indefinitely
      dispatch(clearPendingBooking());
    }
  }, [id, pendingBooking, dispatch]);

  useEffect(() => {
    if (event?.bundles && event.bundles.length > 0) {
      const hasSeenBundleModal = sessionStorage.getItem(`seenBundleModal_event_${id}`);
      if (!hasSeenBundleModal) {
        setShowBundleModal(true);
        sessionStorage.setItem(`seenBundleModal_event_${id}`, 'true');
      }
    }
  }, [event, id]);

  const updateQuantity = (ticketId: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[ticketId] || 0;
      const ticket = event?.ticketTypes.find(t => t.id === ticketId);
      const maxLimit = ticket ? Math.min(10, ticket.available) : 10;
      const newQty = Math.max(0, Math.min(maxLimit, current + delta));
      return { ...prev, [ticketId]: newQty };
    });
  };

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getImageUrl = (path: string | null) => {
    if (!path) return AppImages.placeholders.event_placeholder;
    if (path.startsWith('http')) return path;
    return `${APIENDPOINTS.content_url}${path}`;
  };

  const handleCheckout = async () => {
    if (!id) return;

    const selections = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([ticketId, qty]) => ({
        ticket_id: Number(ticketId),
        quantity: qty,
      }));
  
    if (selections.length === 0) {
      showToast.error("Please select at least one ticket or complete your bundle selection.");
      return;
    }

    if (!isAuthenticated) {
      dispatch(setPendingBooking({
        eventId: id,
        quantities
      }));
      showToast.error("Please login to complete your booking.");
      navigate(`/login?redirect=/event/booking/${id}`);
      return;
    }

    if (isVendor) {
      showToast.error("Vendors cannot book tickets. Please use a guest account.");
      return;
    }
  console.log("Event Selectionss",selections);
    const payload: EventBookingFormData = {
      event_id: Number(id),
      selections,
    };

    if (selectedBundle && selectedRoomId && checkInDate && checkOutDate) {
      if (!validateDates()) {
        return;
      }
      payload.bundle_offer = {
        hotel_id: selectedBundle.hotel.id,
        check_in: checkInDate,
        check_out: checkOutDate,
        guests_count: guestCount,
        rooms_count: roomCount,
        room_type_id: selectedRoomId,
      };
    } else if (selectedBundle) {
      showToast.error("Please select your stay dates and a room to proceed with the bundle.");
      return;
    }

    try {
      const response = await createEventBooking(payload).unwrap();
      showToast.success(response.message || 'Tickets booked successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      showToast.error(error?.data?.message || 'Failed to book tickets. Please try again.');
    }
  };

  const schedule = [
    { time: '7:00 PM', title: 'Gates Open', description: 'Venue opens for entry' },
    { time: '7:30 PM', title: 'Opening Act', description: 'The Midnight Echoes' },
    { time: '8:30 PM', title: 'Main Performance', description: 'Electric Dreams Orchestra' },
    { time: '10:00 PM', title: 'Special Guest', description: 'Surprise headliner' },
    { time: '11:30 PM', title: 'Event Ends', description: 'Last call and venue closing' }
  ];



  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-8 px-6">
        <div className="max-w-7xl mx-auto">
          <SkeletonLoader type="event-details" />
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Event Not Found</h2>
          <p className="text-slate-600">We couldn't load the details for this event.</p>
        </div>
      </div>
    );
  }

  const subtotal = event.ticketTypes.reduce((sum, t) => {
    const qty = quantities[t.id] || 0;
    return sum + qty * t.price;
  }, 0);

  const rooms = hotel?.room_tiers?.map((tier) => ({
    id: tier.id,
    name: tier.type || tier.name,
    description: tier.description || "",
    price: tier.price,
    maxOccupancy: tier.max_guests || tier.max_occupancy,
    features: [`Max Occupancy: ${tier.max_guests || tier.max_occupancy}`, "Free WiFi", "Breakfast included"],
    image: AppImages.placeholders.room_placeholder
  })) || [];

  // const selectedRoom = rooms.find(r => r.id === selectedRoomId);
  // const hotelSubtotal = selectedRoom ? selectedRoom.price * roomCount : 0;

  const nights = calculateNights();
  const selectedRoom = rooms.find(r => r.id === selectedRoomId);
  const hotelSubtotal = selectedRoom && nights > 0 ? selectedRoom.price * roomCount * nights : 0;

  const discount = promoApplied ? 20 : 0;
  const serviceFee = subtotal * 0.05;
  const total = subtotal - discount + serviceFee + hotelSubtotal;

  const hasSelection = Object.values(quantities).some(q => q > 0) || !!selectedRoomId;
  const totalTickets = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <CustomToaster />

      {/* Bundle Modal */}
      {showBundleModal && event?.bundles && event.bundles.length > 0 && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="glass rounded-3xl shadow-2xl border border-white/40 w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-end p-2 px-4 border-b border-slate-200">
              {/* <h2 className="text-2xl font-display text-slate-900">Bundle Offer</h2> */}
              <button
                onClick={() => setShowBundleModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X size={24} className="text-slate-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <StayPlayBundle
                event={event}
                bundles={event.bundles} onSelectBundle={(bundle) => {
                  console.log('Bundle selected from modal:', bundle);
                  // Potentially close modal and update something in the checkout state
                  setShowBundleModal(false);
                  setSelectedBundle(bundle);
                  showToast.success(`${bundle.offer_title} added to your cart!`);
                }}

                onSkip={() => setShowBundleModal(false)} />

            </div>
            <div className="flex items-center justify-end p-2 px-4  border-slate-200">
              {/* <h2 className="text-2xl font-display text-slate-900">Bundle Offer</h2> */}
            </div>

          </div>
        </div>
      )}
   
      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 lg:h-[32rem] overflow-hidden">
        <img
          src={getImageUrl(event.image)}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent" />

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 md:pb-12 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="inline-flex items-center bg-linear-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full shadow-lg">
                <Sparkles size={16} className="text-white mr-2" />
                <span className="text-white font-bold text-sm">Limited Tickets Available</span>
              </div>

              <div className="flex items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                <TrendingUp size={16} className="text-white mr-2" />
                <span className="text-white font-semibold text-sm">{event.attendees}</span>
              </div>

              <div className="flex items-center bg-amber-500/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star size={16} fill="#fff" className="text-white mr-2" />
                <span className="text-white font-bold text-sm">{event.rating} Rating</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display text-white mb-4 leading-tight max-w-4xl">
              {event.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-white/95 text-base md:text-lg">
              <div className="flex items-center">
                <Calendar size={20} className="mr-2 flex-shrink-0" />
                <span className="font-medium">{event.date}</span>
              </div>
              <div className="flex items-center">
                <Clock size={20} className="mr-2 flex-shrink-0" />
                <span className="font-medium">{event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin size={20} className="mr-2 flex-shrink-0" />
                <span className="font-medium">{event.location_details.address}, {event.location_details.city}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="glass backdrop-blur-md bg-white/20 p-3 rounded-xl hover:bg-white/30 transition-all border border-white/30"
              >
                <Heart size={20} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-white'} />
              </button>
              <button className="glass backdrop-blur-md bg-white/20 p-3 rounded-xl hover:bg-white/30 transition-all border border-white/30">
                <Share2 size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Event Description */}
            <div className="glass rounded-3xl border border-white/40 shadow-lg animate-fadeInUp overflow-hidden">
              <button onClick={() => toggleSection('about')} className="w-full flex items-center justify-between p-6 md:p-8 text-left">
                <h2 className="text-2xl font-display text-slate-900">About This Event</h2>
                <ChevronRight size={24} className={`text-slate-500 transition-transform duration-300 ${!collapsedSections.about ? 'rotate-90' : ''}`} />
              </button>
              <div className={`transition-all duration-500 ease-in-out ${collapsedSections.about ? 'max-h-0' : 'max-h-[1000px]'}`}>
                <div className="px-6 md:px-8 pb-8">
                  <p className="text-slate-600 font-serif text-lg leading-relaxed mb-6">
                    {event.description}
                  </p>

                  <h3 className="font-bold text-slate-900 mb-3">Event Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {event.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start">
                        <Sparkles size={18} className="text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bundle Offer Section */}



            {event?.bundles && event.bundles.length > 0 && (
              <div className="glass p-6 md:p-8 rounded-3xl border border-white/40 shadow-lg animate-fadeInUp overflow-hidden" style={{ animationDelay: '0.05s' }}>

                <style>{`
      @keyframes slideInFromRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes discountPulse {
        0%, 100% {
          transform: scale(1) rotate(45deg);
          opacity: 1;
        }
        50% {
          transform: scale(1.05) rotate(45deg);
          opacity: 0.9;
        }
      }
      
      @keyframes shimmerGlow {
        0% {
          background-position: -200% center;
        }
        100% {
          background-position: 200% center;
        }
      }
      
      .hotel-card-enter {
        animation: slideInFromRight 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      .discount-ribbon {
        animation: discountPulse 2s ease-in-out infinite;
      }
      
      .shimmer-btn {
        background: linear-gradient(
          90deg,
          #4f46e5 0%,
          #7c3aed 25%,
          #a855f7 50%,
          #7c3aed 75%,
          #4f46e5 100%
        );
        background-size: 200% auto;
        animation: shimmerGlow 3s linear infinite;
      }
    `}</style>

                {/* Section Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Building2 size={24} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-display text-slate-900">
                          Special Bundle Offer
                        </h2>
                        <p className="text-sm text-slate-500">Save when you bundle</p>
                      </div>
                    </div>
                  </div>

                  {selectedBundle && (
                    <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full border border-green-200 shadow-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-bold">Bundle Active</span>
                    </div>
                  )}
                </div>

                {!selectedBundle ? (
                  /* ─────────────────────────────────────────────────────────────────────
                     CTA STATE - No Bundle Selected
                     ───────────────────────────────────────────────────────────────────── */
                  <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-indigo-200 shadow-lg">
                    {/* Decorative blurs */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-300/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 p-6 md:p-8">
                      <div className="flex flex-col lg:flex-row items-center gap-6">

                        {/* Left: Content */}
                        <div className="flex-1 text-center lg:text-left">
                          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-indigo-200 shadow-sm">
                            <Sparkles size={16} className="text-indigo-600" />
                            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                              Limited Time Offer
                            </span>
                          </div>

                          <h3 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-3 leading-tight">
                            Save Up to <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">15%</span> on Your Stay!
                          </h3>

                          <p className="text-indigo-700 leading-relaxed mb-4 max-w-xl">
                            This event is in <span className="font-bold">{event.location_details.city}</span>.
                            Bundle your event tickets with a hotel stay and unlock instant savings — no extra steps required.
                          </p>

                          <div className="flex flex-wrap gap-3 justify-center lg:justify-start text-sm">
                            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-indigo-100">
                              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                <Check size={12} className="text-white" strokeWidth={3} />
                              </div>
                              <span className="text-indigo-700 font-medium">One Easy Booking</span>
                            </div>

                            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-indigo-100">
                              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                <Check size={12} className="text-white" strokeWidth={3} />
                              </div>
                              <span className="text-indigo-700 font-medium">Instant Savings</span>
                            </div>

                            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-indigo-100">
                              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                <Check size={12} className="text-white" strokeWidth={3} />
                              </div>
                              <span className="text-indigo-700 font-medium">Best Price Guarantee</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: CTA Button */}
                        <button
                          onClick={() => setShowBundleModal(true)}
                          className="shimmer-btn text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 group flex-shrink-0"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Sparkles size={20} />
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium opacity-90">Discover</div>
                            <div className="text-lg font-bold">Bundle Offers</div>
                          </div>
                          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ─────────────────────────────────────────────────────────────────────
                     ACTIVE STATE - Bundle Selected
                     ───────────────────────────────────────────────────────────────────── */
                  <div className="space-y-6 hotel-card-enter">

                    {/* Selected Hotel Card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-white to-indigo-50/40 rounded-2xl border-2 border-indigo-300 shadow-xl">

                      {/* Discount Ribbon */}
                      <div className="absolute top-0 -right-16 discount-ribbon">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-20 transform rotate-45 shadow-lg">
                          <div className="text-center font-bold text-sm tracking-wider">
                            SAVE {selectedBundle.discount_percentage}%
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row">

                        {/* Hotel Image */}
                        <div className="lg:w-80 h-56 lg:h-auto flex-shrink-0 overflow-hidden">
                          <img
                            src={selectedBundle.hotel.image.startsWith('http')
                              ? selectedBundle.hotel.image
                              : `${APIENDPOINTS.content_url}${selectedBundle.hotel.image}`}
                            alt={selectedBundle.hotel.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                          />
                        </div>

                        {/* Hotel Details */}
                        <div className="flex-1 p-6 lg:p-8">

                          {/* Remove Button */}
                          <button
                            onClick={() => {
                              setSelectedBundle(null);
                              setSelectedRoomId(null);
                              setCheckInDate('');
                              setCheckOutDate('');
                              setGuestCount(2);
                              setDateError('');
                              showToast.info('Bundle removed from your booking');
                            }}
                            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-red-100 border border-slate-200 hover:border-red-300 flex items-center justify-center text-slate-400 hover:text-red-600 transition-all shadow-lg"
                            title="Remove bundle"
                          >
                            <X size={20} />
                          </button>

                          {/* Star Rating */}
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: selectedBundle.hotel.stars }).map((_, i) => (
                                <Star key={i} size={16} fill="#f59e0b" className="text-amber-500" />
                              ))}
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                              {selectedBundle.hotel.stars}-Star Hotel
                            </span>
                          </div>

                          {/* Hotel Name */}
                          <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">
                            {selectedBundle.hotel.name}
                          </h3>

                          {/* Location */}
                          <div className="flex items-center text-slate-600 mb-4">
                            <MapPin size={18} className="mr-2 flex-shrink-0" />
                            <span className="font-medium">{selectedBundle.hotel.city}</span>
                          </div>

                          {/* Offer Highlights Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

                            {/* Bundle Offer Card */}
                            <div className="flex items-center space-x-3 bg-gradient-to-br from-violet-50 to-purple-50 p-4 rounded-xl border border-violet-200 shadow-sm">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                <Tag size={20} className="text-white" />
                              </div>
                              <div>
                                <div className="text-xs text-violet-600 font-semibold uppercase tracking-wide">Bundle Offer</div>
                                <div className="text-sm font-bold text-violet-900 leading-tight">{selectedBundle.offer_title}</div>
                              </div>
                            </div>

                            {/* Discount Card */}
                            <div className="flex items-center space-x-3 bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 shadow-sm">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                <TrendingUp size={20} className="text-white" />
                              </div>
                              <div>
                                <div className="text-xs text-green-600 font-semibold uppercase tracking-wide">Your Savings</div>
                                <div className="text-sm font-bold text-green-900">
                                  {selectedBundle.discount_percentage}% off any room
                                </div>
                              </div>
                            </div>
                          </div>



                          {/* Footer Actions */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
                            <div className="flex items-center space-x-2 text-sm">
                              {selectedRoomId && checkInDate && checkOutDate && !dateError ? (
                                <>
                                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                    <Check size={14} className="text-white" strokeWidth={3} />
                                  </div>
                                  <span className="text-green-700 font-semibold">Bundle complete</span>
                                </>
                              ) : (
                                <>
                                  <Info size={16} className="text-slate-400" />
                                  <span className="text-slate-600">Select dates and room to complete</span>
                                </>
                              )}
                            </div>

                            <button
                              onClick={() => setShowBundleModal(true)}
                              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm group"
                            >
                              <span>Change Bundle</span>
                              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stay Details Section */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center">
                          <Calendar size={20} className="mr-2 text-indigo-600" />
                          Your Stay Details
                        </h3>
                      </div>

                      <div className="p-6">

                        {/* Date Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                          {/* Check-in Date */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Check-in Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              <input
                                type="date"
                                value={checkInDate}
                                onChange={(e) => {
                                  setCheckInDate(e.target.value);
                                  setDateError('');
                                  // Clear check-out if it's before new check-in
                                  if (checkOutDate && new Date(e.target.value) >= new Date(checkOutDate)) {
                                    setCheckOutDate('');
                                  }
                                }}
                                min={getTodayDate()}
                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all"
                              />
                            </div>
                          </div>

                          {/* Check-out Date */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Check-out Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              <input
                                type="date"
                                value={checkOutDate}
                                onChange={(e) => {
                                  setCheckOutDate(e.target.value);
                                  setDateError('');
                                }}
                                min={getMinCheckOutDate()}
                                disabled={!checkInDate}
                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                            </div>
                          </div>

                          {/* Guest Count */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Guests <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              <select
                                value={guestCount}
                                onChange={(e) => setGuestCount(Number(e.target.value))}
                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all appearance-none cursor-pointer"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                  <option key={num} value={num}>
                                    {num} {num === 1 ? 'Guest' : 'Guests'}
                                  </option>
                                ))}
                              </select>
                              <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                            </div>
                          </div>
                        </div>

                        {/* Date Error */}
                        {dateError && (
                          <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                            <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                            <span className="text-sm text-red-700 font-medium">{dateError}</span>
                          </div>
                        )}

                        {/* Nights Display */}
                        {checkInDate && checkOutDate && !dateError && calculateNights() > 0 && (
                          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 mb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Clock size={18} className="text-indigo-600" />
                                <span className="text-sm font-semibold text-indigo-900">
                                  {calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}
                                </span>
                              </div>
                              <div className="text-sm text-indigo-700">
                                {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Room Selector */}
                    {checkInDate && checkOutDate && !dateError && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-slate-900 flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                              <Hotel size={18} className="text-indigo-600" />
                            </div>
                            Select Your Room
                          </h3>

                          {selectedRoomId && (
                            <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold border border-indigo-200">
                              {roomCount} {roomCount === 1 ? 'room' : 'rooms'} selected
                            </div>
                          )}
                        </div>

                        {isLoadingHotel ? (
                          <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl border-2 border-slate-200">
                            <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
                            <p className="text-slate-600 font-semibold text-lg">Loading available rooms...</p>
                            <p className="text-slate-500 text-sm mt-1">Please wait a moment</p>
                          </div>
                        ) : (
                          <RoomSelector
                            rooms={rooms}
                            selectedRoomId={selectedRoomId}
                            onSelectRoom={setSelectedRoomId}
                            selectedRoomCount={roomCount}
                            onRoomCountChange={setRoomCount}
                          />
                        )}
                      </div>
                    )}

                    {/* Info Message if dates not selected */}
                    {(!checkInDate || !checkOutDate) && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start space-x-3">
                        <Info size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                          <span className="font-semibold">Please select your check-in and check-out dates</span>
                          <span className="block mt-1 text-amber-700">You need to choose your travel dates before selecting a room.</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}


            {/* Ticket Selection */}
            <div className="glass p-6 md:p-8 rounded-3xl border border-white/40 shadow-lg animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display text-slate-900 flex items-center">
                  <Ticket size={26} className="text-indigo-600 mr-3" />
                  Select Your Tickets
                </h2>
                {totalTickets > 0 && (
                  <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold text-sm">
                    {totalTickets} {totalTickets === 1 ? 'ticket' : 'tickets'} selected
                  </div>
                )}
              </div>


              <div className="space-y-4">
                {event.ticketTypes.map((ticket, index) => {
                  const isSelected = (quantities[ticket.id] || 0) > 0;

                  return (
                    <div
                      key={ticket.id}
                      className={`ticket-card p-5 md:p-6 rounded-2xl border-2 bg-white ${ticket.soldOut
                        ? 'opacity-60 border-slate-200'
                        : isSelected
                          ? 'selected border-indigo-500'
                          : 'border-slate-200 hover:border-slate-300'
                        } transition-all animate-fadeInUp`}
                      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-xl text-slate-900">{ticket.name}</h3>
                            {ticket.popular && (
                              <span className="bg-linear-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                POPULAR
                              </span>
                            )}
                          </div>

                          <p className="text-slate-600 text-sm mb-3">{ticket.description}</p>

                          {ticket.features && (
                            <div className="space-y-1.5">
                              {ticket.features.slice(0, 3).map((feature, idx) => (
                                <div key={idx} className="flex items-center text-sm text-slate-600">
                                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></div>
                                  <span>{feature}</span>
                                </div>
                              ))}
                              {ticket.features.length > 3 && (
                                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold flex items-center">
                                  <span>+{ticket.features.length - 3} more benefits</span>
                                  <ChevronRight size={14} className="ml-1" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-3xl font-display gradient-text mb-1">
                            ${ticket.price}
                          </div>
                          <div className="text-sm text-slate-500">per ticket</div>
                          {!ticket.soldOut && (
                            <div className="text-xs text-slate-400 mt-1">
                              {ticket.available} left
                            </div>
                          )}
                        </div>
                      </div>

                      {ticket.soldOut ? (
                        <div className="flex items-center justify-center py-3 bg-red-50 rounded-xl">
                          <AlertCircle size={18} className="text-red-600 mr-2" />
                          <span className="text-red-600 font-semibold">Sold Out</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(ticket.id, -1)}
                              disabled={!quantities[ticket.id]}
                              className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 disabled:opacity-40 hover:bg-slate-200 transition-colors disabled:cursor-not-allowed font-bold"
                            >
                              <Minus size={18} />
                            </button>
                            <span className="text-2xl font-bold text-slate-900 w-12 text-center">
                              {quantities[ticket.id] || 0}
                            </span>
                            <button
                              onClick={() => updateQuantity(ticket.id, 1)}
                              disabled={(quantities[ticket.id] || 0) >= Math.min(10, ticket.available)}
                              className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 hover:bg-indigo-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-bold"
                            >
                              <Plus size={18} />
                            </button>
                          </div>

                          {isSelected && (
                            <div className="text-right">
                              <div className="text-sm text-slate-500">Subtotal</div>
                              <div className="text-xl font-bold text-indigo-600">
                                ${((quantities[ticket.id] || 0) * ticket.price).toFixed(2)}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>



          </div>

          {/* Sticky Summary */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="glass p-6 md:p-8 rounded-3xl border border-white/40 shadow-2xl animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-display text-slate-900 mb-6">Order Summary</h2>

              {hasSelection ? (
                <>
                  {/* Selected Tickets */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                    {event.ticketTypes.map(t => {
                      const qty = quantities[t.id] || 0;
                      if (qty === 0) return null;
                      return (
                        <div key={t.id} className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-slate-900">{t.name}</div>
                            <div className="text-sm text-slate-500">{qty} × ${t.price}</div>
                          </div>
                          <div className="font-bold text-slate-900">
                            ${(qty * t.price).toFixed(2)}
                          </div>
                        </div>
                      );
                    })}

                    {/* // Update the hotel display in the summary: */}
                    {selectedRoom && checkInDate && checkOutDate && nights > 0 && (
                      <div className="flex justify-between items-center bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                        <div>
                          <div className="font-bold text-indigo-900 flex items-center">
                            <Hotel size={14} className="mr-1.5" />
                            {hotel?.name}
                          </div>
                          <div className="text-sm text-indigo-700">{selectedRoom.name}</div>
                          <div className="text-xs text-indigo-500">
                            {roomCount} {roomCount === 1 ? 'room' : 'rooms'} × {nights} {nights === 1 ? 'night' : 'nights'}
                          </div>
                          <div className="text-xs text-indigo-400 mt-1">
                            {new Date(checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
                          </div>
                        </div>
                        <div className="font-bold text-indigo-900">
                          ${hotelSubtotal.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                    <div className="flex justify-between text-slate-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">${(subtotal + hotelSubtotal).toFixed(2)}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Promo Discount</span>
                        <span className="font-semibold">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-700">
                      <div className="flex items-center">
                        <span>Service Fee</span>
                        <Info size={14} className="ml-1 text-slate-400" />
                      </div>
                      <span className="font-semibold">${serviceFee.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-3xl font-display gradient-text">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  {/* Guarantee Badge */}
                  <div className="bg-linear-to-br mb-4 mt-4 from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-500 rounded-full p-2 flex-shrink-0">
                        <CheckCircle size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-green-900 mb-1">Buyer Protection</h4>
                        <p className="text-sm text-green-700">
                          Your tickets are guaranteed authentic and will be delivered on time
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center group mb-4 ${isVendor
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:shadow-indigo-500/40'
                      }`}
                    disabled={!hasSelection || isBooking || isVendor}
                    onClick={handleCheckout}
                  >
                    {isBooking ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>
                        <span>
                          {isVendor
                            ? 'Vendors Cannot Book'
                            : isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                        </span>
                        {!isVendor && <ChevronRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-slate-500">
                    No hidden fees • Secure payment • Instant confirmation
                  </p>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ticket size={36} className="text-indigo-600" />
                  </div>
                  <p className="text-lg font-semibold text-slate-700 mb-2">No tickets selected</p>
                  <p className="text-slate-500 text-sm">Choose your tickets to see the total</p>
                </div>
              )}

              {/* Policies */}
              <div className="mt-8 pt-8 border-t border-slate-200 text-sm text-slate-600 space-y-2">
                <a href="#" className="flex items-center justify-between hover:text-indigo-600 transition-colors">
                  <span>Cancellation Policy</span>
                  <ChevronRight size={16} />
                </a>
                <a href="#" className="flex items-center justify-between hover:text-indigo-600 transition-colors">
                  <span>Terms & Conditions</span>
                  <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default EventBookingPage;