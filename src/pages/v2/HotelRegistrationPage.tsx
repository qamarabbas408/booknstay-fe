import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Upload, X, MapPin, DollarSign, Image as ImageIcon, Star, Wifi, Coffee, Car, Utensils, Dumbbell, Wind, Tv, Lock, Phone, Globe, Calendar, Users, Bed, Home, Building2, Sparkles, Info, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const HotelRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form Data State
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    propertyName: '',
    propertyType: 'hotel', // hotel, resort, villa, apartment, guesthouse
    starRating: 0,
    description: '',
    
    // Step 2: Location
    country: '',
    city: '',
    address: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    
    // Step 3: Property Details
    totalRooms: '',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    amenities: [] as string[],
    
    // Step 4: Pricing
    basePrice: '',
    currency: 'USD',
    taxRate: '',
    serviceCharge: '',
    
    // Step 5: Images & Policies
    images: [] as File[],
    cancellationPolicy: 'flexible',
    houseRules: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  // Property Types
  const propertyTypes = [
    { value: 'hotel', label: 'Hotel', icon: '🏨' },
    { value: 'resort', label: 'Resort', icon: '🏖️' },
    { value: 'villa', label: 'Villa', icon: '🏡' },
    { value: 'apartment', label: 'Apartment', icon: '🏢' },
    { value: 'guesthouse', label: 'Guest House', icon: '🏠' },
  ];

  // Available Amenities
  const availableAmenities = [
    { id: 'wifi', label: 'Free WiFi', icon: Wifi },
    { id: 'parking', label: 'Free Parking', icon: Car },
    { id: 'restaurant', label: 'Restaurant', icon: Utensils },
    { id: 'gym', label: 'Fitness Center', icon: Dumbbell },
    { id: 'pool', label: 'Swimming Pool', icon: '🏊' },
    { id: 'spa', label: 'Spa & Wellness', icon: '💆' },
    { id: 'ac', label: 'Air Conditioning', icon: Wind },
    { id: 'tv', label: 'TV', icon: Tv },
    { id: 'breakfast', label: 'Breakfast Included', icon: Coffee },
    { id: 'room_service', label: '24/7 Room Service', icon: '🛎️' },
    { id: 'laundry', label: 'Laundry Service', icon: '🧺' },
    { id: 'safe', label: 'Safe Deposit Box', icon: Lock },
  ];

  // Cancellation Policies
  const cancellationPolicies = [
    { value: 'flexible', label: 'Flexible', description: 'Free cancellation up to 24 hours before check-in' },
    { value: 'moderate', label: 'Moderate', description: 'Free cancellation up to 5 days before check-in' },
    { value: 'strict', label: 'Strict', description: 'Free cancellation up to 30 days before check-in' },
    { value: 'non_refundable', label: 'Non-Refundable', description: 'No refunds after booking' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...formData.images, ...files].slice(0, 10); // Max 10 images
    
    setFormData(prev => ({ ...prev, images: newImages }));
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreview(prev => [...prev, ...newPreviews].slice(0, 10));
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    
    setFormData(prev => ({ ...prev, images: newImages }));
    setImagePreview(newPreviews);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.propertyName.trim()) newErrors.propertyName = 'Property name is required';
      if (formData.starRating === 0) newErrors.starRating = 'Please select a star rating';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    }

    if (step === 2) {
      if (!formData.country.trim()) newErrors.country = 'Country is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
    }

    if (step === 3) {
      if (!formData.totalRooms) newErrors.totalRooms = 'Number of rooms is required';
      if (formData.amenities.length === 0) newErrors.amenities = 'Select at least one amenity';
    }

    if (step === 4) {
      if (!formData.basePrice) newErrors.basePrice = 'Base price is required';
      if (!formData.taxRate) newErrors.taxRate = 'Tax rate is required';
    }

    if (step === 5) {
      if (formData.images.length === 0) newErrors.images = 'Upload at least one image';
      if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
      if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    // TODO: Submit to API
    console.log('Form Data:', formData);
    
    // Navigate to success page or dashboard
    navigate('/vendor/dashboard');
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: Home },
    { number: 2, title: 'Location', icon: MapPin },
    { number: 3, title: 'Details', icon: Bed },
    { number: 4, title: 'Pricing', icon: DollarSign },
    { number: 5, title: 'Images & Policies', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pb-12">
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
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <Link
          to="/vendor/dashboard"
          className="inline-flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Dashboard</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full mb-4 border border-indigo-200">
            <Building2 size={16} className="text-indigo-600" />
            <span className="text-indigo-700 text-sm font-semibold">Add New Property</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display text-slate-900 mb-3 leading-tight">
            Register Your Hotel
          </h1>
          <p className="text-lg text-slate-600 font-serif">
            Fill in the details to list your property on BookNStay
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          <div className="glass rounded-2xl p-6 border border-white/40 shadow-lg">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                          : isActive 
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                            : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                      </div>
                      <div className={`text-xs font-semibold hidden sm:block ${
                        isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-slate-500'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                        currentStep > step.number ? 'bg-green-500' : 'bg-slate-200'
                      }`}></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="glass rounded-3xl p-6 md:p-10 shadow-2xl border border-white/40 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-display text-slate-900 mb-6">Basic Information</h2>
              
              {/* Property Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Property Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleChange}
                  placeholder="e.g., Grand Azure Resort & Spa"
                  className={`w-full px-4 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
                    errors.propertyName ? 'border-red-400' : 'border-slate-200 focus:border-indigo-400'
                  }`}
                />
                {errors.propertyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.propertyName}</p>
                )}
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, propertyType: type.value }))}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.propertyType === type.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 hover:border-indigo-300 bg-white'
                      }`}
                    >
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <div className={`text-sm font-semibold ${
                        formData.propertyType === type.value ? 'text-indigo-700' : 'text-slate-700'
                      }`}>
                        {type.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Star Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, starRating: star }))}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={formData.starRating >= star ? 'text-yellow-400' : 'text-slate-300'}
                        fill={formData.starRating >= star ? '#fbbf24' : 'none'}
                      />
                    </button>
                  ))}
                </div>
                {errors.starRating && (
                  <p className="mt-1 text-sm text-red-600">{errors.starRating}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Property Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your property, its unique features, and what makes it special..."
                  className={`w-full px-4 py-3 bg-white border-2 rounded-xl outline-none transition-all resize-none ${
                    errors.description ? 'border-red-400' : 'border-slate-200 focus:border-indigo-400'
                  }`}
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  {formData.description.length} / 1000 characters
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-display text-slate-900 mb-6">Location Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g., Maldives"
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
                      errors.country ? 'border-red-400' : 'border-slate-200 focus:border-indigo-400'
                    }`}
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g., Malé"
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
                      errors.city ? 'border-red-400' : 'border-slate-200 focus:border-indigo-400'
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address, building number, etc."
                  className={`w-full px-4 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
                    errors.address ? 'border-red-400' : 'border-slate-200 focus:border-indigo-400'
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Zip Code */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Zip/Postal Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="e.g., 20026"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all"
                  />
                </div>

                {/* Optional Coordinates */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    GPS Coordinates (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="Latitude (e.g., 4.1755)"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all"
                    />
                    <input
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="Longitude (e.g., 73.5093)"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Property Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-display text-slate-900 mb-6">Property Details</h2>
              
              {/* Total Rooms */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Total Number of Rooms <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="totalRooms"
                  value={formData.totalRooms}
                  onChange={handleChange}
                  placeholder="e.g., 50"
                  min="1"
                  className={`w-full px-4 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
                    errors.totalRooms ? 'border-red-400' : 'border-slate-200 focus:border-indigo-400'
                  }`}
                />
                {errors.totalRooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.totalRooms}</p>
                )}
              </div>

              {/* Check-in/Check-out Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Check-in Time
                  </label>
                  <input
                    type="time"
                    name="checkInTime"
                    value={formData.checkInTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Check-out Time
                  </label>
                  <input
                    type="time"
                    name="checkOutTime"
                    value={formData.checkOutTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Amenities & Facilities <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {availableAmenities.map((amenity) => {
                    const Icon = typeof amenity.icon === 'string' ? null : amenity.icon;
                    const isSelected = formData.amenities.includes(amenity.id);
                    
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 hover:border-indigo-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {Icon ? (
                            <Icon size={20} className={isSelected ? 'text-indigo-600' : 'text-slate-500'} />
                          ) : (
                            <span className="text-xl">{amenity.icon}</span>
                          )}
                          {isSelected && (
                            <Check size={16} className="text-indigo-600" />
                          )}
                        </div>
                        <div className={`text-xs font-semibold ${
                          isSelected ? 'text-indigo-700' : 'text-slate-700'
                        }`}>
                          {amenity.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.amenities && (
                  <p className="mt-2 text-sm text-red-600">{errors.amenities}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Pricing */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-display text-slate-900 mb-6">Pricing Information</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Pricing Note</h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      Set your base price per night. You can adjust prices for specific dates and create seasonal rates later from your dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Base Price */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Base Price Per Night <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleChange}
                      placeholder="250"
                      min="0"
                      step="0.01"
                      className={`w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
                        errors.basePrice ? 'border-red-400' : 'border-slate-200 focus:border-indigo-400'
                      }`}
                    />
                  </div>
                  {errors.basePrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.basePrice}</p>
                  )}
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="PKR">PKR - Pakistani Rupee</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                </div>

                {/* Tax Rate */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tax Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="taxRate"
                    value={formData.taxRate}
                    onChange={handleChange}
                    placeholder="10"
                    min="0"
                    max="100"
                    step="0.01"
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
                      errors.taxRate ? 'border-red-400' : 'border-slate-200 focus:border-indigo-400'
                    }`}
                  />
                  {errors.taxRate && (
                    <p className="mt-1 text-sm text-red-600">{errors.taxRate}</p>
                  )}
                </div>

                {/* Service Charge */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Service Charge (%)
                  </label>
                  <input
                    type="number"
                    name="serviceCharge"
                    value={formData.serviceCharge}
                    onChange={handleChange}
                    placeholder="5"
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>

              {/* Price Preview */}
              {formData.basePrice && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                  <h3 className="font-bold text-slate-900 mb-4">Price Preview</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Base Price</span>
                      <span className="font-semibold">${parseFloat(formData.basePrice).toFixed(2)}</span>
                    </div>
                    {formData.taxRate && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Tax ({formData.taxRate}%)</span>
                        <span className="font-semibold">${(parseFloat(formData.basePrice) * parseFloat(formData.taxRate) / 100).toFixed(2)}</span>
                      </div>
                    )}
                    {formData.serviceCharge && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Service Charge ({formData.serviceCharge}%)</span>
                        <span className="font-semibold">${(parseFloat(formData.basePrice) * parseFloat(formData.serviceCharge) / 100).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-3 border-t border-indigo-200">
                      <span className="font-bold text-slate-900">Total Per Night</span>
                      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-xl">
                        ${(
                          parseFloat(formData.basePrice) +
                          (formData.taxRate ? parseFloat(formData.basePrice) * parseFloat(formData.taxRate) / 100 : 0) +
                          (formData.serviceCharge ? parseFloat(formData.basePrice) * parseFloat(formData.serviceCharge) / 100 : 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Images & Policies */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-display text-slate-900 mb-6">Images & Policies</h2>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Property Images <span className="text-red-500">*</span>
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl border-2 border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {formData.images.length < 10 && (
                    <label className="w-full h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition-colors bg-slate-50">
                      <Upload size={24} className="text-slate-400 mb-2" />
                      <span className="text-xs text-slate-500 font-semibold">Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                <p className="text-xs text-slate-500">
                  Upload up to 10 images. First image will be the main display image.
                </p>
                {errors.images && (
                  <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                )}
              </div>

              {/* Cancellation Policy */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Cancellation Policy
                </label>
                <div className="space-y-3">
                  {cancellationPolicies.map((policy) => (
                    <button
                      key={policy.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, cancellationPolicy: policy.value }))}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        formData.cancellationPolicy === policy.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 hover:border-indigo-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className={`font-bold mb-1 ${
                            formData.cancellationPolicy === policy.value ? 'text-indigo-700' : 'text-slate-900'
                          }`}>
                            {policy.label}
                          </h4>
                          <p className="text-sm text-slate-600">{policy.description}</p>
                        </div>
                        {formData.cancellationPolicy === policy.value && (
                          <Check size={20} className="text-indigo-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* House Rules */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  House Rules (Optional)
                </label>
                <textarea
                  name="houseRules"
                  value={formData.houseRules}
                  onChange={handleChange}
                  rows={4}
                  placeholder="e.g., No smoking, No pets, Quiet hours from 10 PM to 8 AM..."
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all resize-none"
                ></textarea>
              </div>

              {/* Contact Information */}
              <div className="pt-6 border-t border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Contact Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        placeholder="reservations@yourhotel.com"
                        className={`w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
                          errors.contactEmail ? 'border-red-400' : 'border-slate-200 focus:border-indigo-400'
                        }`}
                      />
                    </div>
                    {errors.contactEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Contact Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="+92 300 1234567"
                        className={`w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl outline-none transition-all ${
                          errors.contactPhone ? 'border-red-400' : 'border-slate-200 focus:border-indigo-400'
                        }`}
                      />
                    </div>
                    {errors.contactPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Property Website (Optional)
                    </label>
                    <div className="relative">
                      <Globe size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://www.yourhotel.com"
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft size={20} />
              <span>Previous</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
              >
                <span>Next Step</span>
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-green-500/40 transition-all"
              >
                <Check size={20} />
                <span>Submit Property</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelRegistrationPage;