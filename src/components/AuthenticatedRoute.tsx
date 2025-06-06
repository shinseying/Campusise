
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthenticatedRouteProps {
  children: React.ReactNode;
}

const AuthenticatedRoute = ({ children }: AuthenticatedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
