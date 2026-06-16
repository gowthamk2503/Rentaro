import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// User Pages
import Login from './user/pages/Login';
import Register from './user/pages/Register';
import Home from './user/pages/Home';
import Cars from './user/pages/Cars';
import Bookings from './user/pages/Bookings';
import CarDetails from './user/pages/CarDeatils';
import BookingConfirmation from './user/pages/BookingsConfrimation';
import AddCar from './user/pages/AddCar';
import Profile from './user/pages/Profile';
import History from './user/pages/History';
import EditPage from './user/pages/EditPage';
import PaymentGateway from './user/pages/PaymentGateway';


// Admin Pages
import Dashboard from './admin/pages/Dashboard';
import AllUsers from './admin/pages/AllUsers';
import AllCars from './admin/pages/AllCars';
import AddCarAdmin from './admin/pages/AddCar';
import EditCar from './admin/pages/EditCar';
import AllBookings from './admin/pages/AllBookings';
import BookingDetail from './admin/pages/BookingDetail';
import AdminPayments from './user/pages/AdminPayments';
import AdminLogin from './admin/pages/AdminLogin';

// Components
import Navbar from './user/components/Navbar';
import DataTable from './admin/components/DataTable';

// Layout
import AdminLayout from './admin/layout/AdminLayout';

// Contexts
import { AuthProvider } from './user/contexts/AuthContext';
import { AdminProvider } from './admin/context/AdminContext';

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userEmail');
  return isAuthenticated ? children : <Login />;
};

// Wrapper to access location
const AppContent = () => {
  const location = useLocation();
  const path = location.pathname;

  // Check if Navbar should be hidden
  const shouldHideNavbar =
    path === '/' ||
    path === '/register' ||
    path === '/admin-login' ||
    path.startsWith('/admin');

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:carId" element={<CarDetails />} />
        <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
        <Route path="/booking/:bookingId" element={<PrivateRoute><BookingConfirmation /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><PaymentGateway /></PrivateRoute>} />
        <Route path="/add-car" element={<PrivateRoute><AddCar /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditPage /></PrivateRoute>} />

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="cars" element={<AllCars />} />
          <Route path="cars/add" element={<AddCarAdmin />} />
          <Route path="cars/edit/:carId" element={<EditCar />} />
          <Route path="bookings" element={<AllBookings />} />
          <Route path="bookings/:bookingId" element={<BookingDetail />} />
          <Route path="payments" element={<AdminPayments />} />
        </Route>
      </Routes>
    </>
  );
};


export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminAuth = localStorage.getItem('isAdminAuthenticated');
    setIsAdmin(adminAuth === 'true');
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <AppContent isAdmin={isAdmin} />
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
