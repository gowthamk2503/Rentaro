import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/users">All Users</Link></li>
        <li><Link to="/admin/cars">All Cars</Link></li>
        <li><Link to="/admin/bookings">All Bookings</Link></li>
        
        <li>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
