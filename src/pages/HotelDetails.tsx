import React, { useState } from 'react';
import { ChevronLeft, MapPin, Star, Wifi, Coffee, Car, Dumbbell, Heart, Share2, Check, Calendar, Users, X, ChevronRight } from 'lucide-react';

const HotelDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const images = [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=80"
  ];

  const amenities = [
    { icon: Wifi, name: 'Free Wi-Fi' },
    { icon: Coffee, name: 'Breakfast Included' },
    { icon: Car, name: 'Free Parking' },
    { icon: Dumbbell, name: 'Fitness Center' }
  ];

  const reviews = [
    { name: 'Sarah Mitchell', rating: 5, date: 'Dec 2025', text: 'Absolutely stunning property! The service was impeccable and the ocean views were breathtaking. Would definitely return.', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'James Chen', rating: 5, date: 'Nov 2025', text: 'Perfect getaway spot. The staff went above and beyond to make our stay memorable. The spa facilities are world-class.', avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Emma Thompson', rating: 4, date: 'Nov 2025', text: 'Beautiful hotel with excellent amenities. Only minor issue was the AC in our room. Otherwise, a fantastic experience!', avatar: 'https://i.pravatar.cc/150?img=3' }
  ];

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

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .glass {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button className="flex items-center text-slate-700 font-semibold hover:text-indigo-600 transition-colors">
            <ChevronLeft size={20} className="mr-1" />
            Back to Results
          </button>
          
          <div className="text-2xl font-display bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            BookNStay
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Share2 size={20} className="text-slate-600" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Heart size={20} className="text-slate-600" />
            </button>
          </div>
        </div>
      </nav>

      {/* Image Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fadeIn">
          <button 
            onClick={() => setShowGallery(false)}
            className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={28} />
          </button>
          
          <button 
            onClick={() => setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)}
            className="absolute left-6 text-white p-3 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft size={32} />
          </button>
          
          <img 
            src={images[selectedImage]} 
            alt="Hotel" 
            className="max-h-[85vh] max-w-[90vw] object-contain"
          />
          
          <button 
            onClick={() => setSelectedImage((selectedImage + 1) % images.length)}
            className="absolute right-6 text-white p-3 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight size={32} />
          </button>
          
          <div className="absolute bottom-6 text-white text-lg font-semibold">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Image Grid */}
        <div className="grid grid-cols-4 gap-2 mb-8 h-[500px] animate-slideUp">
          <div 
            className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl cursor-pointer group"
            onClick={() => { setSelectedImage(0); setShowGallery(true); }}
          >
            <img src={images[0]} alt="Hotel main" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
          </div>
          
          {images.slice(1, 5).map((img, idx) => (
            <div 
              key={idx}
              className="relative overflow-hidden rounded-2xl cursor-pointer group"
              onClick={() => { setSelectedImage(idx + 1); setShowGallery(true); }}
            >
              <img src={img} alt={`Hotel ${idx + 2}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
              {idx === 3 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">View All Photos</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8 animate-slideUp" style={{animationDelay: '0.1s'}}>
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-display text-slate-900 mb-2">Grand Azure Resort</h1>
                  <div className="flex items-center text-slate-600 space-x-4">
                    <div className="flex items-center">
                      <MapPin size={18} className="mr-1.5 text-slate-400" />
                      <span>Maldives, Indian Ocean</span>
                    </div>
                    <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-lg">
                      <Star size={16} fill="#f59e0b" className="text-amber-500 mr-1" />
                      <span className="font-bold text-amber-700">4.9</span>
                      <span className="text-slate-600 ml-1">(284 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <p className="text-lg text-slate-700 font-serif leading-relaxed">
                  Experience paradise at our luxury beachfront resort. Immerse yourself in crystal-clear waters, 
                  pristine white sand beaches, and world-class amenities. Each villa offers breathtaking ocean views 
                  and private access to the beach, creating an unforgettable tropical escape.
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-display text-slate-900 mb-6">What This Place Offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                    <amenity.icon size={24} className="text-indigo-600" />
                    <span className="font-semibold text-slate-700">{amenity.name}</span>
                  </div>
                ))}
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                  <Check size={24} className="text-indigo-600" />
                  <span className="font-semibold text-slate-700">Pool & Spa</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                  <Check size={24} className="text-indigo-600" />
                  <span className="font-semibold text-slate-700">Beach Access</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                  <Check size={24} className="text-indigo-600" />
                  <span className="font-semibold text-slate-700">Restaurant & Bar</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                  <Check size={24} className="text-indigo-600" />
                  <span className="font-semibold text-slate-700">24/7 Concierge</span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display text-slate-900">Guest Reviews</h2>
                <button className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
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

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1 animate-slideUp" style={{animationDelay: '0.2s'}}>
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
                <div className="mb-6">
                  <div className="text-sm text-slate-500 mb-1">Starting from</div>
                  <div className="text-4xl font-display bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    $250
                    <span className="text-lg text-slate-600 font-normal ml-2">/night</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Check-in</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Check-out</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Guests</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select 
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors appearance-none bg-white"
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests</option>
                        <option value={5}>5+ Guests</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all mb-4">
                  Reserve Now
                </button>

                <p className="text-center text-sm text-slate-500">You won't be charged yet</p>

                <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>$250 × 3 nights</span>
                    <span>$750</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Service fee</span>
                    <span>$75</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-slate-900 pt-3 border-t border-slate-200">
                    <span>Total</span>
                    <span>$825</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                <div className="flex items-start space-x-3">
                  <div className="bg-emerald-500 rounded-full p-2 flex-shrink-0">
                    <Check size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 mb-1">Free Cancellation</h4>
                    <p className="text-sm text-emerald-700">Cancel up to 24 hours before check-in for a full refund</p>
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

export default HotelDetails;