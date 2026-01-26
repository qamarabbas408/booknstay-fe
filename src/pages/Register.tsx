import React, { useState } from 'react';
import { ArrowLeft, Building2, Mail, Phone, MapPin, User, Lock, Upload, CheckCircle, AlertCircle, Globe, DollarSign, Image, FileText, Sparkles, ChevronRight } from 'lucide-react';

interface FormData {
  // Step 1: Business Information
  businessName: string;
  businessType: 'hotel' | 'resort' | 'event_venue' | 'other';
  email: string;
  phone: string;
  website: string;
  
  // Step 2: Location Details
  address: string;
  city: string;
  country: string;
  zipCode: string;
  
  // Step 3: Property Details
  description: string;
  rooms?: number;
  capacity?: number;
  priceRange: string;
  
  // Step 4: Account Setup
  ownerName: string;
  password: string;
  confirmPassword: string;
}

const RegisterNowPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: 'hotel',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    description: '',
    rooms: undefined,
    capacity: undefined,
    priceRange: '',
    ownerName: '',
    password: '',
    confirmPassword: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => f.name);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Registration successful! Welcome to BookNStay Partners.');
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes progress {
          from { width: 0; }
          to { width: var(--progress-width); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .input-focus {
          transition: all 0.3s ease;
        }
        
        .input-focus:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15);
        }
        
        .step-indicator {
          transition: all 0.4s ease;
        }
        
        .step-indicator.active {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
        }
        
        .step-indicator.completed {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }
        
        .progress-bar {
          animation: progress 0.6s ease-out forwards;
        }
      `}</style>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="glass border-b border-white/40 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-display gradient-text">BookNStay</div>
            <Sparkles className="text-indigo-500" size={20} />
          </div>
          
          <a href="/" className="flex items-center text-slate-700 hover:text-indigo-600 transition-colors group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Home</span>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-5 py-2 rounded-full mb-6 border border-indigo-100">
            <Building2 size={18} className="text-indigo-600" />
            <span className="text-indigo-600 text-sm font-semibold">Partner Registration</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-display text-slate-900 mb-4 leading-tight">
            Join Our <span className="gradient-text">Partner Network</span>
          </h1>
          
          <p className="text-xl text-slate-600 font-serif max-w-2xl mx-auto">
            List your property or venue and connect with thousands of travelers worldwide
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg step-indicator ${
                      step < currentStep ? 'completed' : step === currentStep ? 'active' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {step < currentStep ? <CheckCircle size={24} /> : step}
                  </div>
                  <span className={`text-xs mt-2 font-semibold ${
                    step <= currentStep ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                    {step === 1 && 'Business Info'}
                    {step === 2 && 'Location'}
                    {step === 3 && 'Details'}
                    {step === 4 && 'Account'}
                  </span>
                </div>
                {step < 4 && (
                  <div className="flex-1 h-1 bg-slate-200 mx-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r from-indigo-600 to-purple-600 progress-bar ${
                        step < currentStep ? 'w-full' : 'w-0'
                      }`}
                      style={{'--progress-width': step < currentStep ? '100%' : '0%'} as React.CSSProperties}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl border border-white/40 animate-slideInRight">
          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-3xl font-display text-slate-900 mb-2">Business Information</h2>
                  <p className="text-slate-600 font-serif">Tell us about your property or venue</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Business Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => updateFormData('businessName', e.target.value)}
                      placeholder="Grand Azure Resort"
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all input-focus text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Business Type *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'hotel', label: 'Hotel', icon: '🏨' },
                      { value: 'resort', label: 'Resort', icon: '🏝️' },
                      { value: 'event_venue', label: 'Event Venue', icon: '🎪' },
                      { value: 'other', label: 'Other', icon: '🏢' }
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateFormData('businessType', type.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.businessType === type.value
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="text-3xl mb-2">{type.icon}</div>
                        <div className="text-sm font-semibold text-slate-700">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        placeholder="contact@yourbusiness.com"
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all input-focus text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all input-focus text-slate-800"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Website (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => updateFormData('website', e.target.value)}
                      placeholder="https://www.yourbusiness.com"
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all input-focus text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location Details */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-3xl font-display text-slate-900 mb-2">Location Details</h2>
                  <p className="text-slate-600 font-serif">Where is your property located?</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Street Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                      placeholder="123 Main Street"
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all input-focus text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      placeholder="New York"
                      className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all input-focus text-slate-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => updateFormData('country', e.target.value)}
                      placeholder="United States"
                      className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all input-focus text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ZIP / Postal Code *
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => updateFormData('zipCode', e.target.value)}
                    placeholder="10001"
                    className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all input-focus text-slate-800"
                    required
                  />
                </div>

                {/* Map placeholder */}
                <div className="bg-slate-100 rounded-xl h-64 flex items-center justify-center border-2 border-dashed border-slate-300">
                  <div className="text-center">
                    <MapPin size={48} className="mx-auto mb-3 text-slate-400" />
                    <p className="text-slate-500 font-medium">Map preview will appear here</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Property Details */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-3xl font-display text-slate-900 mb-2">Property Details</h2>
                  <p className="text-slate-600 font-serif">Share more about your offerings</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    placeholder="Tell us about your property, amenities, and what makes it special..."
                    rows={5}
                    className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all text-slate-800 resize-none"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2">Minimum 50 characters</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {formData.businessType !== 'event_venue' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Number of Rooms *
                      </label>
                      <input
                        type="number"
                        value={formData.rooms || ''}
                        onChange={(e) => updateFormData('rooms', parseInt(e.target.value))}
                        placeholder="50"
                        min="1"
                        className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all input-focus text-slate-800"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {formData.businessType === 'event_venue' ? 'Event Capacity' : 'Guest Capacity'} *
                    </label>
                    <input
                      type="number"
                      value={formData.capacity || ''}
                      onChange={(e) => updateFormData('capacity', parseInt(e.target.value))}
                      placeholder="100"
                      min="1"
                      className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all input-focus text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Price Range *
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {['$', '$$', '$$$', '$$$$'].map((price) => (
                      <button
                        key={price}
                        type="button"
                        onClick={() => updateFormData('priceRange', price)}
                        className={`p-4 rounded-xl border-2 transition-all text-2xl font-bold ${
                          formData.priceRange === price
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-400'
                        }`}
                      >
                        {price}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">$ = Budget, $$ = Moderate, $$$ = Upscale, $$$$ = Luxury</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Upload Photos *
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer bg-slate-50 hover:bg-indigo-50/30">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload size={48} className="mx-auto mb-3 text-slate-400" />
                      <p className="text-slate-600 font-semibold mb-1">Click to upload images</p>
                      <p className="text-sm text-slate-500">PNG, JPG up to 10MB each</p>
                    </label>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-indigo-50 px-4 py-3 rounded-lg">
                          <div className="flex items-center">
                            <Image size={18} className="text-indigo-600 mr-3" />
                            <span className="text-sm text-slate-700 font-medium">{file}</span>
                          </div>
                          <CheckCircle size={18} className="text-green-600" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Account Setup */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-3xl font-display text-slate-900 mb-2">Account Setup</h2>
                  <p className="text-slate-600 font-serif">Create your partner account credentials</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Owner / Manager Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => updateFormData('ownerName', e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all input-focus text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all input-focus text-slate-800"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">At least 8 characters with numbers and symbols</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all input-focus text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Benefits Summary */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                    <Sparkles className="mr-2 text-indigo-600" size={20} />
                    What You'll Get
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Commission-free for the first 30 days</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Access to 50,000+ active travelers monthly</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Advanced booking management dashboard</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">24/7 dedicated partner support</span>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 focus:ring-2 mt-0.5"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed">
                    I agree to the{' '}
                    <a href="#" className="text-indigo-600 hover:underline font-semibold">Terms of Service</a>
                    {', '}
                    <a href="#" className="text-indigo-600 hover:underline font-semibold">Privacy Policy</a>
                    {', and '}
                    <a href="#" className="text-indigo-600 hover:underline font-semibold">Partner Agreement</a>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-slate-200">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:shadow-indigo-500/40 flex items-center group"
                >
                  <span>Continue</span>
                  <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-pulse">Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} className="mr-2" />
                      <span>Complete Registration</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-slate-600">
            Need help?{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
              Contact our partner team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterNowPage;