import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import Homepage from '../pages/Homepage';
import LoginPage from '../pages/LoginPage';
import GuestRegistrationPage from '../pages/GuestRegistrationPage';
import VendorRegistrationPage from '../pages/VendorRegistrationPage';
import HelpCenter from '../pages/HelpCenter';

// Listing Pages
import HotelsPage from '../pages/HotelsPage';
import HotelDetails from '../pages/HotelDetails';
import EventsPage from '../pages/EventsPage';
import EventDetails from '../pages/EventDetails';

// Guest Pages
import MyBookingsPage from '../pages/MyBookingsPage';
import AddBooking from '../pages/AddBooking';

// Vendor Pages
import VendorDashboardPage from '../pages/VendorDashboardPage';
import EventCreationPage from '../pages/EventCreationPage';
import WaitingApprovalPage from '../pages/WaitingApprovalPage';
import NotFoundPage from '../pages/NotFoundPage';
import EventBookingPage from '../pages/EventBookingPage';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // 1. PUBLIC ROUTES
      { index: true, element: <Homepage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register/vendor', element: <VendorRegistrationPage /> },
      { path: 'register/guest', element: <GuestRegistrationPage /> },
      { path: 'help', element: <HelpCenter /> },

      // Hotel Discovery
      { path: 'hotels', element: <HotelsPage /> },
      { path: 'hotel/:id', element: <HotelDetails /> },

      // Event Discovery
      { path: 'events', element: <EventsPage /> },
      { path: 'event/:id', element: <EventDetails /> },

      // Waiting 
      { path: 'registration-pending', element: <WaitingApprovalPage/> },


      // 2. GUEST PROTECTED ROUTES (Need to be logged in as 'guest' or 'vendor')
      {
        element: <ProtectedRoute allowedRoles={['guest', 'vendor']} />,
        children: [
          { path: 'bookings', element: <MyBookingsPage /> },
          { path: 'booking/add', element: <AddBooking /> },
        ],
      },

      // 3. VENDOR PROTECTED ROUTES (Specifically for business management)
      {
        path: 'vendor',
        element: <ProtectedRoute allowedRoles={['vendor']} />,
        children: [
          { path: 'dashboard', element: <VendorDashboardPage /> },
          { path: 'hotels', element: <div className="p-20">Manage My Hotels</div> },
          { path: 'event/', element: <EventCreationPage /> },
          {
            path : 'event/edit/:id',element: <EventCreationPage />
          },
          { path: 'event/booking/:id', element: <EventBookingPage /> },
        ],
      },

      // 4. CATCH-ALL ROUTE (Not Found) 
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);