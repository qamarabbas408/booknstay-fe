import { createBrowserRouter } from 'react-router-dom';
// import MainLayout from '../components/layout/MainLayout';
import MainLayout from '../layouts/Mainlayout';
import Homepage from '../pages/Homepage';
import ProtectedRoute from './ProtectedRoute';
// Dummy components for now - create these files as simple functional components
const Login = () => <div className="p-20">Login Page</div>;
const HotelDetails = () => <div className="p-20">Hotel Details Page</div>;
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
        element: <Login />,
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