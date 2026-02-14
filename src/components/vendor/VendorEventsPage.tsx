import React, { useState } from 'react';
import {
    Eye,
    Edit2,
    Trash2,
    MoreVertical,
    Ticket,
    Calendar,
    MapPin,
    DollarSign,
    Users,
    Clock,
    Image as ImageIcon,
    Lock,
    Unlock,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    X,
    Check,
    Globe,
    Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetVendorEventsQuery, useDeleteEventMutation, type VendorEvent } from '../../store/services/eventApi';
import { showToast } from '../CustomToaster';
import { Loader2 } from 'lucide-react';
import PulseLoader from '../PulseLoader';

const VendorEventsPage: React.FC = () => {
    const { data: eventsData, isLoading } = useGetVendorEventsQuery();
    const [deleteEvent] = useDeleteEventMutation();

    const events = eventsData?.data || [];

    const [selectedEvent, setSelectedEvent] = useState<VendorEvent | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [actionMenuId, setActionMenuId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const statusColors: Record<string, string> = {
        active: 'bg-green-100 text-green-700 border-green-200',
        inactive: 'bg-slate-100 text-slate-700 border-slate-200',
        draft: 'bg-amber-100 text-amber-700 border-amber-200',
        cancelled: 'bg-red-100 text-red-700 border-red-200',
    };

    const handleViewDetails = (event: VendorEvent) => {
        setSelectedEvent(event);
        setShowDetailModal(true);
        setActionMenuId(null);
    };

    const handleEdit = (eventId: number) => {
        // Navigation handled by Link in render, this is for modal/menu actions if needed
        setActionMenuId(null);
    };

    const handleDelete = async (eventId: number) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteEvent(eventId).unwrap();
                showToast.success('Event deleted successfully');
                setActionMenuId(null);
                if (selectedEvent?.id === eventId) {
                    setShowDetailModal(false);
                    setSelectedEvent(null);
                }
            } catch (error) {
                showToast.error('Failed to delete event');
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateOnly = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalRevenue = filteredEvents.reduce((sum, e) => sum + e.revenue, 0);
    const totalTicketsSold = filteredEvents.reduce((sum, e) => sum + Number(e.tickets_sold), 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 p-4 md:p-6 lg:p-8 ">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Archivo', -apple-system, sans-serif;
        }
        
        .font-display {
          font-family: 'Archivo', sans-serif;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display text-slate-900 mb-3">
                                Events Management
                            </h1>
                            <p className="text-lg text-slate-600">
                                Manage your events and track ticket sales
                            </p>
                        </div>
                        <Link
                            to="/vendor/event"
                            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-purple-500/40 transition-all"
                        >
                            <Ticket size={20} />
                            <span className="hidden md:inline">Create Event</span>
                        </Link>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="glass rounded-2xl p-6 shadow-lg border border-white/40 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">

                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by event name, category, or location..."
                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-purple-400 transition-all"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="md:w-48">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-purple-400 transition-all appearance-none cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="inactive">Inactive</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
                        <div>
                            <div className="text-xs text-slate-600 mb-1">Total Events</div>
                            <div className="text-2xl font-display text-slate-900">{filteredEvents.length}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-600 mb-1">Active Events</div>
                            <div className="text-2xl font-display text-green-600">
                                {filteredEvents.filter(e => e.status === 'active').length}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-600 mb-1">Tickets Sold</div>
                            <div className="text-2xl font-display text-purple-600">
                                {totalTicketsSold}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-600 mb-1">Total Revenue</div>
                            <div className="text-2xl font-display text-indigo-600">
                                ${totalRevenue.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events Table */}
                <div className="glass rounded-2xl shadow-lg border border-white/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <PulseLoader containerStyle="animate-spin text-purple-600" size={40} />
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-slate-200 bg-slate-50">
                                        <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Event</th>
                                        <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Date</th>
                                        <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Time</th>


                                        <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Location</th>
                                        <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Capacity</th>
                                        <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Sold</th>
                                        <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Revenue</th>
                                        <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Status</th>
                                        <th className="text-right py-4 px-6 font-bold text-slate-900 text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEvents.map((event) => {
                                        const soldPercentage = (Number(event.tickets_sold) / event.total_capacity) * 100;
                                        const primaryImage = event.gallery?.find(img => img.is_primary === 1) || event.gallery?.[0];

                                        return (
                                            <tr
                                                key={event.id}
                                                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                            >
                                                {/* Event */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                                            {primaryImage ? (
                                                                <img
                                                                    src={primaryImage.url}
                                                                    alt={event.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Ticket size={24} className="text-slate-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="max-w-xs">
                                                            <div className="font-bold text-slate-900 text-sm truncate">
                                                                {event.title}
                                                            </div>
                                                            <div className="text-xs text-slate-600 mt-0.5">
                                                                {event.category}
                                                            </div>
                                                            <div className="flex items-center space-x-1 mt-1">
                                                                <ImageIcon size={12} className="text-slate-400" />
                                                                <span className="text-xs text-slate-500">
                                                                    {event.gallery?.length || 0} images
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-xs max-w-xs text-slate-900">
                                                        {formatDateOnly(event.start_date)}
                                                    </div>
                                                </td>
                                                {/* Date & Time */}
                                                <td className="py-4 px-6">
                                                    <div className="text-sm">

                                                        <div className="text-xs text-slate-600 mt-0.5">
                                                            {new Date(event.start_date).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                            {' - '}
                                                            {new Date(event.end_date).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Location */}
                                                <td className="py-4 px-6">
                                                    <div className="text-sm max-w-xs">
                                                        <div className="font-semibold text-slate-900 truncate">
                                                            {event.location_details.city}
                                                        </div>
                                                        <div className="text-xs text-slate-600 truncate">
                                                            {event.location_details.country}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Capacity */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center space-x-2">
                                                        <Users size={16} className="text-slate-400" />
                                                        <span className="font-semibold text-slate-900 text-sm">
                                                            {event.total_capacity}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Sold */}
                                                <td className="py-4 px-6">
                                                    <div>
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <span className="font-bold text-purple-600 text-sm">
                                                                {event.tickets_sold}
                                                            </span>
                                                            <span className="text-xs text-slate-500">
                                                                ({soldPercentage.toFixed(0)}%)
                                                            </span>
                                                        </div>
                                                        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${soldPercentage >= 80
                                                                        ? 'bg-red-500'
                                                                        : soldPercentage >= 50
                                                                            ? 'bg-amber-500'
                                                                            : 'bg-green-500'
                                                                    }`}
                                                                style={{ width: `${soldPercentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Revenue */}
                                                <td className="py-4 px-6">
                                                    <div className="font-bold text-green-600 text-sm">
                                                        ${event.revenue.toLocaleString()}
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="py-4 px-6">
                                                    <div className="space-y-1">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[event.status] || 'bg-gray-100 text-gray-700'}`}>
                                                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                                        </span>
                                                        <div className="flex items-center space-x-1">
                                                            <Globe size={12} className={event.visibility === 'public' ? 'text-green-600' : 'text-slate-400'} />
                                                            <span className="text-xs text-slate-600 capitalize">
                                                                {event.visibility}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleViewDetails(event)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye size={16} />
                                                        </button>

                                                        <div className="relative">
                                                            <button
                                                                onClick={() => setActionMenuId(actionMenuId === event.id ? null : event.id)}
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                                            >
                                                                <MoreVertical size={16} />
                                                            </button>

                                                            {/* Action Menu */}
                                                            {actionMenuId === event.id && (
                                                                <>
                                                                    <div
                                                                        className="fixed inset-0 z-10"
                                                                        onClick={() => setActionMenuId(null)}
                                                                    ></div>

                                                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-20 animate-slideDown">
                                                                        <Link
                                                                            to={`/vendor/event/edit/${event.id}`}
                                                                            className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-indigo-50 transition-colors text-left"
                                                                        >
                                                                            <Edit2 size={16} className="text-indigo-600" />
                                                                            <span className="text-sm font-semibold text-slate-700">Edit Event</span>
                                                                        </Link>

                                                                        <Link
                                                                            to={`/vendor/events/${event.id}/tickets`}
                                                                            className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-purple-50 transition-colors text-left"
                                                                        >
                                                                            <Ticket size={16} className="text-purple-600" />
                                                                            <span className="text-sm font-semibold text-slate-700">Manage Tickets</span>
                                                                        </Link>

                                                                        <button
                                                                            onClick={() => handleDelete(event.id)}
                                                                            className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-red-50 transition-colors text-left border-t border-slate-100"
                                                                        >
                                                                            <Trash2 size={16} className="text-red-600" />
                                                                            <span className="text-sm font-semibold text-red-600">Delete</span>
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Event Detail Modal */}
            {showDetailModal && selectedEvent && (
                <EventDetailModal
                    event={selectedEvent}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedEvent(null);
                    }}
                    onEdit={() => {
                        setShowDetailModal(false);
                    }}
                    onDelete={() => {
                        handleDelete(selectedEvent.id);
                        setShowDetailModal(false);
                    }}
                />
            )}
        </div>
    );
};

// Event Detail Modal Component
interface EventDetailModalProps {
    event: VendorEvent;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose, onEdit, onDelete }) => {
    const primaryImage = event.gallery?.find(img => img.is_primary === 1) || event.gallery?.[0];
    const soldPercentage = (Number(event.tickets_sold) / event.total_capacity) * 100;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 animate-fadeIn"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="glass rounded-3xl shadow-2xl border border-white/40 w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto animate-slideDown"
                    onClick={(e) => e.stopPropagation()}
                >

                    {/* Header with Image */}
                    <div className="relative h-64 overflow-hidden">
                        {primaryImage ? (
                            <img
                                src={primaryImage.url}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                <Ticket size={64} className="text-white opacity-50" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <X size={24} className="text-white" />
                        </button>

                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="flex items-center space-x-2 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${event.status === 'active'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-slate-500 text-white'
                                    }`}>
                                    {event.status.toUpperCase()}
                                </span>
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white">
                                    {event.category}
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display text-white mb-2">
                                {event.title}
                            </h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-8">

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                <div className="text-xs text-purple-600 font-semibold mb-1">Tickets Sold</div>
                                <div className="text-2xl font-display text-purple-900">{event.tickets_sold}</div>
                                <div className="text-xs text-purple-600 mt-1">{soldPercentage.toFixed(0)}% capacity</div>
                            </div>

                            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                <div className="text-xs text-green-600 font-semibold mb-1">Revenue</div>
                                <div className="text-2xl font-display text-green-900">${event.revenue}</div>
                            </div>

                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <div className="text-xs text-blue-600 font-semibold mb-1">Capacity</div>
                                <div className="text-2xl font-display text-blue-900">{event.total_capacity}</div>
                            </div>

                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                                <div className="text-xs text-amber-600 font-semibold mb-1">Images</div>
                                <div className="text-2xl font-display text-amber-900">{event.gallery?.length || 0}</div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">About This Event</h3>
                            <p className="text-slate-600 leading-relaxed">{event.description}</p>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                        <Calendar size={20} className="text-indigo-600" />
                                    </div>
                                    <div className="text-xs text-slate-500 font-semibold uppercase">Start Date</div>
                                </div>
                                <div className="font-bold text-slate-900">{new Date(event.start_date).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}</div>
                                <div className="text-sm text-slate-600 mt-1">
                                    {new Date(event.start_date).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                        <Clock size={20} className="text-purple-600" />
                                    </div>
                                    <div className="text-xs text-slate-500 font-semibold uppercase">End Date</div>
                                </div>
                                <div className="font-bold text-slate-900">{new Date(event.end_date).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}</div>
                                <div className="text-sm text-slate-600 mt-1">
                                    {new Date(event.end_date).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Location</h3>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center flex-shrink-0">
                                        <MapPin size={24} className="text-blue-700" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 mb-1">{event.location_details.full_address}</div>
                                        <div className="text-sm text-slate-600">
                                            {event.location_details.city}, {event.location_details.country}
                                            {event.location_details.zip_code && ` ${event.location_details.zip_code}`}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-2">
                                            Coordinates: {event.location_details.lat}, {event.location_details.lng}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Highlights */}
                        {event.highlights && event.highlights.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Event Highlights</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {event.highlights.map((highlight, index) => (
                                        <div key={index} className="flex items-center space-x-3 bg-purple-50 rounded-xl p-4 border border-purple-200">
                                            <Sparkles size={18} className="text-purple-600 flex-shrink-0" />
                                            <span className="text-sm font-semibold text-slate-900">{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Ticket Tiers */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Ticket Tiers</h3>
                            <div className="space-y-4">
                                {event.tickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className={`rounded-xl p-6 border-2 ${ticket.is_locked
                                                ? 'bg-slate-50 border-slate-300'
                                                : 'bg-white border-slate-200'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h4 className="text-lg font-bold text-slate-900">{ticket.name}</h4>
                                                    {ticket.is_locked && (
                                                        <div className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center space-x-1">
                                                            <Lock size={12} />
                                                            <span>Locked</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {ticket.features.map((feature, idx) => (
                                                        <div key={idx} className="inline-flex items-center space-x-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                            <Check size={12} />
                                                            <span>{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <div className="text-3xl font-display text-purple-600">${ticket.price}</div>
                                                <div className="text-xs text-slate-500">per ticket</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                                            <div>
                                                <div className="text-xs text-slate-500 mb-1">Quantity</div>
                                                <div className="font-bold text-slate-900">{ticket.quantity}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 mb-1">Sold</div>
                                                <div className="font-bold text-purple-600">{ticket.sold_count}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 mb-1">Available</div>
                                                <div className="font-bold text-green-600">{ticket.quantity - ticket.sold_count}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gallery */}
                        {event.gallery && event.gallery.length > 1 && (
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Gallery ({event.gallery.length} images)</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {event.gallery.map((image) => (
                                        <div
                                            key={image.id}
                                            className="relative aspect-square rounded-xl overflow-hidden group"
                                        >
                                            <img
                                                src={image.url}
                                                alt="Event"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            {image.is_primary === 1 && (
                                                <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                    Primary
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 border-t border-slate-200 bg-slate-50">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <Link
                                to={`/vendor/event/edit/${event.id}`}
                                className="flex items-center justify-center space-x-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                            >
                                <Edit2 size={18} />
                                <span>Edit Event</span>
                            </Link>

                            <button
                                onClick={onDelete}
                                className="flex items-center justify-center space-x-2 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
                            >
                                <Trash2 size={18} />
                                <span>Delete Event</span>
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-white transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VendorEventsPage;