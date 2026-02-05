import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Users, AlertCircle, ChevronRight, Sparkles, Clock, Star, Heart, Share2, Plus, Minus, Tag, Shield, CreditCard, Info, TrendingUp, CheckCircle, Loader2 } from 'lucide-react';
import { useGetEventByIdQuery, useCreateEventBookingMutation } from '../store/services/eventApi';
import { APIENDPOINTS } from '../utils/ApiConstants';
import { AppImages } from '../utils/AppImages';
import SkeletonLoader from '../components/SkeletonLoader';
import { CustomToaster, showToast } from '../components/CustomToaster';

const EventBookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: eventResponse, isLoading, isError } = useGetEventByIdQuery(Number(id), {
    skip: !id,
  });
  const [createEventBooking, { isLoading: isBooking }] = useCreateEventBookingMutation();
  const event = eventResponse?.data;

  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

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
      showToast.error("Please select at least one ticket.");
      return;
    }

    try {
      const response = await createEventBooking({
        event_id: Number(id),
        selections,
      }).unwrap();

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

  const reviews = [
    { name: 'Alex Johnson', rating: 5, date: 'Previous Event', text: 'Best concert experience ever! The venue was amazing and the sound quality was incredible. Can\'t wait for the next one!', avatar: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Maria Garcia', rating: 5, date: 'Previous Event', text: 'Absolutely worth it! VIP package was excellent. Great organization and fantastic atmosphere.', avatar: 'https://i.pravatar.cc/150?img=5' },
    { name: 'David Lee', rating: 4, date: 'Previous Event', text: 'Amazing performances and good crowd. Only downside was long lines for drinks, but overall great!', avatar: 'https://i.pravatar.cc/150?img=12' }
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

  const discount = promoApplied ? 20 : 0;
  const serviceFee = subtotal * 0.05;
  const total = subtotal - discount + serviceFee;

  const hasSelection = Object.values(quantities).some(q => q > 0);
  const totalTickets = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <CustomToaster />
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
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
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
        
        .ticket-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .ticket-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
        
        .ticket-card.selected {
          border-color: #6366f1;
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.25);
        }
      `}</style>

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
                <span className="font-medium">{event.venue}, {event.location}</span>
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

            {/* Event Schedule */}
            <div className="glass rounded-3xl border border-white/40 shadow-lg animate-fadeInUp overflow-hidden">
              <button onClick={() => toggleSection('schedule')} className="w-full flex items-center justify-between p-6 md:p-8 text-left">
                <h2 className="text-2xl font-display text-slate-900">Event Schedule</h2>
                <ChevronRight size={24} className={`text-slate-500 transition-transform duration-300 ${!collapsedSections.schedule ? 'rotate-90' : ''}`} />
              </button>
              <div className={`transition-all duration-500 ease-in-out ${collapsedSections.schedule ? 'max-h-0' : 'max-h-[1000px]'}`}>
                <div className="px-6 md:px-8 pb-8 space-y-3">
                  {schedule.map((item, idx) => (
                    <div key={idx} className="bg-white/50 rounded-xl p-5 border border-white/50 flex items-start space-x-4">
                      <div className="bg-linear-to-br from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex-shrink-0">
                        {item.time}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                        <p className="text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Venue Information */}
            <div className="glass rounded-3xl border border-white/40 shadow-lg animate-fadeInUp overflow-hidden">
              <button onClick={() => toggleSection('venue')} className="w-full flex items-center justify-between p-6 md:p-8 text-left">
                <h2 className="text-2xl font-display text-slate-900">Venue Information</h2>
                <ChevronRight size={24} className={`text-slate-500 transition-transform duration-300 ${!collapsedSections.venue ? 'rotate-90' : ''}`} />
              </button>
              <div className={`transition-all duration-500 ease-in-out ${collapsedSections.venue ? 'max-h-0' : 'max-h-[1000px]'}`}>
                <div className="px-6 md:px-8 pb-8">
                  <div className="bg-white/50 rounded-2xl overflow-hidden border border-white/50">
                    <div className="h-64 bg-slate-200 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin size={48} className="text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-600 font-semibold">{event.venue}</p>
                        <p className="text-slate-500 text-sm">{event.location}</p>
                        <button
                          onClick={() => setShowMap(true)}
                          className="mt-4 text-indigo-600 font-semibold hover:text-indigo-700"
                        >
                          View on Map
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <h4 className="font-bold text-slate-900 mb-3">Getting There</h4>
                      <div className="space-y-2 text-slate-600">
                        <p className="flex items-start">
                          <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Wembley Park Station - 5 min walk</span>
                        </p>
                        <p className="flex items-start">
                          <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Parking available - £20 per vehicle</span>
                        </p>
                        <p className="flex items-start">
                          <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Accessible facilities available</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="glass rounded-3xl border border-white/40 shadow-lg animate-fadeInUp overflow-hidden">
              <button onClick={() => toggleSection('info')} className="w-full flex items-center justify-between p-6 md:p-8 text-left">
                <h2 className="text-2xl font-display text-slate-900">Important Information</h2>
                <ChevronRight size={24} className={`text-slate-500 transition-transform duration-300 ${!collapsedSections.info ? 'rotate-90' : ''}`} />
              </button>
              <div className={`transition-all duration-500 ease-in-out ${collapsedSections.info ? 'max-h-0' : 'max-h-[1000px]'}`}>
                <div className="px-6 md:px-8 pb-8">
                  <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <Info size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-blue-900 mb-2">Key Policies & Rules</h3>
                        <ul className="space-y-2 text-blue-800">
                          <li>• Age restriction: 16+ (ID required)</li>
                          <li>• No refunds after purchase</li>
                          <li>• Bag checks at entrance</li>
                          <li>• Digital tickets only - no printing required</li>
                          <li>• Please arrive 30 minutes early</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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

            {/* Promo Code */}
            <div className="glass p-6 rounded-3xl border border-white/40 shadow-lg animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center mb-4">
                <Tag size={20} className="text-indigo-600 mr-2" />
                <h3 className="font-bold text-lg text-slate-900">Promo Code</h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="flex-1 px-4 py-4 rounded-xl border-2 border-slate-200 focus:border-indigo-400 outline-none transition-all text-slate-800 font-medium"
                />
                <button
                  onClick={() => setPromoApplied(!!promoCode.trim())}
                  className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!promoCode.trim()}
                >
                  Apply Code
                </button>
              </div>
              {promoApplied && (
                <div className="mt-4 flex items-center bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                  <Sparkles size={18} className="mr-2" />
                  <span className="font-semibold">Promo code applied! You saved $20</span>
                </div>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              {[
                { icon: Shield, text: 'Secure Payment', color: 'text-green-600' },
                { icon: CreditCard, text: 'Instant Confirmation', color: 'text-blue-600' },
                { icon: Users, text: '24/7 Support', color: 'text-purple-600' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="glass p-4 rounded-xl border border-white/40 flex items-center justify-center">
                    <Icon size={20} className={`${item.color} mr-2`} />
                    <span className="text-slate-700 font-semibold text-sm">{item.text}</span>
                  </div>
                );
              })}
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
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                    <div className="flex justify-between text-slate-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
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
                    className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-indigo-500/40 transition-all flex items-center justify-center group mb-4"
                    disabled={!hasSelection || isBooking}
                    onClick={handleCheckout}
                  >
                    {isBooking ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>
                        <span>Proceed to Checkout</span>
                        <ChevronRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
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