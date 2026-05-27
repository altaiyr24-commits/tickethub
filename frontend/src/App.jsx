import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAuthStore } from '@/store/authStore';
import PageLoader from '@/components/ui/PageLoader';

const HomePage        = lazy(() => import('@/pages/HomePage'));
const EventsPage      = lazy(() => import('@/pages/EventsPage'));
const EventDetailPage = lazy(() => import('@/pages/EventDetailPage'));
const SeatsPage       = lazy(() => import('@/pages/SeatsPage'));
const CheckoutPage    = lazy(() => import('@/pages/CheckoutPage'));
const OrderSuccessPage= lazy(() => import('@/pages/OrderSuccessPage'));
const LoginPage       = lazy(() => import('@/pages/LoginPage'));
const RegisterPage    = lazy(() => import('@/pages/RegisterPage'));
const ProfilePage     = lazy(() => import('@/pages/ProfilePage'));
const OrdersPage      = lazy(() => import('@/pages/OrdersPage'));
const FavoritesPage   = lazy(() => import('@/pages/FavoritesPage'));
const AdminDashboard  = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminEvents     = lazy(() => import('@/pages/admin/AdminEvents'));
const AdminUsers      = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminOrders     = lazy(() => import('@/pages/admin/AdminOrders'));
const NotFoundPage    = lazy(() => import('@/pages/NotFoundPage'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:slug" element={<EventDetailPage />} />
          <Route path="events/:slug/seats" element={<ProtectedRoute><SeatsPage /></ProtectedRoute>} />
          <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="orders/success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
