import React, { useState } from 'react';
import { Wifi, Waves, Coffee, Car, Sparkles, Dumbbell, Check, X } from 'lucide-react';

interface Amenity {
  id: number;
  name: string;
  slug: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

interface AmenitiesMultiSelectorProps {
  amenities: Amenity[];
  selectedAmenities?: number[];
  onChange?: (selectedIds: number[]) => void;
  label?: string;
  required?: boolean;
  maxSelections?: number;
  showSelectedCount?: boolean;
}

const AmenitiesMultiSelector: React.FC<AmenitiesMultiSelectorProps> = ({
  amenities,
  selectedAmenities = [],
  onChange,
  label = 'Select Amenities',
  required = false,
  maxSelections,
  showSelectedCount = true,
}) => {
  const [selected, setSelected] = useState<number[]>(selectedAmenities);

  // Icon mapping
  const iconMap: Record<string, any> = {
    Wifi: Wifi,
    Waves: Waves,
    Coffee: Coffee,
    Car: Car,
    Sparkles: Sparkles,
    Dumbbell: Dumbbell,
  };

  const toggleAmenity = (amenityId: number) => {
    let newSelected: number[];
    
    if (selected.includes(amenityId)) {
      // Remove from selection
      newSelected = selected.filter(id => id !== amenityId);
    } else {
      // Add to selection (check max limit)
      if (maxSelections && selected.length >= maxSelections) {
        alert(`You can only select up to ${maxSelections} amenities`);
        return;
      }
      newSelected = [...selected, amenityId];
    }
    
    setSelected(newSelected);
    onChange?.(newSelected);
  };

  const selectAll = () => {
    const allIds = amenities.map(a => a.id);
    setSelected(allIds);
    onChange?.(allIds);
  };

  const clearAll = () => {
    setSelected([]);
    onChange?.([]);
  };

  return (
    <div>
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
        
        @keyframes checkIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .animate-checkIn {
          animation: checkIn 0.3s ease-out;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className="flex items-center space-x-2">
          {showSelectedCount && (
            <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
              {selected.length} selected
            </div>
          )}
          
          {selected.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
            >
              Clear All
            </button>
          )}
          
          {selected.length < amenities.length && (
            <button
              type="button"
              onClick={selectAll}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Select All
            </button>
          )}
        </div>
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {amenities.map((amenity) => {
          const Icon = iconMap[amenity.icon] || Wifi;
          const isSelected = selected.includes(amenity.id);
          
          return (
            <button
              key={amenity.id}
              type="button"
              onClick={() => toggleAmenity(amenity.id)}
              className={`relative p-4 rounded-xl border-2 transition-all text-center group ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
              }`}
            >
              {/* Checkmark Badge */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center animate-checkIn shadow-lg">
                  <Check size={14} className="text-white" strokeWidth={3} />
                </div>
              )}

              {/* Icon */}
              <div className={`w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-indigo-200'
                  : 'bg-slate-100 group-hover:bg-indigo-100'
              }`}>
                <Icon 
                  size={24} 
                  className={`transition-colors ${
                    isSelected ? 'text-indigo-700' : 'text-slate-600 group-hover:text-indigo-600'
                  }`} 
                />
              </div>

              {/* Name */}
              <div className={`text-xs font-semibold ${
                isSelected ? 'text-indigo-900' : 'text-slate-700 group-hover:text-indigo-700'
              }`}>
                {amenity.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Max Selection Warning */}
      {maxSelections && (
        <p className="mt-2 text-xs text-slate-500">
          You can select up to {maxSelections} amenities
        </p>
      )}

      {/* Selected Amenities List (Optional) */}
      {selected.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">
            Selected Amenities ({selected.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selected.map((id) => {
              const amenity = amenities.find(a => a.id === id);
              if (!amenity) return null;
              
              const Icon = iconMap[amenity.icon] || Wifi;
              
              return (
                <div
                  key={id}
                  className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full group"
                >
                  <Icon size={14} />
                  <span className="text-sm font-semibold">{amenity.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleAmenity(id)}
                    className="ml-1 hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AmenitiesMultiSelector;