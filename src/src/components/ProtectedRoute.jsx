import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin }) {
  const { user } = useAuth();

  // If not logged in, send to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If admin is required but user is a regular customer, send to home page
  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // If authorized, render the requested component
  return children;
}