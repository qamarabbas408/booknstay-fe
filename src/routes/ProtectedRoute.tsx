import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface Props {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // 1. Not logged in? Go to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in, but account is pending/banned?
  // If they are a vendor and not active, send them to a "Pending Approval" page
  if (user.role === 'vendor' && user.status !== 'active') {
    return <Navigate to="/registration-pending" replace />;
  }

  // 3. Wrong role? (e.g. Guest trying to enter Vendor Dashboard)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;