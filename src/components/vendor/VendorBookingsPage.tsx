import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Check, 
  X, 
  Archive, 
  MoreVertical, 
  Hotel, 
  Ticket, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  DollarSign,
  MapPin,
  Clock,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { useGetVendorBookingsQuery, useUpdateVendorBookingStatusMutation, type RecentBooking } from '../../store/services/vendorApi';
import { showToast } from '../CustomToaster';
import { Loader2 } from 'lucide-react';
import PulseLoader from '../PulseLoader';

const VendorBookingsPage: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<RecentBooking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: bookingsData, isLoading, isFetching } = useGetVendorBookingsQuery({
    page: currentPage,
    search: debouncedSearch || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    date_filter: dateFilter === 'all' ? undefined : dateFilter,
    type: typeFilter === 'all' ? undefined : typeFilter,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
  });

  const [updateStatus] = useUpdateVendorBookingStatusMutation();

  const bookings = bookingsData?.data || [];
  const pagination = bookingsData?.pagination || { total: 0, perPage: 10, currentPage: 1, lastPage: 1 };

  const statusColors: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    completed: 'bg-blue-100 text-blue-700 border-blue-200',
    archived: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      await updateStatus({ id: bookingId, status: newStatus }).unwrap();
      showToast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      showToast.error('Failed to update booking status');
    }
  };

  const handleViewDetails = (booking: RecentBooking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleArchive = (bookingId: number) => {
    if (window.confirm('Are you sure you want to archive this booking?')) {
      handleStatusChange(bookingId, 'archived');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFilter('all');
    setTypeFilter('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4 md:p-6 lg:p-8">
     

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-display text-slate-900 mb-3">
            Bookings Management
          </h1>
          <p className="text-lg text-slate-600">
            Manage all your hotel and event bookings
          </p>
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
                  placeholder="Search by booking code, guest name, or property..."
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Filter Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-6 py-3 border-2 rounded-xl transition-colors font-semibold ${showFilters ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-slate-200 hover:border-indigo-400'}`}
            >
              <Filter size={20} />
              <span className="hidden md:inline">More Filters</span>
            </button>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4 pt-4 border-t border-slate-200 animate-fadeIn">
              {/* Type Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Booking Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all appearance-none cursor-pointer text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="hotel">Hotels Only</option>
                  <option value="event">Events Only</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Time Period</label>
                <select
                  value={dateFilter}
                  onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all appearance-none cursor-pointer text-sm"
                >
                  <option value="all">Any Time</option>
                  <option value="today">Checking in Today</option>
                  <option value="tomorrow">Checking in Tomorrow</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">From Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                  className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all text-sm"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">To Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                  className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all text-sm"
                />
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button 
                  onClick={handleResetFilters}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-xl font-semibold transition-colors text-sm"
                >
                  <RotateCcw size={16} />
                  <span>Reset Filters</span>
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
            <div>
              <div className="text-xs text-slate-600 mb-1">Total Bookings</div>
              <div className="text-2xl font-display text-slate-900">{pagination.total}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 mb-1">Confirmed</div>
              <div className="text-2xl font-display text-green-600">
                {/* Note: This count is only for current page. Ideally should come from API stats */}
                {bookings.filter(b => b.status === 'confirmed').length} 
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-600 mb-1">Pending</div>
              <div className="text-2xl font-display text-amber-600">
                 {bookings.filter(b => b.status === 'pending').length}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-600 mb-1">Total Revenue</div>
              <div className="text-2xl font-display text-indigo-600">
                 {/* Note: This sum is only for current page */}
                ${bookings.reduce((sum, b) => sum + (b.financials?.total_price || 0), 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="glass rounded-2xl shadow-lg border border-white/40 overflow-hidden">
          <div className="overflow-x-auto min-h-100">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <PulseLoader containerStyle="animate-spin text-indigo-600" size={40} />
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Booking Code</th>
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Type</th>
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Hotel/Event</th>
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Guest</th>
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Amount</th>
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-sm">Status</th>
                  <th className="text-right py-4 px-6 font-bold text-slate-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr 
                    key={booking.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    {/* Booking Code */}
                    <td className="py-4 px-6">
                      <div className="font-mono text-sm font-bold text-indigo-600">
                        {booking.booking_code}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {booking.created_at}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {booking.target.type === 'Hotel' ? (
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Hotel size={16} className="text-blue-600" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Ticket size={16} className="text-purple-600" />
                          </div>
                        )}
                        <span className="text-sm font-semibold text-slate-700">
                          {booking.target.type}
                        </span>
                      </div>
                    </td>

                    {/* Property/Event */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 text-sm max-w-xs truncate">
                        {booking.target.title}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {booking.target.sub_title}
                      </div>
                    </td>

                    {/* Guest */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 text-sm">
                        {booking.guest.name}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {booking.guest.email}
                      </div>
                    </td>

                    {/* Date/Timing */}
                    {/* <td className="py-4 px-8">
                      {booking.target.type === 'Hotel' ? (
                        <div className="text-sm">
                          <div className="font-semibold text-slate-900">
                            {booking.timing.check_in}
                          </div>
                          <div className="text-xs text-slate-600">
                            {booking.timing.nights} {booking.timing.nights === 1 ? 'night' : 'nights'}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm font-semibold text-slate-900">
                          {booking.timing.event_date}
                        </div>
                      )}
                    </td> */}

                    {/* Amount */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-green-600 text-sm">
                        ${booking.financials.total_price.toLocaleString()}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[booking.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
            <div className="text-sm text-slate-600">
              Showing <span className="font-semibold">{(currentPage - 1) * pagination.perPage + 1}</span> to{' '}
              <span className="font-semibold">
                {Math.min(currentPage * pagination.perPage, pagination.total)}
              </span>{' '}
              of <span className="font-semibold">{pagination.total}</span> bookings
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-slate-200 hover:border-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>

              {[...Array(pagination.lastPage)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all ${
                    currentPage === i + 1
                      ? 'bg-indigo-600 text-white'
                      : 'border-2 border-slate-200 hover:border-indigo-400'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === pagination.lastPage}
                className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-slate-200 hover:border-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {showDetailModal && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedBooking(null);
          }}
          onStatusChange={(newStatus) => {
            handleStatusChange(selectedBooking.id, newStatus);
            setShowDetailModal(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
};

// Booking Detail Modal Component
interface BookingDetailModalProps {
  booking: RecentBooking;
  onClose: () => void;
  onStatusChange: (status: string) => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ booking, onClose, onStatusChange }) => {
  const statusColors: Record<string, string> = {
    confirmed: 'from-green-500 to-emerald-600',
    pending: 'from-amber-500 to-orange-600',
    cancelled: 'from-red-500 to-pink-600',
    completed: 'from-blue-500 to-indigo-600',
    archived: 'from-slate-500 to-gray-600',
  };

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
          className="glass rounded-3xl shadow-2xl border border-white/40 w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto animate-slideDown"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header */}
          <div className={`bg-gradient-to-r ${statusColors[booking.status]} text-white p-8`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm font-semibold mb-2 opacity-90">Booking Details</div>
                <h2 className="text-3xl font-display mb-2">{booking.booking_code}</h2>
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold capitalize">
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            
            {/* Property/Event Info */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                {booking.target.type === 'Hotel' ? (
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Hotel size={24} className="text-blue-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Ticket size={24} className="text-purple-600" />
                  </div>
                )}
                <div>
                  <div className="text-xs text-slate-500 font-semibold uppercase">
                    {booking.target.type}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{booking.target.title}</h3>
                </div>
              </div>
              <div className="text-slate-700">
                <span className="font-semibold">Room/Tier:</span> {booking.target.sub_title}
              </div>
            </div>

            {/* Guest Information */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Guest Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <User size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Full Name</div>
                    <div className="font-semibold text-slate-900">{booking.guest.name}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Mail size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Email Address</div>
                    <div className="font-semibold text-slate-900">{booking.guest.email}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Phone size={18} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Phone Number</div>
                    <div className="font-semibold text-slate-900">{booking.guest.phone}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timing Details */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                {booking.target.type === 'Hotel' ? 'Stay Details' : 'Event Details'}
              </h3>
              
              {booking.target.type === 'Hotel' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="text-xs text-blue-600 font-semibold mb-2">Check-in</div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={18} className="text-blue-600" />
                      <span className="font-bold text-slate-900">{booking.timing.check_in}</span>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <div className="text-xs text-purple-600 font-semibold mb-2">Check-out</div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={18} className="text-purple-600" />
                      <span className="font-bold text-slate-900">{booking.timing.check_out}</span>
                    </div>
                  </div>

                  <div className="col-span-2 bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                    <div className="text-xs text-indigo-600 font-semibold mb-2">Duration</div>
                    <div className="flex items-center space-x-2">
                      <Clock size={18} className="text-indigo-600" />
                      <span className="font-bold text-slate-900">
                        {booking.timing.nights} {booking.timing.nights === 1 ? 'night' : 'nights'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <div className="text-xs text-purple-600 font-semibold mb-2">Event Date & Time</div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={18} className="text-purple-600" />
                    <span className="font-bold text-slate-900">{booking.timing.event_date}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Financial Details */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Information</h3>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-green-200 flex items-center justify-center">
                      <DollarSign size={24} className="text-green-700" />
                    </div>
                    <div>
                      <div className="text-sm text-green-700 font-semibold">Total Amount</div>
                      <div className="text-3xl font-display text-green-900">
                        ${booking.financials.total_price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Meta */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-xs text-slate-600">
                Booking created on <span className="font-semibold text-slate-900">{booking.created_at}</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-slate-200 bg-slate-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => onStatusChange('confirmed')}
                className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
              >
                <Check size={18} />
                <span>Confirm</span>
              </button>

              <button
                onClick={() => onStatusChange('completed')}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                <Check size={18} />
                <span>Complete</span>
              </button>

              <button
                onClick={() => onStatusChange('cancelled')}
                className="flex items-center justify-center space-x-2 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                <X size={18} />
                <span>Cancel</span>
              </button>

              <button
                onClick={() => onStatusChange('archived')}
                className="flex items-center justify-center space-x-2 bg-slate-600 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors"
              >
                <Archive size={18} />
                <span>Archive</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-3 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorBookingsPage;