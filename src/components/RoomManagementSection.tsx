import React from 'react';
import { Building2, X, AlertCircle } from 'lucide-react';
import RoomCard from './vendor/RoomCard';
import SectionHeader from './vendor/SectionHeader';
import { type Hotel } from './HotelSelectionModal';

interface RoomType {
  id: number;
  type: string;
  total: number;
  available: number;
  pricePerNight: string;
  status: 'active' | 'maintenance' | 'inactive';
  amenities: string[];
}

interface RoomManagementSectionProps {
  selectedHotel: Hotel | null;
  rooms: RoomType[];
  onChangeHotel: () => void;
  onEditRoom: (roomId: number) => void;
  onDeleteRoom: (roomId: number) => void;
}

const RoomManagementSection: React.FC<RoomManagementSectionProps> = ({
  selectedHotel,
  rooms,
  onChangeHotel,
  onEditRoom,
  onDeleteRoom,
}) => {
  return (
    <div className="animate-fadeIn">
      {!selectedHotel ? (
        <SectionHeader
          icon={<Building2 size={24} className="text-white" />}
          title="Room Management"
          description="Manage your rooms, bookings, and listings"
          buttonText="Select a Hotel Now"
          onButtonClick={onChangeHotel}
          gradientFrom="to-purple-600"
          gradientTo="from-pink-600"
        />
      ) : (
        <>
          {/* Selected Hotel Header */}
          <div className="mb-8 bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={selectedHotel.image}
                    alt={selectedHotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedHotel.name}</h2>
                  <p className="text-white/80 text-sm mt-1">{selectedHotel.location}</p>
                </div>
              </div>
              <button
                onClick={onChangeHotel}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium backdrop-blur-sm"
              >
                <X size={16} />
                Change Hotel
              </button>
            </div>
          </div>

          {/* Room Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
              <p className="text-slate-600 text-sm mb-2">Total Rooms</p>
              <p className="text-3xl font-bold text-slate-900">
                {rooms.reduce((sum, room) => sum + room.total, 0)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
              <p className="text-slate-600 text-sm mb-2">Available Rooms</p>
              <p className="text-3xl font-bold text-green-600">
                {rooms.reduce((sum, room) => sum + room.available, 0)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
              <p className="text-slate-600 text-sm mb-2">Room Types</p>
              <p className="text-3xl font-bold text-indigo-600">{rooms.length}</p>
            </div>
          </div>

          {/* Room Types Grid */}
          {rooms.length > 0 ? (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Room Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    id={room.id}
                    type={room.type}
                    total={room.total}
                    available={room.available}
                    pricePerNight={room.pricePerNight}
                    status={room.status}
                    onEdit={() => onEditRoom(room.id)}
                    onDelete={() => onDeleteRoom(room.id)}
                    amenities={room.amenities}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-lg">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle size={32} className="text-slate-400" />
                </div>
                <p className="text-slate-700 font-medium mb-2">No room types found</p>
                <p className="text-slate-500 text-sm">
                  This hotel doesn't have any room types yet. Add room types to get started.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RoomManagementSection;
