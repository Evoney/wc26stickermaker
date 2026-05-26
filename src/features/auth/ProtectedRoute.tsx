import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

function LoadingGate() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#002B5B] px-6 text-white">
      <div className="rounded-2xl border border-white/10 bg-[#001D3D]/75 px-6 py-5 text-center shadow-2xl backdrop-blur-md">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-[#FFD700]" />
        <p className="text-sm uppercase tracking-[0.28em] text-white/65">Carregando sessão</p>
      </div>
    </div>
  );
}

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingGate />;
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
