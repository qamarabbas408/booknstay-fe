import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import Homepage from '../pages/Homepage';
import LoginPage from '../pages/auth/LoginPage';
import GuestRegistrationPage from '../pages/auth/GuestRegistrationPage';
// import VendorRegistrationPage from '../pages/VendorRegistrationPage';
import VendorRegistrationPage from '../pages/v2/VendorRegistrationPage';
import HelpCenter from '../pages/HelpCenter';

// Listing Pages
import HotelsPage from '../pages/hotel/HotelsPage';
import HotelDetails from '../pages/hotel/HotelDetails';
import EventsPage from '../pages/event/EventsPage';
import EventDetails from '../pages/event/EventDetails';

// Guest Pages
import MyBookingsPage from '../pages/guest/MyBookingsPage';
import AddBooking from '../pages/guest/AddBooking';

// Vendor Pages
import VendorDashboardPage from '../pages/vendor/VendorDashboardPage';
import EventCreationPage from '../pages/event/EventCreationPage';
import WaitingApprovalPage from '../pages/vendor/WaitingApprovalPage';
import NotFoundPage from '../pages/NotFoundPage';
import EventBookingPage from '../pages/event/EventBookingPage';
import HotelRegistrationPage from '../pages/hotel/HotelRegistrationPage';
import ListPropertiesPage from '../pages/vendor/VendorPropertiesPage';
import { AppRoutes } from '../utils/AppRoutes';
import CreateRoomTierPage from '../pages/vendor/CreateRoomTierPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // 1. PUBLIC ROUTES
      { index: true, element: <Homepage /> },
      { path: AppRoutes.login, element: <LoginPage /> },
      { path: AppRoutes.registerVendor, element: <VendorRegistrationPage /> },
      { path: AppRoutes.registerGuest, element: <GuestRegistrationPage /> },
      { path: AppRoutes.help, element: <HelpCenter /> },

      // Hotel Discovery
      { path: AppRoutes.hotels, element: <HotelsPage /> },
      { path: AppRoutes.hotelDetails, element: <HotelDetails /> },

      // Event Discovery
      { path: AppRoutes.events, element: <EventsPage /> },
      { path: AppRoutes.eventDetails, element: <EventDetails /> },

      // Waiting 
      { path: AppRoutes.registrationPending, element: <WaitingApprovalPage /> },


      // 2. GUEST PROTECTED ROUTES (Need to be logged in as 'guest' or 'vendor')
      {
        element: <ProtectedRoute allowedRoles={['guest']} />,
        children: [
          { path: AppRoutes.guestDashboard, element: <MyBookingsPage /> },
          { path: AppRoutes.addBooking, element: <AddBooking /> },
          { path: AppRoutes.eventBooking, element: <EventBookingPage /> },

        ],
      },

      // 3. VENDOR PROTECTED ROUTES (Specifically for business management)
      {
        path: AppRoutes.vendorBase,
        element: <ProtectedRoute allowedRoles={['vendor']} />,
        children: [
          { path: AppRoutes.vendorDashboard, element: <VendorDashboardPage /> },
          { path: AppRoutes.vendorEventCreate, element: <EventCreationPage /> },
          { path: AppRoutes.vendorEventEdit, element: <EventCreationPage /> },
          { path: AppRoutes.vendorAddHotel, element: <HotelRegistrationPage /> },
          { path: AppRoutes.vendorPropertyList, element: <ListPropertiesPage /> },
          { path: AppRoutes.vendorAddRoomtier, element: <CreateRoomTierPage /> },



        ],
      },

      // 4. CATCH-ALL ROUTE (Not Found) 
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);