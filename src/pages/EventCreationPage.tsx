import React, { useState } from 'react';
import { Calendar, MapPin, Ticket, Image as ImageIcon, Plus, Trash2, Save, Eye, Globe, Lock } from 'lucide-react';

interface TicketType {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const EventCreationPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [tickets, setTickets] = useState<TicketType[]>([
    { id: 1, name: 'General Admission', price: 0, quantity: 100 },
  ]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');

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
    if (tickets.length === 1) return; // keep at least one
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-display text-slate-900">Create New Event</h1>
            <p className="text-slate-600 mt-2">Fill in the details to list your event and start selling tickets.</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center px-6 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
              <Save size={18} className="mr-2" />
              Save Draft
            </button>
            <button className="flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
              <Globe size={18} className="mr-2" />
              Publish Event
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="glass p-8 rounded-3xl border border-white/30 backdrop-blur-md shadow-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Ticket size={24} className="text-indigo-600 mr-3" />
                Event Basics
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-slate-700 font-medium mb-2">Event Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Lahore Music Night 2026"
                    className="w-full p-4 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={5}
                    placeholder="Tell attendees what to expect..."
                    className="w-full p-4 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Date & Location */}
            <div className="glass p-8 rounded-3xl border border-white/30 backdrop-blur-md shadow-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Calendar size={24} className="text-indigo-600 mr-3" />
                When & Where
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-700 font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full p-4 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full p-4 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-slate-700 font-medium mb-2">Location / Venue *</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Alhamra Arts Council, Lahore"
                  className="w-full p-4 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Tickets */}
            <div className="glass p-8 rounded-3xl border border-white/30 backdrop-blur-md shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <Ticket size={24} className="text-indigo-600 mr-3" />
                  Ticket Types
                </h2>
                <button
                  onClick={addTicketType}
                  className="flex items-center px-5 py-2.5 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors"
                >
                  <Plus size={18} className="mr-2" />
                  Add Ticket Type
                </button>
              </div>

              <div className="space-y-6">
                {tickets.map((ticket, index) => (
                  <div key={ticket.id} className="p-6 bg-white rounded-2xl border border-slate-200 relative">
                    {tickets.length > 1 && (
                      <button
                        onClick={() => removeTicket(ticket.id)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                        <input
                          type="text"
                          value={ticket.name}
                          onChange={e => updateTicket(ticket.id, 'name', e.target.value)}
                          className="w-full p-3 rounded-lg border border-slate-300 focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Price (PKR)</label>
                        <input
                          type="number"
                          value={ticket.price}
                          onChange={e => updateTicket(ticket.id, 'price', Number(e.target.value))}
                          min="0"
                          className="w-full p-3 rounded-lg border border-slate-300 focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Available Qty</label>
                        <input
                          type="number"
                          value={ticket.quantity}
                          onChange={e => updateTicket(ticket.id, 'quantity', Number(e.target.value))}
                          min="1"
                          className="w-full p-3 rounded-lg border border-slate-300 focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="glass p-8 rounded-3xl border border-white/30 backdrop-blur-md shadow-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <ImageIcon size={24} className="text-indigo-600 mr-3" />
                Event Poster / Banner
              </h2>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-xl object-cover" />
                    <button
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon size={48} className="mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600 mb-2">Drag & drop or click to upload</p>
                    <p className="text-sm text-slate-500">Recommended: 1200×628 px, max 5MB</p>
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
                  className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl cursor-pointer hover:bg-indigo-700 transition-colors"
                >
                  Choose Image
                </label>
              </div>
            </div>
          </div>

          {/* Preview / Summary Sidebar */}
          <aside className="lg:sticky lg:top-10 h-fit space-y-6">
            <div className="glass p-6 rounded-3xl border border-white/30 backdrop-blur-md shadow-xl">
              <h3 className="text-xl font-bold mb-4">Visibility</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setVisibility('public')}
                  className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    visibility === 'public' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Globe size={18} />
                  Public
                </button>
                <button
                  onClick={() => setVisibility('private')}
                  className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    visibility === 'private' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Lock size={18} />
                  Private
                </button>
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border border-white/30 backdrop-blur-md shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Eye size={20} className="mr-2 text-indigo-600" />
                Quick Preview
              </h3>
              <div className="text-sm space-y-3 text-slate-700">
                <p><strong>Title:</strong> {title || 'Your Event Title'}</p>
                <p><strong>Date:</strong> {date || 'TBD'} {time && `at ${time}`}</p>
                <p><strong>Location:</strong> {location || 'Venue TBC'}</p>
                <p><strong>Tickets:</strong> {tickets.length} type{tickets.length !== 1 ? 's' : ''}</p>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl mt-4" />
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default EventCreationPage;