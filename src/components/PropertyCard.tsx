import React from 'react';
import { MapPin, Star, Edit, Trash2, BarChart3, Eye, AlertCircle, Users, Hotel } from 'lucide-react';

interface PropertyCardProps {
  id: number;
  name: string;
  location: string;
  image: string;
  stars: number;
  pricePerNight: number;
  status: 'active' | 'pending' | 'inactive';
  bookings: number;
  revenue: number;
  rating: number;
  reviews: number;
  createdAt: string;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onAnalytics?: (id: number) => void;
  onDelete?: (id: number) => void;
  onRoomManagement?: (id: number) => void;
  animationDelay?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  name,
  location,
  image,
  stars,
  pricePerNight,
  status,
  bookings,
  revenue,
  rating,
  reviews,
  createdAt,
  onView,
  onEdit,
  onAnalytics,
  onDelete,
  onRoomManagement,
  animationDelay = '0s',
}) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-300',
      pending: 'bg-amber-100 text-amber-700 border-amber-300',
      inactive: 'bg-slate-100 text-slate-700 border-slate-300',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div
      className="glass rounded-3xl overflow-hidden shadow-lg hover:shadow-xl card-hover border border-white/40 animate-fadeInUp"
      style={{ animationDelay }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-64 h-64 md:h-auto relative overflow-hidden flex-shrink-0 group">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div className={`absolute top-4 left-4 px-4 py-2 rounded-xl border-2 text-xs font-bold backdrop-blur-sm ${getStatusBadge(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>

          {status === 'pending' && (
            <div className="absolute bottom-4 left-4 bg-amber-500/95 backdrop-blur-sm text-white px-4 py-2 rounded-xl flex items-center text-xs font-bold shadow-lg">
              <AlertCircle size={14} className="mr-2" />
              Awaiting Approval
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8 flex flex-col">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-5">
            <div className="flex-1 mb-4 lg:mb-0">
              <h3 className="text-2xl font-display text-slate-900 mb-2">{name}</h3>
              <div className="flex items-center text-slate-600 text-sm mb-4">
                <MapPin size={16} className="mr-2 text-slate-400" />
                <span className="font-medium">{location}</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < stars ? '#f59e0b' : 'none'}
                      className={i < stars ? 'text-amber-500' : 'text-slate-300'}
                    />
                  ))}
                </div>
                {bookings > 0 && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center text-slate-600">
                      <Users size={14} className="mr-1.5" />
                      <span className="font-semibold">{reviews} reviews</span>
                    </div>
                    <div className="bg-amber-50 px-3 py-1 rounded-lg">
                      <span className="font-bold text-amber-700">{rating}/5</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-left lg:text-right">
              <p className="text-4xl font-display gradient-text mb-1">${pricePerNight}</p>
              <p className="text-sm text-slate-500 font-semibold">per night</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6 py-6 border-t-2 border-b-2 border-slate-200 mb-6">
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-2">BOOKINGS</p>
              <p className="text-3xl font-display text-indigo-600">{bookings}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-2">REVENUE</p>
              <p className="text-3xl font-display text-green-600">${(revenue / 1000).toFixed(1)}k</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-2">ADDED</p>
              <p className="text-lg font-bold text-slate-700">
                {new Date(createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-auto">
            <button
              onClick={() => onView?.(id)}
              className="flex items-center gap-2 px-5 py-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all font-bold text-sm"
              aria-label={`View ${name}`}
            >
              <Eye size={18} />
              View
            </button>
            <button
              onClick={() => onEdit?.(id)}
              className="flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all font-bold text-sm"
              aria-label={`Edit ${name}`}
            >
              <Edit size={18} />
              Edit
            </button>
            {/* <button
              onClick={() => onAnalytics?.(id)}
              className="flex items-center gap-2 px-5 py-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-all font-bold text-sm"
              aria-label={`View analytics for ${name}`}
            >
              <BarChart3 size={18} />
              Analytics
            </button> */}
            <button
              onClick={() => onRoomManagement?.(id)}
              className="flex items-center gap-2 px-5 py-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-red-100 transition-all font-bold text-sm ml-auto"
              aria-label={`Delete ${name}`}
            >
              <Hotel size={18} />
              Add a Room
            </button>

            <button
              onClick={() => onDelete?.(id)}
              className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-bold text-sm ml-auto"
              aria-label={`Delete ${name}`}
            >
              <Trash2 size={18} />
              Delete
            </button>

            {/* <Hotel size={20} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
