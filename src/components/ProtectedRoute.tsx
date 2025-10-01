import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps { children?: React.ReactNode }

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E7EFC7] to-[#AEC8A4]">
        <div className="bg-white/80 backdrop-blur px-6 py-4 rounded-xl shadow text-sm text-[#3B3B1A]">
          Checking authentication...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Support both wrapper usage (<ProtectedRoute><Page/></ProtectedRoute>) and route group + <Outlet />
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
