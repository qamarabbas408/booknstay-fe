import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Upload, X, MapPin, DollarSign, Image as ImageIcon, Star, Wifi, Coffee, Car, Utensils, Dumbbell, Wind, Tv, Lock, Phone, Globe, Calendar, Users, Bed, Home, Building2, Sparkles, Info, Mail, Waves, Loader2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetAmenitiesQuery } from '../../store/services/miscApi';
import { useCreateHotelMutation, useUpdateHotelMutation, useGetVendorHotelByIdQuery } from '../../store/services/hotelApi';
import { CustomToaster, showToast } from '../../components/CustomToaster';
import { FormInput } from '../../components/FormInput';
import { APIENDPOINTS } from '../../utils/ApiConstants';

const HotelRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { hotelId } = useParams<{ hotelId: string }>();
  const isEditMode = !!hotelId;

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const { data: hotelToEdit, isLoading: isLoadingHotel } = useGetVendorHotelByIdQuery(Number(hotelId), { skip: !isEditMode });

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
    amenities: [] as number[],
    
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
    stars: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const { data: amenitiesList, isLoading: isLoadingAmenities } = useGetAmenitiesQuery();
  const [createHotel, { isLoading: isCreating }] = useCreateHotelMutation();
  const [updateHotel, { isLoading: isUpdating }] = useUpdateHotelMutation();
  const isLoadingAction = isCreating || isUpdating;

  useEffect(() => {
    if (isEditMode && hotelToEdit?.data) {
      
      console.log(h);
      setFormData({
        propertyName: h.name || '',
        propertyType: h.property_type || 'hotel',
        starRating: h.star_rating || 0,
        description: h.description || '',
        country: h.location?.country || '',
        city: h.location?.city || h.city || '',
        address: h.location?.full_address || h.address || '',
        zipCode: h.location?.zip_code || '',
        latitude: h.location?.latitude || '',
        longitude: h.location?.longitude || '',
        totalRooms: h.total_rooms?.toString() || '',
        checkInTime: '14:00', // These are not in API, using defaults
        checkOutTime: '11:00', // These are not in API, using defaults
        amenities: h.amenities?.map(a => a.id) || [],
        basePrice: h.base_price?.toString() || '',
        currency: h.currency || 'USD',
        taxRate: h.tax_rate?.toString() || '',
        serviceCharge: h.service_charge?.toString() || '',
        images: [], // Can't populate files, will handle previews
        cancellationPolicy: h.cancellation_policy || 'flexible',
        houseRules: h.house_rules || '',
        contactEmail: h.contact_email || '',
        contactPhone: h.contact_phone || '',
        website: h.website || '',
        stars : h.star_rating || 0,
      });
      setImagePreview(h.images?.map(img => `${APIENDPOINTS.content_url}${img.path}`) || []);
    }
  }, [isEditMode, hotelToEdit]);

  const iconMap: Record<string, any> = {
    Wifi,
    Car,
    Utensils,
    Dumbbell,
    Waves,
    Wind,
    Tv,
    Coffee,
    Lock,
    Sparkles,
    wifi: Wifi,
    parking: Car,
    restaurant: Utensils,
    gym: Dumbbell,
    pool: Waves,
    spa: '💆',
    ac: Wind,
    tv: Tv,
    breakfast: Coffee,
    room_service: '🛎️',
    laundry: '🧺',
    safe: Lock,
    waves: Waves,
    sparkles: Sparkles,
  };

  // Property Types
  const propertyTypes = [
    { value: 'hotel', label: 'Hotel', icon: '🏨' },
    { value: 'resort', label: 'Resort', icon: '🏖️' },
    { value: 'villa', label: 'Villa', icon: '🏡' },
    { value: 'apartment', label: 'Apartment', icon: '🏢' },
    { value: 'guesthouse', label: 'Guest House', icon: '🏠' },
  ];

  // Available Amenities
  // const availableAmenities = [
  //   { id: 'wifi', label: 'Free WiFi', icon: Wifi },
  //   { id: 'parking', label: 'Free Parking', icon: Car },
  //   { id: 'restaurant', label: 'Restaurant', icon: Utensils },
  //   { id: 'gym', label: 'Fitness Center', icon: Dumbbell },
  //   { id: 'pool', label: 'Swimming Pool', icon: '🏊' },
  //   { id: 'spa', label: 'Spa & Wellness', icon: '💆' },
  //   { id: 'ac', label: 'Air Conditioning', icon: Wind },
  //   { id: 'tv', label: 'TV', icon: Tv },
  //   { id: 'breakfast', label: 'Breakfast Included', icon: Coffee },
  //   { id: 'room_service', label: '24/7 Room Service', icon: '🛎️' },
  //   { id: 'laundry', label: 'Laundry Service', icon: '🧺' },
  //   { id: 'safe', label: 'Safe Deposit Box', icon: Lock },
  // ];

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

  const toggleAmenity = (amenityId: number) => {
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
      if (formData.propertyName.length > 255) newErrors.propertyName = 'Property name must be less than 255 characters';
      if (formData.starRating === 0) newErrors.starRating = 'Please select a star rating';
      if (formData.starRating < 3) newErrors.starRating = 'Star rating must be at least 3';
      if (!formData.description.trim() || formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters';
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
      if (formData.images.length < 5) newErrors.images = 'Please upload at least 5 images';
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

    const submissionData = new FormData();
    // Step 1
    submissionData.append('name', formData.propertyName);
    submissionData.append('property_type', formData.propertyType);
    submissionData.append('star_rating', formData.starRating.toString());
    submissionData.append('description', formData.description);

    // Step 2
    submissionData.append('country', formData.country);
    submissionData.append('city', formData.city);
    submissionData.append('full_address', formData.address);
    if (formData.zipCode) submissionData.append('zip_code', formData.zipCode);
    if (formData.latitude) submissionData.append('latitude', formData.latitude);
    if (formData.longitude) submissionData.append('longitude', formData.longitude);

    // Step 3
    if (formData.totalRooms) submissionData.append('total_rooms', formData.totalRooms);
    submissionData.append('check_in_time', formData.checkInTime);
    submissionData.append('check_out_time', formData.checkOutTime);
    formData.amenities.forEach((id) => submissionData.append('amenities[]', id.toString()));

    // Step 4
    if (formData.basePrice) submissionData.append('base_price', formData.basePrice);
    submissionData.append('currency', formData.currency);
    if (formData.taxRate) submissionData.append('tax_rate', formData.taxRate);
    if (formData.serviceCharge) submissionData.append('service_fee', formData.serviceCharge);

    // Step 5
    formData.images.forEach((file) => {
      if (file instanceof File) { // Only append new files
        submissionData.append('images[]', file);
      }
    });
    submissionData.append('cancellation_policy', formData.cancellationPolicy);
    if (formData.houseRules) submissionData.append('house_rules', formData.houseRules);
    submissionData.append('contact_email', formData.contactEmail);
    submissionData.append('contact_phone', formData.contactPhone);
    if (formData.website) submissionData.append('website', formData.website);

    if (isEditMode) {
      submissionData.append('_method', 'PUT');
    }

    try {
      if (isEditMode) {
        await updateHotel({ id: Number(hotelId), data: submissionData }).unwrap();
        showToast.success('Hotel updated successfully!');
      } else {
        await createHotel(submissionData).unwrap();
        showToast.success('Hotel registered successfully!');
      }
      navigate('/vendor/dashboard');
    } catch (error: any) {
      console.error('Submission failed:', error);
      if (error?.data?.errors) {
        setErrors(error.data.errors);
        showToast.error('Please check the form for errors.');
      } else {
        showToast.error(error?.data?.message || `Failed to ${isEditMode ? 'update' : 'register'} hotel. Please try again.`);
      }
    }
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
      <CustomToaster />
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
            {isEditMode ? 'Edit Your Hotel' : 'Register Your Hotel'}
          </h1>
          <p className="text-lg text-slate-600 font-serif">
            {isEditMode ? 'Update the details of your property.' : 'Fill in the details to list your property on BookNStay'}
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
          {isLoadingHotel && isEditMode ? (
            <div className="flex flex-col items-center justify-center h-96">
              <Loader2 className="animate-spin text-indigo-600" size={48} />
              <p className="mt-4 text-slate-600 font-semibold">Loading hotel data...</p>
            </div>
          ) : (
            <>
          
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-display text-slate-900 mb-6">Basic Information</h2>
              
              {/* Property Name */}
              <FormInput
                label="Property Name"
                name="propertyName"
                type="text"
                value={formData.propertyName}
                onChange={handleChange}
                placeholder="e.g., Grand Azure Resort & Spa"
                error={errors.propertyName}
                required
              />

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
              <FormInput
                label="Property Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property, its unique features, and what makes it special..."
                error={errors.description}
                rows={5}
                required
              />
              <p className="text-xs text-slate-500">
                {formData.description.length} / 1000 characters
              </p>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-display text-slate-900 mb-6">Location Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g., Maldives"
                  error={errors.country}
                  required
                />

                <FormInput
                  label="City"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., Malé"
                  error={errors.city}
                  required
                />
              </div>

              <FormInput
                label="Full Address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, building number, etc."
                error={errors.address}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Zip/Postal Code"
                  name="zipCode"
                  type="text"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="e.g., 20026"
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    GPS Coordinates (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <FormInput
                      label=""
                      name="latitude"
                      type="text"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="Latitude (e.g., 4.1755)"
                    />
                    <FormInput
                      label=""
                      name="longitude"
                      type="text"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="Longitude (e.g., 73.5093)"
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
              
              <FormInput
                label="Total Number of Rooms"
                name="totalRooms"
                type="number"
                value={formData.totalRooms}
                onChange={handleChange}
                placeholder="e.g., 50"
                min="1"
                error={errors.totalRooms}
                required
              />

              {/* Amenities */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Amenities & Facilities <span className="text-red-500">*</span>
                </label>
                {isLoadingAmenities ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-indigo-600" size={24} />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {amenitiesList?.map((amenity) => {
                      const Icon = iconMap[amenity.icon] || Sparkles;
                      const isIconComponent = typeof Icon !== 'string';
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
                            {isIconComponent ? (
                              <Icon size={20} className={isSelected ? 'text-indigo-600' : 'text-slate-500'} />
                            ) : (
                              <span className="text-xl">{Icon}</span>
                            )}
                            {isSelected && (
                              <Check size={16} className="text-indigo-600" />
                            )}
                          </div>
                          <div className={`text-xs font-semibold ${
                            isSelected ? 'text-indigo-700' : 'text-slate-700'
                          }`}>
                            {amenity.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
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
                <FormInput
                  label="Base Price Per Night"
                  name="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={handleChange}
                  placeholder="250"
                  min="0"
                  step="0.01"
                  icon={<DollarSign size={20} />}
                  error={errors.basePrice}
                  required
                />

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

                <FormInput
                  label="Tax Rate (%)"
                  name="taxRate"
                  type="number"
                  value={formData.taxRate}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                  max="100"
                  step="0.01"
                  error={errors.taxRate}
                  required
                />

                <FormInput
                  label="Service Charge (%)"
                  name="serviceCharge"
                  type="number"
                  value={formData.serviceCharge}
                  onChange={handleChange}
                  placeholder="5"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              {/* Price Preview */}
              {formData.basePrice && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                  <h3 className="font-bold text-slate-900 mb-4">Price Preview</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Base Price</span>
                      <span className="font-semibold">${parseFloat(formData.basePrice as string).toFixed(2)}</span>
                    </div>
                    {formData.taxRate && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Tax ({formData.taxRate}%)</span>
                        <span className="font-semibold">${(parseFloat(formData.basePrice as string) * parseFloat(formData.taxRate as string) / 100).toFixed(2)}</span>
                      </div>
                    )}
                    {formData.serviceCharge && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Service Charge ({formData.serviceCharge}%)</span>
                        <span className="font-semibold">${(parseFloat(formData.basePrice as string) * parseFloat(formData.serviceCharge as string) / 100).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-3 border-t border-indigo-200">
                      <span className="font-bold text-slate-900">Total Per Night</span>
                      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-xl">
                        ${(
                          parseFloat(formData.basePrice as string) +
                          (formData.taxRate ? parseFloat(formData.basePrice as string) * parseFloat(formData.taxRate as string) / 100 : 0) +
                          (formData.serviceCharge ? parseFloat(formData.basePrice as string) * parseFloat(formData.serviceCharge as string) / 100 : 0)
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
              <FormInput
                label="House Rules (Optional)"
                name="houseRules"
                value={formData.houseRules}
                onChange={handleChange}
                placeholder="e.g., No smoking, No pets, Quiet hours from 10 PM to 8 AM..."
                rows={4}
              />

              {/* Contact Information */}
              <div className="pt-6 border-t border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Contact Email"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="reservations@yourhotel.com"
                    icon={<Mail size={20} />}
                    error={errors.contactEmail}
                    required
                  />

                  <FormInput
                    label="Contact Phone"
                    name="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    icon={<Phone size={20} />}
                    error={errors.contactPhone}
                    required
                  />

                  <div className="md:col-span-2">
                    <FormInput
                      label="Property Website (Optional)"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://www.yourhotel.com"
                      icon={<Globe size={20} />}
                    />
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
                disabled={isLoadingAction}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingAction ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Check size={20} />
                )}
                <span>{isLoadingAction ? 'Submitting...' : isEditMode ? 'Update Property' : 'Submit Property'}</span>
              </button>
            )}
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelRegistrationPage;