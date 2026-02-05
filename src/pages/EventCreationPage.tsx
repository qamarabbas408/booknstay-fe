import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, MapPin, Ticket, ImagePlus, Plus, Trash2, Save, Eye, Globe, Lock, Sparkles, ChevronLeft, Users, Clock, Tag, Loader2, AlertCircle, Zap, CheckCircle, X } from 'lucide-react';
import { useGetEventCategoriesQuery } from '../store/services/miscApi';
import { useCreateEventMutation, useGetVendorEventQuery, useUpdateVendorEventMutation, type VendorEvent } from '../store/services/eventApi';
import { CustomToaster, showToast } from '../components/CustomToaster';

interface TicketType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  is_locked?: boolean;
  features: string[];
}

const EventCreationPage = () => {
  const navigate = useNavigate();
  const { id: eventId } = useParams<{ id: string }>();
  const isEditMode = Boolean(eventId);

  // API Hooks
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateVendorEvent, { isLoading: isUpdating }] = useUpdateVendorEventMutation();
  const { data: eventData, isLoading: isLoadingEvent } = useGetVendorEventQuery(Number(eventId), {
    skip: !isEditMode,
  });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [venue, setVenue] = useState('');
  const [tickets, setTickets] = useState<TicketType[]>([
    { id: 1, name: 'General Admission', price: 0, quantity: 100, features: [] },
  ]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);

  const { data: categoriesData, isLoading: isLoadingCategories } = useGetEventCategoriesQuery();
  const categories = categoriesData?.data || [];

  useEffect(() => {
    if (isEditMode && eventData?.data && categories.length > 0) {
      const event = eventData.data;
      setTitle(event.title);
      setDescription(event.description || '');
      setHighlights(event.highlights || []);

      const foundCategory = categories.find(c => c.name === event.category);
      if (foundCategory) {
        setCategory(foundCategory.id.toString());
      }

      const [startDate, startTime] = event.start_date.split(' ');
      setDate(startDate);
      setTime(startTime?.substring(0, 5) || '');
      
      const [endDateStr, endTimeStr] = event.end_date.split(' ');
      setEndDate(endDateStr || '');
      setEndTime(endTimeStr?.substring(0, 5) || '');

      setVenue(event.venue || '');
      setLocation(event.location || '');
      setVisibility(event.visibility as 'public' | 'private');

      if (event.tickets?.length > 0) {
        setTickets(event.tickets.map(t => ({ 
          id: t.id, 
          name: t.name, 
          price: t.price, 
          quantity: t.quantity, 
          is_locked: t.is_locked,
          features: t.features || []
        })));
      }
      if (event.images?.length > 0) {
        setImagePreviews(event.images.map(img => img.url));
      }
    }
  }, [isEditMode, eventData, categories]);

  const addTicketType = () => {
    const newId = tickets.length ? Math.max(...tickets.map(t => t.id)) + 1 : 1;
    setTickets([...tickets, { id: newId, name: 'New Ticket', price: 0, quantity: 50, features: [] }]);
  };

  const updateTicket = (id: number, field: keyof TicketType, value: any) => {
    setTickets(tickets.map(t =>
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const removeTicket = (id: number) => {
    if (tickets.length === 1) return;
    setTickets(tickets.filter(t => t.id !== id));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const remainingSlots = 5 - imageFiles.length;

      if (filesArray.length > remainingSlots) {
        showToast.error(`You can only upload a maximum of 5 images. (${remainingSlots} remaining)`);
        return;
      }

      const newFiles = filesArray.slice(0, remainingSlots);
      setImageFiles(prev => [...prev, ...newFiles]);

      Promise.all(newFiles.map(file => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      }))).then(results => {
        setImagePreviews(prev => [...prev, ...results]);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !category || !date || !venue) {
      showToast.error("Please fill in all required fields.");
      return;
    }
    
    if (imageFiles.length === 0 && !isEditMode) {
      showToast.error("Please upload at least one image for a new event.");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category_id', category);
    formData.append('description', description);
    formData.append('startDate', date);
    formData.append('startTime', time);
    formData.append('endDate', endDate);
    formData.append('endTime', endTime);
    formData.append('venue', venue);
    formData.append('location', location);
    formData.append('visibility', visibility);
    formData.append('status', 'active');

    highlights.forEach((highlight) => {
      formData.append('highlights[]', highlight);
    });

    if (isEditMode) {
      formData.append('_method', 'PUT');
    }

    imageFiles.forEach((file) => {
      formData.append('images[]', file);
    });

    tickets.forEach((ticket, index) => {
      formData.append(`tickets[${index}][name]`, ticket.name);
      formData.append(`tickets[${index}][price]`, ticket.price.toString());
      formData.append(`tickets[${index}][quantity]`, ticket.quantity.toString());
      ticket.features.forEach((feature) => {
        formData.append(`tickets[${index}][features][]`, feature);
      });
    });

    try {
      if (isEditMode) {
        await updateVendorEvent({ id: Number(eventId), body: formData }).unwrap();
        showToast.success("Event updated successfully!");
      } else {
        await createEvent(formData).unwrap();
        showToast.success("Event published successfully!");
      }
      navigate('/vendor/dashboard');
    } catch (error: any) {
      console.error(error);
      const action = isEditMode ? 'update' : 'create';
      const msg = error?.data?.message || `Failed to ${action} event`;
      showToast.error(msg);
    }
  };

  const isLoading = isCreating || isUpdating || (isEditMode && isLoadingEvent);
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
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

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }
      `}</style>

    

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 animate-slideUp">
          <div>
            <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
              <Sparkles size={16} className="text-purple-600" />
              <span className="text-purple-700 text-sm font-semibold">{isEditMode ? 'Event Editor' : 'Event Creation'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-slate-900 mb-2">{isEditMode ? 'Edit Your Event' : 'Create Your Event'}</h1>
            <p className="text-slate-600 text-lg font-serif">{isEditMode ? 'Update the details for your event.' : 'Fill in the details to list your event and start selling tickets'}</p>
          </div>
          <div className="flex gap-3">
            {!isEditMode && (
              <button className="flex items-center px-6 py-3 bg-white border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-700">
                <Save size={18} className="mr-2" />
                Save Draft
              </button>
            )}
            <button className="flex items-center px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50"
              >
                {isLoading && !isUpdating && !isCreating ? 'Loading...' : (isCreating || isUpdating) ? <Loader2 className="animate-spin mr-2" size={18} /> : <Globe size={18} className="mr-2" />}
                {isCreating ? 'Publishing...' : isUpdating ? 'Updating...' : isEditMode ? 'Update Event' : 'Publish Event'}
              </button>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="glass rounded-3xl overflow-hidden shadow-lg animate-slideUp" style={{animationDelay: '0.1s'}}>
              <div className="bg-linear-to-r from-purple-600 to-pink-600 p-6">
                <h2 className="text-2xl font-display text-white flex items-center">
                  <Ticket size={24} className="mr-3" />
                  Event Basics
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">Event Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Summer Music Festival 2026"
                    className="w-full p-4 rounded-xl border-2 border-slate-200 transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2">Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-4 rounded-xl border-2 border-slate-200 transition-all bg-white disabled:opacity-50"
                    disabled={isLoadingCategories}
                  >
                    <option value="">{isLoadingCategories ? 'Loading categories...' : 'Select a category'}</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Tell attendees what makes your event special..."
                    className="w-full p-4 rounded-xl border-2 border-slate-200 transition-all bg-white resize-none"
                  />
                  <p className="text-sm text-slate-500 mt-2">{description.length} characters</p>
                </div>
              </div>

              <div className="px-8 pb-8 pt-0">
                <label className="block text-slate-700 font-semibold mb-3">
                  Event Highlights
                  <span className="text-sm font-normal text-slate-500 ml-2">(What makes this event special?)</span>
                </label>
                <div className="space-y-3">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                        <Zap size={18} className="text-purple-600" />
                      </div>
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => {
                          const newHighlights = [...highlights];
                          newHighlights[index] = e.target.value;
                          setHighlights(newHighlights);
                        }}
                        placeholder="e.g. Live performances from top artists"
                        className="flex-1 p-3 rounded-xl border-2 border-slate-200 transition-all bg-white focus:border-purple-500"
                      />
                      <button
                        onClick={() => setHighlights(highlights.filter((_, i) => i !== index))}
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setHighlights([...highlights, ''])}
                    className="flex items-center text-purple-600 font-semibold hover:text-purple-700 px-2 py-1 mt-2"
                  >
                    <Plus size={18} className="mr-1" />
                    Add Highlight
                  </button>
                </div>
              </div>
            </div>

            {/* Date & Location */}
            <div className="glass rounded-3xl overflow-hidden shadow-lg animate-slideUp" style={{animationDelay: '0.2s'}}>
              <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-6">
                <h2 className="text-2xl font-display text-white flex items-center">
                  <Calendar size={24} className="mr-3" />
                  When & Where
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">
                      <Calendar size={16} className="inline mr-2 text-purple-600" />
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full p-4 rounded-xl border-2 border-slate-200 transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">
                      <Clock size={16} className="inline mr-2 text-purple-600" />
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full p-4 rounded-xl border-2 border-slate-200 transition-all bg-white"
                    />
                  </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">
                      <Calendar size={16} className="inline mr-2 text-purple-600" />
                       End Date 
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full p-4 rounded-xl border-2 border-slate-200 transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">
                      <Clock size={16} className="inline mr-2 text-purple-600" />
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      className="w-full p-4 rounded-xl border-2 border-slate-200 transition-all bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">
                    <MapPin size={16} className="inline mr-2 text-purple-600" />
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    placeholder="e.g. Wembley Arena"
                    className="w-full p-4 rounded-xl border-2 border-slate-200 transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">Full Address</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Empire Way, Wembley, London HA9 0DH"
                    className="w-full p-4 rounded-xl border-2 border-slate-200 transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Tickets */}
            <div className="glass rounded-3xl overflow-hidden shadow-lg animate-slideUp" style={{animationDelay: '0.3s'}}>
              <div className="bg-linear-to-r from-pink-600 to-orange-600 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-display text-white flex items-center">
                  <Ticket size={24} className="mr-3" />
                  Ticket Types
                </h2>
                <button
                  onClick={addTicketType}
                  className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all font-semibold border border-white/40"
                >
                  <Plus size={18} className="mr-2" />
                  Add Type
                </button>
              </div>

              <div className="p-8 space-y-4">
                {tickets.map((ticket, index) => (
                  <div key={ticket.id} className="p-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 relative">
                    {tickets.length > 1 && !ticket.is_locked && (
                      <button
                        onClick={() => removeTicket(ticket.id)}
                        className="absolute top-4 right-4 p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}

                    <div className="mb-4 flex items-center">
                      <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Ticket #{index + 1}
                      </span>
                      {ticket.is_locked && (
                        <span className="ml-2 inline-flex items-center bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                          <Lock size={12} className="mr-1" />
                          Locked
                        </span>
                      )}
                    </div>

                    {ticket.is_locked && (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
                        <AlertCircle size={16} className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-800">
                          This ticket tier cannot be edited because tickets have already been sold.
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          <Tag size={14} className="inline mr-1" />
                          Ticket Name
                        </label>
                        <input
                          type="text"
                          value={ticket.name}
                          onChange={e => updateTicket(ticket.id, 'name', e.target.value)}
                          className="w-full p-3 rounded-lg border-2 border-purple-200 bg-white transition-all disabled:opacity-60 disabled:bg-slate-100"
                          disabled={ticket.is_locked}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Price (USD)</label>
                        <input
                          type="number"
                          value={ticket.price}
                          onChange={e => updateTicket(ticket.id, 'price', Number(e.target.value))}
                          min="0"
                          className="w-full p-3 rounded-lg border-2 border-purple-200 bg-white transition-all disabled:opacity-60 disabled:bg-slate-100"
                          disabled={ticket.is_locked}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          <Users size={14} className="inline mr-1" />
                          Available
                        </label>
                        <input
                          type="number"
                          value={ticket.quantity}
                          onChange={e => updateTicket(ticket.id, 'quantity', Number(e.target.value))}
                          min="1"
                          className="w-full p-3 rounded-lg border-2 border-purple-200 bg-white transition-all disabled:opacity-60 disabled:bg-slate-100"
                          disabled={ticket.is_locked}
                        />
                      </div>
                    </div>

                    {/* Ticket Features */}
                    <div className="mt-6 pt-5 border-t border-purple-200/60">
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Ticket Features & Benefits
                      </label>
                      <div className="space-y-2.5">
                        {ticket.features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [...ticket.features];
                                newFeatures[fIndex] = e.target.value;
                                updateTicket(ticket.id, 'features', newFeatures);
                              }}
                              placeholder="e.g. VIP Lounge Access"
                              className="flex-1 p-2 text-sm rounded-lg border border-slate-200 focus:border-purple-400 outline-none bg-white/50 focus:bg-white transition-all"
                              disabled={ticket.is_locked}
                            />
                            {!ticket.is_locked && (
                              <button
                                onClick={() => {
                                  const newFeatures = ticket.features.filter((_, i) => i !== fIndex);
                                  updateTicket(ticket.id, 'features', newFeatures);
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                        {!ticket.is_locked && (
                          <button
                            onClick={() => {
                              const newFeatures = [...ticket.features, ''];
                              updateTicket(ticket.id, 'features', newFeatures);
                            }}
                            className="text-sm text-purple-600 font-semibold hover:text-purple-700 flex items-center mt-2"
                          >
                            <Plus size={14} className="mr-1" />
                            Add Feature
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="glass rounded-3xl overflow-hidden shadow-lg animate-slideUp" style={{animationDelay: '0.4s'}}>
              <div className="bg-linear-to-r from-emerald-600 to-teal-600 p-6">
                <h2 className="text-2xl font-display text-white flex items-center">
                  <ImagePlus size={24} className="mr-3" />
                  Event Banner
                </h2>
              </div>
              <div className="p-8">
                <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 text-center hover:border-purple-500 transition-all bg-linear-to-br from-purple-50/50 to-pink-50/50">
                  {imagePreviews.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img src={preview} alt={`Preview ${index + 1}`} className="h-32 w-full rounded-xl object-cover shadow-md" />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                              Cover
                            </div>
                          )}
                        </div>
                      ))}
                      {imagePreviews.length < 5 && (
                        <label className="h-32 border-2 border-dashed border-purple-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 transition-colors bg-white/50">
                          <Plus size={24} className="text-purple-400 mb-1" />
                          <span className="text-xs text-purple-600 font-semibold">Add Image</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImagePlus size={36} className="text-purple-600" />
                      </div>
                      <p className="text-slate-700 font-semibold mb-2">Drag & drop your image here</p>
                      <p className="text-sm text-slate-500 mb-4">Upload up to 5 images (min 1 required)</p>
                      <div className="bg-white rounded-lg p-4 inline-block">
                        <p className="text-xs text-slate-600">
                          <span className="font-semibold">Recommended:</span> 1920×1080 px • Max 5MB
                        </p>
                      </div>
                      <br />
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="event-image"
                      />
                      <label
                        htmlFor="event-image"
                        className="mt-6 inline-block px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl cursor-pointer hover:shadow-lg hover:shadow-purple-500/30 transition-all font-bold"
                      >
                        Choose Images
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-6">
            {/* Visibility */}
            <div className="glass rounded-2xl p-6 shadow-lg animate-slideUp" style={{animationDelay: '0.5s'}}>
              <h3 className="text-lg font-bold mb-4 text-slate-900">Event Visibility</h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setVisibility('public')}
                  className={`py-3 px-4 rounded-xl flex items-center gap-3 transition-all font-semibold ${
                    visibility === 'public' 
                      ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-md' 
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-purple-300'
                  }`}
                >
                  <Globe size={18} />
                  <div className="text-left flex-1">
                    <div>Public</div>
                    <div className={`text-xs ${visibility === 'public' ? 'text-white/80' : 'text-slate-500'}`}>
                      Anyone can find this event
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setVisibility('private')}
                  className={`py-3 px-4 rounded-xl flex items-center gap-3 transition-all font-semibold ${
                    visibility === 'private' 
                      ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-md' 
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-purple-300'
                  }`}
                >
                  <Lock size={18} />
                  <div className="text-left flex-1">
                    <div>Private</div>
                    <div className={`text-xs ${visibility === 'private' ? 'text-white/80' : 'text-slate-500'}`}>
                      Invitation only
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="glass rounded-2xl overflow-hidden shadow-lg animate-slideUp" style={{animationDelay: '0.6s'}}>
              <div className="bg-linear-to-r from-slate-700 to-slate-900 p-6">
                <h3 className="text-lg font-display text-white flex items-center">
                  <Eye size={20} className="mr-2" />
                  Quick Preview
                </h3>
              </div>
              <div className="p-6">
                {imagePreviews.length > 0 && (
                  <img src={imagePreviews[0]} alt="Preview" className="w-full h-40 object-cover rounded-xl mb-4 shadow-md" />
                )}
                <div className="space-y-3 text-sm">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-purple-600 font-semibold mb-1">TITLE</p>
                    <p className="text-slate-900 font-bold">{title || 'Your Event Title'}</p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <p className="text-xs text-indigo-600 font-semibold mb-1">CATEGORY</p>
                    <p className="text-slate-900 font-bold">{categories.find(c => c.id.toString() === category)?.name || 'Not selected'}</p>
                  </div>
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <p className="text-xs text-pink-600 font-semibold mb-1">DATE & TIME</p>
                    <p className="text-slate-900 font-bold">
                      {date || 'TBD'} {time && `• ${time}`}
                    </p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <p className="text-xs text-emerald-600 font-semibold mb-1">LOCATION</p>
                    <p className="text-slate-900 font-bold">{venue || 'Venue TBC'}</p>
                    {location && <p className="text-xs text-slate-600 mt-1">{location}</p>}
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-xs text-orange-600 font-semibold mb-1">TICKETS</p>
                    <p className="text-slate-900 font-bold">
                      {tickets.length} ticket type{tickets.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200 animate-slideUp" style={{animationDelay: '0.7s'}}>
              <div className="flex items-start space-x-3">
                <Sparkles size={20} className="text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-amber-900 mb-2">Pro Tips</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Use high-quality images</li>
                    <li>• Be detailed in description</li>
                    <li>• Set competitive pricing</li>
                    <li>• Update info regularly</li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default EventCreationPage;