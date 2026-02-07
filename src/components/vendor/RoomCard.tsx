import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface RoomCardProps {
  id: number;
  type: string;
  total: number;
  available: number;
  pricePerNight: string;
  status: 'active' | 'maintenance';
   
  amenities?: string[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
  id,
  type,
  total,
  available,
  pricePerNight,
  status,
  
  amenities,
  onEdit,
  onDelete,
}) => {
  const occupancyRate = Math.round(((total - available) / total) * 100);

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-xl text-slate-900">{type}</h3>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{pricePerNight}</p>
          <p className="text-sm text-slate-500">per night</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Total Rooms:</span>
          <span className="font-semibold text-slate-900">{total}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Available:</span>
          <span className="font-semibold text-green-600">{available}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Occupied:</span>
          <span className="font-semibold text-amber-600">{total - available}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-600 mb-1">
          <span>Occupancy</span>
          <span>{occupancyRate}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-linear-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${occupancyRate}%` }}
          ></div>
        </div>
      </div>

      {amenities && (
        <div className="mb-4">
          <p className="text-xs text-slate-600 mb-2">Amenities:</p>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, idx) => (
              <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={() => onEdit(id)}
          className="flex-1 text-indigo-600 hover:bg-indigo-50 py-2 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
        >
          <Edit size={16} />
          Edit
        </button>
        <button
          onClick={() => onDelete(id)}
          className="flex-1 text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default RoomCard;