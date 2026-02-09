import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Users, Package, DollarSign, Bed, Lock, Unlock, CheckCircle, AlertCircle } from 'lucide-react';
import SkeletonLoader from '../SkeletonLoader';

interface RoomTier {
  id: number;
  type: string;
  description: string;
  base_price: number;
  max_occupancy: number;
  total_inventory: number;
  status: 'active' | 'inactive';
  available: number;
  is_locked: boolean;
  active_bookings_count: number;
}

interface RoomTiersModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelName: string;
  roomTiers: RoomTier[];
  isLoading?: boolean;
  onAddTier: () => void;
  onEditTier: (tierId: number) => void;
  onDeleteTier: (tierId: number) => void;
}

const RoomTiersModal: React.FC<RoomTiersModalProps> = ({
  isOpen,
  onClose,
  hotelName,
  roomTiers,
  isLoading = false,
  onAddTier,
  onEditTier,
  onDeleteTier,
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleDelete = (tier: RoomTier) => {
    if (tier.active_bookings_count > 0) {
      alert(`Cannot delete "${tier.type}" as it has ${tier.active_bookings_count} active booking(s).`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${tier.type}"?`)) {
      setDeletingId(tier.id);
      onDeleteTier(tier.id);
      setTimeout(() => setDeletingId(null), 1000);
    }
  };

  const totalRooms = roomTiers.reduce((sum, tier) => sum + tier.total_inventory, 0);
  const availableRooms = roomTiers.reduce((sum, tier) => sum + tier.available, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Archivo', -apple-system, sans-serif;
        }
        
        .font-display {
          font-family: 'Archivo', sans-serif;
          font-weight: 800;
          letter-spacing: -0.03em;
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
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="glass rounded-3xl shadow-2xl border border-white/40 w-full max-w-3xl max-h-[85vh] flex flex-col pointer-events-auto animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-display text-slate-900 mb-1">
                Room Tiers
              </h2>
              <p className="text-sm text-slate-600">{hotelName}</p>
            </div>
            <div className='flex flex-row gap-4'>
              <button
                onClick={onAddTier}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-600 text-indigo-100 hover:bg-indigo-500 transition-colors"
                title="Add new room tier"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X size={24} className="text-slate-600" />
              </button>

            </div>

          </div>
          {/* Room Tiers List */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <SkeletonLoader key={i} />
                ))}
              </div>
            ) : roomTiers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bed size={40} className="text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Room Tiers Yet</h3>
                <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                  Create your first room tier to start accepting bookings for this property.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {roomTiers.map((tier, index) => {
                  const occupancyRate = tier.total_inventory > 0
                    ? ((tier.total_inventory - tier.available) / tier.total_inventory) * 100
                    : 0;

                  return (
                    <div
                      key={tier.id}
                      className={`bg-white rounded-2xl border-2 transition-all ${deletingId === tier.id
                        ? 'border-red-300 opacity-50'
                        : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
                        }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="p-5">

                        {/* Header Row */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-bold text-slate-900">
                                {tier.type}
                              </h3>

                              {/* Status Badge */}
                              <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${tier.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-700'
                                }`}>
                                {tier.status}
                              </div>

                              {/* Locked Badge */}
                              {tier.is_locked && (
                                <div className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center space-x-1">
                                  <Lock size={12} />
                                  <span>Locked</span>
                                </div>
                              )}
                            </div>

                            {tier.description && (
                              <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                                {tier.description}
                              </p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => onEditTier(tier.id)}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                              title="Edit tier"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(tier)}
                              disabled={tier.active_bookings_count > 0 || deletingId === tier.id}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title={tier.active_bookings_count > 0 ? 'Cannot delete - has active bookings' : 'Delete tier'}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          {/* Base Price */}
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                            <div className="flex items-center space-x-1.5 mb-1">
                              <DollarSign size={16} className="text-blue-600" />
                              <span className="text-xs font-semibold text-blue-900">Base Price</span>
                            </div>
                            <div className="text-xl font-display text-blue-700">
                              ${tier.base_price}
                            </div>
                            <div className="text-xs text-blue-600">per night</div>
                          </div>

                          {/* Max Occupancy */}
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
                            <div className="flex items-center space-x-1.5 mb-1">
                              <Users size={16} className="text-purple-600" />
                              <span className="text-xs font-semibold text-purple-900">Occupancy</span>
                            </div>
                            <div className="text-xl font-display text-purple-700">
                              {tier.max_occupancy}
                            </div>
                            <div className="text-xs text-purple-600">guests</div>
                          </div>

                          {/* Total Inventory */}
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                            <div className="flex items-center space-x-1.5 mb-1">
                              <Package size={16} className="text-green-600" />
                              <span className="text-xs font-semibold text-green-900">Inventory</span>
                            </div>
                            <div className="text-xl font-display text-green-700">
                              {tier.total_inventory}
                            </div>
                            <div className="text-xs text-green-600">rooms</div>
                          </div>

                          {/* Available */}
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100">
                            <div className="flex items-center space-x-1.5 mb-1">
                              <Bed size={16} className="text-amber-600" />
                              <span className="text-xs font-semibold text-amber-900">Available</span>
                            </div>
                            <div className="text-xl font-display text-amber-700">
                              {tier.available}
                            </div>
                            <div className="text-xs text-amber-600">rooms</div>
                          </div>
                        </div>

                        {/* Occupancy Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-700">
                              Occupancy Rate
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {occupancyRate.toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${occupancyRate >= 80
                                ? 'bg-red-500'
                                : occupancyRate >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-green-500'
                                }`}
                              style={{ width: `${occupancyRate}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Active Bookings Warning */}
                        {tier.active_bookings_count > 0 && (
                          <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
                            <span className="text-xs font-semibold text-amber-900">
                              {tier.active_bookings_count} active booking{tier.active_bookings_count !== 1 ? 's' : ''} - Cannot delete
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>


        </div>
      </div>
    </>
  );
};

export default RoomTiersModal;