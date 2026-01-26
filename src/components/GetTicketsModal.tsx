import React, { useState } from 'react';
import { X, Calendar, MapPin, Clock, Users, Minus, Plus, Tag, CreditCard, Shield, Ticket, ChevronRight, Star, Info } from 'lucide-react';

interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  available: number;
  color: string;
}

const GetTicketsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string>('general');
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<'select' | 'checkout'>('select');

  const eventData = {
    title: "Summer Music Festival 2026",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1600&q=80",
    date: "August 15, 2026",
    time: "6:00 PM - 11:00 PM",
    location: "Wembley Arena, London",
    rating: 4.8,
    attendees: "5,234 going"
  };

  const ticketTiers: TicketTier[] = [
    {
      id: 'general',
      name: 'General Admission',
      price: 85,
      description: 'Standard entry with open seating',
      available: 342,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'vip',
      name: 'VIP Experience',
      price: 250,
      description: 'Premium seating, backstage access, complimentary drinks',
      available: 48,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'platinum',
      name: 'Platinum Package',
      price: 450,
      description: 'Front row seats, meet & greet, exclusive merchandise',
      available: 12,
      color: 'from-amber-500 to-orange-600'
    }
  ];

  const selectedTierData = ticketTiers.find(t => t.id === selectedTier) || ticketTiers[0];
  const totalPrice = selectedTierData.price * quantity;
  const serviceFee = totalPrice * 0.1;
  const finalTotal = totalPrice + serviceFee;

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10 && newQuantity <= selectedTierData.available) {
      setQuantity(newQuantity);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        
        .ticket-tier-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .ticket-tier-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
        
        .selected-tier {
          box-shadow: 0 12px 32px rgba(99, 102, 241, 0.3);
          border-color: #6366f1;
        }
      `}</style>

      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl glass shadow-2xl animate-scaleIn">
        
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 group"
        >
          <X size={20} className="text-slate-600 group-hover:text-slate-900" />
        </button>

        <div className="flex flex-col lg:flex-row max-h-[90vh]">
          
          {/* Left Side - Event Info */}
          <div className="lg:w-2/5 relative overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src={eventData.image} 
                alt={eventData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
            </div>
            
            <div className="relative z-10 p-8 lg:p-10 flex flex-col justify-between h-full min-h-[400px] lg:min-h-[600px]">
              <div>
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/30">
                  <Ticket size={16} className="text-white" />
                  <span className="text-white text-sm font-semibold">Live Event</span>
                </div>
                
                <h2 className="text-4xl font-display text-white mb-4 leading-tight">
                  {eventData.title}
                </h2>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center bg-amber-500/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <Star size={14} fill="#fff" className="text-white mr-1" />
                    <span className="text-white text-sm font-bold">{eventData.rating}</span>
                  </div>
                  <div className="flex items-center text-white/90 text-sm">
                    <Users size={16} className="mr-1.5" />
                    {eventData.attendees}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-white/90">
                  <Calendar size={20} className="mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">{eventData.date}</div>
                    <div className="text-sm text-white/70">{eventData.time}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 text-white/90">
                  <MapPin size={20} className="mt-1 flex-shrink-0" />
                  <div className="font-medium">{eventData.location}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Ticket Selection */}
          <div className="lg:w-3/5 overflow-y-auto">
            <div className="p-8 lg:p-10">
              
              {step === 'select' ? (
                <>
                  {/* Header */}
                  <div className="mb-8">
                    <h3 className="text-3xl font-display text-slate-900 mb-2">Select Your Tickets</h3>
                    <p className="text-slate-600 font-serif">Choose the perfect experience for you</p>
                  </div>

                  {/* Ticket Tiers */}
                  <div className="space-y-4 mb-8">
                    {ticketTiers.map((tier) => (
                      <div
                        key={tier.id}
                        onClick={() => {
                          setSelectedTier(tier.id);
                          setQuantity(1);
                        }}
                        className={`ticket-tier-card cursor-pointer border-2 rounded-2xl p-6 ${
                          selectedTier === tier.id 
                            ? 'selected-tier bg-indigo-50/50' 
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-xl font-bold text-slate-900">{tier.name}</h4>
                              {tier.id === 'platinum' && (
                                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${tier.color}`}>
                                  BEST VALUE
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 text-sm mb-3">{tier.description}</p>
                            <div className="flex items-center text-sm">
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                tier.available > 50 ? 'bg-green-500' : tier.available > 20 ? 'bg-amber-500' : 'bg-red-500'
                              }`}></span>
                              <span className="text-slate-500">
                                {tier.available} tickets available
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="text-3xl font-display text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                              ${tier.price}
                            </div>
                            <div className="text-sm text-slate-500">per ticket</div>
                          </div>
                        </div>
                        
                        {selectedTier === tier.id && (
                          <div className="pt-4 border-t border-slate-200 animate-slideUp">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-700 font-semibold">Quantity</span>
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(-1);
                                  }}
                                  disabled={quantity <= 1}
                                  className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                >
                                  <Minus size={18} className="text-slate-700" />
                                </button>
                                
                                <span className="text-2xl font-bold text-slate-900 w-12 text-center">
                                  {quantity}
                                </span>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(1);
                                  }}
                                  disabled={quantity >= 10 || quantity >= tier.available}
                                  className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                >
                                  <Plus size={18} className="text-slate-700" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Promo Code */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-2 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                      <Tag size={20} className="text-indigo-600" />
                      <input
                        type="text"
                        placeholder="Have a promo code?"
                        className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                      />
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm">
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-slate-50 rounded-2xl p-6 mb-8">
                    <h4 className="font-bold text-slate-900 mb-4 text-lg">Order Summary</h4>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-slate-600">
                        <span>{selectedTierData.name} × {quantity}</span>
                        <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span className="flex items-center">
                          Service Fee
                          <Info size={14} className="ml-1 text-slate-400" />
                        </span>
                        <span className="font-semibold">${serviceFee.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900">Total</span>
                      <span className="text-3xl font-display text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:shadow-indigo-500/40 flex items-center justify-center group"
                  >
                    <span>Continue to Checkout</span>
                    <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Shield size={16} className="mr-1.5 text-green-600" />
                      Secure Checkout
                    </div>
                    <div className="flex items-center">
                      <CreditCard size={16} className="mr-1.5 text-blue-600" />
                      Instant Confirmation
                    </div>
                  </div>
                </>
              ) : (
                /* Checkout Step */
                <>
                  <button
                    onClick={() => setStep('select')}
                    className="flex items-center text-slate-600 hover:text-slate-900 mb-6 group transition-colors"
                  >
                    <ChevronRight size={20} className="mr-1 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold">Back to ticket selection</span>
                  </button>

                  <div className="mb-8">
                    <h3 className="text-3xl font-display text-slate-900 mb-2">Payment Details</h3>
                    <p className="text-slate-600 font-serif">Complete your booking securely</p>
                  </div>

                  {/* Payment Form */}
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all text-slate-800"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-2">Tickets will be sent to this email</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all text-slate-800"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all text-slate-800"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all text-slate-800"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all text-slate-800"
                        required
                      />
                    </div>

                    {/* Order Summary in Checkout */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-slate-700">Order Total</span>
                        <span className="text-3xl font-display text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                          ${finalTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600">
                        {quantity}× {selectedTierData.name}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:shadow-indigo-500/40"
                    >
                      Complete Purchase
                    </button>

                    <p className="text-xs text-center text-slate-500 leading-relaxed">
                      By completing this purchase, you agree to our{' '}
                      <a href="#" className="text-indigo-600 hover:underline">Terms</a>
                      {' '}and{' '}
                      <a href="#" className="text-indigo-600 hover:underline">Refund Policy</a>
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetTicketsModal;