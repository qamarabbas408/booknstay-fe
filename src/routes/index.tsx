import { createBrowserRouter } from 'react-router-dom';
import Homepage from '../pages/Homepage';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import RegisterNowPage from '../pages/RegisterNowPage';
import HotelDetails from '../pages/HotelDetails';
import EventsPage from '../pages/EventsPage';
import EventDetails from '../pages/EventDetails';
const VendorDashboard = () => <div className="p-20">Vendor Dashboard</div>;
import MainLayout from '../layouts/MainLayout';
import HotelsPage from '../pages/HotelsPage';
import MyBookingsPage from '../pages/MyBookingsPage';
import EventRegistrationPage from '../pages/EventRegistrationPage';
import EventCreationPage from '../pages/EventCreationPage';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: 'hotel/:id',
        element: <HotelDetails />,
      },
        {
        path: 'hotels',
        element: <HotelsPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
       {
        path: 'register',
        element: <RegisterNowPage />,
      },
       {
        path: 'events',
        element: <EventsPage />,
      },
       {
        path: 'event/:id',
        element: <EventDetails />,
      },
      {
        path: 'bookings',
        element: <MyBookingsPage />,
      },
       {
        path: 'event/registration',
        element: <EventRegistrationPage />,
      },
      {
        path: 'event/create',
        element: <EventCreationPage />,
      },
    ],
  },
  // Protected Vendor Routes
  {
    path: '/vendor',
    element: <ProtectedRoute allowedRoles={['vendor']} />,
    children: [
      {
        path: 'dashboard',
        element: <VendorDashboard />,
      },
      {
        path: 'hotels',
        element: <div className="p-20">Manage Hotels</div>,
      },
    ],
  },
]);