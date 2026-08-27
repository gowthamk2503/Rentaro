import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../user/contexts/AuthContext';
import { 
  FiGrid, 
  FiTruck, 
  FiCalendar, 
  FiUsers, 
  FiBarChart2, 
  FiGlobe, 
  FiLogOut, 
  FiShield, 
  FiPlusCircle 
} from 'react-icons/fi';
import '../styles/Sidebar.css';

export default function AdminSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { to: '/admin/cars', label: 'Fleet Management', icon: <FiTruck /> },
    { to: '/admin/bookings', label: 'Bookings', icon: <FiCalendar /> },
    { to: '/admin/users', label: 'Customers', icon: <FiUsers /> },
    { to: '/admin/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose}></div>}

      <aside className={`admin-sidebar-panel card-light ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="admin-sidebar-header">
          <NavLink to="/admin/dashboard" className="brand-logo" onClick={onClose}>
            <div className="logo-icon-wrap">
              <span className="logo-r">R</span>
            </div>
            <div>
              <span className="brand-name">RENTARO<span className="brand-dot">.</span></span>
              <span className="admin-console-sub">ADMIN CONSOLE</span>
            </div>
          </NavLink>
        </div>

        {/* User Info Capsule */}
        <div className="admin-user-capsule">
          <img 
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=F9DDE1&color=E85D6A&size=100`} 
            alt="Admin Avatar"
            className="admin-avatar-small" 
          />
          <div className="admin-user-meta">
            <p className="admin-meta-name">{user?.name || 'Administrator'}</p>
            <span className="badge badge-active">Fleet Admin</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="admin-nav-list">
          <span className="nav-group-label font-mono">OPERATIONS</span>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text font-mono">{item.label}</span>
            </NavLink>
          ))}

          <span className="nav-group-label font-mono" style={{ marginTop: '1.5rem' }}>GATEWAYS</span>
          <NavLink to="/home" className="admin-nav-link external-link" onClick={onClose}>
            <span className="nav-icon"><FiGlobe /></span>
            <span className="nav-text font-mono">Return to Website</span>
          </NavLink>
        </nav>

        {/* Footer Logout */}
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn font-mono">
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
