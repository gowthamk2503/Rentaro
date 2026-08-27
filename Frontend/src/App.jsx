import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// User Pages
import Home from './user/pages/Home';
import Cars from './user/pages/Cars';
import CarDetails from './user/pages/CarDeatils';
import Bookings from './user/pages/Bookings';
import History from './user/pages/History';
import BookingConfirmation from './user/pages/BookingsConfrimation';
import PaymentCheckout from './user/pages/PaymentCheckout';
import Profile from './user/pages/Profile';
import EditPage from './user/pages/EditPage';
import Login from './user/pages/Login';
import Register from './user/pages/Register';
import Contact from './user/pages/Contact';

// Admin Pages
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import AllCars from './admin/pages/AllCars';
import AddCarAdmin from './admin/pages/AddCar';
import EditCar from './admin/pages/EditCar';
import AllBookings from './admin/pages/AllBookings';
import BookingDetail from './admin/pages/BookingDetail';
import AllUsers from './admin/pages/AllUsers';
import Analytics from './admin/pages/Analytics';

// Layout, Background & Navigation
import Navbar from './user/components/Navbar';
import FloatingBackground from './user/components/FloatingBackground';
import AdminLayout from './admin/layout/AdminLayout';

// Auth Context
import { AuthProvider, useAuth } from './user/contexts/AuthContext';

// Protected Route Component for Customer Pages
const CustomerPrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

const AppContent = () => {
  const location = useLocation();
  const path = location.pathname;

  // Dedicated Authentication Pages (Must preserve video/standalone auth background)
  const isAuthPage = 
    path === '/login' || 
    path === '/register' || 
    path === '/signup' || 
    path === '/admin-login';

  // Hide Customer Navbar on admin portal routes and login/register
  const hideNavbar = 
    isAuthPage || 
    path.startsWith('/admin');

  return (
    <>
      {/* 1. Global Animated Background: Active on all pages EXCEPT Login and Register */}
      {!isAuthPage && <FloatingBackground />}

      {/* 2. Customer Navigation Header */}
      {!hideNavbar && <Navbar />}

      {/* 3. Application Routes */}
      <Routes>
        {/* Public Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:carId" element={<CarDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Customer Routes */}
        <Route path="/booking/:bookingId/pay" element={<CustomerPrivateRoute><PaymentCheckout /></CustomerPrivateRoute>} />
        <Route path="/bookings" element={<CustomerPrivateRoute><Bookings /></CustomerPrivateRoute>} />
        <Route path="/history" element={<CustomerPrivateRoute><History /></CustomerPrivateRoute>} />
        <Route path="/booking/:bookingId" element={<CustomerPrivateRoute><BookingConfirmation /></CustomerPrivateRoute>} />
        <Route path="/profile" element={<CustomerPrivateRoute><Profile /></CustomerPrivateRoute>} />
        <Route path="/edit-profile" element={<CustomerPrivateRoute><EditPage /></CustomerPrivateRoute>} />

        {/* Admin Login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Admin Portal */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="cars" element={<AllCars />} />
          <Route path="cars/add" element={<AddCarAdmin />} />
          <Route path="cars/edit/:carId" element={<EditCar />} />
          <Route path="bookings" element={<AllBookings />} />
          <Route path="bookings/:bookingId" element={<BookingDetail />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
