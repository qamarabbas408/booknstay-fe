import React, { useState } from 'react';
import {
  MapPin, Star, Tag, Zap, ArrowRight, Hotel,
  Clock, ShieldCheck, Sparkles, ChevronRight, Lock
} from 'lucide-react';
import { type Bundle, type Event as EventType } from '../../store/services/eventApi';

interface StayPlayBundleProps {
  bundles: Bundle[];
  event: EventType;
  onSelectBundle?: (bundle: Bundle) => void;
  onSkip?: () => void;
}

const StayPlayBundle: React.FC<StayPlayBundleProps> = ({ bundles, event, onSelectBundle,onSkip }) => {
  const [selectedBundleId, setSelectedBundleId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (!bundles || bundles.length === 0) return null;

  const calcDiscountedPrice = (bundle: Bundle) => {
    const hotelOriginal = bundle.hotel.original_price;
    const hotelBundled = bundle.hotel.bundle_price;
    const eventBase = event.ticketTypes && event.ticketTypes.length > 0
      ? Math.min(...event.ticketTypes.map(t => t.price))
      : 0;

    const combinedOriginal = hotelOriginal + eventBase;
    const combinedDiscounted = hotelBundled + eventBase;
    const savings = combinedOriginal - combinedDiscounted;
    const discountPct = hotelOriginal > 0 ? (savings / hotelOriginal) * 100 : 0;

    return {
      original: combinedOriginal.toFixed(2),
      discounted: combinedDiscounted.toFixed(2),
      savings: savings.toFixed(2),
      hotelPrice: hotelOriginal.toFixed(2),
      eventPrice: eventBase.toFixed(2),
      pct: discountPct.toFixed(0),
    };
  };

  const handleSelect = (bundle: Bundle) => {
    setSelectedBundleId(bundle.bundle_id === selectedBundleId ? null : bundle.bundle_id);
    onSelectBundle?.(bundle);
  };

  return (
    <div className="relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .bundle-root * {
          font-family: 'DM Sans', sans-serif;
        }

        .bundle-display {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        /* — Animated shimmer badge — */
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.85); }
        }

        @keyframes revealUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .animate-revealUp    { animation: revealUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .delay-1 { animation-delay: 0.08s; }
        .delay-2 { animation-delay: 0.16s; }
        .delay-3 { animation-delay: 0.24s; }

        .shimmer-badge {
          background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 30%, #fde68a 50%, #fbbf24 70%, #f59e0b 100%);
          background-size: 400px 100%;
          animation: shimmer 2.4s linear infinite;
        }

        .pulse-dot {
          animation: pulseDot 1.6s ease-in-out infinite;
        }

        .float-icon {
          animation: float 3s ease-in-out infinite;
        }

        /* — Card states — */
        .bundle-card {
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.25s ease;
        }

        .bundle-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 48px -12px rgba(139,92,246,0.25);
        }

        .bundle-card.is-selected {
          transform: translateY(-2px);
          box-shadow: 0 0 0 3px #8b5cf6, 0 20px 40px -12px rgba(139,92,246,0.3);
        }

        /* — Noise texture overlay — */
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          background-repeat: repeat;
          pointer-events: none;
        }

        /* — Discount ribbon — */
        .ribbon {
          position: absolute;
          top: -1px;
          right: 20px;
          background: linear-gradient(135deg, #7c3aed, #db2777);
          color: white;
          padding: 8px 14px 12px;
          clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%);
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 18px;
          line-height: 1;
          text-align: center;
          min-width: 60px;
          z-index: 10;
          box-shadow: 0 4px 16px rgba(124,58,237,0.4);
        }
      `}</style>

      <div className="bundle-root space-y-5 animate-revealUp">

        {/* ── Section Header ───────────────────────────────── */}
        <div className="flex items-start justify-between mb-2 animate-revealUp delay-1">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="shimmer-badge text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                🏨 STAY + PLAY
              </span>
              <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot"></span>
              <span className="text-xs font-semibold text-green-700">Limited Offer</span>
            </div>
            <h2 className="bundle-display text-2xl text-slate-900 leading-tight">
              Recommended<br />
              <span style={{ 
                background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Partner Stays
              </span>
            </h2>
          </div>

          {/* Floating benefit pills */}
          <div className="hidden md:flex flex-col space-y-2">
            <div className="flex items-center space-x-1.5 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-full text-xs font-semibold text-violet-700">
              <ShieldCheck size={12} />
              <span>Bundle & save</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-700">
              <Lock size={12} />
              <span>Best rate guaranteed</span>
            </div>
          </div>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed -mt-1 animate-revealUp delay-2">
          This event is in another city. Book your stay together and pocket the savings — no extra steps.
        </p>

        {/* ── Bundle Cards ─────────────────────────────────── */}
        {bundles.map((bundle, index) => {
          const pricing  = calcDiscountedPrice(bundle);
          const isSelected = selectedBundleId === bundle.bundle_id;

          return (
            <div
              key={bundle.bundle_id}
              className={`bundle-card relative bg-white rounded-2xl border-2 overflow-hidden cursor-pointer animate-revealUp delay-${Math.min(index + 2, 3)} ${
                isSelected
                  ? 'is-selected border-violet-500'
                  : 'border-slate-200 hover:border-violet-300'
              }`}
              onClick={() => handleSelect(bundle)}
              onMouseEnter={() => setHoveredId(bundle.bundle_id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Noise texture */}
              <div className="noise-overlay absolute inset-0 z-0 rounded-2xl" />

              {/* Discount ribbon */}
              <div className="ribbon">
                -{pricing.pct}%
              </div>

              {/* ── Top: offer badge ── */}
              <div className="relative z-10 px-6 pt-6 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="float-icon">
                    <Sparkles size={18} className="text-violet-500" />
                  </div>
                  <span className="text-sm font-bold text-violet-700 tracking-tight">
                    {bundle.offer_title}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Book your event ticket + hotel room in one tap
                </p>
              </div>

              {/* ── Middle: Event + connector + Hotel ── */}
              <div className="relative z-10 px-6 py-5">
                <div className="flex items-stretch gap-3">

                  {/* Event pill */}
                  <div className="flex-1 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                        <Zap size={16} className="text-white" />
                      </div>
                      <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Event</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 leading-snug mb-3 line-clamp-2">
                      {event.title}
                    </p>
                    <div className="text-lg font-bold text-purple-700">
                      ${pricing.eventPrice}
                    </div>
                    <div className="text-xs text-slate-500">per ticket</div>
                  </div>

                  {/* Connector */}
                  <div className="flex flex-col items-center justify-center gap-1 px-1">
                    <div className="w-px h-6 bg-gradient-to-b from-purple-200 to-pink-200"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-200">
                      <span className="text-white text-xs font-black">+</span>
                    </div>
                    <div className="w-px h-6 bg-gradient-to-b from-pink-200 to-rose-200"></div>
                  </div>

                  {/* Hotel pill */}
                  <div className="flex-1 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center flex-shrink-0">
                        <Hotel size={16} className="text-white" />
                      </div>
                      <span className="text-xs font-bold text-pink-700 uppercase tracking-wider">Hotel</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 leading-snug mb-2 line-clamp-2">
                      {bundle.hotel.name}
                    </p>
                    {/* Star rating */}
                    <div className="flex items-center space-x-1 mb-2 -ml-1">
                      {Array.from({ length: bundle.hotel.stars }).map((_, i) => (
                        <Star key={i} size={11} fill="#f59e0b" className="text-amber-400" />
                      ))}
                    </div>
                    <div className="text-lg font-bold text-pink-700">
                      ${pricing.hotelPrice}
                    </div>
                    <div className="text-xs text-slate-500">per night</div>
                  </div>
                </div>

                {/* ── Savings strip ── */}
                <div className="mt-4 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white/70 text-xs font-semibold mb-0.5 uppercase tracking-wider">
                        Bundle Total
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-white/50 line-through text-sm">
                          ${pricing.original}
                        </span>
                        <span className="text-white text-3xl bundle-display">
                          ${pricing.discounted}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                        <div className="text-white/80 text-xs font-semibold">You save</div>
                        <div className="text-white text-xl bundle-display">
                          ${pricing.savings}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal breakdown */}
                  <div className="mt-3 pt-3 border-t border-white/20 flex items-center space-x-4 text-xs text-white/70">
                    <span>🎫 Ticket: ${pricing.eventPrice}</span>
                    <span className="text-white/40">+</span>
                    <span>🏨 Hotel: ${pricing.hotelPrice}</span>
                    <span className="text-white/40">−</span>
                    <span className="text-white font-bold">{pricing.pct}% off</span>
                  </div>
                </div>
              </div>

              {/* ── Footer: CTA ── */}
              <div className="relative z-10 px-6 pb-6">
                <button
                  onClick={(e) => { e.stopPropagation(); handleSelect(bundle); }}
                  className={`w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                    isSelected
                      ? 'bg-slate-100 text-slate-700 border-2 border-slate-200'
                      : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:shadow-xl'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <ShieldCheck size={18} className="text-green-500" />
                      <span className="text-green-700">Bundle Selected — Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <Tag size={18} />
                      <span>Add Bundle to Cart</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                {/* Trust signals */}
                <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck size={12} className="text-green-500" />
                    <span>Secure checkout</span>
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="flex items-center space-x-1">
                    <Clock size={12} className="text-amber-500" />
                    <span>Instant confirmation</span>
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="flex items-center space-x-1">
                    <Zap size={12} className="text-violet-500" />
                    <span>One booking</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── "Or continue without hotel" nudge ── */}
        <p className="text-center text-xs text-slate-400 animate-revealUp delay-3">
          Just want the ticket?{' '}
          <button onClick = {onSkip}className="text-slate-600 font-semibold hover:text-slate-900 underline underline-offset-2 transition-colors">
            Skip hotel and continue
          </button>
        </p>
      </div>
    </div>
  );
};

export default StayPlayBundle;

