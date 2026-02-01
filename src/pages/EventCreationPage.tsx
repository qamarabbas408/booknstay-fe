import React, { useState } from 'react';
import { Calendar, MapPin, Ticket, ImagePlus, Plus, Trash2, Save, Eye, Globe, Lock, Sparkles, ChevronLeft, Users, Clock, Tag } from 'lucide-react';

interface TicketType {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const EventCreationPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [venue, setVenue] = useState('');
  const [tickets, setTickets] = useState<TicketType[]>([
    { id: 1, name: 'General Admission', price: 0, quantity: 100 },
  ]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');

  const categories = ['Music', 'Technology', 'Food & Wine', 'Art & Culture', 'Sports', 'Business', 'Comedy', 'Film'];

  const addTicketType = () => {
    const newId = tickets.length ? Math.max(...tickets.map(t => t.id)) + 1 : 1;
    setTickets([...tickets, { id: newId, name: 'New Ticket', price: 0, quantity: 50 }]);
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
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
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

      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button className="flex items-center text-slate-700 font-semibold hover:text-purple-600 transition-colors">
            <ChevronLeft size={20} className="mr-1" />
            Back to Events
          </button>
          
          <div className="text-2xl font-display bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            BookNStay
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="hidden md:block text-slate-700 font-semibold px-5 py-2 hover:bg-slate-100 rounded-xl transition-colors">
              Help Center
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 animate-slideUp">
          <div>
            <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
              <Sparkles size={16} className="text-purple-600" />
              <span className="text-purple-700 text-sm font-semibold">Event Creation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-slate-900 mb-2">Create Your Event</h1>
            <p className="text-slate-600 text-lg font-serif">Fill in the details to list your event and start selling tickets</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center px-6 py-3 bg-white border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-700">
              <Save size={18} className="mr-2" />
              Save Draft
            </button>
            <button className="flex items-center px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
              <Globe size={18} className="mr-2" />
              Publish Event
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
                    className="w-full p-4 rounded-xl border-2 border-slate-200 transition-all bg-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
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
                      Event Date *
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
                    {tickets.length > 1 && (
                      <button
                        onClick={() => removeTicket(ticket.id)}
                        className="absolute top-4 right-4 p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}

                    <div className="mb-4">
                      <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Ticket #{index + 1}
                      </span>
                    </div>

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
                          className="w-full p-3 rounded-lg border-2 border-purple-200 bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Price (USD)</label>
                        <input
                          type="number"
                          value={ticket.price}
                          onChange={e => updateTicket(ticket.id, 'price', Number(e.target.value))}
                          min="0"
                          className="w-full p-3 rounded-lg border-2 border-purple-200 bg-white transition-all"
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
                          className="w-full p-3 rounded-lg border-2 border-purple-200 bg-white transition-all"
                        />
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
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="max-h-80 w-full mx-auto rounded-xl object-cover shadow-lg" />
                      <button
                        onClick={() => setImagePreview(null)}
                        className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImagePlus size={36} className="text-purple-600" />
                      </div>
                      <p className="text-slate-700 font-semibold mb-2">Drag & drop your image here</p>
                      <p className="text-sm text-slate-500 mb-4">or click the button below to browse</p>
                      <div className="bg-white rounded-lg p-4 inline-block">
                        <p className="text-xs text-slate-600">
                          <span className="font-semibold">Recommended:</span> 1920×1080 px • Max 5MB
                        </p>
                      </div>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="event-image"
                  />
                  <label
                    htmlFor="event-image"
                    className="mt-6 inline-block px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl cursor-pointer hover:shadow-lg hover:shadow-purple-500/30 transition-all font-bold"
                  >
                    {imagePreview ? 'Change Image' : 'Choose Image'}
                  </label>
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
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl mb-4 shadow-md" />
                )}
                <div className="space-y-3 text-sm">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-purple-600 font-semibold mb-1">TITLE</p>
                    <p className="text-slate-900 font-bold">{title || 'Your Event Title'}</p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <p className="text-xs text-indigo-600 font-semibold mb-1">CATEGORY</p>
                    <p className="text-slate-900 font-bold">{category || 'Not selected'}</p>
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