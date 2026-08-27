import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiCalendar, 
  FiLogOut, 
  FiShield, 
  FiMail, 
  FiChevronDown,
  FiArrowRight 
} from 'react-icons/fi';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`rentaro-navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className="rentaro-navbar container-custom">
        {/* Left: Brand Logo in coral-red */}
        <NavLink to="/" className="brand-logo" aria-label="Rentaro Home">
          <div className="logo-icon-wrap">
            <span className="logo-r">R</span>
          </div>
          <span className="brand-name">
            RENTARO<span className="brand-dot">.</span>
          </span>
        </NavLink>

        {/* Center: Desktop Nav Links */}
        <nav className="nav-links-desktop" aria-label="Main Navigation">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink 
            to="/cars" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            Cars
          </NavLink>
          <NavLink 
            to="/bookings" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            My Bookings
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            Contact
          </NavLink>
        </nav>

        {/* Right: User Auth / Profile Area */}
        <div className="nav-auth-desktop">
          {isAuthenticated ? (
            <div className="user-profile-menu-wrap">
              {isAdmin && (
                <NavLink to="/admin/dashboard" className="admin-badge-btn" title="Admin Portal">
                  <FiShield /> Admin
                </NavLink>
              )}

              <div 
                className="user-profile-trigger"
                onClick={() => setProfileDropdownOpen(prev => !prev)}
                tabIndex={0}
                role="button"
                aria-expanded={profileDropdownOpen}
              >
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || 'User')}&background=F9DDE1&color=E85D6A`} 
                  alt={user?.name || 'User Avatar'} 
                  className="user-avatar-nav"
                />
                <span className="user-name-nav">{user?.name?.split(' ')[0] || user?.email?.split('@')[0]}</span>
                <FiChevronDown className={`chevron-icon ${profileDropdownOpen ? 'rotate' : ''}`} />
              </div>

              {profileDropdownOpen && (
                <div className="profile-dropdown-menu card-light">
                  <div className="dropdown-user-info">
                    <p className="dropdown-name">{user?.name || 'Rentaro Driver'}</p>
                    <p className="dropdown-email">{user?.email}</p>
                    <span className="badge badge-active">{user?.role === 'admin' ? 'Administrator' : 'Verified Member'}</span>
                  </div>
                  <hr className="dropdown-divider" />
                  <NavLink to="/profile" className="dropdown-item">
                    <FiUser /> Profile & Account
                  </NavLink>
                  <NavLink to="/bookings" className="dropdown-item">
                    <FiCalendar /> My Bookings
                  </NavLink>
                  {isAdmin && (
                    <NavLink to="/admin/dashboard" className="dropdown-item admin-link">
                      <FiShield /> Admin Portal
                    </NavLink>
                  )}
                  <hr className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    <FiLogOut /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="guest-auth-actions">
              <NavLink to="/login" className="btn btn-outline nav-auth-login">
                Sign In
              </NavLink>
              <NavLink to="/register" className="btn btn-primary nav-auth-register">
                Get Started <FiArrowRight />
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {mobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer card-light">
          <nav className="mobile-nav-links">
            <NavLink to="/" end className="mobile-nav-item">
              Home
            </NavLink>
            <NavLink to="/cars" className="mobile-nav-item">
              Cars
            </NavLink>
            <NavLink to="/bookings" className="mobile-nav-item">
              My Bookings
            </NavLink>
            <NavLink to="/contact" className="mobile-nav-item">
              Contact
            </NavLink>

            <hr className="mobile-divider" />

            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className="mobile-nav-item">
                  <FiUser /> My Profile
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin/dashboard" className="mobile-nav-item admin-highlight">
                    <FiShield /> Admin Portal
                  </NavLink>
                )}
                <button onClick={handleLogout} className="mobile-nav-item logout-mobile">
                  <FiLogOut /> Sign Out ({user?.email})
                </button>
              </>
            ) : (
              <div className="mobile-auth-grid">
                <NavLink to="/login" className="btn btn-outline w-full">
                  Sign In
                </NavLink>
                <NavLink to="/register" className="btn btn-primary w-full">
                  Get Started <FiArrowRight />
                </NavLink>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
