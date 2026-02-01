import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info, Loader, X, Sparkles } from 'lucide-react';

// Custom Toast Component
export const CustomToaster: React.FC = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap');
        
        .toast-custom {
          font-family: 'Archivo', -apple-system, sans-serif;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .toast-enter {
          animation: slideIn 0.3s ease-out forwards;
        }
        
        .toast-exit {
          animation: slideOut 0.3s ease-out forwards;
        }
        
        .toast-spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
      
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName="toast-custom"
        containerStyle={{
          top: 80,
          right: 20,
        }}
        toastOptions={{
          // Default options
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            color: '#1e293b',
            padding: '16px',
            borderRadius: '16px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '420px',
          },
          // Success
          success: {
            duration: 4000,
            style: {
              background: 'rgba(236, 253, 245, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(167, 243, 208, 0.6)',
              boxShadow: '0 10px 40px rgba(16, 185, 129, 0.15)',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#ecfdf5',
            },
          },
          // Error
          error: {
            duration: 5000,
            style: {
              background: 'rgba(254, 242, 242, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(252, 165, 165, 0.6)',
              boxShadow: '0 10px 40px rgba(239, 68, 68, 0.15)',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fef2f2',
            },
          },
          // Loading
          loading: {
            duration: Infinity,
            style: {
              background: 'rgba(239, 246, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(191, 219, 254, 0.6)',
              boxShadow: '0 10px 40px rgba(99, 102, 241, 0.15)',
            },
            iconTheme: {
              primary: '#6366f1',
              secondary: '#eff6ff',
            },
          },
        }}
      />
    </>
  );
};

// Custom Toast Functions with Icons
export const showToast = {
  // Success Toast
  success: (message: string, options?: any) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'toast-enter' : 'toast-exit'
          } flex items-start space-x-3 bg-linear-to-r from-emerald-50 to-green-50 backdrop-blur-xl border border-emerald-200 rounded-2xl p-4 shadow-xl max-w-md`}
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-r from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={20} className="text-white" />
          </div>
          <div className="flex-1 pt-0.5">
            <h4 className="font-bold text-emerald-900 mb-0.5">Success!</h4>
            <p className="text-sm text-emerald-700 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-emerald-600 hover:text-emerald-800 transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>
      ),
      { duration: 4000, ...options }
    );
  },

  // Error Toast
  error: (message: string, options?: any) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'toast-enter' : 'toast-exit'
          } flex items-start space-x-3 bg-linear-to-r from-red-50 to-pink-50 backdrop-blur-xl border border-red-200 rounded-2xl p-4 shadow-xl max-w-md`}
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-r from-red-500 to-pink-600 flex items-center justify-center flex-shrink-0">
            <XCircle size={20} className="text-white" />
          </div>
          <div className="flex-1 pt-0.5">
            <h4 className="font-bold text-red-900 mb-0.5">Error</h4>
            <p className="text-sm text-red-700 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>
      ),
      { duration: 5000, ...options }
    );
  },

  // Warning Toast
  warning: (message: string, options?: any) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'toast-enter' : 'toast-exit'
          } flex items-start space-x-3 bg-linear-to-r from-amber-50 to-yellow-50 backdrop-blur-xl border border-amber-200 rounded-2xl p-4 shadow-xl max-w-md`}
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-r from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={20} className="text-white" />
          </div>
          <div className="flex-1 pt-0.5">
            <h4 className="font-bold text-amber-900 mb-0.5">Warning</h4>
            <p className="text-sm text-amber-700 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-amber-600 hover:text-amber-800 transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>
      ),
      { duration: 4000, ...options }
    );
  },

  // Info Toast
  info: (message: string, options?: any) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'toast-enter' : 'toast-exit'
          } flex items-start space-x-3 bg-linear-to-r from-blue-50 to-indigo-50 backdrop-blur-xl border border-blue-200 rounded-2xl p-4 shadow-xl max-w-md`}
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <Info size={20} className="text-white" />
          </div>
          <div className="flex-1 pt-0.5">
            <h4 className="font-bold text-blue-900 mb-0.5">Info</h4>
            <p className="text-sm text-blue-700 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>
      ),
      { duration: 4000, ...options }
    );
  },

  // Loading Toast
  loading: (message: string, options?: any) => {
    return toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'toast-enter' : 'toast-exit'
          } flex items-start space-x-3 bg-linear-to-r from-indigo-50 to-purple-50 backdrop-blur-xl border border-indigo-200 rounded-2xl p-4 shadow-xl max-w-md`}
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Loader size={20} className="text-white toast-spinner" />
          </div>
          <div className="flex-1 pt-0.5">
            <h4 className="font-bold text-indigo-900 mb-0.5">Loading...</h4>
            <p className="text-sm text-indigo-700 leading-relaxed">{message}</p>
          </div>
        </div>
      ),
      { duration: Infinity, ...options }
    );
  },

  // Special/Featured Toast (with sparkles)
  special: (message: string, title?: string, options?: any) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'toast-enter' : 'toast-exit'
          } flex items-start space-x-3 bg-linear-to-r from-purple-50 via-pink-50 to-orange-50 backdrop-blur-xl border-2 border-purple-300 rounded-2xl p-4 shadow-2xl max-w-md`}
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex-1 pt-0.5">
            <h4 className="font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600 mb-0.5">
              {title || 'Special Offer!'}
            </h4>
            <p className="text-sm text-purple-700 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-purple-600 hover:text-purple-800 transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>
      ),
      { duration: 6000, ...options }
    );
  },

  // Promise Toast (for async operations)
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: any
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        style: {
          minWidth: '250px',
        },
        success: {
          duration: 4000,
          icon: <CheckCircle size={20} className="text-emerald-600" />,
        },
        error: {
          duration: 5000,
          icon: <XCircle size={20} className="text-red-600" />,
        },
        loading: {
          icon: <Loader size={20} className="text-indigo-600 toast-spinner" />,
        },
        ...options,
      }
    );
  },
};

// Dismiss function
export const dismissToast = (toastId?: string) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

export default CustomToaster;