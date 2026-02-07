import React from 'react';
import { Calendar, Ticket, Edit, Trash2 } from 'lucide-react';

interface EventCardProps {
  id: number;
  title: string;
  startDate: string;
  status: 'active' | 'draft' | 'inactive'|any;
  category: string;
  ticketsSold: number;
  revenue: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  startDate,
  status,
  category,
  ticketsSold,
  revenue,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-xl text-slate-900 mb-1 line-clamp-1" title={title}>
            {title}
          </h3>
          <div className="flex items-center text-slate-500 text-sm">
            <Calendar size={14} className="mr-1" />
            {new Date(startDate).toLocaleDateString()}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
          status === 'active' ? 'bg-green-100 text-green-700' :
          status === 'draft' ? 'bg-amber-100 text-amber-700' :
          'bg-slate-100 text-slate-700'
        }`}>
          {status}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-slate-600 text-sm">
          <Ticket size={16} className="mr-2 text-indigo-600" />
          {category}
        </div>
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
          <div>
            <p className="text-xs text-slate-500">Tickets Sold</p>
            <p className="font-bold text-slate-900">{ticketsSold}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Revenue</p>
            <p className="font-bold text-indigo-600">${revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

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

export default EventCard;