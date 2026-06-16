import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = localStorage.getItem('userEmail');

  // Hide center nav links on login page only
  const hideCenterLinks = location.pathname === '/login';

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleContactClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('home/#contact');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/home" className="navbar-brand">
          Rentaro
        </NavLink>
      </div>

      {/* Center links - hidden only on login page */}
      {!hideCenterLinks && (
        <ul className="navbar-links">
          <li>
            <NavLink to="/home" className={({ isActive }) => (isActive ? 'active-link' : undefined)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/cars" className={({ isActive }) => (isActive ? 'active-link' : undefined)}>
              Cars
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/history" className={({ isActive }) => (isActive ? 'active-link' : undefined)}>
              History
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-car" className={({ isActive }) => (isActive ? 'active-link' : undefined)}>
              Add Car
            </NavLink>
          </li>
         
          <li>
            <a href="#contact" className="nav-link" onClick={handleContactClick}>
              Contact
            </a>
          </li>
        </ul>
      )}

      {/* Right side auth links */}
      <div className="navbar-auth">
        {userEmail ? (
          <>
            <NavLink to="/profile" className="logout-button">Profile</NavLink>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/" className="auth-button">
              Login
            </NavLink>
            <NavLink to="/register" className="auth-button">
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
