import React, { useState } from 'react';
import { ChevronLeft, Sparkles, DollarSign, Users, Package, FileText, Save, Eye, Plus, Trash2, AlertCircle, CheckCircle, Bed, Home } from 'lucide-react';

interface RoomTier {
  id: number;
  name: string;
  base_price: string;
  max_occupancy: string;
  total_inventory: string;
  description: string;
}

const CreateRoomTierPage = () => {
  const [roomTiers, setRoomTiers] = useState<RoomTier[]>([
    {
      id: 1,
      name: '',
      base_price: '',
      max_occupancy: '',
      total_inventory: '',
      description: ''
    }
  ]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPreview, setShowPreview] = useState(false);

  const addRoomTier = () => {
    const newId = roomTiers.length > 0 ? Math.max(...roomTiers.map(t => t.id)) + 1 : 1;
    setRoomTiers([...roomTiers, {
      id: newId,
      name: '',
      base_price: '',
      max_occupancy: '',
      total_inventory: '',
      description: ''
    }]);
  };

  const removeRoomTier = (id: number) => {
    if (roomTiers.length === 1) return;
    setRoomTiers(roomTiers.filter(t => t.id !== id));
  };

  const updateRoomTier = (id: number, field: keyof RoomTier, value: string) => {
    setRoomTiers(roomTiers.map(t =>
      t.id === id ? { ...t, [field]: value } : t
    ));
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${id}-${field}`];
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    roomTiers.forEach(tier => {
      // Name validation
      if (!tier.name.trim()) {
        newErrors[`${tier.id}-name`] = 'Room name is required';
      } else if (tier.name.length > 255) {
        newErrors[`${tier.id}-name`] = 'Name must not exceed 255 characters';
      }

      // Base price validation
      if (!tier.base_price) {
        newErrors[`${tier.id}-base_price`] = 'Base price is required';
      } else if (isNaN(Number(tier.base_price))) {
        newErrors[`${tier.id}-base_price`] = 'Price must be a number';
      } else if (Number(tier.base_price) < 0) {
        newErrors[`${tier.id}-base_price`] = 'Price must be 0 or greater';
      }

      // Max occupancy validation
      if (!tier.max_occupancy) {
        newErrors[`${tier.id}-max_occupancy`] = 'Max occupancy is required';
      } else if (!Number.isInteger(Number(tier.max_occupancy))) {
        newErrors[`${tier.id}-max_occupancy`] = 'Occupancy must be a whole number';
      } else if (Number(tier.max_occupancy) < 1) {
        newErrors[`${tier.id}-max_occupancy`] = 'Occupancy must be at least 1';
      }

      // Total inventory validation
      if (!tier.total_inventory) {
        newErrors[`${tier.id}-total_inventory`] = 'Total inventory is required';
      } else if (!Number.isInteger(Number(tier.total_inventory))) {
        newErrors[`${tier.id}-total_inventory`] = 'Inventory must be a whole number';
      } else if (Number(tier.total_inventory) < 1) {
        newErrors[`${tier.id}-total_inventory`] = 'Inventory must be at least 1';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form is valid, submitting:', roomTiers);
      // Handle form submission
      alert('Room tiers created successfully!');
    } else {
      alert('Please fix the errors before submitting');
    }
  };

  const getTotalRooms = () => {
    return roomTiers.reduce((sum, tier) => sum + (Number(tier.total_inventory) || 0), 0);
  };

  const getTotalValue = () => {
    return roomTiers.reduce((sum, tier) => 
      sum + ((Number(tier.base_price) || 0) * (Number(tier.total_inventory) || 0)), 0
    );
  };

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

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .input-error {
          border-color: #ef4444 !important;
        }

        .input-error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
      `}</style>

      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button className="flex items-center text-slate-700 font-semibold hover:text-purple-600 transition-colors">
            <ChevronLeft size={20} className="mr-1" />
            Back to Properties
          </button>
          
          <div className="text-2xl font-display bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            BookNStay
          </div>
          
          <div className="flex items-center space-x-2">
            <Sparkles className="text-purple-500" size={18} />
            <span className="text-slate-700 font-semibold text-sm">Vendor Portal</span>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-white/30">
            <Bed size={16} className="text-white" />
            <span className="text-white text-sm font-semibold">Room Management</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display text-white mb-3 leading-tight">
            Create Room Tiers
          </h1>
          
          <p className="text-xl text-white/90 font-serif max-w-2xl">
            Define different room categories with pricing and availability
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {roomTiers.map((tier, index) => (
              <div
                key={tier.id}
                className="glass rounded-3xl overflow-hidden shadow-lg border border-white/40 animate-slideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <Home size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display text-white">
                        Room Tier #{index + 1}
                      </h2>
                      <p className="text-white/80 text-sm">Configure room details</p>
                    </div>
                  </div>
                  
                  {roomTiers.length > 1 && (
                    <button
                      onClick={() => removeRoomTier(tier.id)}
                      className="p-2 bg-red-500/20 backdrop-blur-sm hover:bg-red-500/30 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} className="text-white" />
                    </button>
                  )}
                </div>

                <div className="p-8 space-y-6">
                  {/* Room Name */}
                  <div>
                    <label className="flex items-center text-slate-700 font-semibold mb-2">
                      <Bed size={16} className="mr-2 text-purple-600" />
                      Room Name *
                    </label>
                    <input
                      type="text"
                      value={tier.name}
                      onChange={(e) => updateRoomTier(tier.id, 'name', e.target.value)}
                      placeholder="e.g., Deluxe Ocean View Suite"
                      maxLength={255}
                      className={`w-full p-4 rounded-xl border-2 transition-all bg-white ${
                        errors[`${tier.id}-name`] ? 'input-error' : 'border-slate-200'
                      }`}
                    />
                    {errors[`${tier.id}-name`] && (
                      <div className="flex items-center mt-2 text-red-600 text-sm">
                        <AlertCircle size={14} className="mr-1" />
                        <span>{errors[`${tier.id}-name`]}</span>
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {tier.name.length}/255 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Base Price */}
                    <div>
                      <label className="flex items-center text-slate-700 font-semibold mb-2">
                        <DollarSign size={16} className="mr-2 text-purple-600" />
                        Base Price (USD) *
                      </label>
                      <input
                        type="number"
                        value={tier.base_price}
                        onChange={(e) => updateRoomTier(tier.id, 'base_price', e.target.value)}
                        placeholder="150.00"
                        min="0"
                        step="0.01"
                        className={`w-full p-4 rounded-xl border-2 transition-all bg-white ${
                          errors[`${tier.id}-base_price`] ? 'input-error' : 'border-slate-200'
                        }`}
                      />
                      {errors[`${tier.id}-base_price`] && (
                        <div className="flex items-center mt-2 text-red-600 text-sm">
                          <AlertCircle size={14} className="mr-1" />
                          <span>{errors[`${tier.id}-base_price`]}</span>
                        </div>
                      )}
                      <p className="text-xs text-slate-500 mt-1">Per night rate</p>
                    </div>

                    {/* Max Occupancy */}
                    <div>
                      <label className="flex items-center text-slate-700 font-semibold mb-2">
                        <Users size={16} className="mr-2 text-purple-600" />
                        Max Occupancy *
                      </label>
                      <input
                        type="number"
                        value={tier.max_occupancy}
                        onChange={(e) => updateRoomTier(tier.id, 'max_occupancy', e.target.value)}
                        placeholder="2"
                        min="1"
                        step="1"
                        className={`w-full p-4 rounded-xl border-2 transition-all bg-white ${
                          errors[`${tier.id}-max_occupancy`] ? 'input-error' : 'border-slate-200'
                        }`}
                      />
                      {errors[`${tier.id}-max_occupancy`] && (
                        <div className="flex items-center mt-2 text-red-600 text-sm">
                          <AlertCircle size={14} className="mr-1" />
                          <span>{errors[`${tier.id}-max_occupancy`]}</span>
                        </div>
                      )}
                      <p className="text-xs text-slate-500 mt-1">Number of guests</p>
                    </div>
                  </div>

                  {/* Total Inventory */}
                  <div>
                    <label className="flex items-center text-slate-700 font-semibold mb-2">
                      <Package size={16} className="mr-2 text-purple-600" />
                      Total Inventory *
                    </label>
                    <input
                      type="number"
                      value={tier.total_inventory}
                      onChange={(e) => updateRoomTier(tier.id, 'total_inventory', e.target.value)}
                      placeholder="10"
                      min="1"
                      step="1"
                      className={`w-full p-4 rounded-xl border-2 transition-all bg-white ${
                        errors[`${tier.id}-total_inventory`] ? 'input-error' : 'border-slate-200'
                      }`}
                    />
                    {errors[`${tier.id}-total_inventory`] && (
                      <div className="flex items-center mt-2 text-red-600 text-sm">
                        <AlertCircle size={14} className="mr-1" />
                        <span>{errors[`${tier.id}-total_inventory`]}</span>
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      Number of rooms available
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="flex items-center text-slate-700 font-semibold mb-2">
                      <FileText size={16} className="mr-2 text-purple-600" />
                      Description (Optional)
                    </label>
                    <textarea
                      value={tier.description}
                      onChange={(e) => updateRoomTier(tier.id, 'description', e.target.value)}
                      placeholder="Describe the room features, amenities, and unique offerings..."
                      rows={4}
                      className="w-full p-4 rounded-xl border-2 border-slate-200 transition-all bg-white resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {tier.description.length} characters
                    </p>
                  </div>

                  {/* Tier Summary */}
                  {tier.name && tier.base_price && tier.max_occupancy && tier.total_inventory && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <CheckCircle size={20} className="text-purple-600" />
                        <h4 className="font-bold text-purple-900">Tier Summary</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-purple-600 font-semibold mb-1">Revenue Potential</p>
                          <p className="text-2xl font-display text-purple-900">
                            ${(Number(tier.base_price) * Number(tier.total_inventory)).toLocaleString()}
                          </p>
                          <p className="text-xs text-purple-700">per night (full occupancy)</p>
                        </div>
                        <div>
                          <p className="text-purple-600 font-semibold mb-1">Total Capacity</p>
                          <p className="text-2xl font-display text-purple-900">
                            {Number(tier.max_occupancy) * Number(tier.total_inventory)} guests
                          </p>
                          <p className="text-xs text-purple-700">maximum capacity</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add Room Tier Button */}
            <button
              onClick={addRoomTier}
              className="w-full glass rounded-2xl p-8 border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50/50 transition-all group"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus size={32} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-900">Add Another Room Tier</p>
                  <p className="text-sm text-slate-600">Create different room categories</p>
                </div>
              </div>
            </button>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Overall Summary */}
              <div className="glass rounded-2xl p-6 shadow-lg border border-white/40">
                <h3 className="text-xl font-display text-slate-900 mb-6 flex items-center">
                  <Eye size={20} className="mr-2 text-purple-600" />
                  Overall Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                    <p className="text-sm text-purple-700 font-semibold mb-1">Total Room Tiers</p>
                    <p className="text-3xl font-display text-purple-900">{roomTiers.length}</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
                    <p className="text-sm text-blue-700 font-semibold mb-1">Total Rooms</p>
                    <p className="text-3xl font-display text-blue-900">{getTotalRooms()}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                    <p className="text-sm text-green-700 font-semibold mb-1">Potential Revenue</p>
                    <p className="text-3xl font-display text-green-900">
                      ${getTotalValue().toLocaleString()}
                    </p>
                    <p className="text-xs text-green-700 mt-1">per night (full occupancy)</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="glass rounded-2xl p-6 shadow-lg border border-white/40 space-y-3">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center"
                >
                  <Save size={20} className="mr-2" />
                  Save Room Tiers
                </button>

                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full bg-white border-2 border-purple-300 text-purple-600 py-4 rounded-xl font-bold hover:bg-purple-50 transition-all flex items-center justify-center"
                >
                  <Eye size={20} className="mr-2" />
                  {showPreview ? 'Hide' : 'Preview'}
                </button>
              </div>

              {/* Validation Info */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm mb-2">Required Fields</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Room name (max 255 characters)</li>
                      <li>• Base price (must be ≥ 0)</li>
                      <li>• Max occupancy (must be ≥ 1)</li>
                      <li>• Total inventory (must be ≥ 1)</li>
                      <li>• Description is optional</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-slideUp">
            <div className="glass rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/40">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-display text-slate-900">Room Tiers Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <AlertCircle size={24} className="text-slate-600" />
                </button>
              </div>

              <div className="space-y-4">
                {roomTiers.map((tier, index) => (
                  <div key={tier.id} className="bg-white rounded-2xl p-6 border-2 border-slate-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {tier.name || `Room Tier #${index + 1}`}
                        </h3>
                        <p className="text-slate-600 text-sm mt-1">
                          {tier.description || 'No description provided'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-display bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ${tier.base_price || '0'}
                        </p>
                        <p className="text-xs text-slate-500">per night</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Max Occupancy</p>
                        <p className="font-bold text-slate-900">{tier.max_occupancy || '0'} guests</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Total Rooms</p>
                        <p className="font-bold text-slate-900">{tier.total_inventory || '0'} rooms</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Capacity</p>
                        <p className="font-bold text-slate-900">
                          {(Number(tier.max_occupancy) || 0) * (Number(tier.total_inventory) || 0)} guests
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRoomTierPage;