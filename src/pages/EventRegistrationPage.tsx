import React, { useState } from 'react';
import { Calendar, MapPin, Ticket, Users, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';

// Mock event data (would come from URL params / route)
const mockEvent = {
  id: 2,
  title: "Summer Music Festival",
  location: "Wembley Arena, London",
  date: "August 15, 2025 • 6:00 PM – 11:00 PM",
  image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&w=1200&q=80",
  description: "Biggest summer beats with international headliners. Limited early bird tickets!",
  ticketTypes: [
    { id: 1, name: "General Admission", price: 85, available: 1200, soldOut: false },
    { id: 2, name: "VIP Access", price: 180, available: 180, soldOut: false, perks: "Fast entry • VIP lounge • Meet & greet" },
    { id: 3, name: "Early Bird (Sold Out)", price: 65, available: 0, soldOut: true },
  ],
};

const EventRegistrationPage: React.FC = () => {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQuantity = (ticketId: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[ticketId] || 0;
      const newQty = Math.max(0, current + delta);
      return { ...prev, [ticketId]: newQty };
    });
  };

  const subtotal = mockEvent.ticketTypes.reduce((sum, t) => {
    const qty = quantities[t.id] || 0;
    return sum + qty * t.price;
  }, 0);

  const hasSelection = Object.values(quantities).some(q => q > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pb-24">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={mockEvent.image}
          alt={mockEvent.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto px-6 pb-10 w-full">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-white/30">
              <Sparkles size={16} className="text-yellow-300 mr-2" />
              <span className="text-white font-semibold">Limited Tickets Available</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display text-white mb-3 leading-tight">
              {mockEvent.title}
            </h1>
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-white/90 text-lg">
              <div className="flex items-center">
                <Calendar size={20} className="mr-2" />
                {mockEvent.date}
              </div>
              <div className="flex items-center">
                <MapPin size={20} className="mr-2" />
                {mockEvent.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ticket Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-6 md:p-8 rounded-3xl border border-white/30 backdrop-blur-md shadow-2xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <Ticket size={24} className="text-indigo-600 mr-3" />
                Choose Your Tickets
              </h2>

              <div className="space-y-6">
                {mockEvent.ticketTypes.map(ticket => (
                  <div
                    key={ticket.id}
                    className={`p-5 rounded-2xl border ${
                      ticket.soldOut ? 'bg-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-indigo-300'
                    } transition-all`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-xl text-slate-900">{ticket.name}</h3>
                        {ticket.perks && (
                          <p className="text-sm text-slate-600 mt-1">{ticket.perks}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                          ${ticket.price}
                        </div>
                        <div className="text-sm text-slate-500">per ticket</div>
                      </div>
                    </div>

                    {ticket.soldOut ? (
                      <div className="flex items-center text-red-600 text-sm font-medium">
                        <AlertCircle size={16} className="mr-1.5" />
                        Sold Out
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => updateQuantity(ticket.id, -1)}
                            disabled={!quantities[ticket.id]}
                            className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 disabled:opacity-40 hover:bg-slate-300 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-xl font-bold w-10 text-center">
                            {quantities[ticket.id] || 0}
                          </span>
                          <button
                            onClick={() => updateQuantity(ticket.id, 1)}
                            disabled={quantities[ticket.id] >= 10 || ticket.available <= (quantities[ticket.id] || 0)} // simple max
                            className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 hover:bg-indigo-200 transition-colors disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-sm text-slate-500">
                          {ticket.available} remaining
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Code */}
            <div className="glass p-6 rounded-3xl border border-white/30 backdrop-blur-md">
              <h3 className="font-bold text-lg mb-3">Have a promo code?</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 p-4 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
                />
                <button
                  onClick={() => setPromoApplied(!!promoCode.trim())}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  disabled={!promoCode.trim()}
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <p className="mt-3 text-green-600 text-sm">Promo applied! -$20 off</p>
              )}
            </div>
          </div>

          {/* Sticky Summary */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="glass p-8 rounded-3xl border border-white/30 backdrop-blur-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              {hasSelection ? (
                <>
                  <div className="space-y-4 mb-8">
                    {mockEvent.ticketTypes.map(t => {
                      const qty = quantities[t.id] || 0;
                      if (qty === 0) return null;
                      return (
                        <div key={t.id} className="flex justify-between text-slate-700">
                          <span>{qty} × {t.name}</span>
                          <span>${(qty * t.price).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <div className="flex justify-between text-lg font-bold mb-2">
                      <span>Total</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 mb-6">
                      *Taxes and fees included. No hidden charges.
                    </div>

                    <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-indigo-500/40 transition-all flex items-center justify-center group disabled:opacity-50" disabled={!hasSelection}>
                      Proceed to Checkout
                      <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-10 text-slate-500">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select tickets to continue</p>
                </div>
              )}

              <div className="mt-8 text-sm text-slate-500 text-center">
                <a href="#" className="text-indigo-600 hover:underline">Refund Policy</a> • Secure checkout
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationPage;