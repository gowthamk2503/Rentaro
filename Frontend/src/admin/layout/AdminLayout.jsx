import React, { useState } from 'react';
import { Outlet, Navigate, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../../user/contexts/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { FiMenu, FiX, FiShield, FiUser } from 'react-icons/fi';
import '../styles/Sidebar.css';

export default function AdminLayout() {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Authorization Guard: Require valid JWT and role === 'admin'
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return (
    <div className="admin-portal-root">
      {/* Mobile Top Header */}
      <header className="admin-mobile-header card-light">
        <button 
          onClick={() => setMobileSidebarOpen(prev => !prev)}
          className="admin-hamburger-btn"
          aria-label="Toggle Sidebar"
        >
          {mobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div className="admin-brand-inline">
          <span className="admin-r-box">R</span>
          <span className="admin-title-sm font-mono">Rentaro Admin</span>
        </div>

        <div className="admin-user-pill">
          <FiShield className="text-coral" />
          <span>{user?.name?.split(' ')[0] || 'Admin'}</span>
        </div>
      </header>

      {/* Main Admin Layout Container */}
      <div className="admin-main-container">
        {/* Sidebar */}
        <AdminSidebar 
          isOpen={mobileSidebarOpen} 
          onClose={() => setMobileSidebarOpen(false)} 
        />

        {/* Content Area */}
        <main className="admin-viewport-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}