import React, { useState } from 'react';
import { ChevronLeft, MapPin, Star, Calendar, Clock, Users, Heart, Share2, Ticket, Music, Wifi, Coffee, PartyPopper, Camera, CheckCircle, Info, ChevronRight, X } from 'lucide-react';

const EventDetails = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showMap, setShowMap] = useState(false);

  const ticketTypes = [
    { id: 1, name: 'General Admission', price: 85, available: 234, benefits: ['Entry to all stages', 'Standing area access'] },
    { id: 2, name: 'VIP Pass', price: 150, available: 45, benefits: ['All General benefits', 'VIP lounge access', 'Fast track entry', 'Free drinks'] },
    { id: 3, name: 'Platinum Package', price: 250, available: 12, benefits: ['All VIP benefits', 'Meet & greet', 'Backstage tour', 'Exclusive merchandise'] }
  ];

  const schedule = [
    { time: '7:00 PM', title: 'Gates Open', description: 'Venue opens for entry' },
    { time: '7:30 PM', title: 'Opening Act', description: 'The Midnight Echoes' },
    { time: '8:30 PM', title: 'Main Performance', description: 'Electric Dreams Orchestra' },
    { time: '10:00 PM', title: 'Special Guest', description: 'Surprise headliner' },
    { time: '11:30 PM', title: 'Event Ends', description: 'Last call and venue closing' }
  ];

  const highlights = [
    { icon: Music, text: 'Live performances from 4 artists' },
    { icon: Camera, text: 'Professional photography allowed' },
    { icon: Coffee, text: 'Food & beverage available' },
    { icon: Wifi, text: 'Free WiFi throughout venue' }
  ];

  const reviews = [
    { name: 'Alex Johnson', rating: 5, date: 'Previous Event', text: 'Best concert experience ever! The venue was amazing and the sound quality was incredible. Can\'t wait for the next one!', avatar: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Maria Garcia', rating: 5, date: 'Previous Event', text: 'Absolutely worth it! VIP package was excellent. Great organization and fantastic atmosphere.', avatar: 'https://i.pravatar.cc/150?img=5' },
    { name: 'David Lee', rating: 4, date: 'Previous Event', text: 'Amazing performances and good crowd. Only downside was long lines for drinks, but overall great!', avatar: 'https://i.pravatar.cc/150?img=12' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
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
            transform: translateY(20px);
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

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-pulse-scale {
          animation: pulse 2s ease-in-out infinite;
        }

        .glass {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .gradient-border {
          position: relative;
          background: white;
        }

        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          padding: 2px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
      `}</style>
      {/* Hero Banner */}
      <div className="relative h-[400px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&w=1600&q=80" 
          alt="Event" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">Music</span>
            <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center animate-pulse-scale">
              <PartyPopper size={14} className="mr-1.5" />
              Trending
            </span>
            <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold">Featured</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display text-white mb-3">Summer Music Festival 2026</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <div className="flex items-center">
              <Calendar size={18} className="mr-2" />
              <span className="font-semibold">August 15, 2026</span>
            </div>
            <div className="flex items-center">
              <Clock size={18} className="mr-2" />
              <span className="font-semibold">7:00 PM - 11:30 PM</span>
            </div>
            <div className="flex items-center">
              <MapPin size={18} className="mr-2" />
              <span className="font-semibold">Wembley Arena, London</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8 animate-slideUp">
            {/* Quick Info */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-amber-50 px-3 py-1.5 rounded-lg flex items-center">
                    <Star size={16} fill="#f59e0b" className="text-amber-500 mr-1" />
                    <span className="font-bold text-amber-700">4.9</span>
                  </div>
                  <span className="text-slate-600">(847 reviews)</span>
                </div>
                
                <div className="flex items-center text-purple-600 font-semibold">
                  <Users size={18} className="mr-2" />
                  <span>12,500+ attending</span>
                </div>
              </div>
              
              <p className="text-slate-700 font-serif text-lg leading-relaxed">
                Join us for an unforgettable night of live music featuring some of the biggest names in the industry. 
                Experience world-class performances, stunning visuals, and an electric atmosphere that will leave you 
                wanting more. This summer's biggest music event returns to Wembley Arena!
              </p>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-2xl font-display text-slate-900 mb-6">Event Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center space-x-3 bg-white p-5 rounded-xl border border-slate-200">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <highlight.icon size={24} className="text-purple-600" />
                    </div>
                    <span className="font-semibold text-slate-700">{highlight.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Schedule */}
            <div>
              <h2 className="text-2xl font-display text-slate-900 mb-6">Event Schedule</h2>
              <div className="space-y-3">
                {schedule.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex-shrink-0">
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

            {/* Venue Information */}
            <div>
              <h2 className="text-2xl font-display text-slate-900 mb-6">Venue Information</h2>
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200">
                <div className="h-64 bg-slate-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={48} className="text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 font-semibold">Wembley Arena</p>
                    <p className="text-slate-500 text-sm">Empire Way, Wembley, London HA9 0DH</p>
                    <button 
                      onClick={() => setShowMap(true)}
                      className="mt-4 text-purple-600 font-semibold hover:text-purple-700"
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

            {/* Important Information */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <Info size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Important Information</h3>
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

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display text-slate-900">Attendee Reviews</h2>
                <button className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                  See All Reviews
                </button>
              </div>
              
              <div className="space-y-4">
                {reviews.map((review, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200">
                    <div className="flex items-start space-x-4">
                      <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-slate-900">{review.name}</h4>
                            <p className="text-sm text-slate-500">{review.date}</p>
                          </div>
                          <div className="flex items-center bg-amber-50 px-3 py-1 rounded-lg">
                            <Star size={14} fill="#f59e0b" className="text-amber-500 mr-1" />
                            <span className="font-bold text-amber-700">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{review.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Ticket Selection */}
          <div className="lg:col-span-1 animate-slideUp" style={{animationDelay: '0.1s'}}>
            <div className="sticky top-24 space-y-6">
              {/* Ticket Types */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
                <h3 className="text-2xl font-display text-slate-900 mb-6">Select Tickets</h3>
                
                <div className="space-y-4 mb-6">
                  {ticketTypes.map((ticket) => (
                    <div
                      key={ticket.id}
                      // onClick={() => setSelectedTicket(ticket.id)}s
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedTicket === ticket.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 hover:border-purple-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">{ticket.name}</h4>
                          <p className="text-sm text-slate-500">{ticket.available} tickets left</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-display text-purple-600">${ticket.price}</div>
                          <div className="text-xs text-slate-500">per person</div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        {ticket.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center text-sm text-slate-600">
                            <CheckCircle size={14} className="text-green-500 mr-2 flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedTicket && (
                  <div className="mb-6 animate-slideUp">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
                    <div className="flex items-center justify-between bg-slate-100 rounded-xl p-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-white rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-bold text-xl text-slate-900">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="w-10 h-10 bg-white rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <button
                  disabled={!selectedTicket}
                  className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center ${
                    selectedTicket
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Ticket size={20} className="mr-2" />
                  Get Tickets
                </button>

                {selectedTicket && (
                  <div className="mt-6 pt-6 border-t border-slate-200 space-y-3 animate-slideUp">
                    <div className="flex justify-between text-slate-600">
                      <span>
                        ${ticketTypes.find(t => t.id === selectedTicket)?.price} × {quantity}
                      </span>
                      <span>${(ticketTypes.find(t => t.id === selectedTicket)?.price || 0) * quantity}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Service fee</span>
                      <span>${((ticketTypes.find(t => t.id === selectedTicket)?.price || 0) * quantity * 0.1).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-slate-900 pt-3 border-t border-slate-200">
                      <span>Total</span>
                      <span>${((ticketTypes.find(t => t.id === selectedTicket)?.price || 0) * quantity * 1.1).toFixed(0)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Guarantee Badge */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;