import React from 'react';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  id: number;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
  responded: boolean;
  onReply?: (id: number) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  guestName,
  rating,
  comment,
  date,
  responded,
  onReply,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-amber-50 px-3 py-1 rounded-lg">
            <Star size={16} fill="#f59e0b" className="text-amber-500 mr-1" />
            <span className="font-bold text-amber-700">{rating}</span>
          </div>
          {responded && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
              Responded
            </span>
          )}
        </div>
        <span className="text-sm text-slate-500">{date}</span>
      </div>
      <p className="text-slate-700 mb-4 leading-relaxed">{comment}</p>
      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
        <p className="text-sm font-medium text-slate-900">- {guestName}</p>
        {!responded && (
          <button
            onClick={() => onReply?.(id)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
          >
            Reply
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;