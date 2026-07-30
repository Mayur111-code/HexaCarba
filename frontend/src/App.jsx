import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import Loader from './components/common/Loader';

import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import EmployeesPage from './pages/admin/EmployeesPage';
import SalariesPage from './pages/admin/SalariesPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import ProductsPage from './pages/admin/ProductsPage';
import ProductFormPage from './pages/admin/ProductFormPage';
import CustomersPage from './pages/admin/CustomersPage';
import ContactsPage from './pages/admin/ContactsPage';
import ProfilePage from './pages/admin/ProfilePage';

import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ProductsPagePublic from './pages/public/ProductsPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import ServicesPage from './pages/public/ServicesPage';
import DownloadsPage from './pages/public/DownloadsPage';
import ContactPage from './pages/public/ContactPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="salaries" element={<SalariesPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/:id/edit" element={<ProductFormPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="products" element={<ProductsPagePublic />} />
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="downloads" element={<DownloadsPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
