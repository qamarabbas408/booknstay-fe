import React, { useState } from 'react';
import { CreditCard, Smartphone, Wallet, Shield, Lock, ChevronRight, Check, AlertCircle } from 'lucide-react';

const PaymentMethodsPage = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const paymentMethods = [
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      icon: '💳',
      description: 'Pay via EasyPaisa wallet',
      color: 'from-green-500 to-emerald-600',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Easypaisa_Logo.svg/1200px-Easypaisa_Logo.svg.png'
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      icon: '📱',
      description: 'Pay via JazzCash mobile wallet',
      color: 'from-red-500 to-pink-600',
      logo: 'https://www.jazzcash.com.pk/assets/themes/jazzcash/img/logo.png'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, American Express',
      color: 'from-blue-500 to-indigo-600',
      logo: null
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: '🏦',
      description: 'Direct bank account transfer',
      color: 'from-purple-500 to-violet-600',
      logo: null
    }
  ];

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
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

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .card-3d {
          perspective: 1000px;
        }

        .card-inner {
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .payment-option {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .payment-option:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-3xl font-display bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            BookNStay
          </div>
          <div className="flex items-center space-x-2 text-slate-600">
            <Lock size={16} />
            <span className="text-sm font-semibold">Secure Payment</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-slideUp">
          <div className="inline-flex items-center space-x-2 bg-indigo-100 px-4 py-2 rounded-full mb-4">
            <Shield size={16} className="text-indigo-600" />
            <span className="text-indigo-700 text-sm font-semibold">256-bit SSL Encrypted</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display text-slate-900 mb-3">Select Payment Method</h1>
          <p className="text-slate-600 text-lg font-serif">Choose your preferred way to pay securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideUp" style={{animationDelay: '0.1s'}}>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`payment-option cursor-pointer rounded-2xl p-6 border-2 transition-all ${
                    selectedMethod === method.id
                      ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                      : 'border-slate-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {method.icon}
                    </div>
                    {selectedMethod === method.id && (
                      <div className="bg-indigo-600 rounded-full p-1">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{method.name}</h3>
                  <p className="text-sm text-slate-600">{method.description}</p>
                </div>
              ))}
            </div>

            {/* Payment Form */}
            {selectedMethod && (
              <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-lg animate-fadeIn">
                {/* EasyPaisa Form */}
                {selectedMethod === 'easypaisa' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-xl">
                        💳
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-slate-900">EasyPaisa Payment</h3>
                        <p className="text-sm text-slate-600">Enter your EasyPaisa mobile number</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="tel"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="03XX XXXXXXX"
                          className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl text-lg font-semibold transition-all"
                          maxLength={11}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">You will receive an OTP on this number</p>
                    </div>

                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-green-900 text-sm mb-1">How it works</h4>
                          <ul className="text-xs text-green-800 space-y-1">
                            <li>• Enter your registered EasyPaisa number</li>
                            <li>• You'll receive an OTP for verification</li>
                            <li>• Complete payment in the EasyPaisa app</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* JazzCash Form */}
                {selectedMethod === 'jazzcash' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-xl">
                        📱
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-slate-900">JazzCash Payment</h3>
                        <p className="text-sm text-slate-600">Enter your JazzCash mobile number</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="tel"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="03XX XXXXXXX"
                          className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl text-lg font-semibold transition-all"
                          maxLength={11}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">You will receive a payment request</p>
                    </div>

                    <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle size={20} className="text-pink-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-pink-900 text-sm mb-1">How it works</h4>
                          <ul className="text-xs text-pink-800 space-y-1">
                            <li>• Enter your Jazz mobile number</li>
                            <li>• Accept the payment request on your phone</li>
                            <li>• Enter your JazzCash PIN to complete</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Payment Form */}
                {selectedMethod === 'card' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl">
                        💳
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-slate-900">Card Payment</h3>
                        <p className="text-sm text-slate-600">Enter your card details</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value.replace(/\s/g, ''));
                            if (formatted.replace(/\s/g, '').length <= 16) {
                              setCardNumber(formatted);
                            }
                          }}
                          placeholder="1234 5678 9012 3456"
                          className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl text-lg font-semibold tracking-wider transition-all"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-1">
                          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='20' viewBox='0 0 32 20'%3E%3Crect fill='%231434CB' width='32' height='20' rx='3'/%3E%3Ccircle fill='%23EB001B' cx='12' cy='10' r='6'/%3E%3Ccircle fill='%23FF5F00' cx='20' cy='10' r='6'/%3E%3C/svg%3E" alt="Mastercard" className="h-5" />
                          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='20' viewBox='0 0 32 20'%3E%3Crect fill='%231A1F71' width='32' height='20' rx='3'/%3E%3Cpath fill='%23F7B600' d='M13 5h6l-3 10h-6z'/%3E%3C/svg%3E" alt="Visa" className="h-5" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="JOHN DOE"
                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl font-semibold uppercase transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => {
                            const formatted = formatExpiryDate(e.target.value);
                            if (formatted.length <= 5) {
                              setExpiryDate(formatted);
                            }
                          }}
                          placeholder="MM/YY"
                          className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl text-lg font-semibold transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => {
                            if (e.target.value.length <= 3 && /^\d*$/.test(e.target.value)) {
                              setCvv(e.target.value);
                            }
                          }}
                          placeholder="123"
                          className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl text-lg font-semibold transition-all"
                          maxLength={3}
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <Shield size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 text-sm mb-1">Your card is safe</h4>
                          <p className="text-xs text-blue-800">We use 256-bit SSL encryption to protect your card details. Your information is never stored.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Form */}
                {selectedMethod === 'bank' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-xl">
                        🏦
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-slate-900">Bank Transfer</h3>
                        <p className="text-sm text-slate-600">Transfer to our bank account</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 rounded-2xl p-6">
                      <h4 className="font-bold text-purple-900 mb-4">Transfer Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-purple-200">
                          <span className="text-sm text-purple-700 font-semibold">Bank Name:</span>
                          <span className="font-bold text-purple-900">Meezan Bank</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-purple-200">
                          <span className="text-sm text-purple-700 font-semibold">Account Title:</span>
                          <span className="font-bold text-purple-900">BookNStay Ltd.</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-purple-200">
                          <span className="text-sm text-purple-700 font-semibold">Account Number:</span>
                          <span className="font-bold text-purple-900">0123-4567-8901-2345</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-purple-700 font-semibold">IBAN:</span>
                          <span className="font-bold text-purple-900">PK36 MEZN 0001 2345 6789 0123</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-amber-900 text-sm mb-1">Important</h4>
                          <ul className="text-xs text-amber-800 space-y-1">
                            <li>• Transfer the exact amount shown in order summary</li>
                            <li>• Use booking reference in transaction notes</li>
                            <li>• Upload transfer receipt after completion</li>
                            <li>• Processing may take 1-2 business days</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl p-8 shadow-xl border-2 border-slate-200 animate-slideUp" style={{animationDelay: '0.2s'}}>
              <h3 className="text-xl font-display text-slate-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Summer Music Festival</span>
                  <span className="font-semibold">$85.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Service Fee</span>
                  <span className="font-semibold">$8.50</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Processing Fee</span>
                  <span className="font-semibold">$2.50</span>
                </div>
                <div className="border-t-2 border-slate-200 pt-4 flex justify-between text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">$96.00</span>
                </div>
              </div>

              <button
                disabled={!selectedMethod}
                className={`w-full py-4 rounded-xl font-bold transition-all mb-4 ${
                  selectedMethod
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {selectedMethod ? 'Complete Payment' : 'Select Payment Method'}
              </button>

              <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
                <Lock size={12} />
                <span>Secured by 256-bit SSL encryption</span>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="font-semibold text-slate-900 text-sm mb-3">We Accept</h4>
                <div className="flex flex-wrap gap-2">
                  {['💳 Cards', '📱 Mobile', '🏦 Banks'].map((method) => (
                    <div key={method} className="bg-slate-100 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600">
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;