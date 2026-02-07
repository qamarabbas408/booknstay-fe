import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  title: string;
  message: string;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  isDangerous?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDangerous ? 'bg-red-100' : 'bg-blue-100'}`}>
            <AlertTriangle size={32} className={isDangerous ? 'text-red-600' : 'text-blue-600'} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;