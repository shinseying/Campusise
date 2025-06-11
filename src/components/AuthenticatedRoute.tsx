
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Auth from '@/pages/Auth';

interface AuthenticatedRouteProps {
  children: React.ReactNode;
}

const AuthenticatedRoute = ({ children }: AuthenticatedRouteProps) => {
  const { user, loading } = useAuth();

  console.log('AuthenticatedRoute - User:', user, 'Loading:', loading);

  if (loading) {
    console.log('AuthenticatedRoute - Still loading auth...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">인증 정보를 확인하는 중...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('AuthenticatedRoute - No user, redirecting to auth...');
    return <Auth />;
  }

  console.log('AuthenticatedRoute - User authenticated, rendering children...');
  return <>{children}</>;
};

export default AuthenticatedRoute;
