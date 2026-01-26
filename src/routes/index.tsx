import { createBrowserRouter } from 'react-router-dom';
// import MainLayout from '../components/layout/MainLayout';
import MainLayout from '../layouts/Mainlayout';
import Homepage from '../pages/Homepage';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import RegisterNowPage from '../pages/RegisterNowPage';
import HotelDetails from '../pages/HotelDetails';
import EventsPage from '../pages/EventsPage';
import EventDetails from '../pages/EventDetails';
const VendorDashboard = () => <div className="p-20">Vendor Dashboard</div>;

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