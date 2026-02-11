import React, { useState, useEffect } from 'react';
import RoomCard from '../../components/vendor/RoomCard';
import SectionHeader from '../../components/vendor/SectionHeader';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { Calendar, Users, Star, DollarSign, BarChart2, Hotel, MessageSquare, Settings, ChevronRight, AlertTriangle, CheckCircle, Clock, Bell, Search, Filter, Download, TrendingUp, TrendingDown, Menu, X, Phone, Mail, MapPin, Edit, Trash2, Plus, Eye, LogOut, Ticket, Building2, Home } from 'lucide-react';
import { useGetVendorEventsQuery, useDeleteEventMutation } from '../../store/services/eventApi';
import { useDeleteHotelMutation, useGetVendorHotelsQuery } from '../../store/services/hotelApi';
import { APIENDPOINTS } from '../../utils/ApiConstants';
import PulseLoader from '../../components/PulseLoader';
import { CustomToaster, showToast } from '../../components/CustomToaster';
import VendorPropertiesPage from './VendorPropertiesPage';
import SkeletonLoader from '../../components/SkeletonLoader';
import EventCard from '../../components/vendor/EventCard';
import { AppRoutes } from '../../utils/AppRoutes';
import HotelSelectionModal, {type  HotelType } from '../../components/HotelSelectionModal';
import RoomManagementSection from '../../components/RoomManagementSection';
import { useDeleteRoomTypeMutation, useGetRoomTiersByHotelIdQuery } from '../../store/services/roomApi';
import VendorHotelCard from '../../components/vendor/VendorHotelCard';
import ConfirmationModal from '../../components/vendor/ConfirmationModal';
// import VendorHotelDetailsModal from '../../components/vendor/VendorHotelDetailsModal';
import VendorHotelDetailsModal from '../../components/vendor/VendorHotelDetailsModal';
import RoomTiersModal from '../../components/vendor/RoomTierModal';

// Mock data for hotel vendor dashboard
interface Stat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  positive?: boolean;
}

const mockStats: Stat[] = [
  {
    title: 'Total Bookings',
    value: 156,
    icon: <Calendar className="text-indigo-600" size={24} />,
    change: '+12%',
    positive: true,
  },
  {
    title: 'Occupancy Rate',
    value: '78%',
    icon: <Users className="text-indigo-600" size={24} />,
    change: '+5%',
    positive: true,
  },
  {
    title: 'Revenue This Month',
    value: '$42,500',
    icon: <DollarSign className="text-indigo-600" size={24} />,
    change: '-2%',
    positive: false,
  },
  {
    title: 'Average Rating',
    value: 4.7,
    icon: <Star className="text-indigo-600" size={24} />,
    change: '+0.2',
    positive: true,
  },
];

interface Booking {
  id: number;
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'checked-in';
  amount: string;
  phone?: string;
  email?: string;
}

const mockBookings: Booking[] = [
  {
    id: 1,
    guestName: 'Ahmed Khan',
    checkIn: 'Jan 28, 2026',
    checkOut: 'Feb 2, 2026',
    roomType: 'Deluxe Suite',
    status: 'confirmed',
    amount: '$1,250',
    phone: '+92 300 1234567',
    email: 'ahmed@example.com',
  },
  {
    id: 2,
    guestName: 'Sara Ali',
    checkIn: 'Jan 30, 2026',
    checkOut: 'Feb 1, 2026',
    roomType: 'Standard Room',
    status: 'pending',
    amount: '$380',
    phone: '+92 301 7654321',
    email: 'sara@example.com',
  },
  {
    id: 3,
    guestName: 'John Doe',
    checkIn: 'Feb 5, 2026',
    checkOut: 'Feb 10, 2026',
    roomType: 'Executive Villa',
    status: 'confirmed',
    amount: '$2,100',
    phone: '+1 555 123 4567',
    email: 'john@example.com',
  },
  {
    id: 4,
    guestName: 'Maria Garcia',
    checkIn: 'Jan 28, 2026',
    checkOut: 'Jan 29, 2026',
    roomType: 'Standard Room',
    status: 'checked-in',
    amount: '$190',
    phone: '+34 600 111 222',
    email: 'maria@example.com',
  },
];



interface Review {
  id: number;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
  responded: boolean;
}

const mockReviews: Review[] = [
  {
    id: 1,
    guestName: 'Ahmed Khan',
    rating: 5,
    comment: 'Amazing stay! Staff was wonderful and the room was spotless.',
    date: 'Jan 20, 2026',
    responded: true,
  },
  {
    id: 2,
    guestName: 'Sara Ali',
    rating: 4.5,
    comment: 'Great location, rooms were clean. Minor issue with WiFi.',
    date: 'Jan 15, 2026',
    responded: false,
  },
  {
    id: 3,
    guestName: 'John Doe',
    rating: 4,
    comment: 'Good value for money. Breakfast could be improved.',
    date: 'Jan 10, 2026',
    responded: true,
  },
];

interface Notification {
  id: number;
  type: 'booking' | 'review' | 'maintenance' | 'payment';
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'booking',
    message: 'New booking from Sara Ali',
    time: '5 mins ago',
    read: false,
  },
  {
    id: 2,
    type: 'review',
    message: 'New review received (4.5 stars)',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'maintenance',
    message: 'Room 305 maintenance completed',
    time: '2 hours ago',
    read: true,
  },
  {
    id: 4,
    type: 'payment',
    message: 'Payment received: $1,250',
    time: '3 hours ago',
    read: true,
  },
];

const VendorDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);
  const [hotelToDelete, setHotelToDelete] = useState<number | null>(null);
  const [selectedHotelIdForTiers, setSelectedHotelIdForTiers] = useState<number | null>(null);
  const [showHotelDetailsModal, setShowHotelDetailsModal] = useState(false);
  const [selectedHotelIdForDetails, setSelectedHotelIdForDetails] = useState<number | null>(null);
  const [hotelNameToDelete, setHotelNameToDelete] = useState<string>('');

  const { data: vendorEventsData, isLoading: isLoadingEvents } = useGetVendorEventsQuery();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
  const [deleteRoomType, { isLoading: isDeletingRoom }] = useDeleteRoomTypeMutation();
  const { data: vendorHotelsData, isLoading: isLoadingHotels } = useGetVendorHotelsQuery({});

  const { data: roomTiersData, isLoading: isLoadingRoomTiers } = useGetRoomTiersByHotelIdQuery(selectedHotelIdForTiers!, {
    skip: !selectedHotelIdForTiers,
  });

  const [deleteHotel, { isLoading: isDeletingHotel }] = useDeleteHotelMutation();

  const vendorEvents = vendorEventsData?.data || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Fetch initial hotel for Room Management (limit 1)
  const { data: initialHotelData, isLoading: isLoadingInitialHotel } = useGetVendorHotelsQuery(
    { limit: 1 },
    { skip: activeSection !== 'rooms' || !!selectedHotel }
  );

  // Fetch all hotels for selection modal
  const { data: allHotelsData, isLoading: isLoadingAllHotels } = useGetVendorHotelsQuery(
    { limit: 100 },
    { skip: !showHotelModal }
  );

  useEffect(() => {
    if (activeSection === 'rooms' && !selectedHotel && initialHotelData && initialHotelData?.data?.length > 0) {
      setSelectedHotel(initialHotelData?.data[0]);
    }
  }, [activeSection, initialHotelData, selectedHotel]);

  const unreadNotifications = mockNotifications.filter(n => !n.read).length;

  const filteredBookings = mockBookings.filter(booking =>
    booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.roomType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id: number) => {
    setEventToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      try {
        await deleteEvent(eventToDelete).unwrap();
        showToast.success('Event deleted successfully');
        setEventToDelete(null);
      } catch (error) {
        console.error('Failed to delete event:', error);
        showToast.error('Failed to delete event');
      }
    }
  };

  const handleConfirmDeleteRoom = async () => {
    if (roomToDelete && selectedHotel) {
      try {
        await deleteRoomType(roomToDelete).unwrap();
        showToast.success('Room type deleted successfully');
        
        // Update local state to remove the deleted room immediately
        const updatedRoomTiers = selectedHotel.room_tiers.filter((tier: any) => tier.id !== roomToDelete);
        setSelectedHotel({
          ...selectedHotel,
          room_tiers: updatedRoomTiers
        });
        
        setRoomToDelete(null);
      } catch (error: any) {
        console.error('Failed to delete room:', error);
        showToast.error(error?.data?.message || 'Failed to delete room type');
      }
    }
  };

  const handleDeleteRoomTierDirectly = async (tierId: number) => {
    try {
      await deleteRoomType(tierId).unwrap();
      showToast.success('Room type deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete room tier:', error);
      showToast.error(error?.data?.message || 'Failed to delete room type');
    }
  };

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
    if (path.startsWith('http')) return path;
    return `${APIENDPOINTS.content_url}${path}`;
  };

  const handleEditHotel = (hotelId: number) => {
    navigate(`/vendor/hotel/${hotelId}/edit`);
  };

  const handleDeleteHotel = (hotelId: number) => {
    const hotel = vendorHotelsData?.data?.find((h: any) => h.id === hotelId);
    if (hotel) {
      setHotelToDelete(hotelId);
      setHotelNameToDelete(hotel.name);
    }
  };

  const handleConfirmDeleteHotel = async () => {
    if (hotelToDelete) {
      try {
        await deleteHotel(hotelToDelete).unwrap();
        showToast.success('Hotel deleted successfully');
        setHotelToDelete(null);
        setHotelNameToDelete('');
      } catch (error) {
        console.error('Failed to delete Hotel:', error);
        showToast.error('Failed to delete hotel');
      }
    }
  };

  const handleCancelDeleteHotel = () => {
    setHotelToDelete(null);
    setHotelNameToDelete('');
  };

  const handleToggleHotelStatus = (hotelId: number) => {
    console.log("Toggle status for hotel:", hotelId);
    // TODO: Implement status toggle API call
     
  };

  const handleManageTier = (hotelId: number) => {
    setSelectedHotelIdForTiers(hotelId);
  };

  const handleViewHotelDetails = (hotelId: number) => {
    setSelectedHotelIdForDetails(hotelId);
    setShowHotelDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <CustomToaster />
  

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white/90 backdrop-blur-md border-r border-slate-200 shadow-lg z-30 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="p-6 h-full flex flex-col">
          <nav className="space-y-2 flex-1">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart2 size={20} /> },
              { id: 'bookings', label: 'Bookings', icon: <Calendar size={20} /> },
              { id: 'properties', label: 'Hotel Management', icon: <Building2 size={20} /> },
              { id: 'events', label: 'Event Management', icon: <Ticket size={20} /> },
              { id: 'rooms', label: 'Room Management', icon: <Hotel size={20} /> },
              // { id: 'reviews', label: 'Reviews & Ratings', icon: <Star size={20} /> },
              // { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={20} /> },
              // { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeSection === item.id
                  ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-700 hover:bg-slate-100'
                  }`}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              <span className="ml-3 font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-24 pb-20 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {activeSection === 'properties' ? (
            <div style={{
              animationDelay: '0s'
            }} className="glass rounded-3xl overflow-hidden shadow-lg hover:shadow-xl card-hover border border-white/40 animate-fadeInUp">
              <SectionHeader
                icon={<Building2 size={24} className="text-white" />}
                title="Your Properties"
                description="Manage your hotels, tickets, and listings"
                buttonText="Add your Hotel"
                onButtonClick={() => navigate(`/${AppRoutes.vendorBase}/${AppRoutes.vendorAddHotel}`)}
                gradientFrom="from-purple-600"
                gradientTo="to-pink-600"
              />

              {isLoadingHotels ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <SkeletonLoader key={i} type="hotel" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {vendorHotelsData?.data.map((hotel: any) => (
                    <VendorHotelCard
                      key={hotel.id}
                      hotel={{
                        id: hotel.id,
                        name: hotel.name,
                        description: hotel.description,
                        image: hotel.images?.[0]?.path || '',
                        thumbnail: hotel.images?.[0]?.path || '',
                        room_tiers: hotel.room_tiers || [],
                        gallery: hotel.images?.map((img: any, index: number) => ({ id: img.id, url: img.path, is_primary: index === 0 })) || [],
                        location: {
                          country: hotel.location?.country || '',
                          city: hotel.location?.city || hotel.city || '',
                          full_address: hotel.location?.full_address || hotel.address || '',
                          zip_code: hotel.location?.zip_code || '',
                          latitude: Number(hotel.location?.latitude) || 0,
                          longitude: Number(hotel.location?.longitude) || 0,
                        },
                        amenities: hotel.amenities || [],
                        location_summary: `${hotel.city}, ${hotel.location?.country || ''}`,
                        stars: hotel.star_rating || 0,
                        status: hotel.status,
                        pricePerNight: hotel.room_types_min_base_price || 0,
                        bookings: hotel.bookings_count || 0,
                        revenue: hotel.bookings_sum_total_price || 0,
                        rating: hotel.reviews_avg_rating || 0,
                        reviews: hotel.reviews_count || 0,
                        createdAt: hotel.createdAt,
                      }}
                      baseImageUrl={APIENDPOINTS.content_url}
                      onEdit={handleEditHotel}
                      onDelete={handleDeleteHotel}
                      onToggleStatus={handleToggleHotelStatus}
                      onTierManage={handleManageTier}
                      onViewDetails={handleViewHotelDetails}
                    />
                  ))}
                  {(!vendorHotelsData?.data || vendorHotelsData.data.length === 0) && (
                    <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">
                      <p>No properties found. Add your first hotel to get started!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : activeSection === 'events' ? (
            <div className="animate-fadeIn">

              <SectionHeader
                icon={<Building2 size={24} className="text-white" />}
                title="Event Management"
                description="Manage your events, tickets, and listings"
                buttonText="Add an Event"
                onButtonClick={() => navigate('/vendor/event')}
                gradientFrom="from-purple-600"
                gradientTo="to-pink-600"
              />

              {isLoadingEvents ? (
                <div className="flex justify-center py-12">
                  <PulseLoader />
                </div>
              ) : vendorEvents.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">
                  <p>No events found. Create your first event to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vendorEvents.map(event => (
                    <EventCard
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      startDate={event.start_date}
                      status={event.status}
                      category={event.category}
                      ticketsSold={event.tickets_sold}
                      revenue={event.revenue}
                      onEdit={(id) => navigate(`/vendor/event/edit/${id}`)}
                      onDelete={(id) => handleDeleteClick(id)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : activeSection === 'rooms' ? (
            isLoadingInitialHotel ? (
              <div className="animate-fadeIn space-y-8">
                {/* Header Skeleton */}
                <div className="h-32 bg-slate-100 rounded-2xl animate-pulse border border-slate-200"></div>
                
                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-slate-200"></div>
                  ))}
                </div>

                {/* Room Cards Skeleton */}
                <div>
                  <div className="h-8 w-48 bg-slate-200 rounded-lg mb-6 animate-pulse"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {[...Array(3)].map((_, i) => (
                      <SkeletonLoader key={i} type="hotel" />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
            <>
              <RoomManagementSection
                selectedHotel={selectedHotel ? {
                  id: selectedHotel.id,
                  name: selectedHotel.name,
                  location: selectedHotel.city,
                  rating: selectedHotel.reviews_avg_rating || 0,
                  image: getImageUrl(selectedHotel.images?.[0]?.path),
                  roomCount: selectedHotel.room_tiers?.length || 0
                } : null}
                rooms={selectedHotel?.room_tiers?.map((tier: any) => ({
                  id: tier.id,
                  type: tier.type,
                  total: tier.total_inventory,
                  available: tier.available,
                  pricePerNight: `$${tier.base_price}`,
                  status: tier.status,
                  amenities: []
                })) || []}
                onChangeHotel={() => setShowHotelModal(true)}
                onEditRoom={(roomId) => {
                  if (selectedHotel) {
                    navigate(`/${AppRoutes.vendorBase}/${AppRoutes.editRoomtier}${roomId}`);
                  }
                }}
                onDeleteRoom={(roomId) => {
                  setRoomToDelete(roomId);
                }}
              />
              <HotelSelectionModal
                isOpen={showHotelModal}
                hotels={allHotelsData?.data?.map((h: any) => ({
                  id: h.id,
                  name: h.name,
                  location: h.city,
                  rating: h.reviews_avg_rating || 0,
                  image: getImageUrl(h.images?.[0]?.path),
                  roomCount: h.room_tiers?.length || 0
                })) || []}
                onClose={() => setShowHotelModal(false)}
                onSelect={(hotel) => {
                  const fullHotel = allHotelsData?.data?.find((h: any) => h.id === hotel.id);
                  if (fullHotel) setSelectedHotel(fullHotel);
                  setShowHotelModal(false);
                }}
                isLoading={isLoadingAllHotels}
              />
            </>
            )
          ) : activeSection === 'bookings' ? (
            <div>booking</div>
          ) : (
            <>
              {/* Welcome Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Welcome back, Qamar</h1>
                  <p className="text-slate-600">Here's what's happening with your hotel today</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white border border-slate-300 rounded-xl hover:shadow-md transition-all flex items-center gap-2">
                    <Download size={18} />
                    <span className="hidden md:inline">Export</span>
                  </button>
                  <button className="px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                    <Plus size={18} />
                    <span className="hidden md:inline">New Booking</span>
                  </button>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {mockStats.map((stat, idx) => (
                  <div key={idx} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-indigo-50 rounded-xl">
                        {stat.icon}
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${stat.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {stat.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {stat.change}
                      </div>
                    </div>
                    <h3 className="text-sm text-slate-600 mb-1">{stat.title}</h3>
                    <div className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-xl transition-all text-center">
                    <Calendar className="mx-auto mb-2" size={24} />
                    <span className="text-sm font-medium">Check-ins Today</span>
                    <p className="text-2xl font-bold mt-1">3</p>
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-xl transition-all text-center">
                    <Clock className="mx-auto mb-2" size={24} />
                    <span className="text-sm font-medium">Check-outs Today</span>
                    <p className="text-2xl font-bold mt-1">5</p>
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-xl transition-all text-center">
                    <AlertTriangle className="mx-auto mb-2" size={24} />
                    <span className="text-sm font-medium">Pending Tasks</span>
                    <p className="text-2xl font-bold mt-1">2</p>
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-xl transition-all text-center">
                    <MessageSquare className="mx-auto mb-2" size={24} />
                    <span className="text-sm font-medium">New Messages</span>
                    <p className="text-2xl font-bold mt-1">7</p>
                  </button>
                </div>
              </div>

              {/* Mobile Search */}
              <div className="md:hidden mb-6">
                <div className="flex items-center bg-white rounded-xl px-4 py-3 border border-slate-200">
                  <Search size={18} className="text-slate-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent outline-none text-sm w-full"
                  />
                </div>
              </div>

              {/* Recent Bookings */}
              <section className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                    <Calendar className="text-indigo-600 mr-3" size={24} />
                    Recent Bookings
                  </h2>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded-xl hover:shadow-md transition-all flex items-center gap-2">
                      <Filter size={18} />
                      Filter
                    </button>
                    <button className="text-indigo-600 font-medium hover:underline flex items-center">
                      View All
                      <ChevronRight size={18} className="ml-1" />
                    </button>
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-lg border border-slate-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 text-left text-sm text-slate-600 border-b border-slate-200">
                        <th className="p-4 font-semibold">Guest</th>
                        <th className="p-4 font-semibold">Check-in</th>
                        <th className="p-4 font-semibold">Check-out</th>
                        <th className="p-4 font-semibold">Room Type</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold">Amount</th>
                        <th className="p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map(booking => (
                        <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <div className="font-medium text-slate-900">{booking.guestName}</div>
                            <div className="text-sm text-slate-500">{booking.email}</div>
                          </td>
                          <td className="p-4 text-slate-700">{booking.checkIn}</td>
                          <td className="p-4 text-slate-700">{booking.checkOut}</td>
                          <td className="p-4 text-slate-700">{booking.roomType}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                booking.status === 'checked-in' ? 'bg-blue-100 text-blue-700' :
                                  'bg-red-100 text-red-700'
                              }`}>
                              {booking.status === 'confirmed' && <CheckCircle size={14} />}
                              {booking.status === 'pending' && <Clock size={14} />}
                              {booking.status === 'cancelled' && <X size={14} />}
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-900">{booking.amount}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedBooking(booking)}
                                className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              <button className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors" title="Edit">
                                <Edit size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {filteredBookings.map(booking => (
                    <div key={booking.id} className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-slate-900">{booking.guestName}</h3>
                          <p className="text-sm text-slate-500">{booking.roomType}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            booking.status === 'checked-in' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                          }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600 mb-3">
                        <div className="flex justify-between">
                          <span>Check-in:</span>
                          <span className="font-medium">{booking.checkIn}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-out:</span>
                          <span className="font-medium">{booking.checkOut}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-bold text-slate-900">{booking.amount}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-slate-200">
                        <button className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
                          View Details
                        </button>
                        <button className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>


              {/* Recent Reviews */}
              <section>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                    <MessageSquare className="text-indigo-600 mr-3" size={24} />
                    Recent Reviews
                  </h2>
                  <button className="text-indigo-600 font-medium hover:underline flex items-center">
                    View All
                    <ChevronRight size={18} className="ml-1" />
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {mockReviews.map(review => (
                    <div key={review.id} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-amber-50 px-3 py-1 rounded-lg">
                            <Star size={16} fill="#f59e0b" className="text-amber-500 mr-1" />
                            <span className="font-bold text-amber-700">{review.rating}</span>
                          </div>
                          {review.responded && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                              Responded
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-slate-500">{review.date}</span>
                      </div>
                      <p className="text-slate-700 mb-4 leading-relaxed">{review.comment}</p>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                        <p className="text-sm font-medium text-slate-900">- {review.guestName}</p>
                        {!review.responded && (
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                            Reply
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-900">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 text-lg">Guest Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Users size={18} className="text-indigo-600" />
                      <span>{selectedBooking.guestName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Mail size={18} className="text-indigo-600" />
                      <span>{selectedBooking.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Phone size={18} className="text-indigo-600" />
                      <span>{selectedBooking.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-semibold text-slate-900 mb-3 text-lg">Booking Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Check-in</p>
                      <p className="font-semibold text-slate-900">{selectedBooking.checkIn}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Check-out</p>
                      <p className="font-semibold text-slate-900">{selectedBooking.checkOut}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Room Type</p>
                      <p className="font-semibold text-slate-900">{selectedBooking.roomType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        selectedBooking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          selectedBooking.status === 'checked-in' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-indigo-600">{selectedBooking.amount}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-slate-200">
                  <button className="flex-1 px-4 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                    Confirm Booking
                  </button>
                  <button className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:shadow-md transition-all">
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEventToDelete(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Delete Event?</h3>
              <p className="text-slate-600">
                Are you sure you want to delete this event? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEventToDelete(null)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Delete Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Room Confirmation Modal */}
      <ConfirmationModal
        title="Delete Room Type?"
        message="Are you sure you want to delete this room type? This action cannot be undone."
        isOpen={!!roomToDelete}
        isLoading={isDeletingRoom}
        onConfirm={handleConfirmDeleteRoom}
        onCancel={() => setRoomToDelete(null)}
        confirmText="Delete Room"
        isDangerous={true}
      />

      {/* Delete Hotel Confirmation Modal */}
      <ConfirmationModal
        title="Delete Hotel?"
        message={`Are you sure you want to delete "${hotelNameToDelete}"? This action cannot be undone.`}
        isOpen={!!hotelToDelete}
        isLoading={isDeletingHotel}
        onConfirm={handleConfirmDeleteHotel}
        onCancel={handleCancelDeleteHotel}
        confirmText="Delete Hotel"
        isDangerous={true}
      />

      {/* Hotel Details Modal */}
      <VendorHotelDetailsModal
        isOpen={showHotelDetailsModal}
        hotelId={selectedHotelIdForDetails}
        onClose={() => setShowHotelDetailsModal(false)}
      />

      {/* Room Tiers Management Modal */}
      {selectedHotelIdForTiers && (
        <RoomTiersModal
          isOpen={!!selectedHotelIdForTiers}
          onClose={() => setSelectedHotelIdForTiers(null)}
          hotelName={vendorHotelsData?.data.find((h: any) => h.id === selectedHotelIdForTiers)?.name || 'Hotel'}
          roomTiers={roomTiersData?.data || []}
          isLoading={isLoadingRoomTiers}
          onAddTier={() => navigate(`/${AppRoutes.vendorBase}/${AppRoutes.vendorAddRoomtier}/${selectedHotelIdForTiers}`)}
          onEditTier={(tierId) => navigate(`/${AppRoutes.vendorBase}/${AppRoutes.editRoomtier}/${tierId}`)}
          onDeleteTier={handleDeleteRoomTierDirectly}
        />
      )}
          
    </div>


  );
};
export default VendorDashboardPage; 
