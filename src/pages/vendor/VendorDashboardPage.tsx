import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { Calendar, BarChart2, Hotel, LogOut, Ticket, Building2, Menu } from 'lucide-react';
import { useGetVendorHotelsQuery } from '../../store/services/hotelApi';
import { APIENDPOINTS } from '../../utils/ApiConstants';
import { CustomToaster, showToast } from '../../components/CustomToaster';
import SkeletonLoader from '../../components/SkeletonLoader';
import { AppRoutes } from '../../utils/AppRoutes';
import HotelSelectionModal from '../../components/HotelSelectionModal';
import RoomManagementSection from '../../components/RoomManagementSection';
import { useDeleteRoomTypeMutation } from '../../store/services/roomApi';
import ConfirmationModal from '../../components/vendor/ConfirmationModal';
import VendorAnalyticsDashboard from '../../components/vendor/AnalyticsDashboard';
import VendorBookingsPage from '../../components/vendor/VendorBookingsPage';
import VendorEventsPage from '../../components/vendor/VendorEventsPage';
import VendorHotelsPage from '../../components/vendor/VendorsHotelsPage';
import type { VendorHotel } from '../../store/services/hotelApi';

const VendorDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('vendor_dashboard_active_section') || 'overview';
  });

  useEffect(() => {
    localStorage.setItem('vendor_dashboard_active_section', activeSection);
  }, [activeSection]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<VendorHotel | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);
  const [deleteRoomType, { isLoading: isDeletingRoom }] = useDeleteRoomTypeMutation();

  const handleLogout = () => {
    localStorage.removeItem('vendor_dashboard_active_section');
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

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
    if (path.startsWith('http')) return path;
    return `${APIENDPOINTS.content_url}${path}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <CustomToaster />
  
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          aria-label="Toggle Dashboard Menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white/80 backdrop-blur-xl border-r border-white/40 shadow-xl z-30 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="p-6 h-full flex flex-col">
          <nav className="space-y-2 flex-1 overflow-y-auto py-2 custom-scrollbar">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart2 size={20} /> },
              { id: 'bookings', label: 'My Bookings', icon: <Calendar size={20} /> },
              { id: 'properties', label: 'My Hotels', icon: <Building2 size={20} /> },
              { id: 'events', label: 'My Events', icon: <Ticket size={20} /> },
              { id: 'rooms', label: 'Room Management', icon: <Hotel size={20} /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeSection === item.id
                  ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
              >
                <span className={`transition-transform duration-200 ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                <span className="ml-3 font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-200/60 mt-auto">
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
            <VendorHotelsPage />
          ) : activeSection === 'events' ? (
            <VendorEventsPage />
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
                  location: selectedHotel.location?.city,
                  rating: selectedHotel.rating || 0,
                  image: getImageUrl(selectedHotel.image),
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
                hotels={allHotelsData?.data?.map((h: VendorHotel) => ({
                  id: h.id,
                  name: h.name,
                  location: h.location?.city,
                  rating: h.rating || 0,
                  image: getImageUrl(h.image),
                  roomCount: h.room_tiers?.length || 0
                })) || []}
                onClose={() => setShowHotelModal(false)}
                onSelect={(hotel) => {
                  const fullHotel = allHotelsData?.data?.find((h: VendorHotel) => h.id === hotel.id);
                  if (fullHotel) setSelectedHotel(fullHotel);
                  setShowHotelModal(false);
                }}
                isLoading={isLoadingAllHotels}
              />
            </>
            )
          ) : activeSection === 'bookings' ? (
            <VendorBookingsPage />
          ) : (
            <>
              <VendorAnalyticsDashboard />
            </>
          )}
        </div>
      </main>

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
          
    </div>


  );
};
export default VendorDashboardPage; 
