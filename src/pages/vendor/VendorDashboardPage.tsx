import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { Calendar, BarChart2, LogOut, Ticket, Building2, ChevronLeft, ChevronRight, Menu, Settings } from 'lucide-react';
import { APIENDPOINTS } from '../../utils/ApiConstants';
import { CustomToaster, showToast } from '../../components/CustomToaster';

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

  useEffect(() => {
    const handleSectionUpdate = () => {
      const section = localStorage.getItem('vendor_dashboard_active_section');
      if (section) setActiveSection(section);
    };
    window.addEventListener('vendor_dashboard_section_update', handleSectionUpdate);
    return () => window.removeEventListener('vendor_dashboard_section_update', handleSectionUpdate);
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<VendorHotel | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);
  const [deleteRoomType, { isLoading: isDeletingRoom }] = useDeleteRoomTypeMutation();

  const handleLogout = () => {
    localStorage.removeItem('vendor_dashboard_active_section');
    dispatch(logout());
    navigate('/login');
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
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white/80 backdrop-blur-xl border-r border-white/40 shadow-xl z-30 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${desktopSidebarOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full'
        }`}>

        <div className="p-6 h-full flex flex-col">
          <nav className="space-y-2 flex-1 overflow-y-auto py-2 custom-scrollbar">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart2 size={20} /> },
              { id: 'bookings', label: 'My Bookings', icon: <Calendar size={20} /> },
              { id: 'properties', label: 'My Hotels', icon: <Building2 size={20} /> },
              { id: 'events', label: 'My Events', icon: <Ticket size={20} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },

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

      {/* Desktop Sidebar Toggle Button (Fixed) */}
      <div className="hidden lg:flex fixed top-24 z-40 items-center group" style={{ left: desktopSidebarOpen ? '288px' : '24px' }}>
        <button
          onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
          className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 p-3 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 hover:scale-110 active:scale-95"
          title={desktopSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {desktopSidebarOpen ? (
            <ChevronLeft size={24} className="transition-transform duration-500" />
          ) : (
            <ChevronRight size={24} className="transition-transform duration-500" />
          )}
        </button>

        {/* Tooltip Badge */}
        <div className="ml-3 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {desktopSidebarOpen ? 'Click to Collapse' : 'Click to Expand'}
        </div>
      </div>

      {/* Main Content */}
      <main className={` pb-20 pt-12 px-4 lg:px-6 transition-all duration-300 ${desktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Desktop Sidebar Toggle */}

          {activeSection === 'properties' ? (
            <VendorHotelsPage />
          ) : activeSection === 'events' ? (
            <VendorEventsPage />
          ) : activeSection === 'bookings' ? (
            <VendorBookingsPage />
          ) : activeSection === 'settings'? (
            <div>Settings</div>
          ) : (
            <>
              <VendorAnalyticsDashboard viewAllBookings={() => setActiveSection('bookings')} />
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
