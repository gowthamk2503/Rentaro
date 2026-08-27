import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Cars from '../pages/Cars';
import Bookings from '../pages/Bookings';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import PrivateRoute from './PrivateRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/cars" element={<PrivateRoute><Cars /></PrivateRoute>} />
      <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
