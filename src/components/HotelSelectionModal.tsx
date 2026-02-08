import React, { useState } from 'react';
import { X, MapPin, Star, CheckCircle } from 'lucide-react';

export interface HotelType {
  id: number;
  name: string;
  location: string;
  rating: number;
  image: string;
  roomCount: number;
}

interface HotelTypeSelectionModalProps {
  isOpen: boolean;
  hotels: HotelType[];
  onClose: () => void;
  onSelect: (hotel: HotelType) => void;
  isLoading?: boolean;
}

const HotelTypeSelectionModal: React.FC<HotelTypeSelectionModalProps> = ({
  isOpen,
  hotels,
  onClose,
  onSelect,
  isLoading = false,
}) => {
  const [selectedHotelType, setSelectedHotelType] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSelect = () => {
    if (selectedHotelType !== null) {
      const hotel = hotels.find(h => h.id === selectedHotelType);
      if (hotel) {
        onSelect(hotel);
        setSelectedHotelType(null);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Select a HotelType</h3>
            <p className="text-sm text-slate-500 mt-1">Choose which hotel's rooms you want to manage</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* HotelTypes List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin">
                <div className="w-8 h-8 border-4 border-slate-300 border-t-indigo-600 rounded-full"></div>
              </div>
            </div>
          ) : hotels.length === 0 ? (
            <div className="flex items-center justify-center py-12 px-6">
              <div className="text-center">
                <p className="text-slate-500 font-medium mb-2">No hotels found</p>
                <p className="text-sm text-slate-400">Create your first hotel to manage rooms</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  onClick={() => setSelectedHotelType(hotel.id)}
                  className={`p-6 cursor-pointer transition-all hover:bg-slate-50 ${
                    selectedHotelType === hotel.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">{hotel.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                            <MapPin size={14} />
                            <span>{hotel.location}</span>
                          </div>
                        </div>
                        {selectedHotelType === hotel.id && (
                          <CheckCircle size={24} className="text-indigo-600 flex-shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                          <Star size={14} fill="#f59e0b" className="text-amber-500 mr-1" />
                          <span className="text-sm font-medium text-amber-700">{hotel.rating}</span>
                        </div>
                        <span className="text-sm text-slate-600">
                          <span className="font-semibold">{hotel.roomCount}</span> room types
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            disabled={selectedHotelType === null}
            className="flex-1 px-4 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select HotelType
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelTypeSelectionModal;
