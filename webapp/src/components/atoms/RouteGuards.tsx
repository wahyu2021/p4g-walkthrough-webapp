import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useProgress } from '../../hooks/useProgress';

export function ProtectedRoute() {
  const { userId } = useProgress();
  const location = useLocation();

  // Jika belum login, cegat dan lempar ke layar login,
  // sambil menyimpan halaman aslinya di location state agar nanti bisa dikembalikan
  if (!userId) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika aman, render rute anak-anaknya (child routes)
  return <Outlet />;
}

export function AdminRoute() {
  const { userId, role } = useProgress();
  const location = useLocation();

  // 1. Cek login
  if (!userId) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Cek apakah admin
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Aman untuk diakses
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { userId } = useProgress();
  const location = useLocation();

  // Jika sudah login tapi mencoba mengakses rute publik (seperti /login), lempar balik
  if (userId) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
