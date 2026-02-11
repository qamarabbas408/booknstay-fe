import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { AppImages } from '../utils/AppImages';

interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  image: string;
}

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoomId: number | null;
  onSelectRoom: (roomId: number) => void;
  selectedRoomCount?: number;
  onRoomCountChange?: (count: number) => void;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({ rooms, selectedRoomId, onSelectRoom, selectedRoomCount = 1, onRoomCountChange }) => {

  console.log("Room ====",rooms)
  return (
    <div>
      <h2 className="text-2xl font-display text-slate-900 mb-6">Choose Your Room</h2>
      <div className="space-y-4">
        {rooms.map((room) => (
          <div 
            key={room.id}
            className={`flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden border-2 transition-all ${
              selectedRoomId === room.id 
                ? 'border-indigo-600 shadow-lg ring-2 ring-indigo-100' 
                : 'border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="md:w-1/3 h-48 md:h-auto relative">
              <img src={AppImages.placeholders.room_placeholder} alt={room.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{room.name}</h3>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-indigo-600">${room.price}</span>
                    <span className="text-sm text-slate-500">/night</span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-4">{room.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.features.map((feature, idx) => (
                    <span key={idx} className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              {selectedRoomId === room.id ? (
                <div className="flex items-center justify-between bg-indigo-50 rounded-xl p-2 border border-indigo-100">
                  <span className="text-indigo-900 font-bold px-3 text-sm">Selected</span>
                  <div className="flex items-center bg-white rounded-lg border border-indigo-200 shadow-sm">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onRoomCountChange && selectedRoomCount > 1) onRoomCountChange(selectedRoomCount - 1);
                      }}
                      className="p-2 hover:bg-indigo-50 text-indigo-600 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={selectedRoomCount <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-indigo-900">{selectedRoomCount}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onRoomCountChange) onRoomCountChange(selectedRoomCount + 1);
                      }}
                      className="p-2 hover:bg-indigo-50 text-indigo-600 transition-colors rounded-r-lg"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onSelectRoom(room.id);
                    if (onRoomCountChange) onRoomCountChange(1);
                  }}
                  className="w-full py-3 rounded-xl font-bold transition-all bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                >
                  Select Room
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomSelector;
