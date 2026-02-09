import React, { useState } from 'react';
import { Calendar, MapPin, Ticket, Users, Star, Heart, Eye, ChevronRight, Clock, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

interface TicketType {
  id: number;
  name: string;
  price: number;
  features: string[];
  available: number;
}

interface EventCardProps {
  id: number;
  title: string;
  category: string;
  location: string;
  venue: string;
  price: string;
  start_date: string;
  end_date: string;
  is_past: boolean;
  highlights: string[];
  description: string;
  total_capacity: number;
  tickets_left: number;
  is_sold_out: boolean;
  image: string | null;
  rating: number;
  attendees: number;
  featured: boolean;
  trending: boolean;
  ticketTypes: TicketType[];
  onLike?: (id: number) => void;
  onView?: (id: number) => void;
  isLiked?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  category,
  location,
  venue,
  price,
  start_date,
  end_date,
  is_past,
  description,
  total_capacity,
  tickets_left,
  is_sold_out,
  image,
  rating,
  attendees,
  featured,
  trending,
  ticketTypes,
  onLike,
  onView,
  isLiked = false
}) => {
  const [liked, setLiked] = useState(isLiked);

  const handleLike = () => {
    setLiked(!liked);
    if (onLike) onLike(id);
  };

  const handleView = () => {
    if (onView) onView(id);
  };

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      'Health & Wellness': 'from-green-500 to-emerald-600',
      'Business': 'from-blue-500 to-indigo-600',
      'Music': 'from-purple-500 to-pink-600',
      'Technology': 'from-cyan-500 to-blue-600',
      'Food & Wine': 'from-orange-500 to-red-600',
      'Art & Culture': 'from-indigo-500 to-purple-600',
    };
    return colors[cat] || 'from-slate-500 to-gray-600';
  };

  const defaultImage = image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl border border-slate-200 transition-all duration-300 hover:-translate-y-2">
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

        .gradient-text {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Image Section */}
      <div className="relative h-56 overflow-hidden group">
        <img
          src={defaultImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className={`bg-gradient-to-r ${getCategoryColor(category)} px-3 py-1.5 rounded-full`}>
            <span className="text-white text-xs font-bold uppercase tracking-wider">
              {category}
            </span>
          </div>
          {featured && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1.5 rounded-full flex items-center">
              <Sparkles size={12} className="text-white mr-1" />
              <span className="text-white text-xs font-bold">Featured</span>
            </div>
          )}
          {trending && (
            <div className="bg-red-500/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center">
              <TrendingUp size={12} className="text-white mr-1" />
              <span className="text-white text-xs font-bold">Trending</span>
            </div>
          )}
          {is_sold_out && (
            <div className="bg-red-600/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="text-white text-xs font-bold">SOLD OUT</span>
            </div>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-2.5 rounded-full hover:scale-110 transition-transform shadow-lg"
        >
          <Heart
            size={20}
            fill={liked ? "#ec4899" : "none"}
            className={liked ? "text-pink-500" : "text-slate-600"}
          />
        </button>

        {/* Date & Time Badge */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center text-slate-900 text-sm font-semibold">
              <Calendar size={14} className="mr-2" />
              <span>{start_date}</span>
              {start_date !== end_date && (
                <>
                  <span className="mx-2">→</span>
                  <span>{end_date}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title & Rating */}
        <div className="mb-4">
          <h3 className="text-xl font-display text-slate-900 mb-2 leading-tight">
            {title}
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-lg">
              <Star size={14} fill="#f59e0b" className="text-amber-500 mr-1" />
              <span className="text-sm font-bold text-amber-700">{rating}</span>
            </div>
            <div className="flex items-center text-sm text-slate-500">
              <Users size={14} className="mr-1.5" />
              <span className="font-semibold">{attendees.toLocaleString()} attending</span>
            </div>
          </div>
        </div>

        {/* Location & Venue */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-slate-600 text-sm">
            <MapPin size={16} className="mr-2 text-slate-400" />
            <span className="font-medium">{venue}</span>
          </div>
          <div className="flex items-center text-slate-500 text-xs">
            <div className="w-4 mr-2"></div>
            <span>{location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Ticket Types */}
        <div className="mb-4">
          <div className="flex items-center text-xs text-slate-500 font-semibold mb-2">
            <Ticket size={14} className="mr-1.5" />
            <span>Ticket Options ({ticketTypes.length})</span>
          </div>
          <div className="space-y-2">
            {ticketTypes.slice(0, 2).map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between bg-purple-50 rounded-lg p-3 border border-purple-200"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{ticket.name}</p>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <Users size={12} className="mr-1" />
                    <span>{ticket.available} available</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-display text-purple-600">
                    ${ticket.price}
                  </p>
                  <p className="text-xs text-slate-500">per ticket</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capacity Alert */}
        {tickets_left < total_capacity * 0.2 && !is_sold_out && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-orange-900">Limited Availability!</p>
                <p className="text-xs text-orange-700">
                  Only {tickets_left} of {total_capacity} tickets left
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing & CTA */}
        <div className="pt-5 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Starting from</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-display gradient-text">
                  {price}
                </p>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {tickets_left} / {total_capacity} tickets left
              </p>
            </div>

            <button 
              onClick={handleView}
              disabled={is_sold_out}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all group ${
                is_sold_out
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
              }`}
            >
              <Ticket size={18} />
              <span>{is_sold_out ? 'Sold Out' : 'Get Tickets'}</span>
              {!is_sold_out && (
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventCard;